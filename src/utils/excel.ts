import * as XLSX from 'xlsx';
import ExcelJS from 'exceljs';
import { CleanedRecord, ReconciliationResult, RawRecord } from '@/types';
import { v4 as uuidv4 } from 'uuid';
import { cleanGstin, cleanInvoiceNumber, cleanNumeric, normalizeDate } from './cleaning';
import { flattenGstr2bJson } from './jsonUtils';

export async function getHeaders(file: File): Promise<string[]> {
    if (file.name.endsWith('.json')) {
        const text = await file.text();
        const data = JSON.parse(text);
        const rows = flattenGstr2bJson(data);
        if (rows.length > 0) return Object.keys(rows[0]);
        return [];
    }
    const buf = await file.arrayBuffer();
    const wb = XLSX.read(buf, { sheetRows: 1 });
    const sheet = wb.Sheets[wb.SheetNames[0]];
    const jsonData: any[] = XLSX.utils.sheet_to_json(sheet, { header: 1 });
    if (jsonData.length > 0) {
        return (jsonData[0] as string[]).map(h => String(h).trim());
    }
    return [];
}

export async function parseFile(
  file: File, 
  type: 'GSTR2B' | 'BOOKS', 
  uploadId: string,
  customMapping?: Record<string, string>
): Promise<CleanedRecord[]> {
  if (file.name.endsWith('.json')) {
      return parseJson(file, type, uploadId);
  } else {
      return parseExcel(file, type, uploadId, customMapping);
  }
}

async function parseJson(file: File, type: 'GSTR2B' | 'BOOKS', uploadId: string): Promise<CleanedRecord[]> {
  const text = await file.text();
  const data = JSON.parse(text);
  
  const rows = flattenGstr2bJson(data);
  
  // JSON usually has fixed keys, so we auto-map using standard keys
  return mapRowsToRecords(rows, type, uploadId); 
}

async function parseExcel(
  file: File, 
  type: 'GSTR2B' | 'BOOKS', 
  uploadId: string,
  customMapping?: Record<string, string>
): Promise<CleanedRecord[]> {
  const buf = await file.arrayBuffer();
  const wb = XLSX.read(buf);
  const sheet = wb.Sheets[wb.SheetNames[0]];
  const rows = XLSX.utils.sheet_to_json(sheet);
  
  return mapRowsToRecords(rows, type, uploadId, customMapping);
}

function mapRowsToRecords(
  rows: any[], 
  type: 'GSTR2B' | 'BOOKS', 
  uploadId: string,
  customMapping?: Record<string, string>
): CleanedRecord[] {
    return rows.map((row, index) => {
        let gstinKey = '', invKey = '', dateKey = '', valKey = '', taxKey = '', 
            igstKey = '', cgstKey = '', sgstKey = '', nameKey = '';

        if (customMapping) {
            // Use user-provided mapping
            gstinKey = customMapping['gstin'] || '';
            invKey = customMapping['invoiceNumber'] || '';
            dateKey = customMapping['invoiceDate'] || '';
            valKey = customMapping['invoiceValue'] || '';
            taxKey = customMapping['taxableValue'] || '';
            igstKey = customMapping['igst'] || '';
            cgstKey = customMapping['cgst'] || '';
            sgstKey = customMapping['sgst'] || '';
            nameKey = customMapping['partyName'] || '';
        } else {
             // Auto-detect (Fallback Logic)
             const keys = Object.keys(row);
             const lowerKeys = keys.map(k => k.toLowerCase());
             
             const findKey = (keywords: string[], excludeTerm?: string) => {
                 for (const kw of keywords) {
                     const found = lowerKeys.find(k => {
                         if (excludeTerm && k.includes(excludeTerm)) return false;
                         // Specific check for 'val' to avoid matching 'taxable value' partially if not careful
                         if (kw === 'val' && k !== 'val' && k !== 'invoice value') return false; 
                         return k.includes(kw);
                     });
                     if (found) {
                          const idx = lowerKeys.indexOf(found);
                          return keys[idx];
                     }
                 }
                 return '';
             };
             
             gstinKey = findKey(['gstin', 'ctin', 'tin']);
             invKey = findKey(['invoice no', 'invoice number', 'inv no', 'inum', 'bill no', 'document no']);
             dateKey = findKey(['invoice date', 'document date', 'bill date', 'date', 'dt'], 'supfildt');
             // Added 'val' back. Placed after specific terms to avoid collision, though exclude 'taxable' handles most.
             valKey = findKey(['total tax', 'total value', 'invoice value', 'bill amount', 'invoice amount', 'grand total', 'total', 'val'], 'taxable');
             taxKey = findKey(['taxable value', 'taxable', 'txval']);
             igstKey = findKey(['integrated tax', 'igst', 'iamt']);
             cgstKey = findKey(['central tax', 'cgst', 'camt']);
             sgstKey = findKey(['state tax', 'sgst', 'samt']);
             nameKey = findKey(['party name', 'trade name', 'supplier name', 'name', 'party', 'trdnm']);
        }

        const rawGstin = row[gstinKey] || '';
        const rawInv = row[invKey] || '';
        const rawDate = row[dateKey] || '';
        
        const cGstin = cleanGstin(rawGstin);
        const cInv = cleanInvoiceNumber(rawInv);
        const cDate = normalizeDate(rawDate);
        
        // Debug first row if missing crucial data and no custom mapping was used
        if (!customMapping && index === 0 && (!cGstin || !cInv)) {
            console.warn(`[${type}] Potential Mapping Issue. Detected Keys:`, {
                gstin: gstinKey, inv: invKey, date: dateKey, val: valKey
            });
        }

        const rec: CleanedRecord = {
            id: uuidv4(),
            uploadId,
            sourceType: type,
            gstin: cGstin,
            invoiceNumber: cInv,
            originalInvoiceNumber: String(rawInv),
            invoiceDate: cDate,
            taxableValue: cleanNumeric(row[taxKey]),
            igst: cleanNumeric(row[igstKey]),
            cgst: cleanNumeric(row[cgstKey]),
            sgst: cleanNumeric(row[sgstKey]),
            invoiceValue: cleanNumeric(row[valKey]),
            matchKey: `${cGstin}_${cInv}`,
            supplierName: row[nameKey] || ''
        };
        return rec;
    });
}


export async function downloadReport(results: ReconciliationResult[]) {
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('Reconciliation Result');
    
    sheet.columns = [
        { header: 'Status', key: 'status', width: 20 },
        { header: 'PB GSTIN', key: 'pb_gstin', width: 15 },
        { header: 'PB Party', key: 'pb_party', width: 20 },
        { header: 'PB Inv', key: 'pb_inv', width: 15 },
        { header: 'PB Date', key: 'pb_date', width: 12 },
        { header: 'PB Total', key: 'pb_total', width: 12 },
        { header: '2B GSTIN', key: 'tb_gstin', width: 15 },
        { header: '2B Party', key: 'tb_party', width: 20 },
        { header: '2B Inv', key: 'tb_inv', width: 15 },
        { header: '2B Date', key: 'tb_date', width: 12 },
        { header: '2B Total', key: 'tb_total', width: 12 },
        { header: 'Remarks', key: 'remarks', width: 25 },
    ];
    
    results.forEach(res => {
        const row = sheet.addRow({
            status: res.status,
            pb_gstin: res.booksRecord?.gstin,
            pb_party: res.booksRecord?.supplierName,
            pb_inv: res.booksRecord?.invoiceNumber,
            pb_date: res.booksRecord?.invoiceDate,
            pb_total: res.booksRecord?.invoiceValue,
            tb_gstin: res.gstr2bRecord?.gstin,
            tb_party: res.gstr2bRecord?.supplierName,
            tb_inv: res.gstr2bRecord?.invoiceNumber,
            tb_date: res.gstr2bRecord?.invoiceDate,
            tb_total: res.gstr2bRecord?.invoiceValue,
            remarks: res.remarks
        });
        
        // Styles
        const statusCell = row.getCell('status');
        if (res.status === 'MATCHED') {
            statusCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFC6EFCE' } }; // Light Green
        } else if (res.status.includes('MISMATCH') || res.status.includes('INFERRED')) {
            statusCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFEB9C' } }; // Light Orange
        } else {
             statusCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFC7CE' } }; // Redish
        }
        
        // Red Text for diffs
        if (res.booksRecord && res.gstr2bRecord) {
             if (res.booksRecord.invoiceNumber !== res.gstr2bRecord.invoiceNumber) {
                 row.getCell('pb_inv').font = { color: { argb: 'FF9C0006' }, bold: true };
                 row.getCell('tb_inv').font = { color: { argb: 'FF9C0006' }, bold: true };
             }
             if (Math.abs(res.booksRecord.invoiceValue - res.gstr2bRecord.invoiceValue) > 1.0) {
                 row.getCell('pb_total').font = { color: { argb: 'FF9C0006' }, bold: true };
                 row.getCell('tb_total').font = { color: { argb: 'FF9C0006' }, bold: true };
             }
        }
    });
    
    // Write buffer
    const buf = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buf], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Reconciliation_Report.xlsx';
    a.click();
}
