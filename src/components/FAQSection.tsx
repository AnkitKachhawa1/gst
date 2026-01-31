import React, { useState } from 'react';
import { ChevronDown, ChevronUp, HelpCircle, FileJson, FileSpreadsheet, ShieldCheck, Zap, Globe } from 'lucide-react';
import clsx from 'clsx';
import { motion, AnimatePresence } from 'framer-motion';

type Language = 'ENGLISH' | 'HINDI' | 'GUJARATI';

const FAQ_DATA = {
  ENGLISH: [
    {
      question: "How do I get started?",
      answer: "It's simple! You need two sets of files: 1) Your GSTR-2B files from the GST Portal (JSON or Excel), and 2) Your Purchase Register (Books) in Excel format. Upload them in the respective boxes above and click 'Start Reconciliation'.",
      icon: Zap
    },
    {
      question: "How do I download GSTR-2B JSON from the GST Portal?",
      answer: (
        <ol className="list-decimal pl-5 space-y-1">
          <li>Log in to the <a href="https://services.gst.gov.in" target="_blank" className="text-blue-600 hover:underline">GST Portal</a>.</li>
          <li>Navigate to <strong>Services &gt; Returns &gt; Returns Dashboard</strong>.</li>
          <li>Select the Financial Year and Return Filing Period.</li>
          <li>Find the <strong>GSTR-2B</strong> tile (Auto-drafted ITC Statement).</li>
          <li>Click <strong>Download</strong> and select <strong>Generate JSON File</strong>.</li>
          <li>After a minute, click 'Generate JSON' again if needed, then download the zip file.</li>
          <li><strong>Unzip</strong> the file to get the .json file, which you can upload here.</li>
        </ol>
      ),
      icon: FileJson
    },
    {
      question: "What format should my Purchase Register (Excel) be in?",
      answer: "You can export your purchase register from Tally, Zoho, Busy, or any ERP. We accept .xlsx files. The file should have headers like GSTIN, Invoice Number, Invoice Date, Taxable Value, etc. Don't worry about exact column names - our tool will help you map them if they don't match automatically.",
      icon: FileSpreadsheet
    },
    {
      question: "What happens if my column names are different?",
      answer: "We feature a 'Smart Column Mapper'. If our system doesn't recognize your column headers (e.g., you have 'Bill No' instead of 'Invoice Number'), a popup will appear asking you to select the correct column for each required field. You only need to do this once per file format.",
      icon: HelpCircle
    },
    {
      question: "How does the reconciliation logic work?",
      answer: (
        <ul className="list-disc pl-5 space-y-1">
          <li><strong>Exact Match:</strong> Invoice Number, GSTIN, and Taxable Value match perfectly.</li>
          <li><strong>Inferred Match:</strong> We detect slight variations in invoice numbers (e.g., '001' vs 'INV/001') to prevent false mismatches.</li>
          <li><strong>Mismatch:</strong> The invoice exists in both records, but amounts (Taxable or Tax) differ.</li>
          <li><strong>Missing:</strong> Invoice exists in one source but not the other.</li>
        </ul>
      ),
      icon: Zap
    },
    {
      question: "Is my data safe?",
      answer: "Absolutely. This tool runs entirely in your browser (Client-Side). Your financial data is NEVER uploaded to any server. You can even disconnect your internet after loading the page and the tool will still work.",
      icon: ShieldCheck
    }
  ],
  HINDI: [
    {
      question: "मैं शुरुआत कैसे करूँ?",
      answer: "यह बहुत आसान है! आपको दो तरह की फाइलों की आवश्यकता है: १) जीएसटी पोर्टल से आपका GSTR-2B (JSON या Excel), और २) Excel फॉर्मेट में आपका पर्चेस रजिस्टर (Books)। उन्हें ऊपर दिए गए बॉक्स में अपलोड करें और 'Start Reconciliation' पर क्लिक करें।",
      icon: Zap
    },
    {
      question: "मैं जीएसटी पोर्टल से GSTR-2B JSON कैसे डाउनलोड करूं?",
      answer: (
        <ol className="list-decimal pl-5 space-y-1">
          <li><a href="https://services.gst.gov.in" target="_blank" className="text-blue-600 hover:underline">GST पोर्टल</a> पर लॉग इन करें।</li>
          <li><strong>Services &gt; Returns &gt; Returns Dashboard</strong> पर जाएं।</li>
          <li>वित्तीय वर्ष और रिटर्न फाइलिंग अवधि का चयन करें।</li>
          <li><strong>GSTR-2B</strong> टाइल (Auto-drafted ITC Statement) ढूंढें।</li>
          <li><strong>Download</strong> पर क्लिक करें और <strong>Generate JSON File</strong> चुनें।</li>
          <li>एक मिनट बाद, यदि आवश्यक हो तो फिर से 'Generate JSON' पर क्लिक करें, और ज़िप फ़ाइल डाउनलोड करें।</li>
          <li>फ़ाइल को <strong>Unzip</strong> करें, आपको .json फ़ाइल मिलेगी जिसे आप यहां अपलोड कर सकते हैं।</li>
        </ol>
      ),
      icon: FileJson
    },
    {
      question: "मेरे पर्चेस रजिस्टर (Excel) का फॉर्मेट क्या होना चाहिए?",
      answer: "आप Tally, Zoho, Busy या किसी भी ERP से अपना पर्चेस रजिस्टर export कर सकते हैं। हम .xlsx फाइल स्वीकार करते हैं। फाइल में GSTIN, Invoice Number, Invoice Date, Taxable Value आदि जैसे हेडर होने चाहिए। कॉलम के नामों की चिंता न करें - हमारा टूल उन्हें मैप करने में आपकी मदद करेगा।",
      icon: FileSpreadsheet
    },
    {
      question: "अगर मेरे कॉलम के नाम अलग हों तो क्या होगा?",
      answer: "हमारे पास 'Smart Column Mapper' है। यदि हमारा सिस्टम आपके कॉलम हेडर को नहीं पहचानता (जैसे 'Invoice Number' की जगह 'Bill No'), तो एक पॉपअप आएगा जो आपसे सही कॉलम चुनने के लिए कहेगा।",
      icon: HelpCircle
    },
    {
      question: "रिकॉन्सिलिएशन कैसे काम करता है?",
      answer: (
        <ul className="list-disc pl-5 space-y-1">
          <li><strong>Exact Match:</strong> इनवॉइस नंबर, GSTIN और टैक्सेबल वैल्यू पूरी तरह मेल खाते हैं।</li>
          <li><strong>Inferred Match:</strong> हम इनवॉइस नंबरों में छोटे अंतर (जैसे '001' बनाम 'INV/001') को पहचानते हैं।</li>
          <li><strong>Mismatch:</strong> इनवॉइस दोनों जगह है, लेकिन राशि अलग है।</li>
          <li><strong>Missing:</strong> इनवॉइस एक जगह है लेकिन दूसरी जगह नहीं।</li>
        </ul>
      ),
      icon: Zap
    },
    {
      question: "क्या मेरा डेटा सुरक्षित है?",
      answer: "बिल्कुल। यह टूल पूरी तरह से आपके ब्राउज़र (Client-Side) में चलता है। आपका वित्तीय डेटा कभी भी किसी सर्वर पर अपलोड नहीं किया जाता है।",
      icon: ShieldCheck
    }
  ],
  GUJARATI: [
    {
      question: "હું શરૂઆત કેવી રીતે કરું?",
      answer: "આ ખૂબ જ સરળ છે! તમારે બે પ્રકારની ફાઇલોની જરૂર છે: ૧) જીએસટી પોર્ટલ પરથી તમારું GSTR-2B (JSON અથવા Excel), અને ૨) Excel ફોર્મેટમાં તમારું ખરીદી રજિસ્ટર (Books). તેમને ઉપરના બોક્સમાં અપલોડ કરો અને 'Start Reconciliation' પર ક્લિક કરો.",
      icon: Zap
    },
    {
      question: "હું જીએસટી પોર્ટલ પરથી GSTR-2B JSON કેવી રીતે ડાઉનલોડ કરું?",
      answer: (
        <ol className="list-decimal pl-5 space-y-1">
          <li><a href="https://services.gst.gov.in" target="_blank" className="text-blue-600 hover:underline">GST પોર્ટલ</a> પર લોગ ઇન કરો.</li>
          <li><strong>Services &gt; Returns &gt; Returns Dashboard</strong> પર જાઓ.</li>
          <li>નાણાકીય વર્ષ અને રિટર્ન ફાઇલિંગ સમયગાળો પસંદ કરો.</li>
          <li><strong>GSTR-2B</strong> ટાઇલ (Auto-drafted ITC Statement) શોધો.</li>
          <li><strong>Download</strong> પર ક્લિક કરો અને <strong>Generate JSON File</strong> પસંદ કરો.</li>
          <li>એક મિનિટ પછી, જો જરૂર હોય તો ફરીથી 'Generate JSON' પર ક્લિક કરો, અને ઝિપ ફાઇલ ડાઉનલોડ કરો.</li>
          <li>ફાઇલને <strong>Unzip</strong> કરો, તમને .json ફાઇલ મળશે જે તમે અહીં અપલોડ કરી શકો છો.</li>
        </ol>
      ),
      icon: FileJson
    },
    {
      question: "મારા ખરીદી રજિસ્ટર (Excel) નું ફોર્મેટ શું હોવું જોઈએ?",
      answer: "તમે Tally, Zoho, Busy અથવા કોઈપણ ERP માંથી તમારું ખરીદી રજિસ્ટર export કરી શકો છો. અમે .xlsx ફાઇલો સ્વીકારીએ છીએ. ફાઇલમાં GSTIN, Invoice Number, Invoice Date, Taxable Value વગેરે જેવા હેડર હોવા જોઈએ.",
      icon: FileSpreadsheet
    },
    {
      question: "જો મારા કોલમના નામ અલગ હોય તો શું થશે?",
      answer: "અમારી પાસે 'Smart Column Mapper' છે. જો અમારી સિસ્ટમ તમારા કોલમ હેડરને ઓળખતી નથી (જેમ કે 'Invoice Number' ને બદલે 'Bill No'), તો એક પોપઅપ આવશે જે તમને સાચા કોલમ પસંદ કરવા માટે પૂછશે.",
      icon: HelpCircle
    },
    {
      question: "રિકન્સિલેશન કેવી રીતે કામ કરે છે?",
      answer: (
        <ul className="list-disc pl-5 space-y-1">
          <li><strong>Exact Match:</strong> ઇન્વોઇસ નંબર, GSTIN અને ટેક્સેબલ વેલ્યુ સંપૂર્ણપણે મેચ થાય છે.</li>
          <li><strong>Inferred Match:</strong> અમે ઇન્વોઇસ નંબરોમાં નાના તફાવતો (જેમ કે '001' વિરુદ્ધ 'INV/001') ને શોધી કાઢીએ છીએ.</li>
          <li><strong>Mismatch:</strong> ઇન્વોઇસ બંને જગ્યાએ છે, પરંતુ રકમ અલગ છે.</li>
          <li><strong>Missing:</strong> ઇન્વોઇસ એક જગ્યાએ છે પરંતુ બીજી જગ્યાએ નથી.</li>
        </ul>
      ),
      icon: Zap
    },
    {
      question: "શું મારો ડેટા સુરક્ષિત છે?",
      answer: "ચોક્કસ. આ સાધન સંપૂર્ણપણે તમારા બ્રાઉઝર (Client-Side) માં ચાલે છે. તમારો નાણાકીય ડેટા ક્યારેય કોઈ સર્વર પર અપલોડ થતો નથી.",
      icon: ShieldCheck
    }
  ]
};

export function FAQSection() {
  const [activeTab, setActiveTab] = useState<Language>('ENGLISH');
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="max-w-4xl mx-auto mt-20 mb-20 px-4">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-slate-800">Frequently Asked Questions</h2>
        <p className="text-slate-500 mt-2">Everything you need to know about using the GSTR Reconciler</p>
      </div>

      {/* Language Tabs */}
      <div className="flex justify-center mb-8">
        <div className="bg-slate-100 p-1 rounded-xl inline-flex">
          {(['ENGLISH', 'HINDI', 'GUJARATI'] as const).map((lang) => (
            <button
              key={lang}
              onClick={() => { setActiveTab(lang); setOpenIndex(null); }}
              className={clsx(
                "px-6 py-2 rounded-lg text-sm font-semibold transition-all duration-200 flex items-center gap-2",
                activeTab === lang 
                  ? "bg-white text-blue-600 shadow-sm" 
                  : "text-slate-500 hover:text-slate-700 hover:bg-slate-200/50"
              )}
            >
              <Globe className="w-4 h-4" />
              {lang === 'ENGLISH' ? 'English' : lang === 'HINDI' ? 'हिंदी' : 'ગુજરાતી'}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        {FAQ_DATA[activeTab].map((faq, idx) => {
          const isOpen = openIndex === idx;
          const Icon = faq.icon;

          return (
            <motion.div 
              key={`${activeTab}-${idx}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className={clsx(
                "bg-white border rounded-xl overflow-hidden transition-colors duration-200",
                isOpen ? "border-blue-200 shadow-sm" : "border-gray-200 hover:border-blue-200"
              )}
            >
              <button
                onClick={() => setOpenIndex(isOpen ? null : idx)}
                className="w-full flex items-center justify-between p-5 text-left focus:outline-none"
              >
                <div className="flex items-center gap-4">
                  <div className={clsx(
                    "p-2 rounded-lg transition-colors shrink-0",
                    isOpen ? "bg-blue-100 text-blue-600" : "bg-gray-100 text-gray-500"
                  )}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className={clsx(
                    "font-semibold text-lg",
                    isOpen ? "text-blue-800" : "text-slate-700"
                  )}>
                    {faq.question}
                  </span>
                </div>
                {isOpen ? <ChevronUp className="w-5 h-5 text-blue-500 shrink-0" /> : <ChevronDown className="w-5 h-5 text-gray-400 shrink-0" />}
              </button>

              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    key="content"
                    initial="collapsed"
                    animate="open"
                    exit="collapsed"
                    variants={{
                      open: { opacity: 1, height: "auto" },
                      collapsed: { opacity: 0, height: 0 }
                    }}
                    transition={{ duration: 0.3, ease: [0.04, 0.62, 0.23, 0.98] }}
                  >
                    <div className="px-5 pb-5 pl-[4.5rem] text-slate-600 leading-relaxed border-t border-gray-50 pt-4">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
