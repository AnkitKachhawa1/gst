'use client';

import React, { useState } from 'react';
import { UploadZone } from '@/components/UploadZone';
import { ResultsTable } from '@/components/ResultsTable';
import { ColumnMapper, REQUIRED_FIELDS } from '@/components/ColumnMapper';
import { CleanedRecord, ReconciliationResult } from '@/types';
import { parseFile, downloadReport, getHeaders } from '@/utils/excel';
import { runReconciliation } from '@/utils/reconciliation';
import { RefreshCw, Download, RotateCcw, Map as MapIcon, AlertCircle, CheckCircle2, FileSpreadsheet } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { FAQSection } from '@/components/FAQSection';
import { ArticleSection } from '@/components/ArticleSection';
import { motion, AnimatePresence } from 'framer-motion';

export default function Home() {
  const [step, setStep] = useState<'UPLOAD' | 'RESULTS'>('UPLOAD');
  const [loading, setLoading] = useState(false);
  const [infoTab, setInfoTab] = useState<'ARTICLE' | 'FAQ'>('ARTICLE');
  
  // Files
  const [gstrFiles, setGstrFiles] = useState<File[]>([]);
  const [booksFiles, setBooksFiles] = useState<File[]>([]);
  
  // Mapping
  const [showMapper, setShowMapper] = useState<{ show: boolean, type: 'GSTR2B' | 'BOOKS' }>({ show: false, type: 'GSTR2B' });
  const [gstrMapping, setGstrMapping] = useState<Record<string, string> | null>(null);
  const [booksMapping, setBooksMapping] = useState<Record<string, string> | null>(null);

  // Data
  const [results, setResults] = useState<ReconciliationResult[]>([]);
  const [stats, setStats] = useState({ matched: 0, mismatch: 0, missing: 0 });

  // Auto-detection logic
  const checkMapping = async (files: File[], type: 'GSTR2B' | 'BOOKS') => {
      if (files.length === 0 || files[0].name.endsWith('.json')) return;
      
      const headers = await getHeaders(files[0]);
      const lowerHeaders = headers.map(h => h.toLowerCase());
      
      const findKey = (keywords: string[], excludeTerms?: string[]) => {
          for (const kw of keywords) {
              const found = lowerHeaders.find(k => {
                  if (excludeTerms && excludeTerms.some(term => k.includes(term))) return false;
                  return k.includes(kw);
              });
              if (found) return headers[lowerHeaders.indexOf(found)];
          }
          return null;
      };

      const mapping: Record<string, string> = {};
      let missingRequired = false;

      REQUIRED_FIELDS.forEach(field => {
          let keywords: string[] = [];
          let exclude: string[] | undefined = undefined;

          if (field.key === 'gstin') keywords = ['gstin', 'ctin', 'tin'];
          if (field.key === 'invoiceDate') {
              keywords = ['invoice date', 'document date', 'bill date', 'date', 'dt'];
              exclude = ['supfildt', 'filing'];
          }
          if (field.key === 'invoiceValue') {
              keywords = ['invoice value', 'total invoice value', 'grand total', 'invoice amount', 'total value', 'total'];
              exclude = ['taxable', 'net', 'amount before', 'rate'];
          }
          if (field.key === 'taxableValue') keywords = ['taxable value', 'taxable', 'txval'];
          if (field.key === 'partyName') keywords = ['party name', 'trade name', 'supplier name', 'name'];
          if (field.key === 'igst') keywords = ['igst', 'integrated tax'];
          if (field.key === 'cgst') keywords = ['cgst', 'central tax'];
          if (field.key === 'sgst') keywords = ['sgst', 'state tax', 'utgst'];

          const match = findKey(keywords, exclude);
          if (match) {
              mapping[field.key] = match;
          } else if (field.required) {
              missingRequired = true;
          }
      });

      if (type === 'GSTR2B') setGstrMapping(mapping);
      else setBooksMapping(mapping);

      if (missingRequired) {
          setShowMapper({ show: true, type });
      }
  };

  const handleProcess = async () => {
    if (gstrFiles.length === 0 || booksFiles.length === 0) {
        alert("Please upload both GSTR-2B and Books files.");
        return;
    }

    setLoading(true);
    try {
        let allGstr: CleanedRecord[] = [];
        for (const file of gstrFiles) {
            const records = await parseFile(file, 'GSTR2B', uuidv4(), gstrMapping || undefined);
            allGstr = [...allGstr, ...records];
        }

        let allBooks: CleanedRecord[] = [];
        for (const file of booksFiles) {
             const records = await parseFile(file, 'BOOKS', uuidv4(), booksMapping || undefined);
             allBooks = [...allBooks, ...records];
        }

        await new Promise(r => setTimeout(r, 800)); // Slight delay for animation
        
        const res = runReconciliation(allBooks, allGstr);
        setResults(res);
        
        setStats({
            matched: res.filter(r => r.status === 'MATCHED').length,
            mismatch: res.filter(r => r.status.includes('MISMATCH') || r.status.includes('INFERRED')).length,
            missing: res.filter(r => r.status.includes('MISSING')).length
        });
        
        setStep('RESULTS');

    } catch (e: any) {
        console.error(e);
        alert("Error processing files: " + e.message);
    } finally {
        setLoading(false);
    }
  };

  const isMappingIncomplete = (mapping: Record<string, string> | null) => {
      if (!mapping) return true;
      return REQUIRED_FIELDS.some(f => f.required && !mapping[f.key]);
  };

  const handleReset = () => {
      if(confirm("Start fresh? All current data will be lost.")) {
          setResults([]);
          setGstrFiles([]);
          setBooksFiles([]);
          setGstrMapping(null);
          setBooksMapping(null);
          setStep('UPLOAD');
      }
  };

  return (
    <div className="bg-slate-50 min-h-screen flex flex-col font-sans text-slate-900">
      
      {/* --- HEADER --- */}
      <motion.header 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', stiffness: 100, damping: 20 }}
        className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-40 shadow-sm"
      >
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <a href="https://ankitkachhawa.in" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg group-hover:scale-105 transition-transform">
              G
            </div>
            <div className="flex flex-col">
              <h1 className="text-xl font-bold text-slate-800 leading-tight group-hover:text-blue-700 transition-colors">
                GSTR-2B Reconciler
              </h1>
              <span className="text-xs font-medium text-slate-500 tracking-wide uppercase">
                by <span className="text-blue-600 font-bold">ANKIT KACHHAWA</span>
              </span>
            </div>
          </a>
          
          <a 
            href="https://ankitkachhawa.in"
            className="hidden sm:flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-blue-600 transition-colors bg-slate-100 hover:bg-blue-50 px-4 py-2 rounded-full"
          >
            Visit Main Site &rarr;
          </a>
        </div>
      </motion.header>

      {/* --- MAIN CONTENT --- */}
      <div className="flex-grow relative overflow-hidden">
        
        {/* Background Elements */}
        <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-blue-50/50 to-transparent -z-10" />
        
        {/* Mapper Modal */}
        <AnimatePresence>
          {showMapper.show && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
            >
              <ColumnMapper 
                  files={showMapper.type === 'GSTR2B' ? gstrFiles : booksFiles}
                  sourceType={showMapper.type}
                  initialMapping={showMapper.type === 'GSTR2B' ? gstrMapping : booksMapping}
                  onMappingConfirmed={(map) => {
                      if (showMapper.type === 'GSTR2B') setGstrMapping(map);
                      else setBooksMapping(map);
                      setShowMapper({ show: false, type: 'GSTR2B' });
                  }}
                  onCancel={() => setShowMapper({ show: false, type: 'GSTR2B' })}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Toolbar (Results Step) */}
        <AnimatePresence>
          {step === 'RESULTS' && (
            <motion.div 
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="bg-white border-b px-8 py-4 flex justify-between items-center shadow-sm z-30"
            >
                <div className="flex gap-6 text-sm">
                   <div className="flex items-center gap-2 text-green-700 bg-green-50 px-3 py-1 rounded-full font-medium">
                      <CheckCircle2 size={16} /> Matched: {stats.matched}
                   </div>
                   <div className="flex items-center gap-2 text-amber-700 bg-amber-50 px-3 py-1 rounded-full font-medium">
                      <AlertCircle size={16} /> Mismatch: {stats.mismatch}
                   </div>
                   <div className="flex items-center gap-2 text-red-700 bg-red-50 px-3 py-1 rounded-full font-medium">
                      <AlertCircle size={16} /> Missing: {stats.missing}
                   </div>
                </div>
                <div className="flex gap-3">
                  <button onClick={() => downloadReport(results)} className="flex items-center gap-2 px-5 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-bold shadow-md hover:shadow-lg transition-all active:scale-95">
                      <Download className="w-4 h-4" /> Export Report
                  </button>
                  <button onClick={handleReset} className="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg text-sm font-semibold transition-all shadow-sm hover:shadow active:scale-95">
                      <RotateCcw className="w-4 h-4" /> Reset
                  </button>
                </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="p-8 container mx-auto max-w-[1600px]">
           <AnimatePresence mode="wait">
             
             {/* LOADING STATE */}
             {loading ? (
                 <motion.div 
                    key="loading"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.1 }}
                    className="flex flex-col items-center justify-center h-[60vh]"
                 >
                     <div className="relative mb-8">
                        <div className="w-24 h-24 border-4 border-slate-100 rounded-full"></div>
                        <div className="w-24 h-24 border-4 border-t-blue-600 rounded-full animate-spin absolute top-0 left-0 shadow-lg shadow-blue-500/20"></div>
                        <div className="absolute inset-0 flex items-center justify-center text-blue-600">
                          <RefreshCw className="w-8 h-8 animate-pulse" />
                        </div>
                     </div>
                     <h2 className="text-3xl font-bold text-slate-800 mb-2">Analyzing Data...</h2>
                     <p className="text-slate-500 text-lg">Parsing {gstrFiles.length + booksFiles.length} files and matching invoices.</p>
                 </motion.div>
             ) 
             
             /* UPLOAD STEP */
             : step === 'UPLOAD' ? (
                 <motion.div 
                    key="upload"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.4 }}
                 >
                    <div className="max-w-5xl mx-auto mt-8">
                        <div className="text-center mb-12">
                          <h1 className="text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">
                            Free GSTR-2B Reconciliation Tool - <span className="text-blue-600">India</span>
                          </h1>
                          <p className="text-lg text-slate-500 max-w-3xl mx-auto">
                            The fastest way to match your Purchase Register with GSTR-2B JSONs. 
                            <br className="hidden md:block"/>
                            100% Privacy: Data is processed locally in your browser and never uploaded.
                            <span className="block mt-3 text-base text-slate-400">
                              Trusted by CAs and Accountants in Gujarat, Mumbai, and across India.
                            </span>
                          </p>
                        </div>

                        <div className="grid md:grid-cols-2 gap-8 items-start">
                            {/* GSTR-2B CARD */}
                            <div className="space-y-4">
                                <motion.div whileHover={{ y: -5 }} transition={{ type: 'spring', stiffness: 300 }}>
                                  <UploadZone 
                                      title="1. Upload GSTR-2B (JSON/Excel)" 
                                      accept=".json,.xlsx" 
                                      multiple 
                                      color="purple"
                                      onFilesSelected={files => {
                                          const newFiles = [...gstrFiles, ...files];
                                          setGstrFiles(newFiles);
                                          checkMapping(files, 'GSTR2B');
                                      }} 
                                  />
                                </motion.div>
                                <AnimatePresence>
                                  {gstrFiles.length > 0 && (
                                      <motion.div 
                                        initial={{ opacity: 0, height: 0 }} 
                                        animate={{ opacity: 1, height: 'auto' }} 
                                        className="bg-white p-5 rounded-2xl border border-purple-100 shadow-sm"
                                      >
                                          <div className="flex justify-between items-center mb-3">
                                              <h4 className="font-bold text-purple-900 flex items-center gap-2">
                                                <FileSpreadsheet className="w-4 h-4" /> 
                                                GSTR-2B Files ({gstrFiles.length})
                                              </h4>
                                              <button 
                                                  onClick={() => setShowMapper({ show: true, type: 'GSTR2B' })}
                                                  className={`text-xs font-bold flex items-center gap-1 border px-3 py-1.5 rounded-lg transition-colors ${
                                                      isMappingIncomplete(gstrMapping) 
                                                      ? 'bg-red-50 border-red-200 text-red-700 hover:bg-red-100' 
                                                      : 'bg-purple-50 border-purple-200 text-purple-700 hover:bg-purple-100'
                                                  }`}
                                              >
                                                  {isMappingIncomplete(gstrMapping) ? <AlertCircle className="w-3 h-3" /> : <MapIcon className="w-3 h-3" />}
                                                  {isMappingIncomplete(gstrMapping) ? 'Map Columns' : 'Mapped'}
                                              </button>
                                          </div>
                                          <ul className="text-sm text-slate-600 space-y-2 max-h-40 overflow-y-auto custom-scrollbar">
                                              {gstrFiles.map((f, i) => (
                                                <li key={i} className="flex justify-between items-center bg-slate-50 px-3 py-2 rounded-lg">
                                                  <span className="truncate max-w-[200px]">{f.name}</span>
                                                  <span className="text-xs text-slate-400 font-mono">{(f.size/1024).toFixed(0)}KB</span>
                                                </li>
                                              ))}
                                          </ul>
                                          <button onClick={() => { setGstrFiles([]); setGstrMapping(null); }} className="text-xs text-red-500 hover:text-red-600 hover:underline mt-3 font-medium">Remove All</button>
                                      </motion.div>
                                  )}
                                </AnimatePresence>
                            </div>

                            {/* BOOKS CARD */}
                            <div className="space-y-4">
                                <motion.div whileHover={{ y: -5 }} transition={{ type: 'spring', stiffness: 300 }}>
                                  <UploadZone 
                                      title="2. Upload Purchase Register" 
                                      accept=".xlsx" 
                                      color="blue"
                                      onFilesSelected={files => {
                                          const newFiles = [...booksFiles, ...files];
                                          setBooksFiles(newFiles);
                                          checkMapping(files, 'BOOKS');
                                      }} 
                                  />
                                </motion.div>
                                <AnimatePresence>
                                  {booksFiles.length > 0 && (
                                      <motion.div 
                                        initial={{ opacity: 0, height: 0 }} 
                                        animate={{ opacity: 1, height: 'auto' }}
                                        className="bg-white p-5 rounded-2xl border border-blue-100 shadow-sm"
                                      >
                                          <div className="flex justify-between items-center mb-3">
                                              <h4 className="font-bold text-blue-900 flex items-center gap-2">
                                                <FileSpreadsheet className="w-4 h-4" />
                                                Purchase Books ({booksFiles.length})
                                              </h4>
                                              <button 
                                                  onClick={() => setShowMapper({ show: true, type: 'BOOKS' })}
                                                  className={`text-xs font-bold flex items-center gap-1 border px-3 py-1.5 rounded-lg transition-colors ${
                                                      isMappingIncomplete(booksMapping) 
                                                      ? 'bg-red-50 border-red-200 text-red-700 hover:bg-red-100' 
                                                      : 'bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100'
                                                  }`}
                                              >
                                                  {isMappingIncomplete(booksMapping) ? <AlertCircle className="w-3 h-3" /> : <MapIcon className="w-3 h-3" />}
                                                  {isMappingIncomplete(booksMapping) ? 'Map Columns' : 'Mapped'}
                                              </button>
                                          </div>
                                          <ul className="text-sm text-slate-600 space-y-2 max-h-40 overflow-y-auto custom-scrollbar">
                                              {booksFiles.map((f, i) => (
                                                <li key={i} className="flex justify-between items-center bg-slate-50 px-3 py-2 rounded-lg">
                                                  <span className="truncate max-w-[200px]">{f.name}</span>
                                                  <span className="text-xs text-slate-400 font-mono">{(f.size/1024).toFixed(0)}KB</span>
                                                </li>
                                              ))}
                                          </ul>
                                          <button onClick={() => { setBooksFiles([]); setBooksMapping(null); }} className="text-xs text-red-500 hover:text-red-600 hover:underline mt-3 font-medium">Remove All</button>
                                      </motion.div>
                                  )}
                                </AnimatePresence>
                            </div>
                        </div>

                        <div className="mt-16 flex justify-center">
                            <motion.button 
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={handleProcess}
                                disabled={gstrFiles.length === 0 || booksFiles.length === 0 || isMappingIncomplete(gstrMapping) || isMappingIncomplete(booksMapping)}
                                className="group flex items-center gap-3 bg-gradient-to-r from-slate-900 to-slate-800 hover:from-blue-600 hover:to-indigo-600 disabled:from-slate-200 disabled:to-slate-300 disabled:text-slate-400 disabled:cursor-not-allowed text-white px-10 py-5 rounded-2xl text-lg font-bold transition-all shadow-xl hover:shadow-2xl hover:shadow-blue-500/20"
                            >
                                <RefreshCw className="w-6 h-6 group-hover:rotate-180 transition-transform duration-700 ease-in-out" />
                                Start Reconciliation
                            </motion.button>
                        </div>
                        
                        <div className="mt-24">
                          <div className="flex justify-center mb-8">
                             <div className="bg-slate-200 p-1 rounded-full flex">
                                <button 
                                  onClick={() => setInfoTab('ARTICLE')}
                                  className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${infoTab === 'ARTICLE' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                                >
                                  Guide & Article
                                </button>
                                <button 
                                  onClick={() => setInfoTab('FAQ')}
                                  className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${infoTab === 'FAQ' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                                >
                                  Common Questions (FAQ)
                                </button>
                             </div>
                          </div>
                          
                          <motion.div
                            key={infoTab}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                          >
                             {infoTab === 'ARTICLE' ? <ArticleSection /> : <FAQSection />}
                          </motion.div>
                        </div>
                    </div>
                 </motion.div>
             ) 
             
             /* RESULTS STEP */
             : (
                 <motion.div 
                    key="results"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="h-[calc(100vh-140px)] flex flex-col gap-4"
                 >
                    <ResultsTable 
                      results={results} 
                      onDownloadCurrent={(filtered) => downloadReport(filtered)}
                    />
                 </motion.div>
             )}
           </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
