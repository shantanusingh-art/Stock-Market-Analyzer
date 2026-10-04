import { useState, useMemo, useEffect } from "react";
import { StockAnalysis, MutualFund } from "./types";
import { PRECOMPILED_STOCKS, PRECOMPILED_MUTUAL_FUNDS } from "./data";
import StockPerformanceTab from "./components/StockPerformanceTab";
import SipPlannerTab from "./components/SipPlannerTab";
import EducationAcademyTab from "./components/EducationAcademyTab";
import SectorHeatmapTab from "./components/SectorHeatmapTab";
import PdfExporter from "./components/PdfExporter";
import { 
  TrendingUp, TrendingDown, BarChart4, Landmark, Calculator, FileText, 
  ChevronRight, Calendar, ArrowUpRight, ArrowDownRight, HelpCircle, AlertCircle, BookOpen, Grid,
  ChevronDown, ShieldAlert, Globe, Activity, CheckCircle
} from "lucide-react";

interface IndexItem {
  symbol: string;
  name: string;
  price: number;
  changePercent: number;
}

export default function App() {
  const [activeTab, setActiveTab] = useState<"stocks" | "mutual_funds" | "academy" | "sectors">("stocks");
  const [indices, setIndices] = useState<IndexItem[]>([]);
  const [indicesError, setIndicesError] = useState<boolean>(false);
  
  // Stock selection state
  const [activeStock, setActiveStock] = useState<StockAnalysis>(PRECOMPILED_STOCKS["TCS"]);

  // Mutual Fund selection state
  const [selectedFund, setSelectedFund] = useState<MutualFund | null>(PRECOMPILED_MUTUAL_FUNDS[0]);
  const [monthlySip, setMonthlySip] = useState<number>(5000);
  const [sipReturnRate, setSipReturnRate] = useState<number>(PRECOMPILED_MUTUAL_FUNDS[0].historicalReturn5Y);
  const [sipYears, setSipYears] = useState<number>(10);

  // Diagnostics panel states
  const [diagnosticsOpen, setDiagnosticsOpen] = useState(false);
  const [diagnosticsData, setDiagnosticsData] = useState<any>(null);
  const [diagnosticsLoading, setDiagnosticsLoading] = useState(false);
  const [diagnosticsErrorMsg, setDiagnosticsErrorMsg] = useState<string | null>(null);
  const [devDiagnostics, setDevDiagnostics] = useState<any>(null);
  const [verifyingAmfi, setVerifyingAmfi] = useState(false);
  const [schemeFilter, setSchemeFilter] = useState<"all" | "verified" | "broken">("all");

  const fetchDiagnostics = async () => {
    try {
      setDiagnosticsLoading(true);
      const res = await fetch("/api/diagnostics");
      if (!res.ok) throw new Error("Diagnostics API offline");
      const data = await res.json();
      setDiagnosticsData(data);
      setDiagnosticsErrorMsg(null);
    } catch (err: any) {
      setDiagnosticsErrorMsg(err.message || "Failed to load diagnostics");
    } finally {
      setDiagnosticsLoading(false);
    }
  };

  const fetchDevDiagnostics = async () => {
    try {
      const res = await fetch("/api/developer-diagnostics");
      if (res.ok) {
        const data = await res.json();
        setDevDiagnostics(data);
      }
    } catch (err) {
      console.warn("Could not fetch development diagnostics", err);
    }
  };

  const runAmfiSchemeVerification = async () => {
    try {
      setVerifyingAmfi(true);
      const res = await fetch("/api/verify-amfi-schemes");
      if (res.ok) {
        await fetchDevDiagnostics();
        await fetchDiagnostics();
      }
    } catch (err) {
      console.error("AMFI verification error:", err);
    } finally {
      setVerifyingAmfi(false);
    }
  };

  useEffect(() => {
    fetchDiagnostics();
    fetchDevDiagnostics();
    const interval = setInterval(() => {
      fetchDiagnostics();
      fetchDevDiagnostics();
    }, 4000); // Poll metrics every 4s to track developer queries snappy
    return () => clearInterval(interval);
  }, []);

  // Fetch live market indices
  useEffect(() => {
    let active = true;
    const fetchIndices = async () => {
      try {
        const res = await fetch("/api/market-indices");
        const contentType = res.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          throw new Error("Invalid format");
        }
        const data = await res.json();
        if (!res.ok) throw new Error("Unavailable");
        if (active) {
          setIndices(data);
          setIndicesError(false);
        }
      } catch (err) {
        if (active) {
          setIndicesError(true);
        }
      }
    };

    fetchIndices();
    const interval = setInterval(fetchIndices, 30000); // refresh every 30 seconds
    return () => {
      active = false;
      clearInterval(interval);
    };
  }, []);

  // Synchronously compute active SIP results for the PDF exporter React bindings
  const sipExpectations = useMemo(() => {
    let totalInvested = 0;
    let maturityValue = 0;
    let currentSip = monthlySip;
    const rate = sipReturnRate / 100;
    const monthlyRate = rate / 12;

    for (let year = 1; year <= sipYears; year++) {
      for (let month = 1; month <= 12; month++) {
        totalInvested += currentSip;
        // monthly compounding standard steps
        maturityValue = (maturityValue + currentSip) * (1 + monthlyRate);
      }
      // Assuming a default 10% annual step up aligned with SipPlannerTab state
      currentSip = currentSip * 1.1;
    }

    return {
      totalInvested: Math.round(totalInvested),
      totalEstimatedGains: Math.round(Math.max(0, maturityValue - totalInvested)),
      maturityValue: Math.round(maturityValue)
    };
  }, [monthlySip, sipReturnRate, sipYears]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 antialiased selection:bg-emerald-600 selection:text-white">
      
      {/* Top Real-time Market Indices Banner */}
      <div className="bg-slate-900 border-b border-slate-800 text-white py-2 px-4 text-xs font-mono select-none overflow-x-auto whitespace-nowrap">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-8">
          <div className="flex items-center gap-6">
            <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-500 animate-pulse flex items-center gap-1.5">
              <span>● LIVE INDEX FEED</span>
              {(indices as any)[0]?.fetchedAt && (
                <span className="text-[9px] text-slate-400 font-normal lowercase tracking-normal">
                  (updated: {new Date((indices as any)[0].fetchedAt).toLocaleTimeString()})
                </span>
              )}
            </span>
            
            {indicesError ? (
              <span className="text-rose-400 font-sans font-medium text-xs">Live market data unavailable.</span>
            ) : indices.length === 0 ? (
              <span className="text-slate-400 font-sans font-medium text-xs animate-pulse">Connecting to live AMFI indexes...</span>
            ) : (
              indices.map((index: any, i) => {
                const isPositive = index.changePercent >= 0;
                return (
                  <div key={index.symbol || `index-${i}`} className={`flex items-center gap-2 ${i > 0 ? "border-l border-slate-800 pl-6" : ""}`}>
                    <span className="text-slate-400 font-sans font-medium">{index.name}</span>
                    <span className="font-bold">
                      {typeof index.price === "number" ? index.price.toLocaleString(undefined, { minimumFractionDigits: 2 }) : index.price}
                    </span>
                    {typeof index.price === "number" && (
                      <span className={`font-bold flex items-center gap-0.5 ${isPositive ? "text-emerald-400" : "text-rose-400"}`}>
                        {isPositive ? <ArrowUpRight className="w-3 h-3 block" /> : <ArrowDownRight className="w-3 h-3 block" />}
                        {isPositive ? "+" : ""}{index.changePercent.toFixed(2)}%
                      </span>
                    )}
                  </div>
                );
              })
            )}
          </div>
          <div className="flex items-center gap-4 select-none">
            <button
              id="diagnostics-panel-toggle-btn"
              onClick={() => {
                setDiagnosticsOpen(!diagnosticsOpen);
                fetchDiagnostics();
              }}
              className="flex items-center gap-2 hover:bg-slate-800 text-slate-300 hover:text-white px-2.5 py-1 rounded-md border border-slate-700/80 hover:border-slate-600 bg-slate-950 font-sans text-[11px] font-semibold transition-all cursor-pointer"
            >
              <span className={`w-1.5 h-1.5 rounded-full ${diagnosticsData?.overallStatus === "Operational" ? "bg-emerald-500 animate-pulse" : "bg-amber-400 animate-pulse"}`}></span>
              <span>API Diagnostics</span>
              <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${diagnosticsOpen ? "rotate-180" : ""}`} />
            </button>
            <div className="hidden sm:block text-slate-400 uppercase text-[10px]">
              EquiGrowth Intel Portal
            </div>
          </div>
        </div>
      </div>

      {/* Main Structural Navbar Header */}
      <header className="bg-white border-b border-slate-100 shadow-xs sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-white shadow-xs">
              <TrendingUp className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <h1 className="text-lg font-black text-slate-900 tracking-tight flex items-center gap-2">
                EquiGrowth Stock & SIP Analyzer
              </h1>
              <p className="text-slate-400 text-xs">
                Advanced financial ratios benchmarking & mutual fund compound planners
              </p>
            </div>
          </div>

          {/* Navigation View Switcher tabs */}
          <div className="flex bg-slate-100 p-1.5 rounded-xl border border-slate-200">
            <button
              id="tab-btn-stocks"
              onClick={() => setActiveTab("stocks")}
              className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                activeTab === "stocks"
                  ? "bg-white text-slate-900 shadow-xs"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              <BarChart4 className="w-4 h-4 text-emerald-600 shadow-xs" />
              Stock Market Analyzer
            </button>
            <button
              id="tab-btn-mutual-funds"
              onClick={() => setActiveTab("mutual_funds")}
              className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                activeTab === "mutual_funds"
                  ? "bg-white text-slate-900 shadow-xs"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              <Calculator className="w-4 h-4 text-emerald-600 shadow-xs" />
              Mutual Fund SIP Return Planner
            </button>
            <button
              id="tab-btn-academy"
              onClick={() => setActiveTab("academy")}
              className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                activeTab === "academy"
                  ? "bg-white text-slate-900 shadow-xs"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              <BookOpen className="w-4 h-4 text-emerald-600 shadow-xs" />
              Investor Learning Academy
            </button>
            <button
              id="tab-btn-sectors"
              onClick={() => setActiveTab("sectors")}
              className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                activeTab === "sectors"
                  ? "bg-white text-slate-900 shadow-xs"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              <Grid className="w-4 h-4 text-emerald-600 shadow-xs" />
              Sector Heatmap
            </button>
          </div>
        </div>
      </header>

      {/* Real-time Connectivity Diagnostics Panel */}
      {diagnosticsOpen && (
        <div id="diagnostics-panel-drawer" className="bg-slate-900 text-slate-100 border-b border-slate-850 shadow-inner">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-3">
              <div className="flex items-start gap-2.5">
                <Activity className="w-4 h-4 text-emerald-400 mt-1 animate-pulse shrink-0" />
                <div>
                  <h3 className="text-xs font-bold tracking-tight text-white flex items-center gap-2">
                    EquiGrowth Connection Registry & Diagnostics
                    <span className="text-[9px] px-2 py-0.5 bg-emerald-950 text-emerald-400 border border-emerald-900 rounded font-normal font-sans uppercase">
                      Integrity Audit Mode
                    </span>
                  </h3>
                  <p className="text-slate-400 text-[11px] mt-0.5">
                    Monitoring live connections and API sources for all indices, equities, and AMFI trust directories. No static caches allowed.
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setDiagnosticsOpen(false)}
                className="text-slate-400 hover:text-white text-[10px] uppercase font-bold px-3 py-1 bg-slate-950 hover:bg-slate-800 rounded border border-slate-800 transition-all cursor-pointer block self-start sm:self-auto"
              >
                ✕ Close
              </button>
            </div>

            {diagnosticsErrorMsg ? (
              <div className="p-3 bg-rose-950/40 border border-rose-900 rounded-lg text-left flex items-start gap-2 text-rose-300 text-xs">
                <ShieldAlert className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold">Diagnostics Sync Failed</p>
                  <p className="text-slate-400">{diagnosticsErrorMsg}. Verify API endpoints at /api/diagnostics.</p>
                </div>
              </div>
            ) : !diagnosticsData ? (
              <div className="py-4 text-center text-slate-400 text-xs animate-pulse font-mono">
                Querying active connection state registries...
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {Object.entries(diagnosticsData.apis || {}).map(([key, api]: any) => {
                  const isOnline = api.status === "online";
                  return (
                    <div key={key} className="bg-slate-950 rounded-xl p-4 border border-slate-800/80 flex flex-col justify-between space-y-4">
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-[11px] font-bold text-slate-200 truncate">{api.name}</span>
                          <span className={`text-[8px] px-2 py-0.5 font-bold uppercase rounded-full border ${isOnline ? "text-emerald-400 bg-emerald-950/20 border-emerald-900" : "text-rose-450 bg-rose-950/25 border-rose-900/60 animate-pulse"}`}>
                            ● {api.status.toUpperCase()}
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-500 leading-normal">{api.source}</p>
                      </div>

                      <div className="pt-2 border-t border-slate-900 space-y-1 font-mono text-[9px]">
                        <div className="flex justify-between items-center gap-2">
                          <span className="text-slate-500">Service Status:</span>
                          <span className={isOnline ? "text-emerald-400 font-bold" : "text-rose-400 font-bold"}>
                            {isOnline ? "Active Stream" : "Offline - Retrying"}
                          </span>
                        </div>
                        <div className="flex justify-between items-center gap-2">
                          <span className="text-slate-500">Telemetry Src:</span>
                          <span className="text-slate-300 font-semibold">{isOnline ? "Direct API Fetch" : "Live data unavailable"}</span>
                        </div>
                        <div className="flex justify-between items-center gap-2">
                          <span className="text-slate-500">Last Fetch Success:</span>
                          <span className="text-slate-300 text-right truncate max-w-[120px]">
                            {api.lastSuccess ? new Date(api.lastSuccess).toLocaleTimeString() : "No successful pulls yet"}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Developer Diagnostics Panel (Visible strictly in development) */}
            {(import.meta as any).env.DEV && (
              <div id="dev-diagnostics-section" className="border-t border-slate-800 pt-6 mt-6 space-y-4">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></div>
                    <h4 className="text-xs font-extrabold tracking-widest text-amber-400 font-mono uppercase">
                      🚀 Developer Diagnostics Panel (Localhost Console)
                    </h4>
                  </div>
                  <button
                    onClick={fetchDevDiagnostics}
                    className="flex items-center gap-1 text-[10px] uppercase font-mono font-bold px-2.5 py-1 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 rounded border border-amber-500/35 transition-all cursor-pointer"
                  >
                    🔄 Instant Refresh Probe
                  </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                  {/* Left Column: API Metadata */}
                  <div className="lg:col-span-1 bg-slate-950 border border-slate-850 rounded-xl p-4 space-y-3 font-mono text-xs">
                    <div className="border-b border-slate-900 pb-2">
                      <span className="text-slate-500 text-[10px] uppercase block">API Endpoint Called</span>
                      <div className="text-sky-400 break-all select-all font-semibold max-h-16 overflow-y-auto leading-relaxed mt-1">
                        {devDiagnostics?.endpoint || "No endpoint queried yet"}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <span className="text-slate-500 text-[10px] uppercase block">HTTP Status Code</span>
                        <div className="mt-1">
                          {devDiagnostics?.statusCode ? (
                            <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-bold ${devDiagnostics.statusCode === 200 ? "bg-emerald-950/40 text-emerald-400 border border-emerald-900/50" : "bg-rose-950/40 text-rose-400 border border-rose-900/50"}`}>
                              {devDiagnostics.statusCode} {devDiagnostics.statusCode === 200 ? "OK" : "Error"}
                            </span>
                          ) : (
                            <span className="text-slate-500 text-xs italic">N/A</span>
                          )}
                        </div>
                      </div>

                      <div>
                        <span className="text-slate-500 text-[10px] uppercase block">Response Time</span>
                        <div className="mt-1 font-bold text-slate-200">
                          {devDiagnostics?.responseTimeMs !== null ? `${devDiagnostics.responseTimeMs} ms` : "N/A"}
                        </div>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-900 grid grid-cols-1 gap-2">
                      <div>
                        <span className="text-slate-500 text-[10px] uppercase block">Last Successful Fetch</span>
                        <div className="mt-1 text-slate-300 font-semibold text-[11px]">
                          {devDiagnostics?.lastSuccessTimestamp ? (
                            new Date(devDiagnostics.lastSuccessTimestamp).toLocaleString()
                          ) : (
                            <span className="text-slate-500 italic">None cached</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Middle Column: Parse Errors State */}
                  <div className="lg:col-span-1 bg-slate-950 border border-slate-850 rounded-xl p-4 flex flex-col justify-between space-y-3 font-mono text-xs">
                    <div>
                      <span className="text-slate-500 text-[10px] uppercase block">System Parse Errors</span>
                      <div className="mt-2">
                        {devDiagnostics?.parseError ? (
                          <div className="p-3 bg-rose-950/30 border border-rose-900/60 rounded-lg text-rose-400 flex items-start gap-2 max-h-32 overflow-y-auto leading-relaxed">
                            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-500" />
                            <div>
                              <p className="font-bold">Parsing/Connection Error</p>
                              <p className="text-[11px] mt-0.5 text-slate-300">{devDiagnostics.parseError}</p>
                            </div>
                          </div>
                        ) : devDiagnostics?.endpoint && devDiagnostics?.endpoint !== "None called yet" ? (
                          <div className="p-3 bg-emerald-950/20 border border-emerald-950/40 rounded-lg text-emerald-400 flex items-start gap-2">
                            <CheckCircle className="w-4 h-4 shrink-0 mt-0.5 text-emerald-500" />
                            <div>
                              <p className="font-bold text-xs uppercase animate-pulse">No active parse errors</p>
                              <p className="text-[10px] text-slate-300 mt-1">
                                Metadata mapped cleanly. Schema indices verified fully operational.
                              </p>
                            </div>
                          </div>
                        ) : (
                          <span className="text-slate-500 text-xs italic">Awaiting research query...</span>
                        )}
                      </div>
                    </div>
                    <div className="text-[10px] text-slate-500 border-t border-slate-900 pt-2 leading-relaxed">
                      Probing live chart metadata structures for dynamic Indian tickers and cross-border tech benchmarks.
                    </div>
                  </div>

                  {/* Right Column: Raw Yahoo Response Preview */}
                  <div className="lg:col-span-1 bg-slate-950 border border-slate-850 rounded-xl p-4 flex flex-col space-y-2 font-mono text-xs">
                    <span className="text-slate-500 text-[10px] uppercase block">Raw Yahoo Response Preview</span>
                    <div className="flex-1 min-h-[140px] max-h-[180px] overflow-auto bg-black/45 p-2 rounded border border-slate-900 text-[10px] text-zinc-400 font-mono scrollbar-thin whitespace-pre-wrap select-all">
                      {devDiagnostics?.rawResponsePreview ? (
                        devDiagnostics.rawResponsePreview
                      ) : (
                        <span className="text-slate-600 block text-center py-8 italic">
                          No payload logged yet. Perform a stock analysis to inspect raw JSON stream.
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* AMFI Mutual Fund Scheme Mapping Diagnostics Sub-panel */}
                <div className="mt-6 border-t border-slate-800 pt-5 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <Landmark className="w-4 h-4 text-emerald-400" />
                      <h4 className="text-xs font-bold text-emerald-400 uppercase font-mono tracking-wider">
                        AMFI Mutual Fund Scheme Code Verification & Diagnostics (mfapi.in)
                      </h4>
                    </div>
                    <button
                      onClick={runAmfiSchemeVerification}
                      disabled={verifyingAmfi}
                      className="flex items-center gap-1.5 text-[10px] uppercase font-mono font-bold px-3 py-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 rounded-md border border-emerald-500/30 transition-all cursor-pointer disabled:opacity-50"
                    >
                      <Activity className={`w-3 h-3 ${verifyingAmfi ? "animate-spin" : ""}`} />
                      {verifyingAmfi ? "Auditing AMFI Schemes..." : "🔄 Verify Scheme Code Mappings"}
                    </button>
                  </div>

                  {/* Summary Bar */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs">
                    <div className="bg-slate-950 border border-slate-850 rounded-lg p-2.5">
                      <span className="text-slate-500 text-[10px] block uppercase">AMFI API Health</span>
                      <span className={`font-bold mt-1 inline-block ${devDiagnostics?.amfi?.apiHealthStatus === "online" ? "text-emerald-400" : "text-amber-400"}`}>
                        {devDiagnostics?.amfi?.apiHealthStatus === "online" ? "● ONLINE" : "● OFFLINE / DEGRADED"}
                      </span>
                    </div>

                    <div className="bg-slate-950 border border-slate-850 rounded-lg p-2.5">
                      <span className="text-slate-500 text-[10px] block uppercase">Last Success NAV Fetch</span>
                      <span className="text-slate-300 font-semibold text-[11px] block mt-1 truncate">
                        {devDiagnostics?.amfi?.lastSuccessfulNavFetch 
                          ? new Date(devDiagnostics.amfi.lastSuccessfulNavFetch).toLocaleTimeString() 
                          : "None recorded"}
                      </span>
                    </div>

                    <div className="bg-slate-950 border border-slate-850 rounded-lg p-2.5">
                      <span className="text-slate-500 text-[10px] block uppercase">Current NAV Date</span>
                      <span className="text-sky-400 font-bold block mt-1">
                        {devDiagnostics?.amfi?.currentNavDateTimestamp || "N/A"}
                      </span>
                    </div>

                    <div className="bg-slate-950 border border-slate-850 rounded-lg p-2.5">
                      <span className="text-slate-500 text-[10px] block uppercase">Audited / Broken Entries</span>
                      <span className="text-slate-200 font-bold block mt-1">
                        <span className="text-emerald-400">{devDiagnostics?.amfi?.verifiedSchemesCount || 0} Verified</span>
                        {" / "}
                        <span className={devDiagnostics?.amfi?.staleOrBrokenSchemesCount > 0 ? "text-rose-400 font-extrabold" : "text-slate-500"}>
                          {devDiagnostics?.amfi?.staleOrBrokenSchemesCount || 0} Broken
                        </span>
                      </span>
                    </div>
                  </div>

                  {/* Stale / Broken Schemes Warning Highlight */}
                  {devDiagnostics?.amfi?.staleOrBrokenSchemesCount > 0 ? (
                    <div className="p-3 bg-rose-950/40 border border-rose-900/80 rounded-xl text-rose-300 font-mono text-xs space-y-2">
                      <div className="flex items-center gap-2 text-rose-400 font-bold uppercase text-[11px]">
                        <ShieldAlert className="w-4 h-4 text-rose-500 shrink-0" />
                        Stale or Broken Scheme Mappings Highlighted ({devDiagnostics.amfi.staleOrBrokenSchemesCount})
                      </div>
                      <div className="space-y-1.5 pt-1">
                        {devDiagnostics.amfi.staleOrBrokenSchemes.map((stale: any, i: number) => (
                          <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between bg-black/40 p-2 rounded border border-rose-900/50 text-[11px]">
                            <div>
                              <strong className="text-rose-400 font-bold">Scheme #{stale.schemeCode}</strong> - {stale.schemeName || "Unknown Name"}
                            </div>
                            <div className="text-rose-300 font-mono text-[10px] mt-1 sm:mt-0">
                              Error: {stale.parseError || "HTTP/Parse Failure"} (Status: {stale.statusCode || 0})
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="p-3 bg-emerald-950/20 border border-emerald-900/40 rounded-xl text-emerald-400 font-mono text-xs flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span>All AMFI scheme code mappings verified and active against live mfapi.in feed.</span>
                      </div>
                      <span className="text-[10px] bg-emerald-950/60 px-2.5 py-1 rounded text-emerald-300 border border-emerald-800/50">
                        0 Stale or Broken Entries
                      </span>
                    </div>
                  )}

                  {/* Scheme Code Audit Table */}
                  {devDiagnostics?.amfi?.allSchemesDiagnostics && (() => {
                    const allList = Object.values(devDiagnostics.amfi.allSchemesDiagnostics) as any[];
                    const filteredList = allList.filter((s: any) => {
                      if (schemeFilter === "verified") return s.isVerified;
                      if (schemeFilter === "broken") return s.isStaleOrBroken || !s.isVerified;
                      return true;
                    });

                    return (
                      <div className="bg-slate-950 border border-slate-850 rounded-xl p-3 font-mono text-[11px] space-y-3">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-900">
                          <span className="text-slate-400 font-bold uppercase text-[10px] tracking-wider">
                            Audited Scheme Code Mappings ({filteredList.length} of {allList.length} shown)
                          </span>
                          <div className="flex items-center gap-2">
                            <label htmlFor="scheme-filter-select" className="text-slate-500 text-[10px] uppercase font-bold">
                              Status Filter:
                            </label>
                            <select
                              id="scheme-filter-select"
                              value={schemeFilter}
                              onChange={(e) => setSchemeFilter(e.target.value as "all" | "verified" | "broken")}
                              className="bg-slate-900 text-slate-200 border border-slate-800 text-[11px] rounded px-2.5 py-1 font-mono focus:outline-none focus:border-emerald-500/50 cursor-pointer"
                            >
                              <option value="all">All Schemes ({allList.length})</option>
                              <option value="verified">
                                Only Verified ({allList.filter((s) => s.isVerified).length})
                              </option>
                              <option value="broken">
                                Only Broken/Stale ({allList.filter((s) => s.isStaleOrBroken || !s.isVerified).length})
                              </option>
                            </select>
                          </div>
                        </div>

                        <div className="overflow-x-auto scrollbar-thin">
                          <table className="w-full text-left border-collapse min-w-[680px]">
                            <thead>
                              <tr className="border-b border-slate-900 text-slate-500 text-[10px] uppercase">
                                <th className="py-1.5 px-2">Code</th>
                                <th className="py-1.5 px-2">Scheme Name</th>
                                <th className="py-1.5 px-2">HTTP Code</th>
                                <th className="py-1.5 px-2">Speed</th>
                                <th className="py-1.5 px-2">Latest NAV</th>
                                <th className="py-1.5 px-2">NAV Date</th>
                                <th className="py-1.5 px-2 text-center">30D Trajectory</th>
                                <th className="py-1.5 px-2 text-right">Mapping Status</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-900/70 text-slate-300">
                              {filteredList.length === 0 ? (
                                <tr>
                                  <td colSpan={8} className="py-4 text-center text-slate-500 text-[11px]">
                                    No scheme mappings match the current filter selection ({schemeFilter}).
                                  </td>
                                </tr>
                              ) : (
                                filteredList.map((s: any, idx: number) => {
                                  const points: number[] = s.sparklinePoints || [];
                                  const changePct: number | undefined = s.nav30DayChangePercent;
                                  const min = points.length > 0 ? Math.min(...points) : 0;
                                  const max = points.length > 0 ? Math.max(...points) : 0;
                                  const range = max - min || 1;
                                  const width = 52;
                                  const height = 16;
                                  const svgPoints = points.length >= 2
                                    ? points
                                        .map((val, pIdx) => {
                                          const x = ((pIdx / (points.length - 1)) * width).toFixed(1);
                                          const y = (height - 2 - ((val - min) / range) * (height - 4)).toFixed(1);
                                          return `${x},${y}`;
                                        })
                                        .join(" ")
                                    : "";
                                  const isPos = (changePct ?? 0) >= 0;

                                  return (
                                    <tr key={idx} className="hover:bg-slate-900/40">
                                      <td className="py-1.5 px-2 font-bold text-sky-400">{s.schemeCode}</td>
                                      <td className="py-1.5 px-2 text-slate-200 truncate max-w-[200px]">{s.schemeName || "AMFI Scheme"}</td>
                                      <td className="py-1.5 px-2">
                                        <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${s.statusCode === 200 ? "bg-emerald-950/60 text-emerald-400" : "bg-rose-950/60 text-rose-400"}`}>
                                          {s.statusCode || 0}
                                        </span>
                                      </td>
                                      <td className="py-1.5 px-2 text-slate-400">{s.responseTimeMs !== null ? `${s.responseTimeMs}ms` : "N/A"}</td>
                                      <td className="py-1.5 px-2 font-bold text-emerald-400">{s.currentNav ? `₹${s.currentNav}` : "N/A"}</td>
                                      <td className="py-1.5 px-2 text-slate-400">{s.navDate || "N/A"}</td>
                                      <td className="py-1.5 px-2 text-center">
                                        {points.length >= 2 ? (
                                          <div className="flex items-center justify-center gap-2">
                                            <svg width={width} height={height} className="overflow-visible shrink-0">
                                              <polyline
                                                fill="none"
                                                stroke={isPos ? "#34d399" : "#fb7185"}
                                                strokeWidth="1.5"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                points={svgPoints}
                                              />
                                            </svg>
                                            <span className={`flex items-center gap-0.5 text-[10px] font-bold ${isPos ? "text-emerald-400" : "text-rose-400"}`}>
                                              {isPos ? <TrendingUp className="w-3 h-3 shrink-0" /> : <TrendingDown className="w-3 h-3 shrink-0" />}
                                              {isPos ? `+${changePct}%` : `${changePct}%`}
                                            </span>
                                          </div>
                                        ) : (
                                          <span className="text-slate-600 text-[10px]">-</span>
                                        )}
                                      </td>
                                      <td className="py-1.5 px-2 text-right">
                                        {s.isVerified ? (
                                          <span className="text-emerald-400 text-[10px] font-bold uppercase">Verified</span>
                                        ) : (
                                          <span className="text-rose-400 text-[10px] font-bold uppercase">Broken/Stale</span>
                                        )}
                                      </td>
                                    </tr>
                                  );
                                })
                              )}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Primary Container Stage */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
        
        {/* Render Active View Tab */}
        <div className="transition-all duration-300">
          {activeTab === "stocks" ? (
            <StockPerformanceTab 
              activeStock={activeStock} 
              setActiveStock={setActiveStock} 
            />
          ) : activeTab === "mutual_funds" ? (
            <SipPlannerTab 
              selectedFund={selectedFund}
              setSelectedFund={setSelectedFund}
              monthlySip={monthlySip}
              setMonthlySip={setMonthlySip}
              sipReturnRate={sipReturnRate}
              setSipReturnRate={setSipReturnRate}
              sipYears={sipYears}
              setSipYears={setSipYears}
            />
          ) : activeTab === "sectors" ? (
            <SectorHeatmapTab 
              setActiveStock={setActiveStock}
              setActiveTab={setActiveTab}
            />
          ) : (
            <EducationAcademyTab />
          )}
        </div>

        {/* Global PDF Exporter Section - always accessible at bottom to pack both states! */}
        <div className="pt-6 border-t border-slate-200">
          <PdfExporter 
            activeStock={activeStock}
            selectedFund={selectedFund}
            sipAmount={monthlySip}
            sipReturnRate={sipReturnRate}
            sipYears={sipYears}
            sipExpectations={sipExpectations}
          />
        </div>

      </main>

      {/* Simple Footer */}
      <footer className="bg-slate-900 text-slate-400 text-xs py-8 px-4 mt-20 border-t border-slate-800 font-sans text-center">
        <div className="max-w-7xl mx-auto space-y-2">
          <strong className="text-white block font-semibold text-xs tracking-wider">EQUIGR0WTH CAPITALS LLC</strong>
          <p>
            Real-time calculations powered by Google Gemini 3.5 Web Grounding integrations and vector HTML canvas exporters.
          </p>
          <span className="block text-[10px] text-slate-500 font-mono">
            SECURE CLIENT PORTAL FOR SHANTANUSINGHHP@GMAIL.COM • ALL PRICE TARGETS SUBJECT TO REGULAR RISK DISCLAIMERS
          </span>
        </div>
      </footer>

    </div>
  );
}
