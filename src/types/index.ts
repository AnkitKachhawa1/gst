export interface RawRecord {
  id: string; // generated uuid
  uploadId: string;
  sourceType: 'GSTR2B' | 'BOOKS';
  gstin: string;
  supplierName: string;
  invoiceNumber: string;
  invoiceDate: string | Date; // Original string or date obj
  taxableValue: number;
  igst: number;
  cgst: number;
  sgst: number;
  invoiceValue: number;
  rawData: any;
}

export interface CleanedRecord {
  id: string;
  uploadId: string;
  sourceType: 'GSTR2B' | 'BOOKS';
  gstin: string; // Cleaned GSTIN
  invoiceNumber: string; // Cleaned Invoice No
  originalInvoiceNumber: string;
  invoiceDate: string; // YYYY-MM-DD
  taxableValue: number;
  igst: number;
  cgst: number;
  sgst: number;
  invoiceValue: number;
  matchKey: string; // GSTIN_INV
  supplierName: string;
}

export interface ReconciliationResult {
  id: string;
  status: 'MATCHED' | 'AMOUNT MISMATCH' | 'INFERRED MATCH' | 'MISSING_IN_2B' | 'MISSING_IN_BOOKS';
  remarks: string;
  gstr2bRecord?: CleanedRecord;
  booksRecord?: CleanedRecord;
}

export interface UploadMetadata {
  id: string;
  filename: string;
  uploadDate: string;
  type: 'GSTR2B' | 'BOOKS';
}
