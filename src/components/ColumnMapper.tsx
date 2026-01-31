import React, { useEffect, useState } from 'react';
import * as XLSX from 'xlsx';
import { FileSpreadsheet } from 'lucide-react';
import { flattenGstr2bJson } from '@/utils/jsonUtils';

interface ColumnMapperProps {
  files: File[];
  sourceType: 'GSTR2B' | 'BOOKS';
  initialMapping?: Record<string, string> | null;
  onMappingConfirmed: (mapping: Record<string, string>) => void;
  onCancel: () => void;
}

export const REQUIRED_FIELDS = [
  { key: 'gstin', label: 'GSTIN', required: true },
  { key: 'partyName', label: 'Party Name', required: false },
  { key: 'invoiceNumber', label: 'Invoice Number', required: true },
  { key: 'invoiceDate', label: 'Invoice Date', required: true },
  { key: 'taxableValue', label: 'Taxable Value', required: false },
  { key: 'igst', label: 'IGST', required: false },
  { key: 'cgst', label: 'CGST', required: false },
  { key: 'sgst', label: 'SGST', required: false },
  { key: 'invoiceValue', label: 'Total Invoice Value', required: true },
];

export function ColumnMapper({ files, sourceType, initialMapping, onMappingConfirmed, onCancel }: ColumnMapperProps) {
  const [headers, setHeaders] = useState<string[]>([]);
  const [mapping, setMapping] = useState<Record<string, string>>({});
  const [previewData, setPreviewData] = useState<any[]>([]);

  useEffect(() => {
    if (files.length > 0) {
      const file = files[0];
      const reader = new FileReader();
      
      const processHeaders = (detectedHeaders: string[], dataPreview: any[]) => {
          setHeaders(detectedHeaders);
          setPreviewData(dataPreview);
          
          const lowerHeaders = detectedHeaders.map(h => h.toLowerCase());
          
          const findKey = (keywords: string[], excludeTerms?: string[]) => {
              for (const kw of keywords) {
                  const found = lowerHeaders.find(k => {
                      if (excludeTerms && excludeTerms.some(term => k.includes(term))) return false;
                      return k.includes(kw);
                  });
                  if (found) return detectedHeaders[lowerHeaders.indexOf(found)];
              }
              return null;
          };

          const autoMap: Record<string, string> = {};
          
          REQUIRED_FIELDS.forEach(field => {
              let keywords: string[] = [];
              let exclude: string[] | undefined = undefined;

              if (field.key === 'gstin') keywords = ['gstin', 'ctin', 'tin'];
              if (field.key === 'invoiceNumber') keywords = ['invoice no', 'invoice number', 'inv no', 'inum', 'bill no', 'document no'];
              if (field.key === 'invoiceDate') {
                  keywords = ['invoice date', 'document date', 'bill date', 'date', 'dt'];
                  exclude = ['supfildt', 'filing'];
              }
              if (field.key === 'invoiceValue') {
                  keywords = [
                      'invoice value', 
                      'total invoice value', 
                      'total invoice amount', 
                      'invoice total', 
                      'grand total', 
                      'total payable', 
                      'total tax', 
                      'gross total',
                      'bill amount', 
                      'invoice amount', 
                      'total value', 
                      'total',
                      'val'
                  ];
                  exclude = ['taxable', 'net', 'assessable', 'amount before', 'tax val', 'rate'];
              }
              if (field.key === 'taxableValue') keywords = ['taxable value', 'taxable', 'txval'];
              if (field.key === 'partyName') keywords = ['party name', 'trade name', 'supplier name', 'name', 'party', 'trdnm'];
              if (field.key === 'igst') keywords = ['igst', 'integrated tax'];
              if (field.key === 'cgst') keywords = ['cgst', 'central tax'];
              if (field.key === 'sgst') keywords = ['sgst', 'state tax', 'utgst'];

              const match = findKey(keywords, exclude);
              if (match) {
                  autoMap[field.key] = match;
              }
          });

          // Merge with initialMapping if provided, prioritizing initialMapping
          setMapping({ ...autoMap, ...(initialMapping || {}) });
      };

      if (file.name.endsWith('.json')) {
          reader.onload = (e) => {
              try {
                  const text = e.target?.result as string;
                  const jsonData = JSON.parse(text);
                  const flatData = flattenGstr2bJson(jsonData);
                  if (flatData.length > 0) {
                      processHeaders(Object.keys(flatData[0]), flatData.slice(0, 3));
                  }
              } catch (err) {
                  console.error("Error parsing JSON for mapping", err);
              }
          };
          reader.readAsText(file);
      } else {
          reader.onload = (e) => {
            const data = e.target?.result;
            const wb = XLSX.read(data, { type: 'binary' });
            const sheet = wb.Sheets[wb.SheetNames[0]];
            const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });
            
            if (jsonData.length > 0) {
              const detectedHeaders = (jsonData[0] as string[]).map(h => String(h).trim());
              processHeaders(detectedHeaders, jsonData.slice(1, 4));
            }
          };
          reader.readAsBinaryString(file);
      }
    }
  }, [files, initialMapping]);

  const handleConfirm = () => {
    // Validate required fields
    const missing = REQUIRED_FIELDS.filter(f => f.required && !mapping[f.key]);
    if (missing.length > 0) {
      alert(`Please map the following required fields: ${missing.map(f => f.label).join(', ')}`);
      return;
    }
    onMappingConfirmed(mapping);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-6 border-b flex justify-between items-center bg-slate-50 rounded-t-xl">
           <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${sourceType === 'GSTR2B' ? 'bg-purple-100 text-purple-600' : 'bg-blue-100 text-blue-600'}`}>
                <FileSpreadsheet className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-800">Map Columns: {sourceType === 'GSTR2B' ? 'GSTR-2B' : 'Purchase Books'}</h2>
                <p className="text-sm text-gray-500">Match the columns from your Excel file to the system fields.</p>
              </div>
           </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1">
           <div className="grid md:grid-cols-2 gap-x-12 gap-y-6">
              {REQUIRED_FIELDS.map(field => (
                <div key={field.key} className="flex flex-col gap-2">
                   <label className="text-sm font-semibold text-gray-700 flex justify-between">
                      {field.label}
                      {field.required && <span className="text-red-500 text-xs">*Required</span>}
                   </label>
                   <select 
                      value={mapping[field.key] || ''}
                      onChange={(e) => setMapping(prev => ({ ...prev, [field.key]: e.target.value }))}
                      className={`w-full border rounded-lg px-3 py-2.5 text-sm focus:ring-2 outline-none transition
                        ${mapping[field.key] ? 'border-green-300 bg-green-50/30' : 'border-gray-300 bg-white hover:border-blue-400'}
                      `}
                   >
                      <option value="">-- Select Column --</option>
                      {headers.map(h => (
                        <option key={h} value={h}>{h}</option>
                      ))}
                   </select>
                   {/* Preview Value */}
                   {mapping[field.key] && previewData.length > 0 && (
                      <div className="text-xs text-gray-500 truncate px-1">
                        Ex: {String(files[0]?.name.endsWith('.json') ? previewData[0][mapping[field.key]] : previewData[0][headers.indexOf(mapping[field.key])])}
                      </div>
                   )}
                </div>
              ))}
           </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t bg-gray-50 rounded-b-xl flex justify-end gap-3">
            <button 
              onClick={onCancel}
              className="px-6 py-2.5 text-gray-600 font-medium hover:bg-gray-200 rounded-lg transition"
            >
              Cancel
            </button>
            <button 
              onClick={handleConfirm}
              className="px-8 py-2.5 bg-slate-900 text-white font-medium hover:bg-slate-800 rounded-lg shadow-lg hover:shadow-xl transition transform hover:-translate-y-0.5"
            >
              Confirm Mapping
            </button>
        </div>
      </div>
    </div>
  );
}
