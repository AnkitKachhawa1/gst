import React, { useMemo, useState } from 'react';
import { ReconciliationResult } from '@/types';
import { Filter, Maximize2, Minimize2 } from 'lucide-react';
import clsx from 'clsx';
import { TransactionDetailModal } from './TransactionDetailModal';
import { SummaryCards, SummaryTab } from './SummaryCards';

interface ResultsTableProps {
  results: ReconciliationResult[];
  onDownloadCurrent?: (filteredResults: ReconciliationResult[]) => void;
}

export function ResultsTable({ results, onDownloadCurrent }: ResultsTableProps) {
  const [activeTab, setActiveTab] = useState<SummaryTab>('ALL');
  const [search, setSearch] = useState('');
  const [selectedParty, setSelectedParty] = useState('');
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<ReconciliationResult | null>(null);

  // Extract unique parties
  const parties = useMemo(() => {
      const set = new Set<string>();
      results.forEach(r => {
          if (r.gstr2bRecord?.supplierName) set.add(r.gstr2bRecord.supplierName);
          if (r.booksRecord?.supplierName) set.add(r.booksRecord.supplierName);
      });
      return Array.from(set).sort();
  }, [results]);

  const filteredResults = useMemo(() => {
    let data = results;
    
    // Status Filter
    if (activeTab === 'MATCHED') data = data.filter(r => r.status === 'MATCHED');
    if (activeTab === 'MISMATCH') data = data.filter(r => r.status.includes('MISMATCH') || r.status === 'INFERRED MATCH');
    if (activeTab === 'MISSING_2B') data = data.filter(r => r.status === 'MISSING_IN_2B');
    if (activeTab === 'MISSING_BOOKS') data = data.filter(r => r.status === 'MISSING_IN_BOOKS');

    // Party Filter
    if (selectedParty) {
        data = data.filter(r => 
            r.gstr2bRecord?.supplierName === selectedParty || 
            r.booksRecord?.supplierName === selectedParty
        );
    }

    // Search Filter
    if (search) {
        const s = search.toLowerCase();
        data = data.filter(r => 
            r.gstr2bRecord?.supplierName.toLowerCase().includes(s) || 
            r.booksRecord?.supplierName.toLowerCase().includes(s) ||
            r.gstr2bRecord?.invoiceNumber.toLowerCase().includes(s) ||
            r.booksRecord?.invoiceNumber.toLowerCase().includes(s)
        );
    }
    
    return data;
  }, [results, activeTab, search, selectedParty]);

  const counts = useMemo(() => ({
    ALL: results.length,
    MATCHED: results.filter(r => r.status === 'MATCHED').length,
    MISMATCH: results.filter(r => r.status.includes('MISMATCH') || r.status === 'INFERRED MATCH').length,
    MISSING_2B: results.filter(r => r.status === 'MISSING_IN_2B').length,
    MISSING_BOOKS: results.filter(r => r.status === 'MISSING_IN_BOOKS').length,
  }), [results]);

  const formatCurrency = (val?: number) => val !== undefined ? `₹${val.toFixed(2)}` : '-';
  
  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '-';
    // dateStr is expected to be yyyy-mm-dd
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      return `${parts[2]}-${parts[1]}-${parts[0]}`;
    }
    return dateStr;
  };

  const renderCell = (label: string, val1?: any, val2?: any, type: 'text' | 'curr' | 'date' = 'text') => {
      const format = (v: any) => {
          if (type === 'curr') return formatCurrency(v);
          if (type === 'date') return formatDate(v);
          return v;
      };

      if (val1 === val2 && val1 !== undefined) return <span className="text-gray-700">{format(val1)}</span>;
      if (!val1 && !val2) return '-';
      
      return (
          <div className="flex flex-col text-xs space-y-1">
             {val1 !== undefined && <span className="text-blue-600 font-medium" title="Books">Book: {format(val1)}</span>}
             {val2 !== undefined && <span className="text-purple-600 font-medium" title="Portal">Portal: {format(val2)}</span>}
          </div>
      )
  };

  const totals = useMemo(() => {
      return filteredResults.reduce((acc, r) => {
          // Prefer Portal value, fallback to Book
          const rec = r.gstr2bRecord || r.booksRecord;
          if (rec) {
              acc.taxable += rec.taxableValue || 0;
              acc.igst += rec.igst || 0;
              acc.cgst += rec.cgst || 0;
              acc.sgst += rec.sgst || 0;
              acc.total += rec.invoiceValue || 0;
          }
          return acc;
      }, { taxable: 0, igst: 0, cgst: 0, sgst: 0, total: 0 });
  }, [filteredResults]);

  return (
    <div className={clsx(
        "flex flex-col transition-all duration-300",
        isFullScreen ? "fixed inset-0 z-50 h-screen w-screen bg-white" : "h-full"
    )}>
      {/* Summary Cards (Dashboard) */}
      {!isFullScreen && (
        <SummaryCards 
          activeTab={activeTab} 
          onTabChange={setActiveTab}
          counts={counts}
          totals={totals}
        />
      )}

      <div className={clsx(
        "flex-1 bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col overflow-hidden",
        isFullScreen ? "h-full rounded-none border-0" : ""
      )}>
        {/* Header */}
        <div className="p-4 border-b flex flex-col md:flex-row justify-between items-center gap-4 bg-white">
            <h2 className="text-lg font-semibold text-gray-800">
               {activeTab === 'ALL' ? 'All Invoices' : 
                activeTab === 'MATCHED' ? 'Matched Invoices' :
                activeTab === 'MISMATCH' ? 'Mismatched Invoices' :
                activeTab === 'MISSING_2B' ? 'Missing in GSTR-2B' : 'Missing in Books'}
               <span className="ml-2 text-sm font-normal text-gray-500">({filteredResults.length})</span>
            </h2>
            
            <div className="flex items-center gap-2 w-full md:w-auto">
                <div className="relative flex-1 md:w-48">
                    <Filter className="absolute left-2.5 top-2.5 w-4 h-4 text-gray-400" />
                    <select 
                      value={selectedParty}
                      onChange={(e) => setSelectedParty(e.target.value)}
                      className="w-full pl-9 pr-4 py-2 border rounded-lg text-sm focus:ring-2 ring-blue-500 outline-none appearance-none bg-white"
                    >
                        <option value="">All Parties</option>
                        {parties.map(p => <option key={p} value={p}>{p}</option>)}
                    </select>
                </div>
                
                <input 
                  type="text" 
                  placeholder="Search..." 
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="border rounded-lg px-3 py-2 text-sm w-40 md:w-48 focus:ring-2 ring-blue-500 outline-none"
                />
                
                {onDownloadCurrent && (
                    <button 
                      onClick={() => onDownloadCurrent(filteredResults)}
                      className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-sm font-medium transition whitespace-nowrap"
                      title="Download current view"
                    >
                        Download View
                    </button>
                )}

                <button
                  onClick={() => setIsFullScreen(!isFullScreen)}
                  className="p-2 hover:bg-gray-100 rounded-lg text-gray-600 transition"
                  title={isFullScreen ? "Exit Full Screen" : "Full Screen"}
                >
                    {isFullScreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
                </button>
            </div>
        </div>

        {/* Modal */}
        {selectedRecord && (
          <TransactionDetailModal 
              result={selectedRecord} 
              onClose={() => setSelectedRecord(null)} 
          />
        )}

        {/* Table */}
        <div className="flex-1 overflow-auto">
            <table className="w-full text-sm text-left">
                <thead className="bg-gray-50 text-gray-500 sticky top-0 z-10 shadow-sm">
                    <tr>
                        <th className="px-4 py-3 font-medium whitespace-nowrap">Status</th>
                        <th className="px-4 py-3 font-medium min-w-[200px]">Party</th>
                        <th className="px-4 py-3 font-medium whitespace-nowrap">Inv No</th>
                        <th className="px-4 py-3 font-medium whitespace-nowrap">Date</th>
                        <th className="px-4 py-3 font-medium text-right whitespace-nowrap">Taxable</th>
                        <th className="px-4 py-3 font-medium text-right whitespace-nowrap text-xs text-gray-400">IGST</th>
                        <th className="px-4 py-3 font-medium text-right whitespace-nowrap text-xs text-gray-400">CGST</th>
                        <th className="px-4 py-3 font-medium text-right whitespace-nowrap text-xs text-gray-400">SGST</th>
                        <th className="px-4 py-3 font-medium text-right whitespace-nowrap">Total</th>
                        <th className="px-4 py-3 font-medium min-w-[150px]">Remarks</th>
                    </tr>
                </thead>
                <tbody className="divide-y">
                    {filteredResults.map(res => {
                        const b = res.booksRecord;
                        const g = res.gstr2bRecord;
                        const party = g?.supplierName || b?.supplierName || '-';
                        const gstin = g?.gstin || b?.gstin || '-';
                        
                        let statusColor = 'bg-gray-100 text-gray-700';
                        if (res.status === 'MATCHED') statusColor = 'bg-green-100 text-green-800';
                        else if (res.status.includes('MISMATCH') || res.status.includes('INFERRED')) statusColor = 'bg-yellow-100 text-yellow-800';
                        else statusColor = 'bg-red-100 text-red-800';

                        return (
                            <tr 
                              key={res.id} 
                              onClick={() => setSelectedRecord(res)}
                              className="hover:bg-blue-50/50 group cursor-pointer transition-colors"
                            >
                                <td className="px-4 py-3">
                                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${statusColor} whitespace-nowrap`}>
                                        {res.status.replace(/_/g, ' ')}
                                    </span>
                                </td>
                                <td className="px-4 py-3">
                                    <div className="font-medium text-gray-900">{party}</div>
                                    <div className="text-xs text-gray-400">{gstin}</div>
                                </td>
                                <td className="px-4 py-3 font-mono">
                                    {renderCell('Inv', b?.invoiceNumber, g?.invoiceNumber)}
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap">
                                    {renderCell('Date', b?.invoiceDate, g?.invoiceDate, 'date')}
                                </td>
                                <td className="px-4 py-3 text-right font-mono text-gray-600">
                                    {renderCell('Tax', b?.taxableValue, g?.taxableValue, 'curr')}
                                </td>
                                {/* Tax Columns */}
                                <td className="px-4 py-3 text-right font-mono text-xs text-gray-500">
                                    {renderCell('IGST', b?.igst, g?.igst, 'curr')}
                                </td>
                                <td className="px-4 py-3 text-right font-mono text-xs text-gray-500">
                                    {renderCell('CGST', b?.cgst, g?.cgst, 'curr')}
                                </td>
                                <td className="px-4 py-3 text-right font-mono text-xs text-gray-500">
                                    {renderCell('SGST', b?.sgst, g?.sgst, 'curr')}
                                </td>
                                
                                <td className="px-4 py-3 text-right font-bold font-mono text-gray-900">
                                    {renderCell('Total', b?.invoiceValue, g?.invoiceValue, 'curr')}
                                </td>
                                <td className="px-4 py-3 text-xs text-gray-500 max-w-[200px] truncate" title={res.remarks}>
                                    {res.remarks}
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
            {filteredResults.length === 0 && (
                <div className="p-12 text-center text-gray-400">
                    No results found for this filter.
                </div>
            )}
        </div>
      </div>
    </div>
  );
}