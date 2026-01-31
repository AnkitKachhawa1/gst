# GST Reco (GSTR-2B Analyzer)

A powerful, client-side GST Reconciliation tool built with **Next.js** and **Tailwind CSS**. This tool helps accountants and businesses reconcile their Purchase Register (Books) with GSTR-2B JSON files efficiently, identifying matches, mismatches, and missing entries automatically.

## 🚀 Key Features

*   **Multi-File Upload:** Drag & drop multiple GSTR-2B JSON files at once; the tool aggregates them automatically.
*   **Smart Reconciliation Engine:**
    *   **Phase 1 (Exact Match):** Matches by GSTIN + Invoice Number. Detects "Amount Mismatches" (within a tolerance of ₹2.00).
    *   **Phase 2 (Inferred Match):** Smartly finds matches where the Invoice Number might differ (e.g., typo) but the GSTIN and Taxable/Tax Amounts match exactly.
*   **Detailed Status Reports:**
    *   ✅ **MATCHED**: Perfect match.
    *   ⚠️ **AMOUNT MISMATCH**: Invoice found but values differ.
    *   🔍 **INFERRED MATCH**: Likely match based on amount & vendor.
    *   ❌ **MISSING IN 2B**: Invoice present in Books but not in GSTR-2B.
    *   📥 **MISSING IN BOOKS**: Invoice present in GSTR-2B but not in Books.
*   **Drill-Down Dashboard:** Clickable cards for B2B, B2C, and Exempt categories.
*   **Excel Export:** Export the full reconciliation ledger to Excel for offline review.
*   **Privacy Focused:** All processing happens **in your browser**. No data is uploaded to any server.

## 🛠️ Tech Stack

*   **Framework:** Next.js 14 (App Router)
*   **Language:** TypeScript
*   **Styling:** Tailwind CSS
*   **Logic:** Client-side processing (Lodash, custom algorithms)
*   **Deployment:** Vercel

## 📂 Project Structure

```
.
├── src/
│   ├── app/              # Next.js App Router pages
│   ├── components/       # UI Components (UploadZone, ResultsTable, etc.)
│   ├── utils/            # Core logic (reconciliation.ts, cleaning.ts, excel.ts)
│   └── types/            # TypeScript interfaces
├── public/               # Static assets
└── start.bat             # Quick start script for Windows
```

## ⚡ How to Run Locally

### Prerequisites
*   Node.js installed (v18 or higher recommended).

### Steps
1.  **Clone the repository:**
    ```bash
    git clone https://github.com/AnkitKachhawa1/gst.git
    cd gst-reco-new
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Run the development server:**
    *   **Option A (Windows):** Double-click `start.bat`.
    *   **Option B (Terminal):**
        ```bash
        npm run dev
        ```

4.  **Open in Browser:**
    Navigate to `http://localhost:3000`.

## 📖 How to Use

1.  **Upload Books Data:** Upload your Purchase Register (Excel/CSV) in the "Books" section.
2.  **Upload GSTR-2B:** Drag and drop one or multiple GSTR-2B JSON files (downloaded from the GST Portal) into the "GSTR-2B" section.
3.  **Analyze:** The tool will automatically process the files and display a summary dashboard.
4.  **Review Matches:**
    *   Click on **"Matched"** to see confirmed invoices.
    *   Check **"Mismatches"** to resolve small differences.
    *   Review **"Missing"** lists to identify non-compliant vendors or missing bookings.
5.  **Export:** Click the "Export Excel" button to get a comprehensive report.

## 🚢 Deployment

This project is deployed on **Vercel** and connected to this GitHub repository.
*   **Live URL:** [https://gst-reco-new.vercel.app](https://gst-reco-new.vercel.app) (Example URL)
*   **Updates:** Any push to the `main` branch automatically triggers a new deployment.