import { useState } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { StockAnalysis, MutualFund } from "../types";
import { Download, Loader2, CheckCircle2, FileText, Calendar, TrendingUp, Award } from "lucide-react";

interface PdfExporterProps {
  activeStock: StockAnalysis;
  selectedFund: MutualFund | null;
  sipAmount: number;
  sipReturnRate: number;
  sipYears: number;
  sipExpectations: {
    totalInvested: number;
    totalEstimatedGains: number;
    maturityValue: number;
  };
}

export default function PdfExporter({
  activeStock,
  selectedFund,
  sipAmount,
  sipReturnRate,
  sipYears,
  sipExpectations
}: PdfExporterProps) {
  const [downloading, setDownloading] = useState(false);
  const [success, setSuccess] = useState(false);

  const generatePdf = async () => {
    const reportElement = document.getElementById("executive-pdf-template");
    if (!reportElement) return;

    setDownloading(true);
    setSuccess(false);

    try {
      // Make template briefly visible or styled for rendering
      reportElement.style.display = "block";

      const canvas = await html2canvas(reportElement, {
        scale: 2, // High resolution crisp PDF text
        useCORS: true,
        logging: false,
        backgroundColor: "#ffffff",
        onclone: (clonedDoc) => {
          // Remove all default stylesheets to bypass html2canvas trying to parse modern oklch() colors in Tailwind v4
          const stylesheets = clonedDoc.querySelectorAll("style, link[rel='stylesheet']");
          stylesheets.forEach((el) => el.remove());

          // Inject a web-safe styling block specifically for our executive report printing without oklch
          const style = clonedDoc.createElement("style");
          style.innerHTML = `
            #executive-pdf-template {
              display: block !important;
              padding: 40px !important;
              background-color: #ffffff !important;
              color: #1e293b !important;
              font-family: Arial, sans-serif !important;
              width: 800px !important;
            }
            .flex { display: flex !important; }
            .justify-between { justify-content: space-between !important; }
            .items-end { align-items: flex-end !important; }
            .items-center { align-items: center !important; }
            .grid { display: grid !important; }
            .grid-cols-3 { grid-template-columns: repeat(3, minmax(0, 1fr)) !important; }
            .grid-cols-4 { grid-template-columns: repeat(4, minmax(0, 1fr)) !important; }
            .gap-4 { gap: 16px !important; }
            .gap-6 { gap: 24px !important; }
            .space-y-1.5 > * + * { margin-top: 6px !important; }
            .space-y-3 > * + * { margin-top: 12px !important; }
            .space-y-6 > * + * { margin-top: 24px !important; }
            .pb-4 { padding-bottom: 16px !important; }
            .mb-8 { margin-bottom: 32px !important; }
            .mb-4 { margin-bottom: 16px !important; }
            .mb-2 { margin-bottom: 8px !important; }
            .p-4 { padding: 16px !important; }
            .p-3 { padding: 12px !important; }
            .p-2 { padding: 8px !important; }
            .rounded-lg { border-radius: 8px !important; }
            .rounded-xl { border-radius: 12px !important; }
            .rounded-full { border-radius: 9999px !important; }
            .text-2xl { font-size: 24px !important; }
            .text-lg { font-size: 18px !important; }
            .text-sm { font-size: 14px !important; }
            .text-xs { font-size: 12px !important; }
            .text-\\[10px\\] { font-size: 10px !important; }
            .text-\\[9px\\] { font-size: 9px !important; }
            .text-\\[11px\\] { font-size: 11px !important; }
            .font-black { font-weight: 900 !important; }
            .font-bold { font-weight: 700 !important; }
            .font-semibold { font-weight: 600 !important; }
            .font-medium { font-weight: 500 !important; }
            .uppercase { text-transform: uppercase !important; }
            .tracking-tight { letter-spacing: -0.025em !important; }
            .tracking-widest { letter-spacing: 0.1em !important; }
            .font-mono { font-family: monospace !important; }
            .font-sans { font-family: Arial, sans-serif !important; }
            .w-full { width: 100% !important; }
            .text-right { text-align: right !important; }
            .text-center { text-align: center !important; }
            .border-collapse { border-collapse: collapse !important; }
            .block { display: block !important; }
            .mr-2 { margin-right: 8px !important; }
            .mt-1 { margin-top: 4px !important; }
            .pt-4 { padding-top: 16px !important; }
            .pt-6 { padding-top: 24px !important; }
            .italic { font-style: italic !important; }
            .leading-relaxed { line-height: 1.625 !important; }
            .h-4 { height: 16px !important; }
            .gap-1.5 { gap: 6px !important; }
            .w-1\\.5 { width: 6px !important; }
            .h-3 { height: 12px !important; }
            thead { display: table-header-group !important; }
            tbody { display: table-row-group !important; }
            tr { display: table-row !important; }
            th, td { display: table-cell !important; }
          `;
          clonedDoc.head.appendChild(style);
        }
      });

      // Restore template layout state
      reportElement.style.display = "none";

      const imgData = canvas.toDataURL("image/jpeg", 0.95);
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = imgWidth / pdfWidth;
      const calculatedHeight = imgHeight / ratio;

      // Handle pages if content is larger than 1 page
      let heightLeft = calculatedHeight;
      let position = 0;

      pdf.addImage(imgData, "JPEG", 0, position, pdfWidth, calculatedHeight);
      heightLeft -= pdfHeight;

      while (heightLeft >= 0) {
        position = heightLeft - calculatedHeight;
        pdf.addPage();
        pdf.addImage(imgData, "JPEG", 0, position, pdfWidth, calculatedHeight);
        heightLeft -= pdfHeight;
      }

      const fileName = `${activeStock.symbol}_SIP_Investment_Research_Report.pdf`;
      pdf.save(fileName);

      setSuccess(true);
      setTimeout(() => setSuccess(false), 4000);
    } catch (err) {
      console.error("PDF generation failure: ", err);
      alert("Error building the PDF report. Please try again.");
    } finally {
      setDownloading(false);
    }
  };

  const formattedDate = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric"
  });

  return (
    <div>
      {/* Export Button Controller */}
      <div className="bg-gradient-to-r from-emerald-700 to-slate-800 rounded-2xl p-6 shadow-xs border border-emerald-600/30 text-white flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-1.5 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-1.5 text-xs font-bold text-emerald-400 tracking-wider uppercase">
            <Award className="w-4 h-4" />
            Empower Your Capital Decisions
          </div>
          <h3 className="text-lg font-bold">Generate Comprehensive PDF Investment Report</h3>
          <p className="text-xs text-slate-300 max-w-xl">
            Assembles all stock ratios, competitor indexes, future predictions, dynamic mutual fund SIP COMPOUND projections, and research notes into a beautifully designed institutional PDF booklet.
          </p>
        </div>

        <button
          onClick={generatePdf}
          disabled={downloading}
          id="btn-trigger-pdf-download"
          className="bg-emerald-500 hover:bg-emerald-400 active:bg-emerald-600 text-white font-bold text-sm px-6 py-3 rounded-xl shadow-xs flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap shrink-0 disabled:opacity-50"
        >
          {downloading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Compiling Executive Pages...
            </>
          ) : success ? (
            <>
              <CheckCircle2 className="w-4 h-4 text-white" />
              Report Downloaded Successfully!
            </>
          ) : (
            <>
              <Download className="w-4 h-4" />
              Download Detailed Report (PDF)
            </>
          )}
        </button>
      </div>

      {/* Hidden high-fidelity template styled strictly for html2canvas printing */}
      <div 
        id="executive-pdf-template" 
        style={{ display: "none", width: "800px", fontFamily: "sans-serif", backgroundColor: "#ffffff", color: "#1e293b" }} 
        className="p-10"
      >
        
        {/* Page Header */}
        <div style={{ borderBottom: "4px solid #0f172a" }} className="pb-4 mb-8 flex justify-between items-end">
          <div>
            <h1 style={{ color: "#0f172a" }} className="text-2xl font-black tracking-tight uppercase">EquiGrowth Research Corporation</h1>
            <p style={{ color: "#64748b" }} className="text-xs tracking-widest font-mono">INSTITUTUIONAL VALUE PLANNERS & EQUITY RESEARCH</p>
          </div>
          <div className="text-right">
            <span style={{ color: "#94a3b8" }} className="text-[10px] block font-mono">COMPILED FOR SHANTANUSINGHHP@GMAIL.COM</span>
            <span style={{ color: "#334155" }} className="text-xs font-mono font-bold">{formattedDate}</span>
          </div>
        </div>

        {/* SECTION 1: Stock Summary */}
        <div className="space-y-6">
          <div style={{ backgroundColor: "#0f172a", color: "#ffffff" }} className="p-4 rounded-lg flex justify-between items-center">
            <div>
              <span style={{ backgroundColor: "#059669", color: "#ffffff" }} className="text-xs font-bold px-2.5 py-0.5 rounded-full mr-2">STOCK REPORT</span>
              <strong className="text-lg font-black">{activeStock.companyName} (${activeStock.symbol})</strong>
            </div>
            <div className="text-right">
              <span style={{ color: "#94a3b8" }} className="text-xs block font-mono">LAST QUOTED PRICE</span>
              <strong style={{ color: "#34d399" }} className="text-lg font-mono font-black">
                {activeStock.currency === "INR" ? "₹" : "$"}{activeStock.currentPrice}
              </strong>
            </div>
          </div>

          <div style={{ backgroundColor: "#f8fafc", border: "1px solid #cbd5e1", color: "#475569" }} className="p-4 rounded-lg text-xs leading-relaxed">
            <strong>Company Profile:</strong> {activeStock.about}
          </div>

          {/* Quick core stock indicators Grid */}
          <div className="grid grid-cols-4 gap-4">
            <div style={{ border: "1px solid #e2e8f0" }} className="p-3 rounded-lg text-center">
              <span style={{ color: "#94a3b8" }} className="text-[10px] uppercase block font-semibold">Current EPS</span>
              <strong style={{ color: "#94a3b8" }} className="text-xs font-normal mt-1 block">
                Not tracked in free tier
              </strong>
            </div>
            <div style={{ border: "1px solid #e2e8f0" }} className="p-3 rounded-lg text-center">
              <span style={{ color: "#94a3b8" }} className="text-[10px] uppercase block font-semibold">P/E Valuation</span>
              <strong style={{ color: "#94a3b8" }} className="text-xs font-normal mt-1 block">Not tracked in free tier</strong>
            </div>
            <div style={{ border: "1px solid #e2e8f0" }} className="p-3 rounded-lg text-center">
              <span style={{ color: "#94a3b8" }} className="text-[10px] uppercase block font-semibold">P/B Ratio</span>
              <strong style={{ color: "#94a3b8" }} className="text-xs font-normal mt-1 block">Not tracked in free tier</strong>
            </div>
            <div style={{ border: "1px solid #e2e8f0" }} className="p-3 rounded-lg text-center">
              <span style={{ color: "#94a3b8" }} className="text-[10px] uppercase block font-semibold">Dividend Yield</span>
              <strong style={{ color: "#94a3b8" }} className="text-xs font-normal mt-1 block">Not tracked in free tier</strong>
            </div>
          </div>

          {/* Financial details summary */}
          <div className="space-y-3">
            <h3 style={{ borderBottom: "1px solid #e2e8f0", color: "#0f172a" }} className="text-sm font-bold uppercase pb-1.5 flex items-center gap-1.5">
              <span style={{ backgroundColor: "#059669" }} className="w-1.5 h-3 rounded-full"></span>
              Recent Growth Statements (INR Cr)
            </h3>
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr style={{ backgroundColor: "#f1f5f9", color: "#475569" }} className="text-slate-500">
                  <th style={{ border: "1px solid #cbd5e1" }} className="p-2">Fiscal Year</th>
                  <th style={{ border: "1px solid #cbd5e1" }} className="p-2">Total Revenue</th>
                  <th style={{ border: "1px solid #cbd5e1" }} className="p-2">Net profit</th>
                  <th style={{ border: "1px solid #cbd5e1" }} className="p-2">Operating margins</th>
                </tr>
              </thead>
              <tbody style={{ color: "#475569" }} className="font-mono">
                {activeStock.financials.map((yearObj, i) => (
                  <tr key={i}>
                    <td style={{ border: "1px solid #cbd5e1", color: "#0f172a" }} className="p-2 font-sans font-bold">{yearObj.year}</td>
                    <td style={{ border: "1px solid #cbd5e1" }} className="p-2">
                      {activeStock.currency === "INR" ? "₹" : "$"}{yearObj.revenue.toLocaleString()} Cr
                    </td>
                    <td style={{ border: "1px solid #cbd5e1", color: "#059669" }} className="p-2 font-bold">
                      {activeStock.currency === "INR" ? "₹" : "$"}{yearObj.netProfit.toLocaleString()} Cr
                    </td>
                    <td style={{ border: "1px solid #cbd5e1" }} className="p-2">{yearObj.operatingMargin}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Ratios block strictly printed */}
          <div className="space-y-3">
            <h3 style={{ borderBottom: "1px solid #e2e8f0", color: "#0f172a" }} className="text-sm font-bold uppercase pb-1.5 flex items-center gap-1.5">
              <span style={{ backgroundColor: "#059669" }} className="w-1.5 h-3 rounded-full"></span>
              Comprehensive Ratio Solvency analysis
            </h3>
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr style={{ backgroundColor: "#f1f5f9", color: "#475569" }} className="text-[10px]">
                  <th style={{ border: "1px solid #cbd5e1" }} className="p-2 uppercase">Ratio Name</th>
                  <th style={{ border: "1px solid #cbd5e1" }} className="p-2 uppercase text-center">Reported value</th>
                  <th style={{ border: "1px solid #cbd5e1" }} className="p-2 uppercase text-center">Standard baseline</th>
                  <th style={{ border: "1px solid #cbd5e1" }} className="p-2 uppercase">Health evaluation</th>
                  <th style={{ border: "1px solid #cbd5e1" }} className="p-2">Functional coverage</th>
                </tr>
              </thead>
              <tbody style={{ color: "#475569" }}>
                {/* Liquidity current ratio */}
                {activeStock.ratios.liquidity.map((ratio, i) => (
                  <tr key={i}>
                    <td style={{ border: "1px solid #cbd5e1", color: "#334155" }} className="p-2 font-bold">{ratio.name} (Liquidity)</td>
                    <td style={{ border: "1px solid #cbd5e1", color: "#0f172a" }} className="p-2 text-center font-mono font-bold">{ratio.value}</td>
                    <td style={{ border: "1px solid #cbd5e1" }} className="p-2 text-center font-mono">{ratio.benchmark}</td>
                    <td style={{ border: "1px solid #cbd5e1", color: "#065f46", backgroundColor: "#f0fdf4" }} className="p-2 font-bold text-center">{ratio.health}</td>
                    <td style={{ border: "1px solid #cbd5e1", color: "#64748b" }} className="p-2 text-xs">{ratio.description}</td>
                  </tr>
                ))}
                {/* Solvency ratios */}
                {activeStock.ratios.solvency.map((ratio, i) => (
                  <tr key={i}>
                    <td style={{ border: "1px solid #cbd5e1", color: "#334155" }} className="p-2 font-bold">{ratio.name} (Solvency)</td>
                    <td style={{ border: "1px solid #cbd5e1", color: "#0f172a" }} className="p-2 text-center font-mono font-bold">{ratio.value}</td>
                    <td style={{ border: "1px solid #cbd5e1" }} className="p-2 text-center font-mono">{ratio.benchmark}</td>
                    <td style={{ border: "1px solid #cbd5e1", color: "#065f46", backgroundColor: "#f0fdf4" }} className="p-2 font-bold text-center">{ratio.health}</td>
                    <td style={{ border: "1px solid #cbd5e1", color: "#64748b" }} className="p-2 text-xs">{ratio.description}</td>
                  </tr>
                ))}
                {/* Efficiency ROEs */}
                {activeStock.ratios.efficiency.map((ratio, i) => (
                  <tr key={i}>
                    <td style={{ border: "1px solid #cbd5e1", color: "#334155" }} className="p-2 font-bold">{ratio.name} (Efficiency)</td>
                    <td style={{ border: "1px solid #cbd5e1", color: "#0f172a" }} className="p-2 text-center font-mono font-bold">{ratio.value}%</td>
                    <td style={{ border: "1px solid #cbd5e1" }} className="p-2 text-center font-mono">{ratio.benchmark}</td>
                    <td style={{ border: "1px solid #cbd5e1", color: "#065f46", backgroundColor: "#f0fdf4" }} className="p-2 font-bold text-center">{ratio.health}</td>
                    <td style={{ border: "1px solid #cbd5e1", color: "#64748b" }} className="p-2 text-xs">{ratio.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Symmetrical competitors benchmark */}
          <div className="space-y-3">
            <h3 style={{ borderBottom: "1px solid #e2e8f0", color: "#0f172a" }} className="text-sm font-bold uppercase pb-1.5 flex items-center gap-1.5">
              <span style={{ backgroundColor: "#059669" }} className="w-1.5 h-3 rounded-full"></span>
              Prominent Sector Peer Competitors Comparison
            </h3>
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr style={{ backgroundColor: "#f1f5f9", color: "#475569" }} className="text-slate-500">
                  <th style={{ border: "1px solid #cbd5e1" }} className="p-2">Company Name</th>
                  <th style={{ border: "1px solid #cbd5e1" }} className="p-2 font-mono">P/E</th>
                  <th style={{ border: "1px solid #cbd5e1" }} className="p-2 font-mono">P/B</th>
                  <th style={{ border: "1px solid #cbd5e1" }} className="p-2 font-mono">EPS</th>
                  <th style={{ border: "1px solid #cbd5e1" }} className="p-2">Premium market Cap</th>
                  <th style={{ border: "1px solid #cbd5e1" }} className="p-2">Div Yield</th>
                  <th style={{ border: "1px solid #cbd5e1" }} className="p-2 text-right">Value Score (100)</th>
                </tr>
              </thead>
              <tbody style={{ color: "#475569" }} className="font-mono">
                {activeStock.competitors.map((comp, idx) => (
                  <tr key={idx}>
                    <td style={{ border: "1px solid #cbd5e1", color: "#334155" }} className="p-2 font-sans font-medium">{comp.name}</td>
                    <td style={{ border: "1px solid #cbd5e1" }} className="p-2">{comp.peRatio}x</td>
                    <td style={{ border: "1px solid #cbd5e1" }} className="p-2">{comp.pbRatio}x</td>
                    <td style={{ border: "1px solid #cbd5e1" }} className="p-2">{comp.eps}</td>
                    <td style={{ border: "1px solid #cbd5e1" }} className="p-2 font-sans">{comp.marketCap}</td>
                    <td style={{ border: "1px solid #cbd5e1" }} className="p-2">{comp.devYield}%</td>
                    <td style={{ border: "1px solid #cbd5e1", color: "#0f172a" }} className="p-2 text-right font-sans font-bold">{comp.score}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* 3-Year growth projections */}
          <div className="space-y-3">
            <h3 style={{ borderBottom: "1px solid #e2e8f0", color: "#0f172a" }} className="text-sm font-bold uppercase pb-1.5 flex items-center gap-1.5">
              <span style={{ backgroundColor: "#059669" }} className="w-1.5 h-3 rounded-full"></span>
              Future Stock Targets & Growth Projections (Normal Market Circumstances)
            </h3>
            <p style={{ color: "#64748b" }} className="text-[10px] leading-relaxed mb-2 italic">
              * Guidance: {activeStock.futureGrowth.predictionSummary}
            </p>
            <div className="grid grid-cols-3 gap-6">
              {activeStock.futureGrowth.years.map((gPoint, index) => (
                <div key={index} style={{ border: "1px solid #cbd5e1", backgroundColor: "#f8fafc" }} className="p-3 rounded-lg text-center space-y-1">
                  <span style={{ color: "#94a3b8" }} className="text-[10px] block font-semibold">YEAR {gPoint.year} PREDICTED PRICE</span>
                  <strong style={{ color: "#059669" }} className="text-base font-mono block">
                    {activeStock.currency === "INR" ? "₹" : "$"}{gPoint.predictedSharePrice.toFixed(0)}
                  </strong>
                  <span style={{ color: "#64748b" }} className="text-[9px] font-sans block">+{gPoint.predictedRevenueDelta}% YoY Revenue Growth</span>
                </div>
              ))}
            </div>
          </div>

          <div className="h-4"></div>

          {/* SECTION 2: Mutual Fund SIP Projections */}
          {selectedFund && (
            <div style={{ borderTop: "2px solid #cbd5e1" }} className="space-y-6 pt-6 mb-4">
              <div style={{ backgroundColor: "#065f46", color: "#ffffff" }} className="p-4 rounded-lg flex justify-between items-center">
                <div>
                  <span style={{ backgroundColor: "#020617", color: "#34d399" }} className="text-xs font-bold px-2.5 py-0.5 rounded-full mr-2">MUTUAL FUND SIP PLAN</span>
                  <strong className="text-base font-black">{selectedFund.fundName}</strong>
                </div>
                <div className="text-right">
                  <span style={{ color: "#d1fae5" }} className="text-xs block font-mono">TARGET COMPILING HORIZON</span>
                  <strong className="text-base font-sans font-black">{sipYears} Years</strong>
                </div>
              </div>

              {/* Sip details breakdown */}
              <div className="grid grid-cols-4 gap-4 text-xs font-mono">
                <div style={{ border: "1px solid #cbd5e1" }} className="p-3 rounded-lg text-center font-sans">
                  <span style={{ color: "#94a3b8" }} className="text-[9px] uppercase block font-semibold">Monthly SIP Amount</span>
                  <strong style={{ color: "#334155" }} className="text-sm font-bold mt-1 block">₹{sipAmount.toLocaleString()}</strong>
                </div>
                <div style={{ border: "1px solid #cbd5e1" }} className="p-3 rounded-lg text-center font-sans">
                  <span style={{ color: "#94a3b8" }} className="text-[9px] uppercase block font-semibold">Compounding rate</span>
                  <strong style={{ color: "#334155" }} className="text-sm font-bold mt-1 block">{sipReturnRate}% p.a.</strong>
                </div>
                <div style={{ border: "1px solid #cbd5e1" }} className="p-3 rounded-lg text-center font-sans">
                  <span style={{ color: "#94a3b8" }} className="text-[9px] uppercase block font-semibold">Risk Category</span>
                  <strong style={{ color: "#334155" }} className="text-sm font-bold mt-1 block">{selectedFund.risk}</strong>
                </div>
                <div style={{ border: "1px solid #cbd5e1" }} className="p-3 rounded-lg text-center font-sans">
                  <span style={{ color: "#94a3b8" }} className="text-[9px] uppercase block font-semibold">Expense Ratio</span>
                  <strong style={{ color: "#334155" }} className="text-sm font-bold mt-1 block">{selectedFund.expenseRatio}%</strong>
                </div>
              </div>

              {/* Sip Output returns summary */}
              <div style={{ backgroundColor: "#f8fafc", border: "1px solid #cbd5e1" }} className="grid grid-cols-3 gap-4 font-sans p-4 rounded-xl">
                <div className="space-y-1">
                  <span style={{ color: "#94a3b8" }} className="text-[10px] block font-semibold">Total Invested Principal</span>
                  <strong style={{ color: "#334155" }} className="text-lg font-bold">₹{sipExpectations.totalInvested.toLocaleString()}</strong>
                </div>
                <div className="space-y-1">
                  <span style={{ color: "#059669" }} className="text-[10px] block font-semibold">Estimated Profits / Gains</span>
                  <strong style={{ color: "#059669" }} className="text-lg font-bold">₹{sipExpectations.totalEstimatedGains.toLocaleString()}</strong>
                </div>
                <div className="space-y-1">
                  <span style={{ color: "#64748b" }} className="text-[10px] block font-semibold">Future Maturity Value</span>
                  <strong style={{ color: "#0f172a" }} className="text-lg font-bold">₹{sipExpectations.maturityValue.toLocaleString()}</strong>
                </div>
              </div>

              <p style={{ color: "#64748b" }} className="text-xs italic leading-relaxed">
                * Strategic Advisory: {selectedFund.reason} Similar funds that matches category indexing profiles include {selectedFund.similarFunds.join(", ")}.
              </p>
            </div>
          )}

          <div className="h-4"></div>

          {/* SECTION 3: Institutional Notes & Sign-off */}
          <div style={{ borderTop: "2px solid #cbd5e1" }} className="pt-6 space-y-3">
            <h3 style={{ color: "#0f172a" }} className="text-sm font-bold uppercase flex items-center gap-1.5">
              <span style={{ backgroundColor: "#1e293b" }} className="w-1.5 h-3 rounded-full"></span>
              Research Notes & Analyst Sign-off
            </h3>
            <p style={{ color: "#475569" }} className="text-[11px] leading-relaxed font-sans">
              This intelligence dossier is generated dynamically in partnership with Google Gemini advanced reasoning systems. Estimates assume steady macroeconomic environments containing standardized discount parameters. No explicit security returns guarantees are implied.
            </p>
            <div style={{ color: "#94a3b8" }} className="flex justify-between items-center text-[10px] font-mono uppercase pt-4">
              <span>EquiGrowth Securities Research Division</span>
              <span>Authorization Stamp: PASSED VERIFIED</span>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
