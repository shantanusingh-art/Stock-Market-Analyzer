import React, { useState, useMemo } from "react";
import { StockAnalysis } from "../types";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line
} from "recharts";
import { 
  X, Scale, TrendingUp, BarChart2, ShieldAlert, CheckCircle, 
  HelpCircle, DollarSign, Percent, Award, ArrowLeftRight, Landmark
} from "lucide-react";

interface SplitScreenStockComparisonProps {
  stockA: StockAnalysis;
  stockB: StockAnalysis;
  onClose: () => void;
}

export default function SplitScreenStockComparison({ stockA, stockB, onClose }: SplitScreenStockComparisonProps) {
  const [chartMetric, setChartMetric] = useState<"revenue" | "profit" | "future">("revenue");

  // Helper extraction with adaptive search for different stock/banking models
  const getRatio = (stock: StockAnalysis, group: "liquidity" | "solvency" | "efficiency", keywords: string[]) => {
    const list = stock.ratios?.[group] || [];
    const found = list.find(r => keywords.some(kw => r.name.toLowerCase().includes(kw.toLowerCase())));
    return found || null;
  };

  // Extract key comparison values
  const metricsA = useMemo(() => {
    const curR = getRatio(stockA, "liquidity", ["current", "liquidity coverage"]);
    const qkR = getRatio(stockA, "liquidity", ["quick", "casa"]);
    const deR = getRatio(stockA, "solvency", ["debt", "adequacy", "car"]);
    const icR = getRatio(stockA, "solvency", ["interest", "npa"]);
    const roeR = getRatio(stockA, "efficiency", ["roe", "nim"]);
    const turnR = getRatio(stockA, "efficiency", ["turnover", "assets", "roa"]);
    
    // Last available financials
    const sortedFin = [...(stockA.financials || [])].sort((a, b) => parseInt(b.year) - parseInt(a.year));
    const latestFin = sortedFin[0] || { revenue: 0, netProfit: 0, operatingMargin: 0, year: "N/A" };

    return {
      currentRatio: curR,
      quickRatio: qkR,
      debtEquity: deR,
      interestCoverage: icR,
      roe: roeR,
      turnover: turnR,
      latestFin
    };
  }, [stockA]);

  const metricsB = useMemo(() => {
    const curR = getRatio(stockB, "liquidity", ["current", "liquidity coverage"]);
    const qkR = getRatio(stockB, "liquidity", ["quick", "casa"]);
    const deR = getRatio(stockB, "solvency", ["debt", "adequacy", "car"]);
    const icR = getRatio(stockB, "solvency", ["interest", "npa"]);
    const roeR = getRatio(stockB, "efficiency", ["roe", "nim"]);
    const turnR = getRatio(stockB, "efficiency", ["turnover", "assets", "roa"]);

    // Last available financials
    const sortedFin = [...(stockB.financials || [])].sort((a, b) => parseInt(b.year) - parseInt(a.year));
    const latestFin = sortedFin[0] || { revenue: 0, netProfit: 0, operatingMargin: 0, year: "N/A" };

    return {
      currentRatio: curR,
      quickRatio: qkR,
      debtEquity: deR,
      interestCoverage: icR,
      roe: roeR,
      turnover: turnR,
      latestFin
    };
  }, [stockB]);

  // Align historical chart data (Revenues vs Net Profits over time)
  const historicalChartData = useMemo(() => {
    const yearsA = (stockA.financials || []).map(f => f.year);
    const yearsB = (stockB.financials || []).map(f => f.year);
    const allYears = Array.from(new Set([...yearsA, ...yearsB])).sort();

    return allYears.map(year => {
      const fA = (stockA.financials || []).find(f => f.year === year);
      const fB = (stockB.financials || []).find(f => f.year === year);
      return {
        year,
        [`${stockA.symbol}_Revenue`]: fA ? fA.revenue : 0,
        [`${stockB.symbol}_Revenue`]: fB ? fB.revenue : 0,
        [`${stockA.symbol}_NetProfit`]: fA ? fA.netProfit : 0,
        [`${stockB.symbol}_NetProfit`]: fB ? fB.netProfit : 0,
      };
    });
  }, [stockA, stockB]);

  // Align future price predictions path
  const futureChartData = useMemo(() => {
    const yearsA = (stockA.futureGrowth?.years || []).map(y => y.year);
    const yearsB = (stockB.futureGrowth?.years || []).map(y => y.year);
    const allYears = Array.from(new Set([...yearsA, ...yearsB])).sort();

    return allYears.map(year => {
      const yA = (stockA.futureGrowth?.years || []).find(y => y.year === year);
      const yB = (stockB.futureGrowth?.years || []).find(y => y.year === year);
      return {
        year: `Year ${year}`,
        [`${stockA.symbol}_Prediction`]: yA ? yA.predictedSharePrice : null,
        [`${stockB.symbol}_Prediction`]: yB ? yB.predictedSharePrice : null,
      };
    });
  }, [stockA, stockB]);

  const getHealthBadgeClass = (health: string) => {
    const h = health.toLowerCase();
    if (h.includes("excellent") || h.includes("strong") || h.includes("optimal") || h.includes("good")) {
      return "bg-emerald-50 text-emerald-700 border-emerald-200";
    }
    if (h.includes("average") || h.includes("stable") || h.includes("moderate")) {
      return "bg-amber-50 text-amber-700 border-amber-200";
    }
    return "bg-rose-50 text-rose-700 border-rose-200";
  };

  const getLeaderText = (valA: number | string, valB: number | string, lowerIsBetter = false) => {
    const numA = typeof valA === "number" ? valA : parseFloat(valA);
    const numB = typeof valB === "number" ? valB : parseFloat(valB);
    if (isNaN(numA) || isNaN(numB)) return null;
    if (numA === numB) return null;
    const isALeader = lowerIsBetter ? numA < numB : numA > numB;
    return isALeader ? stockA.symbol : stockB.symbol;
  };

  const formatCurrency = (num: number, currency: string) => {
    const prefix = currency === "INR" ? "₹" : "$";
    if (num >= 100000) return `${prefix}${(num / 100000).toFixed(2)}L Cr`;
    if (num >= 1000) return `${prefix}${(num / 1000).toFixed(2)} Cr`;
    return `${prefix}${num.toLocaleString()}`;
  };

  return (
    <div id="split-screen-stock-comparison-wrapper" className="space-y-8 animate-fade-in">
      {/* Header Panel */}
      <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-dashed border-slate-100 pb-6">
          <div className="space-y-1 text-left">
            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
              <Scale className="w-5 h-5 text-emerald-600" />
              Institiutional Split-Screen Benchmarking
            </h2>
            <p className="text-slate-500 text-sm">
              Analyzing key structural ratios, cash cycles, and performance parameters side-by-side.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="self-start md:self-auto flex items-center gap-1.5 px-3.5 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-500 hover:text-slate-800 rounded-xl text-xs font-bold transition-all border border-slate-200/60 cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
            Clear Split View
          </button>
        </div>

        {/* Dual Core Stats Overview Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
          {/* Stock A Card */}
          <div className="bg-slate-50/50 rounded-2xl p-4 md:p-5 border border-slate-150/50 space-y-4 text-left">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-0.5 bg-emerald-50 text-emerald-700 rounded-full">
                  Primary Stock ({stockA.sector})
                </span>
                <h3 className="text-lg font-bold text-slate-800 mt-2">{stockA.companyName}</h3>
                <span className="text-xs font-mono font-bold text-slate-400 mt-1 block">{stockA.symbol}</span>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-slate-400 block font-semibold uppercase tracking-wider">Market Price</span>
                <span className="text-xl font-extrabold text-slate-800 font-mono">
                  {stockA.currency === "INR" ? "₹" : "$"}{stockA.currentPrice}
                </span>
              </div>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed bg-white/70 p-3 rounded-lg border border-slate-100">
              {stockA.about}
            </p>
          </div>

          {/* Stock B Card */}
          <div className="bg-slate-50/50 rounded-2xl p-4 md:p-5 border border-slate-150/50 space-y-4 text-left">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-0.5 bg-blue-50 text-blue-700 rounded-full">
                  Comparison Stock ({stockB.sector})
                </span>
                <h3 className="text-lg font-bold text-slate-800 mt-2">{stockB.companyName}</h3>
                <span className="text-xs font-mono font-bold text-slate-400 mt-1 block">{stockB.symbol}</span>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-slate-400 block font-semibold uppercase tracking-wider">Market Price</span>
                <span className="text-xl font-extrabold text-slate-800 font-mono">
                  {stockB.currency === "INR" ? "₹" : "$"}{stockB.currentPrice}
                </span>
              </div>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed bg-white/70 p-3 rounded-lg border border-slate-100">
              {stockB.about}
            </p>
          </div>
        </div>
      </div>

      {/* Main Split-Screen Benchmarking Table Matrix */}
      <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-xs">
        <h3 className="text-md font-bold text-slate-800 mb-4 flex items-center gap-1.5 text-left">
          <ArrowLeftRight className="w-5 h-5 text-emerald-600" />
          General & Ratio Benchmark split Matrix
        </h3>
        
        <div className="overflow-x-auto rounded-2xl border border-slate-100">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="p-4 font-bold text-slate-400 uppercase tracking-widest text-[9.5px] w-[30%]">Comparison Parameters</th>
                <th className="p-4 font-extrabold text-emerald-800 bg-emerald-50/20 text-sm w-[35%] text-left">
                  {stockA.companyName} ({stockA.symbol})
                </th>
                <th className="p-4 font-extrabold text-blue-800 bg-blue-50/20 text-sm w-[35%] text-left">
                  {stockB.companyName} ({stockB.symbol})
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-sans">
              
              {/* GROUP 1: VALUATION CRITERIA */}
              <tr className="bg-slate-50/50 font-bold text-slate-700 text-left">
                <td colSpan={3} className="px-4 py-3 text-[10px] uppercase tracking-wider bg-slate-100/50 border-y border-slate-200/50">
                  Valuation Metrics & Core Yields
                </td>
              </tr>
              <tr className="hover:bg-slate-50/30 text-left">
                <td className="p-4 font-semibold text-slate-600">Current Market Price</td>
                <td className="p-4 font-mono font-bold text-slate-800">
                  {stockA.currency === "INR" ? "₹" : "$"}{stockA.currentPrice}
                </td>
                <td className="p-4 font-mono font-bold text-slate-800">
                  {stockB.currency === "INR" ? "₹" : "$"}{stockB.currentPrice}
                </td>
              </tr>
              <tr className="hover:bg-slate-50/30 text-left">
                <td className="p-4 font-semibold text-slate-600">Earnings Per Share (EPS)</td>
                <td className="p-4 font-sans text-slate-400 font-normal text-xs">
                  Not tracked in free tier
                </td>
                <td className="p-4 font-sans text-slate-400 font-normal text-xs">
                  Not tracked in free tier
                </td>
              </tr>
              <tr className="hover:bg-slate-50/30 text-left">
                <td className="p-4 font-semibold text-slate-600">Price-to-Earnings Valuation (P/E)</td>
                <td className="p-4 font-sans text-slate-400 font-normal text-xs">
                  Not tracked in free tier
                </td>
                <td className="p-4 font-sans text-slate-400 font-normal text-xs">
                  Not tracked in free tier
                </td>
              </tr>
              <tr className="hover:bg-slate-50/30 text-left">
                <td className="p-4 font-semibold text-slate-600">Price-to-Book Multiplier (P/B)</td>
                <td className="p-4 font-sans text-slate-400 font-normal text-xs">
                  Not tracked in free tier
                </td>
                <td className="p-4 font-sans text-slate-400 font-normal text-xs">
                  Not tracked in free tier
                </td>
              </tr>
              <tr className="hover:bg-slate-50/30 text-left">
                <td className="p-4 font-semibold text-slate-600">Asset-Backed Book Value (NAV / Share)</td>
                <td className="p-4 font-sans text-slate-400 font-normal text-xs">
                  Not tracked in free tier
                </td>
                <td className="p-4 font-sans text-slate-400 font-normal text-xs">
                  Not tracked in free tier
                </td>
              </tr>
              <tr className="hover:bg-slate-50/30 text-left">
                <td className="p-4 font-semibold text-slate-600">Annual Dividend Yield (%)</td>
                <td className="p-4 font-sans text-slate-400 font-normal text-xs">
                  Not tracked in free tier
                </td>
                <td className="p-4 font-sans text-slate-400 font-normal text-xs">
                  Not tracked in free tier
                </td>
              </tr>

              {/* GROUP 2: SHORT TERM LIQUIDITY */}
              <tr className="bg-slate-50/50 font-bold text-slate-700 text-left">
                <td colSpan={3} className="px-4 py-3 text-[10px] uppercase tracking-wider bg-slate-100/50 border-y border-slate-200/50">
                  Short-Term Liquidity Cushions
                </td>
              </tr>
              <tr className="hover:bg-slate-50/30 text-left">
                <td className="p-4 font-semibold text-slate-600">
                  {metricsA.currentRatio?.name || "Liquidity/Current Ratio"}
                </td>
                <td className="p-4">
                  {metricsA.currentRatio ? (
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5 font-mono">
                        <span className="font-bold text-slate-800">{metricsA.currentRatio.value}</span>
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase border ${getHealthBadgeClass(metricsA.currentRatio.health)}`}>
                          {metricsA.currentRatio.health}
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-400 block leading-tight">{metricsA.currentRatio.description}</span>
                    </div>
                  ) : (
                    <span className="text-slate-400 font-mono">Not Sourced</span>
                  )}
                </td>
                <td className="p-4">
                  {metricsB.currentRatio ? (
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5 font-mono">
                        <span className="font-bold text-slate-800">{metricsB.currentRatio.value}</span>
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase border ${getHealthBadgeClass(metricsB.currentRatio.health)}`}>
                          {metricsB.currentRatio.health}
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-400 block leading-tight">{metricsB.currentRatio.description}</span>
                    </div>
                  ) : (
                    <span className="text-slate-400 font-mono">Not Sourced</span>
                  )}
                </td>
              </tr>
              <tr className="hover:bg-slate-50/30 text-left">
                <td className="p-4 font-semibold text-slate-600">
                  {metricsA.quickRatio?.name || metricsB.quickRatio?.name || "Quick Test / CASA Buffer"}
                </td>
                <td className="p-4">
                  {metricsA.quickRatio ? (
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5 font-mono">
                        <span className="font-bold text-slate-800">{metricsA.quickRatio.value}</span>
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase border ${getHealthBadgeClass(metricsA.quickRatio.health)}`}>
                          {metricsA.quickRatio.health}
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-400 block leading-tight">{metricsA.quickRatio.description}</span>
                    </div>
                  ) : (
                    <span className="text-slate-400 font-mono">Not Sourced</span>
                  )}
                </td>
                <td className="p-4">
                  {metricsB.quickRatio ? (
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5 font-mono">
                        <span className="font-bold text-slate-800">{metricsB.quickRatio.value}</span>
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase border ${getHealthBadgeClass(metricsB.quickRatio.health)}`}>
                          {metricsB.quickRatio.health}
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-400 block leading-tight">{metricsB.quickRatio.description}</span>
                    </div>
                  ) : (
                    <span className="text-slate-400 font-mono">Not Sourced</span>
                  )}
                </td>
              </tr>

              {/* GROUP 3: CAPITAL SOLVENCY */}
              <tr className="bg-slate-50/50 font-bold text-slate-700 text-left">
                <td colSpan={3} className="px-4 py-3 text-[10px] uppercase tracking-wider bg-slate-100/50 border-y border-slate-200/50">
                  Capital Solvency & Debt Gearing
                </td>
              </tr>
              <tr className="hover:bg-slate-50/30 text-left">
                <td className="p-4 font-semibold text-slate-600">
                  {metricsA.debtEquity?.name || "Structural Leverage / CAR"}
                </td>
                <td className="p-4">
                  {metricsA.debtEquity ? (
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5 font-mono">
                        <span className="font-bold text-slate-800">{metricsA.debtEquity.value}</span>
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase border ${getHealthBadgeClass(metricsA.debtEquity.health)}`}>
                          {metricsA.debtEquity.health}
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-400 block leading-tight">{metricsA.debtEquity.description}</span>
                    </div>
                  ) : (
                    <span className="text-slate-400 font-mono">Not Sourced</span>
                  )}
                </td>
                <td className="p-4">
                  {metricsB.debtEquity ? (
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5 font-mono">
                        <span className="font-bold text-slate-800">{metricsB.debtEquity.value}</span>
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase border ${getHealthBadgeClass(metricsB.debtEquity.health)}`}>
                          {metricsB.debtEquity.health}
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-400 block leading-tight">{metricsB.debtEquity.description}</span>
                    </div>
                  ) : (
                    <span className="text-slate-400 font-mono">Not Sourced</span>
                  )}
                </td>
              </tr>
              <tr className="hover:bg-slate-50/30 text-left">
                <td className="p-4 font-semibold text-slate-600">
                  {metricsA.interestCoverage?.name || "Interest Coverage / Asset Health"}
                </td>
                <td className="p-4">
                  {metricsA.interestCoverage ? (
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5 font-mono">
                        <span className="font-bold text-slate-800">{metricsA.interestCoverage.value}</span>
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase border ${getHealthBadgeClass(metricsA.interestCoverage.health)}`}>
                          {metricsA.interestCoverage.health}
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-400 block leading-tight">{metricsA.interestCoverage.description}</span>
                    </div>
                  ) : (
                    <span className="text-slate-400 font-mono">Not Sourced</span>
                  )}
                </td>
                <td className="p-4">
                  {metricsB.interestCoverage ? (
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5 font-mono">
                        <span className="font-bold text-slate-800">{metricsB.interestCoverage.value}</span>
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase border ${getHealthBadgeClass(metricsB.interestCoverage.health)}`}>
                          {metricsB.interestCoverage.health}
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-400 block leading-tight">{metricsB.interestCoverage.description}</span>
                    </div>
                  ) : (
                    <span className="text-slate-400 font-mono">Not Sourced</span>
                  )}
                </td>
              </tr>

              {/* GROUP 4: OPERATIONAL EFFICIENCY */}
              <tr className="bg-slate-50/50 font-bold text-slate-700 text-left">
                <td colSpan={3} className="px-4 py-3 text-[10px] uppercase tracking-wider bg-slate-100/50 border-y border-slate-200/50">
                  Operating Efficiency & Capital Productivity
                </td>
              </tr>
              <tr className="hover:bg-slate-50/30 text-left">
                <td className="p-4 font-semibold text-slate-600">
                  {metricsA.roe?.name || "Return on Equity (ROE) / Net Interest Margin"}
                </td>
                <td className="p-4">
                  {metricsA.roe ? (
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5 font-mono">
                        <span className={`font-bold ${parseFloat(String(metricsA.roe.value)) > parseFloat(String(metricsB.roe?.value || 0)) ? "text-emerald-600" : "text-slate-800"}`}>
                          {metricsA.roe.value}%
                        </span>
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase border ${getHealthBadgeClass(metricsA.roe.health)}`}>
                          {metricsA.roe.health}
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-400 block leading-tight">{metricsA.roe.description}</span>
                    </div>
                  ) : (
                    <span className="text-slate-400 font-mono">Not Sourced</span>
                  )}
                </td>
                <td className="p-4">
                  {metricsB.roe ? (
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5 font-mono">
                        <span className={`font-bold ${parseFloat(String(metricsB.roe.value)) > parseFloat(String(metricsA.roe?.value || 0)) ? "text-emerald-600" : "text-slate-800"}`}>
                          {metricsB.roe.value}%
                        </span>
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase border ${getHealthBadgeClass(metricsB.roe.health)}`}>
                          {metricsB.roe.health}
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-400 block leading-tight">{metricsB.roe.description}</span>
                    </div>
                  ) : (
                    <span className="text-slate-400 font-mono">Not Sourced</span>
                  )}
                </td>
              </tr>
              <tr className="hover:bg-slate-50/30 text-left">
                <td className="p-4 font-semibold text-slate-600">
                  {metricsA.turnover?.name || "Asset Turnover / ROA productivity"}
                </td>
                <td className="p-4">
                  {metricsA.turnover ? (
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5 font-mono">
                        <span className="font-bold text-slate-800">{metricsA.turnover.value}</span>
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase border ${getHealthBadgeClass(metricsA.turnover.health)}`}>
                          {metricsA.turnover.health}
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-400 block leading-tight">{metricsA.turnover.description}</span>
                    </div>
                  ) : (
                    <span className="text-slate-400 font-mono">Not Sourced</span>
                  )}
                </td>
                <td className="p-4">
                  {metricsB.turnover ? (
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5 font-mono">
                        <span className="font-bold text-slate-800">{metricsB.turnover.value}</span>
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase border ${getHealthBadgeClass(metricsB.turnover.health)}`}>
                          {metricsB.turnover.health}
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-400 block leading-tight">{metricsB.turnover.description}</span>
                    </div>
                  ) : (
                    <span className="text-slate-400 font-mono">Not Sourced</span>
                  )}
                </td>
              </tr>

              {/* GROUP 5: LATEST AUDITED INCOME STATEMENT */}
              <tr className="bg-slate-50/50 font-bold text-slate-700 text-left">
                <td colSpan={3} className="px-4 py-3 text-[10px] uppercase tracking-wider bg-slate-100/50 border-y border-slate-200/50">
                  Latest Audited Financial Performance ({metricsA.latestFin.year || "FY2024"})
                </td>
              </tr>
              <tr className="hover:bg-slate-50/30 font-mono text-left">
                <td className="p-4 font-semibold text-slate-600 font-sans">Enterprise Total Revenue</td>
                <td className="p-4 font-bold text-slate-700">
                  {formatCurrency(metricsA.latestFin.revenue, stockA.currency)}
                </td>
                <td className="p-4 font-bold text-slate-700">
                  {formatCurrency(metricsB.latestFin.revenue, stockB.currency)}
                </td>
              </tr>
              <tr className="hover:bg-slate-50/30 font-mono text-left">
                <td className="p-4 font-semibold text-slate-600 font-sans">Net Compounded Profits</td>
                <td className="p-4 font-bold text-emerald-700">
                  {formatCurrency(metricsA.latestFin.netProfit, stockA.currency)}
                </td>
                <td className="p-4 font-bold text-emerald-700">
                  {formatCurrency(metricsB.latestFin.netProfit, stockB.currency)}
                </td>
              </tr>
              <tr className="hover:bg-slate-50/30 font-mono text-left">
                <td className="p-4 font-semibold text-slate-600 font-sans">Operating EBITDA Margin (%)</td>
                <td className="p-4">
                  <span className={`font-bold ${metricsA.latestFin.operatingMargin > metricsB.latestFin.operatingMargin ? "text-emerald-600" : "text-slate-800"}`}>
                    {metricsA.latestFin.operatingMargin}%
                  </span>
                </td>
                <td className="p-4">
                  <span className={`font-bold ${metricsB.latestFin.operatingMargin > metricsA.latestFin.operatingMargin ? "text-emerald-600" : "text-slate-800"}`}>
                    {metricsB.latestFin.operatingMargin}%
                  </span>
                </td>
              </tr>

              {/* GROUP 6: ANALYST RECOMMENDATIONS & FUTURES */}
              <tr className="bg-slate-50/50 font-bold text-slate-700 text-left">
                <td colSpan={3} className="px-4 py-3 text-[10px] uppercase tracking-wider bg-slate-100/50 border-y border-slate-200/50">
                  Analyst Consensus & 3-Year Targets
                </td>
              </tr>
              <tr className="hover:bg-slate-50/30 text-left">
                <td className="p-4 font-semibold text-slate-600">Research Note Commentary</td>
                <td className="p-4 text-xs font-normal text-slate-600 leading-normal">
                  {stockA.investmentResearchSummary}
                </td>
                <td className="p-4 text-xs font-normal text-slate-600 leading-normal">
                  {stockB.investmentResearchSummary}
                </td>
              </tr>
              <tr className="hover:bg-slate-50/30 text-left">
                <td className="p-4 font-semibold text-slate-600">3-Yr Projected Share Destination</td>
                <td className="p-4 font-mono font-bold text-slate-800">
                  {stockA.currency === "INR" ? "₹" : "$"}{(stockA.futureGrowth?.years?.slice(-1)[0]?.predictedSharePrice || 0).toFixed(0)}
                  {typeof stockA.currentPrice === "number" ? (
                    <span className="text-[10px] text-emerald-600 block font-sans font-medium mt-0.5">
                      +{(((stockA.futureGrowth?.years?.slice(-1)[0]?.predictedSharePrice || 0) - stockA.currentPrice) / stockA.currentPrice * 100).toFixed(1)}% Appr.
                    </span>
                  ) : (
                    <span className="text-[10px] text-slate-400 block font-sans font-medium mt-0.5">
                      Live delta unavailable
                    </span>
                  )}
                </td>
                <td className="p-4 font-mono font-bold text-slate-800">
                  {stockB.currency === "INR" ? "₹" : "$"}{(stockB.futureGrowth?.years?.slice(-1)[0]?.predictedSharePrice || 0).toFixed(0)}
                  {typeof stockB.currentPrice === "number" ? (
                    <span className="text-[10px] text-emerald-600 block font-sans font-medium mt-0.5">
                      +{(((stockB.futureGrowth?.years?.slice(-1)[0]?.predictedSharePrice || 0) - stockB.currentPrice) / stockB.currentPrice * 100).toFixed(1)}% Appr.
                    </span>
                  ) : (
                    <span className="text-[10px] text-slate-400 block font-sans font-medium mt-0.5">
                      Live delta unavailable
                    </span>
                  )}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Synchronized Recharts Graphics Comparison Section */}
      <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div className="space-y-1 text-left">
            <h3 className="text-md font-bold text-slate-800 flex items-center gap-1.5">
              <BarChart2 className="w-5 h-5 text-emerald-600" />
              Dynamic side-by-side Trend Analytics
            </h3>
            <p className="text-slate-500 text-xs">
              Synchronized visual graphs of raw corporate reports and predicted valuation pathways.
            </p>
          </div>

          <div className="inline-flex rounded-lg p-0.5 bg-slate-100/80 text-xs self-start md:self-auto border border-slate-200/40">
            <button
              type="button"
              onClick={() => setChartMetric("revenue")}
              className={`px-3 py-1.5 rounded-md font-semibold transition-all cursor-pointer ${
                chartMetric === "revenue"
                  ? "bg-white text-emerald-700 shadow-xs"
                  : "text-slate-500 hover:text-slate-850"
              }`}
            >
              Revenues (Cr)
            </button>
            <button
              type="button"
              onClick={() => setChartMetric("profit")}
              className={`px-3 py-1.5 rounded-md font-semibold transition-all cursor-pointer ${
                chartMetric === "profit"
                  ? "bg-white text-emerald-700 shadow-xs"
                  : "text-slate-500 hover:text-slate-850"
              }`}
            >
              Net Profits (Cr)
            </button>
            <button
              type="button"
              onClick={() => setChartMetric("future")}
              className={`px-3 py-1.5 rounded-md font-semibold transition-all cursor-pointer ${
                chartMetric === "future"
                  ? "bg-white text-emerald-700 shadow-xs"
                  : "text-slate-500 hover:text-slate-850"
              }`}
            >
              Predicted Prices Target
            </button>
          </div>
        </div>

        <div className="h-[280px]">
          <ResponsiveContainer width="100%" height="100%">
            {chartMetric === "future" ? (
              <LineChart data={futureChartData} margin={{ top: 15, right: 15, left: 10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="year" tickLine={false} axisLine={false} tick={{ fill: '#64748b', fontSize: 11 }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fill: '#64748b', fontSize: 11 }} />
                <Tooltip 
                  contentStyle={{ borderRadius: "12px", border: "1px solid #f1f5f9", boxShadow: "0 1px 2px 0 rgba(0,0,0,0.05)" }}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey={`${stockA.symbol}_Prediction`} 
                  name={`${stockA.symbol} Predicted Target`} 
                  stroke="#10b981" 
                  strokeWidth={3} 
                  dot={{ r: 4 }} 
                />
                <Line 
                  type="monotone" 
                  dataKey={`${stockB.symbol}_Prediction`} 
                  name={`${stockB.symbol} Predicted Target`} 
                  stroke="#3b82f6" 
                  strokeWidth={3} 
                  dot={{ r: 4 }} 
                />
              </LineChart>
            ) : (
              <BarChart data={historicalChartData} margin={{ top: 15, right: 15, left: 10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="year" tickLine={false} axisLine={false} tick={{ fill: '#64748b', fontSize: 11 }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fill: '#64748b', fontSize: 11 }} />
                <Tooltip 
                  contentStyle={{ borderRadius: "12px", border: "1px solid #f1f5f9", boxShadow: "0 1px 2px 0 rgba(0,0,0,0.05)" }}
                  formatter={(val: any) => [`₹${Number(val).toLocaleString()} Crore`, ""]}
                />
                <Legend />
                <Bar 
                  dataKey={chartMetric === "revenue" ? `${stockA.symbol}_Revenue` : `${stockA.symbol}_NetProfit`} 
                  name={`${stockA.symbol} ${chartMetric === "revenue" ? "Revenue" : "Net Profit"}`} 
                  fill="#10b981" 
                  radius={[4, 4, 0, 0]} 
                />
                <Bar 
                  dataKey={chartMetric === "revenue" ? `${stockB.symbol}_Revenue` : `${stockB.symbol}_NetProfit`} 
                  name={`${stockB.symbol} ${chartMetric === "revenue" ? "Revenue" : "Net Profit"}`} 
                  fill="#3b82f6" 
                  radius={[4, 4, 0, 0]} 
                />
              </BarChart>
            )}
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
