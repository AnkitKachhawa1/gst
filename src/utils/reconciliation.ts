import { CleanedRecord, ReconciliationResult } from "@/types";
import { groupBy, maxBy, sumBy } from "lodash";
import { v4 as uuidv4 } from "uuid";

// Tolerance for float comparison
const TOLERANCE = 2.0;

function aggregateRecords(records: CleanedRecord[], label: string): CleanedRecord[] {
  // 1. Group by Match Key
  const grouped = groupBy(records, 'matchKey');
  const uniqueRecords: CleanedRecord[] = [];

  Object.entries(grouped).forEach(([key, group]) => {
    if (!key) return; // Skip empty keys

    // 2. Python Logic: Resolve conflicts (Same invoice, multiple uploads vs Same invoice, split lines)
    // Strategy: Group by Upload ID. Pick the LATEST upload.
    // In this client-side version, we don't have explicit timestamps for uploads, 
    // but typically files in the list are processed in order.
    // However, if the user drags 2 files, they have different uploadIds.
    // If they are meant to be additive (e.g. Apr and May), we should sum them.
    // If they are duplicates (e.g. Apr v1 and Apr v2), we should pick latest.
    // The Python code was designed for "Re-runs" where you upload the same file again.
    // Here, we will assume ADDITIVE behavior (sum all) because usually users drag "GSTR2B_Apr.json", "GSTR2B_May.json".
    // Merging them is correct.
    
    // We sum ALL lines that share the same MatchKey.
    // This handles:
    // a) Split tax lines (5%, 12%) -> Sums to one invoice total.
    // b) Additive files -> Sums up (Wait, duplicate invoice in 2 months? Unlikely).
    
    const base = group[0];
    
    // Use sumBy for robust summing (handles undefineds via cleanNumeric implicitly if mapped, but here we iterate)
    const totalTaxable = group.reduce((sum, r) => sum + (r.taxableValue || 0), 0);
    const totalIgst = group.reduce((sum, r) => sum + (r.igst || 0), 0);
    const totalCgst = group.reduce((sum, r) => sum + (r.cgst || 0), 0);
    const totalSgst = group.reduce((sum, r) => sum + (r.sgst || 0), 0);
    const totalVal = group.reduce((sum, r) => sum + (r.invoiceValue || 0), 0);
    
    uniqueRecords.push({
        ...base,
        taxableValue: totalTaxable,
        igst: totalIgst,
        cgst: totalCgst,
        sgst: totalSgst,
        invoiceValue: totalVal
    });
  });

  console.log(`[${label}] Aggregated ${records.length} -> ${uniqueRecords.length}`);
  return uniqueRecords;
}

export function runReconciliation(
  books: CleanedRecord[],
  gstr2b: CleanedRecord[]
): ReconciliationResult[] {
  
  const aggBooks = aggregateRecords(books, "Books");
  const aggGstr = aggregateRecords(gstr2b, "GSTR2B");
  
  const results: ReconciliationResult[] = [];
  const matchedGstrIds = new Set<string>();
  const matchedBooksIds = new Set<string>();
  
  // Index GSTR by MatchKey for O(1) lookup
  const gstrMap = groupBy(aggGstr, 'matchKey');
  
  // --- PHASE 1: Exact Match (GSTIN + Inv No) ---
  aggBooks.forEach(b => {
     const key = b.matchKey;
     if (gstrMap[key]) {
         // Find best candidate
         const candidates = gstrMap[key].filter(g => !matchedGstrIds.has(g.id));
         
         if (candidates.length > 0) {
             let bestG: CleanedRecord | null = null;
             let minDiff = Infinity;
             
             for (const g of candidates) {
                 const diff = Math.abs(g.invoiceValue - b.invoiceValue);
                 if (diff < minDiff) {
                     minDiff = diff;
                     bestG = g;
                 }
             }
             
             if (bestG) {
                 const diff = Math.abs(bestG.invoiceValue - b.invoiceValue);
                 let status: ReconciliationResult['status'] = "MATCHED";
                 if (diff > TOLERANCE) status = "AMOUNT MISMATCH";
                 
                 results.push({
                     id: uuidv4(),
                     status,
                     remarks: `Diff: ${diff.toFixed(2)}`,
                     booksRecord: b,
                     gstr2bRecord: bestG
                 });
                 
                 matchedBooksIds.add(b.id);
                 matchedGstrIds.add(bestG.id);
             }
         }
     }
  });
  
  // --- PHASE 2: Inferred Match (GSTIN + Amount) ---
  // Index remaining GSTR by GSTIN
  const remainingGstr = aggGstr.filter(g => !matchedGstrIds.has(g.id));
  const gstrGstinMap = groupBy(remainingGstr, 'gstin');
  
  aggBooks.forEach(b => {
      if (matchedBooksIds.has(b.id)) return;
      
      const key = b.gstin;
      if (gstrGstinMap[key]) {
          const candidates = gstrGstinMap[key].filter(g => !matchedGstrIds.has(g.id));
          
          const bestG = candidates.find(g => Math.abs(g.invoiceValue - b.invoiceValue) <= TOLERANCE);
          
          if (bestG) {
              results.push({
                  id: uuidv4(),
                  status: "INFERRED MATCH",
                  remarks: "Matched by GSTIN & Amount",
                  booksRecord: b,
                  gstr2bRecord: bestG
              });
              matchedBooksIds.add(b.id);
              matchedGstrIds.add(bestG.id);
          }
      }
  });
  
  // --- MISSING ---
  aggBooks.forEach(b => {
      if (!matchedBooksIds.has(b.id)) {
          results.push({
              id: uuidv4(),
              status: "MISSING_IN_2B",
              remarks: "Not found in GSTR-2B",
              booksRecord: b
          });
      }
  });
  
  aggGstr.forEach(g => {
      if (!matchedGstrIds.has(g.id)) {
          results.push({
              id: uuidv4(),
              status: "MISSING_IN_BOOKS",
              remarks: "Not found in Books",
              gstr2bRecord: g
          });
      }
  });
  
  return results;
}
