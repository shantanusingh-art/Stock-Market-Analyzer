import React, { useState, useMemo, useEffect } from "react";
import { MutualFund } from "../types";
import { PRECOMPILED_MUTUAL_FUNDS } from "../data";
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Legend, PieChart, Pie, Cell
} from "recharts";
import { 
  PiggyBank, Calculator, Lightbulb, Check, ChevronRight, HelpCircle, 
  RefreshCw, TrendingUp, Sparkles, PieChartIcon, Percent, CreditCard, ShieldCheck,
  AlertTriangle, Activity
} from "lucide-react";

interface SipPlannerTabProps {
  selectedFund: MutualFund | null;
  setSelectedFund: (fund: MutualFund) => void;
  monthlySip: number;
  setMonthlySip: (amount: number) => void;
  sipReturnRate: number;
  setSipReturnRate: (rate: number) => void;
  sipYears: number;
  setSipYears: (years: number) => void;
}

export default function SipPlannerTab({
  selectedFund,
  setSelectedFund,
  monthlySip,
  setMonthlySip,
  sipReturnRate,
  setSipReturnRate,
  sipYears,
  setSipYears
}: SipPlannerTabProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [stepUp, setStepUp] = useState<number>(10); // Optional elegant 10% annual step up default
  
  // MF Recommender state
  const [riskProfile, setRiskProfile] = useState<string>("Moderate");
  const [fundPeriod, setFundPeriod] = useState<number>(10);
  const [customFunds, setCustomFunds] = useState<MutualFund[]>([]);
  const [loadingMf, setLoadingMf] = useState<boolean>(false);
  const [mfError, setMfError] = useState<string | null>(null);
  const [bannerDismissed, setBannerDismissed] = useState<boolean>(false);
  const [retryAttempt, setRetryAttempt] = useState<number>(0);
  const [retryStatus, setRetryStatus] = useState<string | null>(null);
  const [amfiAuditData, setAmfiAuditData] = useState<any>(null);
  const [auditingSchemes, setAuditingSchemes] = useState<boolean>(false);

  // 5-minute cache for mutual fund recommendations
  const mfCacheRef = React.useRef<Map<string, { data: MutualFund[]; timestamp: number }>>(new Map());

  const runAmfiSchemeAudit = async () => {
    try {
      setAuditingSchemes(true);
      const res = await fetch("/api/verify-amfi-schemes");
      if (res.ok) {
        const data = await res.json();
        setAmfiAuditData(data);
      }
    } catch (err) {
      console.error("AMFI audit fetch error:", err);
    } finally {
      setAuditingSchemes(false);
    }
  };

  useEffect(() => {
    runAmfiSchemeAudit();
  }, []);

  // Filter regular precompiled funds
  const filteredFunds = useMemo(() => {
    const list = [...PRECOMPILED_MUTUAL_FUNDS, ...customFunds];
    // De-duplicate if custom list matches names
    const seen = new Set();
    const unique = list.filter(item => {
      const duplicate = seen.has(item.fundName);
      seen.add(item.fundName);
      return !duplicate;
    });

    if (selectedCategory === "All") return unique;
    return unique.filter(f => f.category.toLowerCase().includes(selectedCategory.toLowerCase()));
  }, [selectedCategory, customFunds]);

  // Set initial selected fund if null
  useMemo(() => {
    if (!selectedFund && filteredFunds.length > 0) {
      setSelectedFund(filteredFunds[0]);
      const initialRate = filteredFunds[0].historicalReturn5Y || filteredFunds[0].historicalReturn3Y;
      setSipReturnRate(typeof initialRate === "number" ? initialRate : 12);
    }
  }, [selectedFund, filteredFunds, setSelectedFund, setSipReturnRate]);

  // Handle fund card click
  const handleFundSelect = (fund: MutualFund) => {
    setSelectedFund(fund);
    // Auto populate return rate for user simulation convenience
    const initialRate = fund.historicalReturn5Y || fund.historicalReturn3Y;
    setSipReturnRate(typeof initialRate === "number" ? initialRate : 12);
    setBannerDismissed(false);
  };

  // Perform SIP Growth Calculation over years (handling direct compounding or optional annual step-up compounding!)
  const sipCalculationDetails = useMemo(() => {
    let totalInvested = 0;
    let maturityValue = 0;
    const chartData: any[] = [];
    
    let currentMonthlySip = monthlySip;
    const numericRate = typeof sipReturnRate === "number" ? sipReturnRate : parseFloat(sipReturnRate) || 12;
    const rateOfReturn = numericRate / 100;
    const monthlyRate = rateOfReturn / 12;

    for (let year = 1; year <= sipYears; year++) {
      // Calculate monthly intervals over this year
      for (let month = 1; month <= 12; month++) {
        totalInvested += currentMonthlySip;
        // SIP standard formula addition: SIP * [((1 + i)^n - 1) / i] * (1 + i)
        // Since we simulate monthly, we can calculate step-by-step
        maturityValue = (maturityValue + currentMonthlySip) * (1 + monthlyRate);
      }

      chartData.push({
        year: `Year ${year}`,
        invested: Math.round(totalInvested),
        wealthGained: Math.round(Math.max(0, maturityValue - totalInvested)),
        totalValue: Math.round(maturityValue)
      });

      // Implement Annual Step-Up: increase the monthly savings budget for next year
      if (stepUp > 0) {
        currentMonthlySip = currentMonthlySip * (1 + stepUp / 100);
      }
    }

    const totalEstimatedGains = Math.max(0, maturityValue - totalInvested);

    return {
      totalInvested: Math.round(totalInvested),
      totalEstimatedGains: Math.round(totalEstimatedGains),
      maturityValue: Math.round(maturityValue),
      chartData
    };
  }, [monthlySip, sipReturnRate, sipYears, stepUp]);

  // Unified dynamic AMFI database crawler with 5-min caching
  const fetchMutualFundsLive = async (
    risk: string = riskProfile,
    period: number = fundPeriod,
    sipAmount: number = monthlySip,
    cat: string = selectedCategory,
    forceFresh: boolean = false
  ) => {
    const cacheKey = `${risk}-${period}-${sipAmount}-${cat}`;

    if (!forceFresh && mfCacheRef.current.has(cacheKey)) {
      const cached = mfCacheRef.current.get(cacheKey)!;
      if (Date.now() - cached.timestamp < 5 * 60 * 1000) {
        setCustomFunds(cached.data);
        const stillExists = selectedFund ? cached.data.find(f => f.fundName === selectedFund.fundName) : null;
        if (stillExists) {
          setSelectedFund(stillExists);
          const rate = stillExists.historicalReturn5Y || stillExists.historicalReturn3Y;
          if (typeof rate === "number") setSipReturnRate(rate);
        } else if (cached.data.length > 0) {
          setSelectedFund(cached.data[0]);
          const rate = cached.data[0].historicalReturn5Y || cached.data[0].historicalReturn3Y;
          if (typeof rate === "number") setSipReturnRate(rate);
        }
        setLoadingMf(false);
        setMfError(null);
        setRetryStatus(null);
        return;
      }
    }

    setRetryAttempt(0);
    setLoadingMf(true);
    setMfError(null);
    setRetryStatus(null);

    try {
      const response = await fetch("/api/recommend-mutual-funds", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          riskProfile: risk,
          investmentPeriod: period,
          monthlySipAmount: sipAmount,
          category: cat === "All" ? "" : cat
        })
      });

      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("Live AMFI database unavailable.");
      }

      const list = await response.json();
      if (!response.ok) {
        throw new Error(list.error || "Live AMFI database unavailable.");
      }

      if (Array.isArray(list) && list.length > 0) {
        mfCacheRef.current.set(cacheKey, { data: list, timestamp: Date.now() });
        setCustomFunds(list);
        
        // Match existing selected fund or set fallback
        const stillExists = selectedFund ? list.find(f => f.fundName === selectedFund.fundName) : null;
        if (stillExists) {
          setSelectedFund(stillExists);
          const rate = stillExists.historicalReturn5Y || stillExists.historicalReturn3Y;
          if (typeof rate === "number") setSipReturnRate(rate);
        } else {
          setSelectedFund(list[0]);
          const rate = list[0].historicalReturn5Y || list[0].historicalReturn3Y;
          if (typeof rate === "number") setSipReturnRate(rate);
        }
      }
    } catch (err: any) {
      console.warn("Mutual fund filter error:", err.message || err);
      setMfError(err.message || "Live mutual fund database unavailable.");
      setRetryStatus(null);
    } finally {
      setLoadingMf(false);
    }
  };

  const queryMFAdvisor = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetchMutualFundsLive();
  };

  // Populate dynamic AMFI data on tab load automatically to replace mock items with real live NAV quotes
  useEffect(() => {
    fetchMutualFundsLive("Moderate", 10, 5000, "All");
  }, []);

  // Sync category clicks with live refetches
  useEffect(() => {
    fetchMutualFundsLive(riskProfile, fundPeriod, monthlySip, selectedCategory);
  }, [selectedCategory]);

  const getRiskColor = (risk: string) => {
    const r = risk.toLowerCase();
    if (r.includes("very high") || r.includes("aggressive")) return "text-rose-600 bg-rose-50 border-rose-150";
    if (r.includes("high")) return "text-amber-700 bg-amber-50 border-amber-150";
    return "text-emerald-700 bg-emerald-50 border-emerald-150";
  };

  // Pie chart data for breakdown
  const pieData = [
    { name: "Invested Principal", value: sipCalculationDetails.totalInvested, color: "#0f172a" },
    { name: "Estimated Profits", value: sipCalculationDetails.totalEstimatedGains, color: "#10b981" }
  ];

  return (
    <div className="space-y-8" id="sip-planner-section">
      
      {/* Upper Double Column: Directory on Left, Live Simulator on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column (SPAN 1): Mutual Fund Directory */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 shadow-xs border border-slate-100 flex flex-col justify-between h-full">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <PiggyBank className="w-5 h-5 text-emerald-600" />
                <h3 className="font-bold text-slate-800 text-md">Highest Growth Mutual Funds</h3>
              </div>

              {/* AMFI Database Live Status & NAV Timestamp Bar */}
              <div className="bg-slate-900 text-slate-200 rounded-xl p-3 border border-slate-800 space-y-2 text-xs font-mono">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 font-bold text-emerald-400">
                    <Activity className={`w-3.5 h-3.5 ${auditingSchemes ? "animate-spin" : ""}`} />
                    <span>AMFI Status:</span>
                    <span className={amfiAuditData?.apiHealthStatus === "online" ? "text-emerald-400 font-extrabold" : "text-amber-400 font-extrabold"}>
                      {amfiAuditData?.apiHealthStatus === "online" ? "ONLINE" : "OFFLINE / FALLBACK"}
                    </span>
                  </div>
                  <button
                    onClick={runAmfiSchemeAudit}
                    disabled={auditingSchemes}
                    className="text-[10px] uppercase font-bold px-2 py-0.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 rounded border border-emerald-500/30 transition-all cursor-pointer disabled:opacity-50"
                  >
                    {auditingSchemes ? "Auditing..." : "🔄 Audit AMFI"}
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[10px] text-slate-400 pt-1.5 border-t border-slate-800/80">
                  <div>
                    <span className="block text-slate-500 uppercase font-sans">Last Success Fetch</span>
                    <strong className="text-slate-200 font-semibold block truncate">
                      {amfiAuditData?.lastSuccessfulNavFetch
                        ? new Date(amfiAuditData.lastSuccessfulNavFetch).toLocaleTimeString()
                        : "Active Probe"}
                    </strong>
                  </div>
                  <div>
                    <span className="block text-slate-500 uppercase font-sans">Current NAV Date</span>
                    <strong className="text-sky-400 font-bold block truncate">
                      {amfiAuditData?.currentNavDateTimestamp || (selectedFund as any)?.navDate || "Latest Stream"}
                    </strong>
                  </div>
                </div>
              </div>
              
              {/* Category Quick Selector */}
              <div className="flex flex-wrap gap-1.5 pt-2">
                {["All", "Small Cap", "Flexi Cap", "Large Cap", "Index", "Hybrid"].map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-2.5 py-1 text-[11px] font-semibold rounded-md border cursor-pointer transition-all ${
                      selectedCategory === cat 
                        ? "bg-slate-800 text-white border-slate-800 shadow-sm"
                        : "bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Fund list */}
              <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-slate-200">
                {filteredFunds.map((fund, idx) => {
                  const isSelected = selectedFund?.fundName === fund.fundName;
                  return (
                    <div 
                      key={idx}
                      id={`fund-card-${idx}`}
                      onClick={() => handleFundSelect(fund)}
                      className={`p-4 rounded-xl border transition-all hover:scale-[1.01] cursor-pointer ${
                        isSelected 
                          ? "bg-emerald-50 border-emerald-400 shadow-xs" 
                          : "bg-slate-50 hover:bg-slate-100 border-slate-200"
                      }`}
                    >
                      <div className="flex justify-between items-start gap-2">
                        <span className="text-xs font-semibold text-slate-500 block uppercase tracking-wider leading-tight">
                          {fund.category}
                        </span>
                        <span className={`text-[9px] px-2 py-0.5 font-bold uppercase rounded-full border ${getRiskColor(fund.risk)}`}>
                          {fund.risk} Risk
                        </span>
                      </div>

                      <h4 className="text-sm font-bold text-slate-800 mt-2 line-clamp-1">{fund.fundName}</h4>

                      <div className="grid grid-cols-3 gap-1 mt-4 pt-3 border-t border-dashed border-slate-200 text-xs font-mono">
                        <div>
                          <span className="text-[9px] text-slate-400 block font-sans">5Y Returns</span>
                          <span className="font-bold text-emerald-600 block text-[11px]">
                            {typeof fund.historicalReturn5Y === "number" 
                              ? `+${fund.historicalReturn5Y}% p.a.` 
                              : typeof fund.historicalReturn3Y === "number"
                                ? `+${fund.historicalReturn3Y}% p.a.`
                                : "Live data unavailable"}
                          </span>
                        </div>
                        <div className="text-center">
                          <span className="text-[9px] text-slate-400 block font-sans">NAV Quote</span>
                          <span className="font-bold text-slate-700 block text-[11px]">
                            {typeof fund.currentNav === "number" ? `₹${fund.currentNav}` : (fund.currentNav || "Live data unavailable")}
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="text-[9px] text-slate-400 block font-sans">Fund AUM</span>
                          <span className="font-bold text-slate-700 block text-[11px] truncate">{fund.aum}</span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center text-[9px] text-slate-400 font-sans mt-2 pt-1 border-t border-slate-100 italic">
                        <span>Source: AMFI Directory</span>
                        {fund.fetchedAt && <span>Timestamp: {new Date(fund.fetchedAt).toLocaleTimeString()}</span>}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* AI Advisor Promotion prompt */}
            <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white p-4 rounded-xl space-y-3 mt-6">
              <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400 uppercase tracking-widest">
                <Sparkles className="w-4 h-4 animate-pulse" />
                AI Mutual Fund Advisor
              </div>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                Looking for a highly targeted SIP plan? Enter your profiles below to have Gemini fetch and build custom equity lists.
              </p>
              
              <form onSubmit={queryMFAdvisor} className="space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-[9px] text-slate-300 block uppercase font-semibold">Risk Appetite</span>
                    <select
                      value={riskProfile}
                      onChange={(e) => setRiskProfile(e.target.value)}
                      className="w-full bg-slate-700 border border-slate-600 text-xs text-white rounded-lg p-1.5"
                    >
                      <option value="Aggressive">Aggressive</option>
                      <option value="Moderate">Moderate</option>
                      <option value="Conservative">Conservative</option>
                    </select>
                  </div>
                  <div>
                    <span className="text-[9px] text-slate-300 block uppercase font-semibold">Horizon (Yrs)</span>
                    <select
                      value={fundPeriod}
                      onChange={(e) => setFundPeriod(Number(e.target.value))}
                      className="w-full bg-slate-700 border border-slate-600 text-xs text-white rounded-lg p-1.5"
                    >
                      <option value={3}>3 Years</option>
                      <option value={5}>5 Years</option>
                      <option value={10}>10 Years</option>
                      <option value={15}>15 Years</option>
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loadingMf}
                  className="w-full bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white text-xs font-bold py-2 rounded-lg transition-all flex items-center justify-center gap-1 cursor-pointer disabled:opacity-50"
                >
                  {loadingMf ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      Benchmarking Funds...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5" />
                      Get Personal AI Portfolio
                    </>
                  )}
                </button>
              </form>

              {mfError && (
                <div className="text-[10px] text-rose-350 bg-rose-950/90 p-3 rounded-lg border border-rose-900/60 text-left space-y-1.5 shadow-sm">
                  <p className="font-semibold">{mfError}</p>
                  {retryStatus && (
                    <p className="text-amber-400 font-medium animate-pulse flex items-center gap-1.5 mt-1.5">
                      <RefreshCw className="w-3 h-3 animate-spin" />
                      {retryStatus}
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Columns (SPAN 2): Calculator and Dynamic Simulation Details */}
        <div className="lg:col-span-2 space-y-6">
          
          {selectedFund?.offlineSimulation && !bannerDismissed && (
            <div id="offline-simulation-mf-banner" className="p-4 bg-gradient-to-r from-amber-50 to-amber-50/50 border border-amber-200 rounded-xl flex items-start justify-between gap-3 text-amber-850 shadow-xs animate-fade-in">
              <div className="flex items-start gap-3 justify-start text-left">
                <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div className="text-xs">
                  <strong className="block font-bold text-amber-900 mb-0.5">SIP Advisor Simulation Active</strong>
                  Live mutual fund indexing is offline or under peak AI advisor request load. EquiGrowth has activated seamless offline research models for top capital compounding funds.
                </div>
              </div>
              <button 
                type="button"
                onClick={() => setBannerDismissed(true)}
                title="Dismiss Banner"
                className="text-amber-600 hover:text-amber-900 font-bold p-1 hover:bg-amber-100/60 rounded text-xs leading-none transition-all cursor-pointer select-none shrink-0"
              >
                ✕
              </button>
            </div>
          )}

          <div className="bg-white rounded-2xl p-6 shadow-xs border border-slate-100 space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-100 pb-4 gap-4">
              <div className="flex items-center gap-2">
                <Calculator className="w-5 h-5 text-emerald-600" />
                <h3 className="font-bold text-slate-800 text-md">Wealth Compounding Calculator</h3>
              </div>
              {selectedFund && (
                <div className="bg-slate-50 py-1.5 px-3 rounded-lg border border-slate-100 text-xs">
                  <span className="text-slate-500 font-medium mr-1.5 uppercase font-sans">Simulating:</span>
                  <strong className="text-slate-800 font-bold">{selectedFund.fundName}</strong>
                </div>
              )}
            </div>

            {/* Multi inputs matrix */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Monthly SIP (₹)</label>
                <input
                  type="number"
                  value={monthlySip}
                  onChange={(e) => setMonthlySip(Number(e.target.value))}
                  min={500}
                  step={500}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-sm font-semibold text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 focus:bg-white font-mono"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Expected Rate (% p.a.)</label>
                <input
                  type="number"
                  value={sipReturnRate}
                  onChange={(e) => setSipReturnRate(Number(e.target.value))}
                  min={1}
                  max={50}
                  step={0.5}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-sm font-semibold text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 focus:bg-white font-mono"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Duration (Years)</label>
                <input
                  type="number"
                  value={sipYears}
                  onChange={(e) => setSipYears(Number(e.target.value))}
                  min={1}
                  max={40}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-sm font-semibold text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 focus:bg-white font-mono"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-500 uppercase block mb-1 flex items-center gap-1">
                  Annual Step-up (%)
                  <HelpCircle className="w-3.5 h-3.5 text-slate-300 block" title="Amount by which you increase your monthly savings every fiscal year." />
                </label>
                <input
                  type="number"
                  value={stepUp}
                  onChange={(e) => setStepUp(Number(e.target.value))}
                  min={0}
                  max={50}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-sm font-semibold text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 focus:bg-white font-mono"
                />
              </div>
            </div>

            {/* Output metrics blocks */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-slate-100">
              <div className="p-4 bg-slate-50 rounded-xl space-y-1">
                <span className="text-xs text-slate-400 flex items-center gap-1 font-medium">
                  <CreditCard className="w-3.5 h-3.5 text-slate-400" />
                  Invested Principal
                </span>
                <span className="text-xl font-bold font-mono text-slate-800">
                  ₹{sipCalculationDetails.totalInvested.toLocaleString()}
                </span>
              </div>
              <div className="p-4 bg-emerald-50 text-emerald-800 rounded-xl space-y-1">
                <span className="text-xs text-emerald-600 flex items-center gap-1 font-medium">
                  <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
                  Estimated Wealth Gains
                </span>
                <span className="text-xl font-bold font-mono text-emerald-700">
                  ₹{sipCalculationDetails.totalEstimatedGains.toLocaleString()}
                </span>
              </div>
              <div className="p-4 bg-slate-900 text-white rounded-xl space-y-1">
                <span className="text-xs text-slate-400 flex items-center gap-1 font-medium">
                  <PieChartIcon className="w-3.5 h-3.5 text-emerald-400" />
                  Expected Maturity Capital
                </span>
                <span className="text-xl font-bold font-mono text-emerald-400">
                  ₹{sipCalculationDetails.maturityValue.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Calculations Area Chart representation */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">SIP Compound Path Simulation</h4>
              <div className="h-[230px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={sipCalculationDetails.chartData} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorInvested" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#0f172a" stopOpacity={0.15}/>
                        <stop offset="95%" stopColor="#0f172a" stopOpacity={0.01}/>
                      </linearGradient>
                      <linearGradient id="colorGains" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.25}/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0.02}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="year" tickLine={false} axisLine={false} tick={{ fill: '#64748b', fontSize: 10 }} />
                    <YAxis tickLine={false} axisLine={false} tick={{ fill: '#64748b', fontSize: 10 }} />
                    <Tooltip 
                      contentStyle={{ borderRadius: "12px", border: "1px solid #f1f5f9" }}
                      formatter={(val: any) => [`₹${val.toLocaleString()}`, ""]}
                    />
                    <Area type="monotone" dataKey="invested" name="Principal Invested" stroke="#0f172a" strokeWidth={2} fillOpacity={1} fill="url(#colorInvested)" />
                    <Area type="monotone" dataKey="wealthGained" name="Interests/Gains Gained" stroke="#10b981" strokeWidth={2.5} fillOpacity={1} fill="url(#colorGains)" />
                    <Legend verticalAlign="top" height={36} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Active Fund Recommended suggestions & Similar peer funds */}
          {selectedFund && (
            <div className="bg-white rounded-2xl p-6 shadow-xs border border-slate-100 grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Detailed reason notes */}
              <div className="md:col-span-2 space-y-3">
                <h4 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                  <Lightbulb className="w-4 h-4 text-emerald-600" />
                  Advisor Research Notes for {selectedFund.fundName}
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100">
                  {selectedFund.reason}
                </p>

                {/* Micro values */}
                <div className="grid grid-cols-3 gap-2 text-xs pt-1">
                  <div className="bg-slate-50/50 p-2.5 rounded-lg border border-slate-100">
                    <span className="text-[10px] text-slate-400 block font-sans">Expense Ratio</span>
                    <strong className="text-slate-700 font-bold block">{selectedFund.expenseRatio}%</strong>
                  </div>
                  <div className="bg-slate-50/50 p-2.5 rounded-lg border border-slate-100">
                    <span className="text-[10px] text-slate-400 block font-sans">Fund Age</span>
                    <strong className="text-slate-700 font-bold block">{selectedFund.vintageYears} Yrs</strong>
                  </div>
                  <div className="bg-slate-50/50 p-2.5 rounded-lg border border-slate-100">
                    <span className="text-[10px] text-slate-400 block font-sans">Risk Rating</span>
                    <strong className="text-slate-700 font-bold block flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 block shrink-0" />
                      {selectedFund.risk}
                    </strong>
                  </div>
                </div>
              </div>

              {/* Similar / suggested Mutual Funds */}
              <div className="space-y-3">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Suggested Similar / Recommended Funds</span>
                <div className="space-y-2">
                  {selectedFund.similarFunds && selectedFund.similarFunds.map((similarName, idx) => (
                    <div 
                      key={idx} 
                      className="p-3 bg-emerald-50/30 hover:bg-emerald-50/60 rounded-xl border border-emerald-100/50 flex items-center justify-between transition-colors gap-2"
                    >
                      <div className="space-y-0.5">
                        <strong className="text-xs font-bold text-slate-700 block line-clamp-1">{similarName}</strong>
                        <span className="text-[10px] text-emerald-600 inline-flex items-center font-semibold">Matched Category Class</span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-emerald-600 shrink-0" />
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* New Interactive Goal-Based SIP Destination Planner */}
          <GoalBasedSipPlanner currentMonthlySip={monthlySip} />

        </div>

      </div>

    </div>
  );
}

// Separate highly modular goal based SIP Planner Component
interface GoalBasedSipPlannerProps {
  currentMonthlySip: number;
}

function GoalBasedSipPlanner({ currentMonthlySip }: GoalBasedSipPlannerProps) {
  const [goalPreset, setGoalPreset] = useState<"house" | "retirement" | "education" | "custom">("house");
  const [targetValue, setTargetValue] = useState<number>(10000000); // Default 1 Crore INR (10,000,000)
  const [targetYears, setTargetYears] = useState<number>(15);
  const [expectedRateOutput, setExpectedRateOutput] = useState<number>(14.5);
  const [customTitle, setCustomTitle] = useState<string>("My Luxury Beachside Villa");

  // Presets mapping handler
  const handlePresetChange = (preset: "house" | "retirement" | "education" | "custom") => {
    setGoalPreset(preset);
    if (preset === "house") {
      setTargetValue(10000000); // 1 Cr
      setTargetYears(15);
      setExpectedRateOutput(14);
    } else if (preset === "retirement") {
      setTargetValue(30000000); // 3 Cr
      setTargetYears(25);
      setExpectedRateOutput(13.5);
    } else if (preset === "education") {
      setTargetValue(5000000); // 50 Lakhs
      setTargetYears(10);
      setExpectedRateOutput(12);
    } else {
      setTargetValue(2000000); // 20 Lakhs
      setTargetYears(7);
      setExpectedRateOutput(15);
    }
  };

  // Reverse Compound Interest Equation solver for Monthly SIP Annuity
  const requiredMonthlySip = React.useMemo(() => {
    if (targetValue <= 0 || targetYears <= 0) return 0;
    const r = (expectedRateOutput / 100) / 12; // monthly rate
    const n = targetYears * 12; // total monthly deposits
    
    if (r === 0) return Math.round(targetValue / n);

    // Standard formula: Target = P * [ ((1+r)^n - 1) / r ] * (1+r)
    // Therefore P = Target * r / [ ((1+r)^n - 1) * (1+r) ]
    const numerator = targetValue * r;
    const denominator = (Math.pow(1 + r, n) - 1) * (1 + r);
    return Math.max(1, Math.round(numerator / denominator));
  }, [targetValue, targetYears, expectedRateOutput]);

  const totalSipInvested = requiredMonthlySip * targetYears * 12;
  const rewardCompoundedWealth = Math.max(0, targetValue - totalSipInvested);

  // Formatting utility
  const formatINR = (value: number) => {
    if (value >= 10000000) {
      return `₹${(value / 10000000).toFixed(2)} Crore`;
    } else if (value >= 100000) {
      return `₹${(value / 100000).toFixed(2)} Lakh`;
    }
    return `₹${value.toLocaleString()}`;
  };

  const currentDeficit = Math.max(0, requiredMonthlySip - currentMonthlySip);
  const isCurrentlySufficient = currentMonthlySip >= requiredMonthlySip;

  return (
    <div className="bg-slate-900 text-white rounded-3xl p-6 md:p-8 shadow-lg border border-slate-800 space-y-6" id="goal-sip-planner">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-emerald-600/25 rounded-md border border-emerald-500/30 text-emerald-400">
              <Sparkles className="w-5 h-5" />
            </span>
            <h3 className="font-extrabold text-lg text-white tracking-tight">AI Wealth Goal Destination Planner</h3>
          </div>
          <p className="text-slate-400 text-xs">
            Calculate exactly what monthly SIP is required today to achieve your lifetime aspirations.
          </p>
        </div>

        {/* Preset Selector buttons */}
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => handlePresetChange("house")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold border cursor-pointer transition-all ${
              goalPreset === "house"
                ? "bg-emerald-600 text-white border-emerald-500 shadow-sm"
                : "bg-slate-800/80 text-slate-300 border-slate-700/60 hover:bg-slate-800"
            }`}
          >
            🏠 Build Dream House
          </button>
          <button
            type="button"
            onClick={() => handlePresetChange("retirement")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold border cursor-pointer transition-all ${
              goalPreset === "retirement"
                ? "bg-emerald-600 text-white border-emerald-500 shadow-sm"
                : "bg-slate-800/80 text-slate-300 border-slate-700/60 hover:bg-slate-800"
            }`}
          >
            👴 Retirement Corpus
          </button>
          <button
            type="button"
            onClick={() => handlePresetChange("education")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold border cursor-pointer transition-all ${
              goalPreset === "education"
                ? "bg-emerald-600 text-white border-emerald-500 shadow-sm"
                : "bg-slate-800/80 text-slate-300 border-slate-700/60 hover:bg-slate-800"
            }`}
          >
            🎓 Ivy League Education
          </button>
          <button
            type="button"
            onClick={() => handlePresetChange("custom")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold border cursor-pointer transition-all ${
              goalPreset === "custom"
                ? "bg-emerald-600 text-white border-emerald-500 shadow-sm"
                : "bg-slate-800/80 text-slate-300 border-slate-700/60 hover:bg-slate-800"
            }`}
          >
            ✨ Custom Goal
          </button>
        </div>
      </div>

      {/* Grid Inputs Column */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        {/* Custom Controls Panel */}
        <div className="lg:col-span-1 bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-4">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block border-b border-slate-800 pb-2">
            Configure Destination
          </span>

          {goalPreset === "custom" && (
            <div className="space-y-1">
              <label className="text-[10px] uppercase font-bold text-slate-400">Custom Goal Label</label>
              <input
                type="text"
                value={customTitle}
                onChange={(e) => setCustomTitle(e.target.value)}
                className="w-full bg-slate-900 border border-slate-850 rounded-lg py-1.5 px-3 text-xs text-slate-200 focus:ring-1 focus:ring-emerald-500 font-medium"
              />
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-[10px] uppercase font-bold text-slate-400 flex justify-between">
              <span>Target Asset Value</span>
              <span className="text-emerald-400 font-bold">{formatINR(targetValue)}</span>
            </label>
            <input
              type="number"
              value={targetValue}
              onChange={(e) => setTargetValue(Number(e.target.value))}
              min={100000}
              step={100000}
              className="w-full bg-slate-900 border border-slate-850 rounded-lg py-1.5 px-3 text-sm font-semibold text-white focus:outline-hidden focus:ring-1 focus:ring-emerald-500 font-mono"
            />
            {/* Slider bar also for visual feel */}
            <input
              type="range"
              min={500000}
              max={100000000}
              step={500000}
              value={targetValue}
              onChange={(e) => setTargetValue(Number(e.target.value))}
              className="w-full accent-emerald-500 h-1 rounded-lg bg-slate-800 cursor-pointer"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] uppercase font-bold text-slate-400">Duration Years</label>
              <input
                type="number"
                value={targetYears}
                onChange={(e) => setTargetYears(Math.max(1, Number(e.target.value)))}
                min={1}
                max={40}
                className="w-full bg-slate-900 border border-slate-850 rounded-lg py-1.5 px-3 text-xs text-white font-semibold font-mono"
              />
            </div>
            
            <div className="space-y-1">
              <label className="text-[10px] uppercase font-bold text-slate-400">Expected CAGR (%)</label>
              <input
                type="number"
                value={expectedRateOutput}
                onChange={(e) => setExpectedRateOutput(Number(e.target.value))}
                min={1}
                max={30}
                step={0.5}
                className="w-full bg-slate-900 border border-slate-850 rounded-lg py-1.5 px-3 text-xs text-white font-semibold font-mono"
              />
            </div>
          </div>

          <div className="pt-2 text-[11px] text-slate-400 leading-relaxed bg-slate-900/40 p-3 rounded-lg border border-slate-900 flex gap-2">
            <Lightbulb className="w-4 h-4 text-emerald-400 block shrink-0" />
            <span>
              Real estate has historically generated 8-11% in urban hubs, while equity compounding SIPs offer 12-16% yield rates over decades.
            </span>
          </div>
        </div>

        {/* Dynamic Analytics Required SIP Result Sheet (SPAN 2) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-slate-950 p-6 rounded-2xl border border-slate-850 space-y-6">
            
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-900 pb-4">
              <div>
                <span className="text-[10px] font-bold text-emerald-400 tracking-wider uppercase block">Calculated Requirement</span>
                <h4 className="text-sm font-bold text-white mt-0.5">
                  Investment plan to buy {goalPreset === "house" ? "a House" : goalPreset === "retirement" ? "Retirement Capital" : goalPreset === "education" ? "Higher Education" : customTitle} worth {formatINR(targetValue)}
                </h4>
              </div>
              <div className="bg-emerald-950/40 border border-emerald-900/60 p-3 rounded-xl text-center">
                <span className="text-[9px] text-emerald-400 uppercase font-bold tracking-wider block">Required Monthly Investment</span>
                <span className="text-2xl font-black font-mono text-emerald-400 block" id="goal-required-sip-amount">
                  ₹{requiredMonthlySip.toLocaleString()}<span className="text-xs font-normal">/mo</span>
                </span>
              </div>
            </div>

            {/* Split Metrics Breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-slate-900/70 rounded-xl space-y-1 border border-slate-850">
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">Total Principal Contributed (Invested)</span>
                <span className="text-lg font-bold font-mono text-slate-200">₹{totalSipInvested.toLocaleString()}</span>
                <p className="text-[10px] text-slate-500 pt-1">
                  Your out-of-pocket savings budget across {targetYears} years.
                </p>
              </div>

              <div className="p-4 bg-slate-900/70 rounded-xl space-y-1 border border-slate-850">
                <span className="text-[10px] text-emerald-400 uppercase font-semibold block">Compound Growth Retained (Interest Gained)</span>
                <span className="text-lg font-bold font-mono text-emerald-400">₹{rewardCompoundedWealth.toLocaleString()}</span>
                <p className="text-[10px] text-slate-500 pt-1">
                  Agile compounding interest returns generated by the equity market indices.
                </p>
              </div>
            </div>

            {/* Current Active Plan Deficit/Sufficient bar checklist! */}
            <div className="bg-slate-900/40 rounded-xl p-4 border border-slate-850 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-300">Your Current Active Monthly SIP Budget:</span>
                <span className="text-sm font-bold font-mono text-white">₹{currentMonthlySip.toLocaleString()}/mo</span>
              </div>

              {isCurrentlySufficient ? (
                <div className="p-3 bg-emerald-950/30 text-emerald-300 border border-emerald-900/40 rounded-lg text-xs flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>
                    Outstanding! Your current active SIP of <strong>₹{currentMonthlySip.toLocaleString()}/mo</strong> is already sufficient to comfortably achieve this destination. You will outcompounding your target by years!
                  </span>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="p-3 bg-amber-950/30 text-amber-300 border border-amber-900/40 rounded-lg text-xs flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <div className="space-y-1 text-left">
                      <strong>Contribution Deficit Identified:</strong>
                      <p className="leading-relaxed">
                        To hit this goal timeline, your current portfolio contribution has a shortfall of <strong className="text-amber-400 font-mono">₹{currentDeficit.toLocaleString()}/mo</strong>.
                      </p>
                    </div>
                  </div>
                  
                  {/* Visual delta ratio bar */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-[10px] text-slate-400 font-semibold uppercase">
                      <span>Plan Coverage Status</span>
                      <span>{Math.min(100, Math.round((currentMonthlySip / requiredMonthlySip) * 100))}% covered</span>
                    </div>
                    <div className="w-full h-2.5 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                      <div 
                        className="h-full bg-gradient-to-r from-amber-500 to-emerald-500 transition-all duration-1000"
                        style={{ width: `${Math.min(100, (currentMonthlySip / requiredMonthlySip) * 100)}%` }}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Final dynamic verbal target summary */}
            <p className="text-xs text-slate-300 leading-relaxed italic border-t border-slate-900/50 pt-4 text-center">
              "By initiating a systematically growing investment of <strong>₹{requiredMonthlySip.toLocaleString()}</strong> every month into disciplined equity mutual funds with direct compounding returns of <strong>{expectedRateOutput}% CAGR</strong>, you will successfully reach your dream wealth destination of <strong>{formatINR(targetValue)}</strong> in exactly <strong>{targetYears} Years</strong>."
            </p>

          </div>
        </div>

      </div>

    </div>
  );
}
