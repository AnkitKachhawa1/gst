
export function cleanGstin(gstin: any): string {
  if (!gstin) return "";
  return String(gstin).replace(/\s+/g, "").toUpperCase();
}

export function cleanNumeric(value: any): number {
  if (value === null || value === undefined || value === '') return 0.0;
  const sVal = String(value).replace(/,/g, "").trim();
  if (!sVal) return 0.0;
  const parsed = parseFloat(sVal);
  return isNaN(parsed) ? 0.0 : parsed;
}

export function cleanInvoiceNumber(invNum: any): string {
  if (invNum === null || invNum === undefined) return "";
  const sVal = String(invNum).trim();
  if (sVal.toLowerCase() === 'nan' || sVal === '') return "";

  // Find all sequences of digits
  const nums = sVal.match(/\d+/g);
  if (!nums) return sVal; 

  // Expanded exclusions for years 2020 to 2030
  const exclusions = [
    // 4-digit years
    '2020', '2021', '2022', '2023', '2024', '2025', '2026', '2027', '2028', '2029', '2030',
    // Financial year patterns (e.g., 2425 for 2024-25)
    '2021', '2122', '2223', '2324', '2425', '2526', '2627', '2728', '2829', '2930',
    // 2-digit short years
    '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30'
  ];

  if (nums.length > 1) {
    // Iterate from right to left (invoice numbers are usually at the end)
    for (let i = nums.length - 1; i >= 0; i--) {
      const n = nums[i];
      if (!exclusions.includes(n)) {
        return String(parseInt(n, 10)); 
      }
    }
  }

  // Fallback to the last sequence found if all are in exclusions or only one exists
  return String(parseInt(nums[nums.length - 1], 10));
}

// Date normalization matching pd.to_datetime(dayfirst=True)
export function normalizeDate(dateVal: any): string {
  if (!dateVal) return "";
  
  // Excel Serial Date
  if (typeof dateVal === 'number') {
      const d = new Date(Math.round((dateVal - 25569)*86400*1000));
      if (!isNaN(d.getTime())) return d.toISOString().split('T')[0];
  }

  const sVal = String(dateVal).trim();
  
  // Try standard ISO YYYY-MM-DD
  if (sVal.match(/^\d{4}-\d{2}-\d{2}/)) return sVal.split('T')[0];

  // Handle DD-MM-YYYY or DD/MM/YYYY or DD.MM.YYYY
  const parts = sVal.split(/[-/.]/);
  if (parts.length === 3) {
      const p1 = parseInt(parts[0], 10);
      const p2 = parseInt(parts[1], 10);
      const p3 = parseInt(parts[2], 10);
      
      // Case: DD-MM-YYYY (Year is last)
      if (parts[2].length === 4) {
           // Month is 0-indexed in JS Date? No, "YYYY-MM-DD" string doesn't care, 
           // but new Date(y, m, d) does.
           // We construct ISO string "YYYY-MM-DD" manually to avoid timezone issues
           // Ensure 2 digits
           const y = parts[2];
           const m = parts[1].padStart(2, '0');
           const d = parts[0].padStart(2, '0');
           return `${y}-${m}-${d}`;
      }
      
      // Case: YYYY-MM-DD (Year is first)
      if (parts[0].length === 4) {
           const y = parts[0];
           const m = parts[1].padStart(2, '0');
           const d = parts[2].padStart(2, '0');
           return `${y}-${m}-${d}`;
      }
  }
  
  return sVal;
}
