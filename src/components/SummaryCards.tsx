import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';
import { 
  CheckCircle, 
  AlertTriangle, 
  XCircle, 
  FileText, 
  AlertCircle,
  X
} from 'lucide-react';

export type SummaryTab = 'ALL' | 'MATCHED' | 'MISMATCH' | 'MISSING_2B' | 'MISSING_BOOKS';

interface SummaryCardsProps {
  activeTab: SummaryTab;
  onTabChange: (tab: SummaryTab) => void;
  counts: Record<SummaryTab, number>;
  totals: {
    taxable: number;
    igst: number;
    cgst: number;
    sgst: number;
    total: number;
  };
}

const CARDS = [
  { id: 'ALL', label: 'Total Invoices', icon: FileText, color: 'blue' },
  { id: 'MATCHED', label: 'Matched', icon: CheckCircle, color: 'green' },
  { id: 'MISMATCH', label: 'Mismatch', icon: AlertTriangle, color: 'yellow' },
  { id: 'MISSING_2B', label: 'Missing in 2B', icon: XCircle, color: 'red' },
  { id: 'MISSING_BOOKS', label: 'Missing in Books', icon: AlertCircle, color: 'orange' },
] as const;

export function SummaryCards({ activeTab, onTabChange, counts, totals }: SummaryCardsProps) {
  const [isModalOpen, setModalOpen] = useState(false);

  const formatCurrency = (val: number) => 
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(val);

  const activeCardConfig = CARDS.find(c => c.id === activeTab);

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 mb-6">
        {CARDS.map((card) => {
          const isActive = activeTab === card.id;
          const count = counts[card.id as SummaryTab];
          
          const colorStyles = {
            blue: 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100',
            green: 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100',
            yellow: 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100',
            red: 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100',
            orange: 'bg-orange-50 text-orange-700 border-orange-200 hover:bg-orange-100',
          };
          
          const activeColorStyles = {
            blue: 'bg-blue-600 text-white border-blue-700 shadow-blue-200',
            green: 'bg-emerald-600 text-white border-emerald-700 shadow-emerald-200',
            yellow: 'bg-amber-500 text-white border-amber-600 shadow-amber-200',
            red: 'bg-rose-600 text-white border-rose-700 shadow-rose-200',
            orange: 'bg-orange-600 text-white border-orange-700 shadow-orange-200',
          };

          return (
            <motion.div
              key={card.id}
              whileHover={{ y: -2 }}
              onClick={() => {
                onTabChange(card.id as SummaryTab);
                setModalOpen(true);
              }}
              className={clsx(
                "cursor-pointer rounded-lg border px-4 py-3 transition-all duration-200 shadow-sm flex items-center justify-between",
                isActive 
                  ? `${activeColorStyles[card.color]} shadow-md ring-1 ring-offset-1 ring-offset-slate-50 ${card.color === 'yellow' ? 'ring-amber-500' : ''}` 
                  : `${colorStyles[card.color]}`
              )}
            >
              <div>
                <p className={clsx("text-[10px] font-bold uppercase tracking-wider mb-0.5", isActive ? "text-white/80" : "text-gray-500")}>
                  {card.label}
                </p>
                <h3 className="text-xl font-bold font-mono leading-none">
                  {count}
                </h3>
              </div>
              <card.icon className={clsx("w-5 h-5", isActive ? "text-white/90" : "opacity-60")} />
            </motion.div>
          );
        })}
      </div>

      <AnimatePresence>
        {isModalOpen && activeCardConfig && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setModalOpen(false)}
              className="absolute inset-0 bg-slate-900/30 backdrop-blur-sm"
            />
            
            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100"
            >
              {/* Header */}
              <div className={clsx(
                "px-6 py-4 flex justify-between items-center border-b",
                // Use a light header background based on the active card color if desired, 
                // or just keep it white. Let's keep it simple white for cleanness.
                "bg-gray-50/50"
              )}>
                <div className="flex items-center gap-3">
                  <div className={clsx(
                    "p-2 rounded-lg", 
                    activeCardConfig.color === 'blue' && "bg-blue-100 text-blue-600",
                    activeCardConfig.color === 'green' && "bg-emerald-100 text-emerald-600",
                    activeCardConfig.color === 'yellow' && "bg-amber-100 text-amber-600",
                    activeCardConfig.color === 'red' && "bg-rose-100 text-rose-600",
                    activeCardConfig.color === 'orange' && "bg-orange-100 text-orange-600",
                  )}>
                    <activeCardConfig.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-gray-800">{activeCardConfig.label}</h2>
                    <p className="text-xs text-gray-500">Financial Summary</p>
                  </div>
                </div>
                <button 
                  onClick={() => setModalOpen(false)}
                  className="p-2 hover:bg-gray-200 rounded-full text-gray-500 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Body */}
              <div className="p-6">
                <div className="text-center mb-8">
                  <p className="text-sm text-gray-500 uppercase tracking-wider font-semibold mb-1">Total Value</p>
                  <p className="text-3xl font-bold text-slate-900">{formatCurrency(totals.total)}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                   <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                      <div className="text-xs text-gray-500 uppercase mb-1">Taxable Amount</div>
                      <div className="text-lg font-mono font-semibold text-slate-700">{formatCurrency(totals.taxable)}</div>
                   </div>
                   <div className="bg-blue-50 p-3 rounded-lg border border-blue-100">
                      <div className="text-xs text-blue-600 uppercase mb-1">IGST</div>
                      <div className="text-lg font-mono font-semibold text-blue-700">{formatCurrency(totals.igst)}</div>
                   </div>
                   <div className="bg-purple-50 p-3 rounded-lg border border-purple-100">
                      <div className="text-xs text-purple-600 uppercase mb-1">CGST</div>
                      <div className="text-lg font-mono font-semibold text-purple-700">{formatCurrency(totals.cgst)}</div>
                   </div>
                   <div className="bg-purple-50 p-3 rounded-lg border border-purple-100">
                      <div className="text-xs text-purple-600 uppercase mb-1">SGST</div>
                      <div className="text-lg font-mono font-semibold text-purple-700">{formatCurrency(totals.sgst)}</div>
                   </div>
                </div>
              </div>

              {/* Footer */}
              <div className="bg-gray-50 px-6 py-3 text-center">
                 <p className="text-xs text-gray-400">Showing data for {counts[activeTab]} invoices</p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
