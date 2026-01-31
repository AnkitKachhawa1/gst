import React from 'react';
import { CleanedRecord, ReconciliationResult } from '@/types';
import { X, ArrowRightLeft } from 'lucide-react';

interface TransactionDetailModalProps {
  result: ReconciliationResult;
  onClose: () => void;
}

export function TransactionDetailModal({ result, onClose }: TransactionDetailModalProps) {
  const b = result.booksRecord;
  const g = result.gstr2bRecord;

  const formatCurrency = (val?: number) => val !== undefined ? `₹${val.toFixed(2)}` : '-';
  const formatDate = (dateStr?: string) => {
      if (!dateStr) return '-';
      const parts = dateStr.split('-');
      if (parts.length === 3) return `${parts[2]}-${parts[1]}-${parts[0]}`;
      return dateStr;
  };

  const ComparisonRow = ({ label, val1, val2, type = 'text', highlightDiff = false }: { label: string, val1?: any, val2?: any, type?: 'text'|'curr'|'date', highlightDiff?: boolean }) => {
      const v1Str = type === 'curr' ? formatCurrency(val1) : (type === 'date' ? formatDate(val1) : val1);
      const v2Str = type === 'curr' ? formatCurrency(val2) : (type === 'date' ? formatDate(val2) : val2);
      
      const isDiff = val1 != val2 && val1 !== undefined && val2 !== undefined;
      // Loose equality for strings, strict for logic
      const showDiff = highlightDiff && isDiff;

      return (
          <div className={`grid grid-cols-3 py-3 border-b last:border-0 hover:bg-slate-50 ${showDiff ? 'bg-red-50/50' : ''}`}>
              <div className="font-medium text-gray-600 pl-4">{label}</div>
              <div className={`font-mono text-blue-700 ${showDiff ? 'font-bold' : ''}`}>{v1Str || '-'}</div>
              <div className={`font-mono text-purple-700 ${showDiff ? 'font-bold' : ''}`}>{v2Str || '-'}</div>
          </div>
      );
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-slate-900 text-white p-6 flex justify-between items-start">
            <div>
                <h3 className="text-xl font-bold flex items-center gap-2">
                    <ArrowRightLeft className="w-5 h-5 text-blue-400" />
                    Invoice Details
                </h3>
                <div className="text-slate-400 text-sm mt-1">
                    Comparing <span className="text-blue-300 font-medium">Purchase Books</span> vs <span className="text-purple-300 font-medium">GSTR-2B Portal</span>
                </div>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition">
                <X className="w-5 h-5" />
            </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto flex-1 p-0">
            {/* Status Banner */}
            <div className={`px-6 py-3 text-sm font-bold tracking-wide uppercase flex justify-between items-center
                ${result.status === 'MATCHED' ? 'bg-green-100 text-green-800' : 
                  result.status.includes('MISSING') ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                }`}>
                <span>Status: {result.status.replace(/_/g, ' ')}</span>
                <span className="text-xs normal-case opacity-75">{result.remarks}</span>
            </div>

            {/* Grid Header */}
            <div className="grid grid-cols-3 bg-slate-100 py-2 text-xs font-bold text-slate-500 uppercase tracking-wider border-b">
                <div className="pl-4">Field</div>
                <div>Books (Yours)</div>
                <div>Portal (Govt)</div>
            </div>

            {/* Rows */}
            <ComparisonRow label="Party Name" val1={b?.supplierName} val2={g?.supplierName} />
            <ComparisonRow label="GSTIN" val1={b?.gstin} val2={g?.gstin} />
            <ComparisonRow label="Invoice No" val1={b?.invoiceNumber} val2={g?.invoiceNumber} highlightDiff />
            <ComparisonRow label="Invoice Date" val1={b?.invoiceDate} val2={g?.invoiceDate} type="date" highlightDiff />
            
            <div className="bg-slate-50 py-2 px-4 text-xs font-bold text-slate-500 uppercase tracking-wider mt-2">Financials</div>
            
            <ComparisonRow label="Taxable Value" val1={b?.taxableValue} val2={g?.taxableValue} type="curr" highlightDiff />
            <ComparisonRow label="IGST" val1={b?.igst} val2={g?.igst} type="curr" highlightDiff />
            <ComparisonRow label="CGST" val1={b?.cgst} val2={g?.cgst} type="curr" highlightDiff />
            <ComparisonRow label="SGST" val1={b?.sgst} val2={g?.sgst} type="curr" highlightDiff />
            
            <div className="bg-slate-50 py-1"></div>
            <div className="grid grid-cols-3 py-4 bg-slate-50 border-t border-slate-200">
                <div className="font-bold text-slate-800 pl-4">Total Invoice Value</div>
                <div className={`font-mono font-bold text-lg text-blue-700`}>{formatCurrency(b?.invoiceValue)}</div>
                <div className={`font-mono font-bold text-lg text-purple-700`}>{formatCurrency(g?.invoiceValue)}</div>
            </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t text-center">
            <button onClick={onClose} className="px-6 py-2 bg-white border border-slate-300 shadow-sm rounded-lg text-sm font-medium hover:bg-slate-100 transition">
                Close
            </button>
        </div>
      </div>
    </div>
  );
}
