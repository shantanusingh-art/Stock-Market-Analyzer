import React, { useState } from "react";
import { StockAnalysis } from "../types";
import { PRECOMPILED_STOCKS } from "../data";
import { VERIFIED_SYMBOL_REGISTRY } from "../symbolRegistry";
import SplitScreenStockComparison from "./SplitScreenStockComparison";
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Legend, LineChart, Line 
} from "recharts";
import { 
  Search, TrendingUp, DollarSign, Award, Target,
  Percent, RefreshCw, BarChart2, ShieldAlert, CheckCircle, HelpCircle,
  BookOpen, Users, Landmark, AlertTriangle, Scale
} from "lucide-react";

interface StockPerformanceTabProps {
  activeStock: StockAnalysis;
  setActiveStock: (stock: StockAnalysis) => void;
}

function StockSkeletonLoader() {
  return (
    <div id="stock-skeleton-loader" className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-pulse">
      {/* Left Column: Essential Metrics & Financial Statements */}
      <div className="lg:col-span-2 space-y-8">
        
        {/* Key Facts Card Skeleton */}
        <div className="bg-white rounded-2xl p-6 border border-slate-100 space-y-4 shadow-xs">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <div className="h-5 w-20 bg-slate-200 rounded-full"></div>
              <div className="h-7 w-48 bg-slate-200 rounded-md"></div>
              <div className="h-4 w-16 bg-slate-100 rounded-sm"></div>
            </div>
            <div className="text-right space-y-2">
              <div className="h-4 w-24 bg-slate-200 rounded-sm ml-auto"></div>
              <div className="h-8 w-28 bg-slate-200 rounded-md ml-auto"></div>
              <div className="h-3 w-20 bg-slate-100 rounded-sm ml-auto"></div>
            </div>
          </div>
          
          <div className="bg-slate-50/50 p-4 rounded-xl border border-slate-100 space-y-2">
            <div className="h-4 bg-slate-200 rounded-sm w-full"></div>
            <div className="h-4 bg-slate-200 rounded-sm w-5/6"></div>
            <div className="h-4 bg-slate-200 rounded-sm w-4/5"></div>
          </div>

          {/* Micro metrics grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-slate-100 p-3 rounded-xl border border-slate-100 space-y-1.5">
                <div className="h-3 w-16 bg-slate-200 rounded-sm"></div>
                <div className="h-5 w-20 bg-slate-300 rounded-md"></div>
              </div>
            ))}
          </div>
        </div>

        {/* Past growth trends Chart Skeleton */}
        <div className="bg-white rounded-2xl p-6 border border-slate-100 space-y-6 shadow-xs">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 bg-slate-200 rounded-full"></div>
            <div className="h-5 w-60 bg-slate-200 rounded-md"></div>
          </div>
          <div className="h-[250px] bg-slate-50 rounded-xl flex items-end p-4 gap-6">
            <div className="w-full h-1/3 bg-slate-200 rounded-t-lg"></div>
            <div className="w-full h-1/2 bg-slate-200 rounded-t-lg"></div>
            <div className="w-full h-2/3 bg-slate-200 rounded-t-lg"></div>
            <div className="w-full h-3/4 bg-slate-200 rounded-t-lg"></div>
            <div className="w-full h-full bg-slate-300 rounded-t-lg"></div>
          </div>
          <div className="space-y-3">
            <div className="h-4 bg-slate-200 rounded-sm w-full"></div>
            <div className="h-4 bg-slate-100 rounded-sm w-full"></div>
            <div className="h-4 bg-slate-100 rounded-sm w-full"></div>
          </div>
        </div>

        {/* Competitors Benchmarking Skeleton */}
        <div className="bg-white rounded-2xl p-6 border border-slate-100 space-y-4 shadow-xs">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 bg-slate-200 rounded-full"></div>
            <div className="h-5 w-72 bg-slate-200 rounded-md"></div>
          </div>
          <div className="h-3 w-64 bg-slate-100 rounded-sm"></div>
          <div className="space-y-3 mt-4">
            <div className="h-8 bg-slate-200 rounded-md w-full"></div>
            <div className="h-10 bg-slate-100 rounded-md w-full"></div>
            <div className="h-10 bg-slate-200 rounded-md w-full"></div>
            <div className="h-10 bg-slate-100 rounded-md w-full"></div>
          </div>
        </div>

        {/* Ratios Skeleton */}
        <div className="bg-white rounded-2xl p-6 border border-slate-100 space-y-6 shadow-xs">
          <div className="w-56 h-5 bg-slate-200 rounded-md"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((col) => (
              <div key={col} className="space-y-4">
                <div className="border-b border-slate-100 pb-2 space-y-1">
                  <div className="h-4 w-28 bg-slate-200 rounded-sm"></div>
                  <div className="h-3 w-40 bg-slate-100 rounded-sm"></div>
                </div>
                <div className="space-y-3">
                  {[1, 2].map((row) => (
                    <div key={row} className="bg-slate-50 p-3 rounded-xl border border-slate-100 space-y-2">
                      <div className="flex justify-between items-center">
                        <div className="h-4 w-20 bg-slate-200 rounded-sm"></div>
                        <div className="h-4 w-12 bg-slate-200 rounded-full"></div>
                      </div>
                      <div className="flex justify-between items-baseline mt-2">
                        <div className="h-6 w-14 bg-slate-300 rounded-md"></div>
                        <div className="h-3 w-16 bg-slate-100 rounded-sm"></div>
                      </div>
                      <div className="h-3 w-full bg-slate-100 rounded-sm"></div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Right Column: Dividend, Predictions, Summaries Skeletons */}
      <div className="space-y-8">
        
        {/* Dividend Skeleton */}
        <div className="bg-white rounded-2xl p-6 border border-slate-100 space-y-4 shadow-xs">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 bg-slate-200 rounded-full"></div>
            <div className="h-5 w-48 bg-slate-200 rounded-md"></div>
          </div>
          <div className="h-12 bg-slate-50 rounded-xl"></div>
          <div className="space-y-3 pt-2">
            <div className="h-8 bg-slate-100 rounded-md"></div>
            <div className="h-8 bg-slate-100 rounded-md"></div>
            <div className="h-8 bg-slate-100 rounded-md"></div>
          </div>
        </div>

        {/* Future prediction Skeleton */}
        <div className="bg-white rounded-2xl p-6 border border-slate-100 space-y-4 shadow-xs">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 bg-slate-200 rounded-full"></div>
            <div className="h-5 w-56 bg-slate-200 rounded-md"></div>
          </div>
          <div className="h-[180px] bg-slate-50 rounded-xl flex items-center justify-center">
            <div className="w-11/12 h-2 bg-slate-200 rounded-full relative animate-pulse">
              <div className="absolute right-1/4 top-1/2 -translate-y-1/2 w-3 h-3 bg-slate-300 rounded-full"></div>
              <div className="absolute left-1/3 top-1/2 -translate-y-1/2 w-3 h-3 bg-slate-300 rounded-full"></div>
            </div>
          </div>
          <div className="space-y-3">
            <div className="h-8 bg-slate-100 rounded-md"></div>
            <div className="h-8 bg-slate-100 rounded-md"></div>
            <div className="h-8 bg-slate-100 rounded-md"></div>
          </div>
        </div>

        {/* Research summary Skeleton */}
        <div className="bg-white rounded-2xl p-6 border border-slate-100 space-y-4 shadow-xs">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 bg-slate-200 rounded-full"></div>
            <div className="h-5 w-44 bg-slate-200 rounded-md"></div>
          </div>
          <div className="space-y-2">
            <div className="h-3 bg-slate-200 rounded-sm w-full"></div>
            <div className="h-3 bg-slate-200 rounded-sm w-full"></div>
            <div className="h-3 bg-slate-200 rounded-sm w-4/5"></div>
            <div className="h-3 bg-slate-100 rounded-sm w-3/4"></div>
            <div className="h-3 bg-slate-100 rounded-sm w-5/6"></div>
          </div>
        </div>

      </div>
    </div>
  );
}

interface RiskMetrics {
  liquidityScore: number;
  solvencyScore: number;
  overallScore: number;
  riskTier: "Low" | "Medium" | "High";
  riskColor: string;
  riskBg: string;
  riskBorder: string;
  verdict: string;
}

function computeRiskMetrics(stock: StockAnalysis): RiskMetrics {
  const healthToScore = (health?: string): number => {
    if (!health) return 60;
    const h = health.toLowerCase();
    if (h.includes("excellent") || h.includes("outstanding")) return 95;
    if (h.includes("strong") || h.includes("optimal") || h.includes("good")) return 85;
    if (h.includes("stable") || h.includes("average") || h.includes("moderate")) return 65;
    if (h.includes("below average") || h.includes("weak") || h.includes("low")) return 35;
    if (h.includes("distressed") || h.includes("poor") || h.includes("critical")) return 15;
    return 60;
  };

  const liquidityItems = stock.ratios?.liquidity || [];
  const solvencyItems = stock.ratios?.solvency || [];

  const liqScores = liquidityItems.map(item => healthToScore(item.health));
  const solScores = solvencyItems.map(item => healthToScore(item.health));

  const avgLiq = liqScores.length > 0
    ? liqScores.reduce((a, b) => a + b, 0) / liqScores.length
    : 75;

  const avgSol = solScores.length > 0
    ? solScores.reduce((a, b) => a + b, 0) / solScores.length
    : 80;

  const stabilityRating = Math.round(avgLiq * 0.4 + avgSol * 0.6);
  const overallScore = 100 - stabilityRating;

  let riskTier: "Low" | "Medium" | "High";
  let riskColor: string;
  let riskBg: string;
  let riskBorder: string;
  let verdict: string;

  if (overallScore <= 22) {
    riskTier = "Low";
    riskColor = "text-emerald-700 bg-emerald-50 border-emerald-200";
    riskBg = "bg-emerald-600";
    riskBorder = "border-emerald-150";
    verdict = `Highly Defensive Profile: ${stock.companyName} shows exceptional capital solvency and an outstanding liquidity cushion. The operational cash flow is highly robust against severe macro-economic stress.`;
  } else if (overallScore <= 45) {
    riskTier = "Medium";
    riskColor = "text-amber-700 bg-amber-50 border-amber-200";
    riskBg = "bg-amber-500";
    riskBorder = "border-amber-150";
    verdict = `Balanced/Moderate Risk Profile: Solvency is well within regulatory and industry standards. While short-term liquidity cycles may occasionally fluctuate during growth phases, the general structural capital remains secure.`;
  } else {
    riskTier = "High";
    riskColor = "text-rose-700 bg-rose-50 border-rose-200";
    riskBg = "bg-rose-600";
    riskBorder = "border-rose-150";
    verdict = `Leveraged/Turnaround Profile: High leverage relative to assets or lower interest/debt-servicing indicators are present. Capital expenditure relies heavily on external debt, raising exposure to interest rate hikes and credit tightening.`;
  }

  return {
    liquidityScore: Math.round(avgLiq),
    solvencyScore: Math.round(avgSol),
    overallScore,
    riskTier,
    riskColor,
    riskBg,
    riskBorder,
    verdict
  };
}

export default function StockPerformanceTab({ activeStock, setActiveStock }: StockPerformanceTabProps) {
  const [tickerInput, setTickerInput] = useState("");
  const [sectorInput, setSectorInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Filter registry entries matching current prefix or query
  const suggestions = React.useMemo(() => {
    const query = tickerInput.trim().toUpperCase();
    if (!query) return [];
    const matched = VERIFIED_SYMBOL_REGISTRY.filter(
      (entry) =>
        entry.ticker.toUpperCase().includes(query) ||
        entry.name.toUpperCase().includes(query)
    );
    // Deduplicate suggestions by ticker to prevent duplicate items
    const seen = new Set<string>();
    const uniqueMatches: typeof matched = [];
    for (const item of matched) {
      if (!seen.has(item.ticker)) {
        seen.add(item.ticker);
        uniqueMatches.push(item);
      }
    }
    return uniqueMatches.slice(0, 6);
  }, [tickerInput]);
  const [error, setError] = useState<string | null>(null);
  const [loadingSteps, setLoadingSteps] = useState<string>("");
  const [retryAttempt, setRetryAttempt] = useState<number>(0);
  const [retryStatus, setRetryStatus] = useState<string | null>(null);

  // 5-minute cache per ticker
  const stockCacheRef = React.useRef<Map<string, { data: any; timestamp: number }>>(new Map());

  // Compare mode state
  const [isCompareMode, setIsCompareMode] = useState(false);
  const [comparisonStockSymbol, setComparisonStockSymbol] = useState<string>("RELIANCE");

  const comparisonStock = React.useMemo(() => {
    const symbol = comparisonStockSymbol === activeStock.symbol 
      ? Object.keys(PRECOMPILED_STOCKS).find((s) => s !== activeStock.symbol) || "TCS"
      : comparisonStockSymbol;
    return PRECOMPILED_STOCKS[symbol] || PRECOMPILED_STOCKS["RELIANCE"] || Object.values(PRECOMPILED_STOCKS)[0];
  }, [comparisonStockSymbol, activeStock.symbol]);

  const metrics = React.useMemo(() => {
    return computeRiskMetrics(activeStock);
  }, [activeStock]);

  const [chartTab, setChartTab] = useState<"price" | "growth" | "absolute">("price");
  const [dateRange, setDateRange] = useState<"1M" | "6M" | "1Y" | "5Y">("5Y");

  const chartTimelineData = React.useMemo(() => {
    if (!activeStock || !activeStock.financials) return [];
    
    // Sort financials in chronological order (e.g. 2022, 2023, 2024)
    const sortedFinancials = [...activeStock.financials].sort((a, b) => parseInt(a.year) - parseInt(b.year));
    
    // Seeded random number generator
    const createSeededRandom = (seedString: string) => {
      let h = 2166136261 >>> 0;
      for (let i = 0; i < seedString.length; i++) {
        h ^= seedString.charCodeAt(i);
        h = Math.imul(h, 16777619);
      }
      return function() {
        h += 0xeac8c3e6;
        h ^= h >>> 15;
        h = Math.imul(h, 0x5115baeb);
        h ^= h >>> 15;
        return ((h >>> 0) % 100000) / 100000;
      };
    };

    const seededRand = createSeededRandom(activeStock.symbol + dateRange);
    const latestFinancial = sortedFinancials[sortedFinancials.length - 1] || { revenue: 100000, netProfit: 10000, operatingMargin: 15, year: "2024" };
    const numericPrice = typeof activeStock.currentPrice === "number" ? activeStock.currentPrice : 1500;
    
    if (dateRange === "1M") {
      const points: any[] = [];
      const endDate = new Date(2026, 5, 14); // June 14, 2026
      const count = 20; // number of granular trading days
      
      const startFactor = 0.94 + seededRand() * 0.08; // 0.94 - 1.02
      
      for (let i = 0; i < count; i++) {
        const d = new Date(endDate);
        d.setDate(d.getDate() - (count - 1 - i) * 1.5);
        const label = d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
        
        const baseFactor = startFactor + (1.0 - startFactor) * (i / (count - 1));
        const wave = Math.sin((i / (count - 1)) * Math.PI * 2) * 0.015;
        const noise = (seededRand() - 0.5) * 0.01;
        const finalAdj = i === count - 1 ? 1.0 : (baseFactor + wave + noise);
        
        const estimatedPrice = +(numericPrice * finalAdj).toFixed(2);
        
        // Monthly run rate
        const revBase = latestFinancial.revenue / 12;
        const profitBase = latestFinancial.netProfit / 12;
        const revenue = +(revBase * (1 + (seededRand() - 0.5) * 0.02)).toFixed(1);
        const netProfit = +(profitBase * (1 + (seededRand() - 0.5) * 0.03)).toFixed(1);
        
        const operatingMargin = +(latestFinancial.operatingMargin + (seededRand() - 0.5) * 0.3).toFixed(1);
        const revenueGrowth = +( (latestFinancial ? 8.5 : 10) + (seededRand() - 0.5) * 1.0 ).toFixed(1);
        const profitGrowth = +( (latestFinancial ? 9.2 : 11) + (seededRand() - 0.5) * 1.5 ).toFixed(1);
        
        points.push({
          year: label,
          revenue,
          netProfit,
          revenueGrowth,
          profitGrowth,
          operatingMargin,
          estimatedPrice
        });
      }
      return points;
    }

    if (dateRange === "6M") {
      const points: any[] = [];
      const endDate = new Date(2026, 5, 14); // June 14, 2026
      const count = 12; // bi-weekly points
      
      const startFactor = 0.88 + seededRand() * 0.12; // 0.88 - 1.0
      
      for (let i = 0; i < count; i++) {
        const d = new Date(endDate);
        d.setDate(d.getDate() - (count - 1 - i) * 16);
        const label = d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
        
        const baseFactor = startFactor + (1.0 - startFactor) * (i / (count - 1));
        const wave = Math.sin((i / (count - 1)) * Math.PI * 3) * 0.03;
        const noise = (seededRand() - 0.5) * 0.02;
        const finalAdj = i === count - 1 ? 1.0 : (baseFactor + wave + noise);
        
        const estimatedPrice = +(numericPrice * finalAdj).toFixed(2);
        
        // Semi-annual/bi-monthly run rate
        const revBase = latestFinancial.revenue / 6;
        const profitBase = latestFinancial.netProfit / 6;
        const revenue = +(revBase * (1 + (seededRand() - 0.5) * 0.03)).toFixed(1);
        const netProfit = +(profitBase * (1 + (seededRand() - 0.5) * 0.04)).toFixed(1);
        
        const operatingMargin = +(latestFinancial.operatingMargin + (seededRand() - 0.5) * 0.6).toFixed(1);
        const revenueGrowth = +( (latestFinancial ? 8.5 : 10) + (seededRand() - 0.5) * 1.5 ).toFixed(1);
        const profitGrowth = +( (latestFinancial ? 9.2 : 11) + (seededRand() - 0.5) * 2.0 ).toFixed(1);
        
        points.push({
          year: label,
          revenue,
          netProfit,
          revenueGrowth,
          profitGrowth,
          operatingMargin,
          estimatedPrice
        });
      }
      return points;
    }

    if (dateRange === "1Y") {
      const points: any[] = [];
      const endDate = new Date(2026, 5, 14); // June 14, 2026
      const count = 12; // monthly points
      
      const startFactor = 0.82 + seededRand() * 0.14; // 0.82 - 0.96
      
      for (let i = 0; i < count; i++) {
        const d = new Date(endDate);
        d.setMonth(d.getMonth() - (count - 1 - i));
        const label = d.toLocaleDateString("en-US", { month: "short", year: "2-digit" }).replace(" ", " '");
        
        const baseFactor = startFactor + (1.0 - startFactor) * (i / (count - 1));
        const wave = Math.sin((i / (count - 1)) * Math.PI * 2.5) * 0.05;
        const noise = (seededRand() - 0.5) * 0.03;
        const finalAdj = i === count - 1 ? 1.0 : (baseFactor + wave + noise);
        
        const estimatedPrice = +(numericPrice * finalAdj).toFixed(2);
        
        // Monthly run rate
        const revBase = latestFinancial.revenue / 12;
        const profitBase = latestFinancial.netProfit / 12;
        const progressRatio = 0.9 + 0.2 * (i / (count - 1));
        const revenue = +(revBase * progressRatio * (1 + (seededRand() - 0.5) * 0.03)).toFixed(1);
        const netProfit = +(profitBase * progressRatio * (1 + (seededRand() - 0.5) * 0.04)).toFixed(1);
        
        const operatingMargin = +(latestFinancial.operatingMargin + (seededRand() - 0.5) * 1.0).toFixed(1);
        const revenueGrowth = +( (latestFinancial ? 8.5 : 10) + (seededRand() - 0.5) * 2.5 ).toFixed(1);
        const profitGrowth = +( (latestFinancial ? 9.2 : 11) + (seededRand() - 0.5) * 3.0 ).toFixed(1);
        
        points.push({
          year: label,
          revenue,
          netProfit,
          revenueGrowth,
          profitGrowth,
          operatingMargin,
          estimatedPrice
        });
      }
      return points;
    }

    // Default "5Y"
    const points: any[] = [];
    const count = 20; // 20 quarters
    const startYear = 2021;
    const startQuarter = 2; // Q2 2021 to Q2 2026
    
    const startFactor = 0.40 + seededRand() * 0.20; // 0.40 - 0.60
    
    const getAnnualBase = (targetYear: number) => {
      const earliest = sortedFinancials[0] || { revenue: 100000, netProfit: 10000, operatingMargin: 15, year: "2024" };
      const latest = sortedFinancials[sortedFinancials.length - 1] || { revenue: 100000, netProfit: 10000, operatingMargin: 15, year: "2024" };
      const earliestYear = parseInt(earliest.year) || 2024;
      const latestYear = parseInt(latest.year) || 2024;

      if (targetYear < earliestYear) {
        const diff = earliestYear - targetYear;
        return {
          revenue: earliest.revenue * Math.pow(0.88, diff),
          netProfit: earliest.netProfit * Math.pow(0.85, diff),
          operatingMargin: earliest.operatingMargin - diff * 0.5,
          year: String(targetYear)
        };
      } else if (targetYear > latestYear) {
        const diff = targetYear - latestYear;
        return {
          revenue: latest.revenue * Math.pow(1.09, diff),
          netProfit: latest.netProfit * Math.pow(1.11, diff),
          operatingMargin: latest.operatingMargin + diff * 0.3,
          year: String(targetYear)
        };
      } else {
        const exact = sortedFinancials.find(f => parseInt(f.year) === targetYear);
        if (exact) return exact;
        const lower = [...sortedFinancials].reverse().find(f => parseInt(f.year) < targetYear);
        const upper = sortedFinancials.find(f => parseInt(f.year) > targetYear);
        if (lower && upper) {
          const t = (targetYear - parseInt(lower.year)) / (parseInt(upper.year) - parseInt(lower.year));
          return {
            revenue: lower.revenue + t * (upper.revenue - lower.revenue),
            netProfit: lower.netProfit + t * (upper.netProfit - lower.netProfit),
            operatingMargin: lower.operatingMargin + t * (upper.operatingMargin - lower.operatingMargin),
            year: String(targetYear)
          };
        }
        return latest;
      }
    };

    for (let i = 0; i < count; i++) {
      const qIndex = (startQuarter + i) % 4 + 1;
      const yr = startYear + Math.floor((startQuarter + i) / 4);
      const label = `${yr} Q${qIndex}`;
      
      const baseFactor = startFactor + (1.0 - startFactor) * (i / (count - 1));
      const wave = Math.sin((i / (count - 1)) * Math.PI * 4.5) * 0.08;
      const noise = (seededRand() - 0.5) * 0.04;
      const finalAdj = i === count - 1 ? 1.0 : (baseFactor + wave + noise);
      
      const estimatedPrice = +(numericPrice * finalAdj).toFixed(2);
      
      const annualData = getAnnualBase(yr);
      const prevAnnualData = getAnnualBase(yr - 1);
      
      const revenue = +(annualData.revenue / 4 * (1 + (seededRand() - 0.5) * 0.04)).toFixed(1);
      const netProfit = +(annualData.netProfit / 4 * (1 + (seededRand() - 0.5) * 0.05)).toFixed(1);
      
      const operatingMargin = +(annualData.operatingMargin + (seededRand() - 0.5) * 1.2).toFixed(1);
      const revenueGrowth = +(((annualData.revenue - prevAnnualData.revenue) / prevAnnualData.revenue) * 100).toFixed(1);
      const profitGrowth = +(((annualData.netProfit - prevAnnualData.netProfit) / prevAnnualData.netProfit) * 100).toFixed(1);
      
      points.push({
        year: label,
        revenue,
        netProfit,
        revenueGrowth,
        profitGrowth,
        operatingMargin,
        estimatedPrice
      });
    }
    return points;
  }, [activeStock, dateRange]);

  const triggerLiveStockFetch = async (symbolToFetch: string, sectorHint: string = "", forceFresh: boolean = false) => {
    const cleanSymbol = symbolToFetch.trim().toUpperCase();
    if (!cleanSymbol) return;

    fetchedSymbolRef.current = cleanSymbol;

    // Check 5-minute cache per ticker unless forceFresh requested
    if (!forceFresh && stockCacheRef.current.has(cleanSymbol)) {
      const cached = stockCacheRef.current.get(cleanSymbol)!;
      if (Date.now() - cached.timestamp < 5 * 60 * 1000) {
        setActiveStock(cached.data);
        setError(null);
        setRetryStatus(null);
        return;
      }
    }

    setRetryAttempt(0);
    setRetryStatus(null);
    setLoading(true);
    setError(null);
    setLoadingSteps("Initiating Live Yahoo Finance Proxy Fetch...");
    
    const steps = [
      "Accessing active exchange tickers...",
      "Scraping latest financial reports...",
      "Calculating liquidity & solvency ratios...",
      "Benchmarking competitors within the sector...",
      "Formulating 3-year growth predictions...",
      "Generating professional institutional analyst report..."
    ];

    let stepIndex = 0;
    const interval = setInterval(() => {
      if (stepIndex < steps.length) {
        setLoadingSteps(steps[stepIndex]);
        stepIndex++;
      }
    }, 1500);

    try {
      const response = await fetch("/api/analyze-stock", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          symbol: cleanSymbol, 
          sector: sectorHint.trim() 
        })
      });

      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error(`Live data unavailable for ${cleanSymbol} — please verify the symbol.`);
      }

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || `Live data unavailable for ${cleanSymbol} — please verify the symbol.`);
      }

      // Cache valid response for 5 minutes
      stockCacheRef.current.set(cleanSymbol, { data, timestamp: Date.now() });
      setActiveStock(data);
      setRetryAttempt(0);
      setRetryStatus(null);
    } catch (err: any) {
      console.warn("Stock fetch error:", err.message || err);
      const errMsg = err.message || `Live data unavailable for ${cleanSymbol} — please verify the symbol.`;
      setError(errMsg);
      setRetryStatus(null);
    } finally {
      clearInterval(interval);
      setLoading(false);
      setLoadingSteps("");
    }
  };

  // On mount or stock symbol change, attempt initial live fetch if not already loading or errored
  const fetchedSymbolRef = React.useRef<string | null>(null);
  React.useEffect(() => {
    if (activeStock?.symbol && !activeStock.isRealTime && fetchedSymbolRef.current !== activeStock.symbol) {
      fetchedSymbolRef.current = activeStock.symbol;
      triggerLiveStockFetch(activeStock.symbol);
    }
  }, [activeStock?.symbol]);

  const handleQuickSelect = (symbol: string) => {
    triggerLiveStockFetch(symbol);
  };

  const handleCustomSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tickerInput.trim()) return;
    await triggerLiveStockFetch(tickerInput, sectorInput);
    setTickerInput("");
    setSectorInput("");
  };

  const handleSelectSuggestion = (ticker: string, sector: string) => {
    setTickerInput(ticker);
    setSectorInput(sector || "");
    setShowSuggestions(false);
    triggerLiveStockFetch(ticker, sector || "");
  };

  // Helper to render markdown beautifully
  const renderMarkdown = (text: string) => {
    if (!text) return null;
    const lines = text.split("\n");
    return lines.map((line, idx) => {
      const trimmed = line.trim();
      if (trimmed.startsWith("###")) {
        return (
          <h4 key={idx} className="text-lg font-semibold text-slate-800 mt-6 mb-2 border-b border-slate-100 pb-1 flex items-center gap-2">
            <span className="w-1.5 h-4 bg-emerald-600 rounded-full"></span>
            {trimmed.replace(/^###\s+/, "")}
          </h4>
        );
      } else if (trimmed.startsWith("##")) {
        return (
          <h3 key={idx} className="text-xl font-bold text-slate-900 mt-8 mb-3 flex items-center gap-2">
            {trimmed.replace(/^##\s+/, "")}
          </h3>
        );
      } else if (trimmed.startsWith("-") || trimmed.startsWith("*")) {
        return (
          <li key={idx} className="text-sm text-slate-600 ml-4 list-disc my-1.5 leading-relaxed">
            {trimmed.substring(1).trim()}
          </li>
        );
      } else if (trimmed === "") {
        return <div key={idx} className="h-2"></div>;
      } else {
        // Simple search for bold inline texts
        let element: React.ReactNode = trimmed;
        if (trimmed.includes("**")) {
          const parts = trimmed.split("**");
          element = parts.map((part, pIdx) => pIdx % 2 === 1 ? <strong key={pIdx} className="font-semibold text-slate-900">{part}</strong> : part);
        }
        return <p key={idx} className="text-sm text-slate-600 leading-relaxed my-2">{element}</p>;
      }
    });
  };

  const getHealthColor = (health: string) => {
    const h = health.toLowerCase();
    if (h.includes("excellent") || h.includes("strong") || h.includes("optimal") || h.includes("good")) {
      return "bg-emerald-50 text-emerald-700 border-emerald-200";
    }
    if (h.includes("average") || h.includes("stable") || h.includes("moderate")) {
      return "bg-amber-50 text-amber-700 border-amber-200";
    }
    return "bg-rose-50 text-rose-700 border-rose-200";
  };

  const getHealthIcon = (health: string) => {
    const h = health.toLowerCase();
    if (h.includes("excellent") || h.includes("strong") || h.includes("optimal") || h.includes("good")) {
      return <CheckCircle className="w-4 h-4 text-emerald-600" />;
    }
    if (h.includes("average") || h.includes("stable") || h.includes("moderate")) {
      return <HelpCircle className="w-4 h-4 text-amber-600" />;
    }
    return <ShieldAlert className="w-4 h-4 text-rose-600" />;
  };

  // Format big numbers like INR Cr nicely
  const formatAmount = (num: number, currency: string) => {
    if (num >= 100000) {
      return `${currency === "INR" ? "₹" : "$"}${(num / 100000).toFixed(2)}L Cr`;
    }
    if (num >= 1000) {
      return `${currency === "INR" ? "₹" : "$"}${(num / 1000).toFixed(2)} Cr`;
    }
    return `${currency === "INR" ? "₹" : "$"}${num.toLocaleString()}`;
  };

  return (
    <div className="space-y-8" id="stock-analyzer-section">
      {/* Search Header Container */}
      <div className="bg-white rounded-2xl p-6 shadow-xs border border-slate-100">
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6 pb-6 border-b border-sidebar-divider border-slate-150">
          <div className="space-y-1">
            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
              <RefreshCw className="w-5 h-5 text-emerald-600 animate-spin-slow" />
              Analyze Any Stock Instantly
            </h2>
            <p className="text-slate-500 text-sm">
              Quickly select top Nifty/Sensex leaders, or dynamically fetch any custom national/international ticker symbol in real-time.
            </p>
            <div className="flex items-center gap-2 pt-1">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-[10px] font-bold text-emerald-600 tracking-wider uppercase font-mono">
                Direct Real-Time Backend Crawler Connection Active
              </span>
            </div>
          </div>

          {/* Quick Dynamic Search Bar Embedded directly in the Tab Header */}
          <div className="w-full lg:w-96">
            <form onSubmit={handleCustomSearch} className="flex flex-col sm:flex-row gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  id="tab-header-ticker-search"
                  placeholder="Ticker Symbol (e.g. TCS, GOOG, RELIANCE.NS)..."
                  value={tickerInput}
                  onChange={(e) => setTickerInput(e.target.value)}
                  onFocus={() => setShowSuggestions(true)}
                  onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 pl-9 pr-3 text-sm text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 focus:bg-white font-mono uppercase font-semibold transition-all placeholder:text-slate-400"
                  disabled={loading}
                />
                
                {/* Real-time Ticker suggestions with country & exchange badges */}
                {showSuggestions && suggestions.length > 0 && (
                  <div className="absolute z-50 left-0 right-0 mt-1.5 bg-white border border-slate-200 rounded-xl shadow-lg divide-y divide-slate-100 max-h-60 overflow-y-auto">
                    {suggestions.map((entry, idx) => (
                      <button
                        key={`${entry.ticker}-${entry.name}-${idx}`}
                        type="button"
                        onMouseDown={() => handleSelectSuggestion(entry.ticker, entry.sector)}
                        className="w-full flex items-center justify-between px-4 py-2.5 text-left hover:bg-emerald-50/50 transition-colors cursor-pointer group"
                      >
                        <div className="flex flex-col">
                          <span className="text-xs font-semibold text-slate-800 group-hover:text-emerald-700">
                            {entry.name}
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono font-medium">
                            {entry.ticker} • {entry.sector}
                          </span>
                        </div>
                        <div className="flex flex-col items-end shrink-0 pl-2">
                          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider bg-slate-100 px-1.5 py-0.5 rounded">
                            {entry.exchange}
                          </span>
                          <span className="text-[9px] text-slate-400 mt-0.5 font-medium">
                            {entry.country}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <button
                type="submit"
                id="tab-header-search-submit"
                disabled={loading || !tickerInput.trim()}
                className="bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs py-2 px-4 rounded-xl shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
              >
                {loading ? (
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <TrendingUp className="w-3.5 h-3.5" />
                )}
                Fetch Live
              </button>
            </form>
          </div>
        </div>

        {/* Quick select tags and optional helper */}
        <div className="mt-4 flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          <div className="flex flex-wrap items-center gap-2 max-w-4xl">
            <span className="text-xs text-slate-400 font-medium mr-1 uppercase tracking-wider shrink-0">Top Stocks:</span>
            {Object.keys(PRECOMPILED_STOCKS).map((symbol) => {
              const stock = PRECOMPILED_STOCKS[symbol];
              const isUS = stock.currency === "USD";
              const tag = isUS ? "US Tech" : stock.sector.includes("IT") ? "IT Major" : stock.sector.includes("Bank") ? "Banking" : stock.sector.includes("Auto") ? "Automotive" : stock.sector.includes("FMCG") ? "FMCG" : stock.sector.includes("Energy") || stock.sector.includes("Renewable") ? "Energy/Green" : "Large Cap";
              
              return (
                <button
                  key={symbol}
                  id={`btn-quick-${symbol}`}
                  onClick={() => handleQuickSelect(symbol)}
                  className={`px-2.5 py-1 text-xs font-semibold rounded-lg border transition-all cursor-pointer flex items-center gap-1.5 ${
                    activeStock.symbol === symbol
                      ? "bg-emerald-600 text-white border-emerald-600 shadow-sm"
                      : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                  }`}
                >
                  <span>{symbol}</span>
                  <span className={`text-[9px] px-1 py-0.2 rounded font-medium ${
                    activeStock.symbol === symbol 
                      ? "bg-emerald-700 text-emerald-100" 
                      : "bg-slate-200/70 text-slate-500"
                  }`}>
                    {tag}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-semibold uppercase">Sector Context:</span>
            <input
              type="text"
              id="input-stock-sector"
              placeholder="e.g. IT, Bank (Optional Guide)"
              value={sectorInput}
              onChange={(e) => setSectorInput(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-lg py-1 px-2.5 text-xs text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all w-48"
              disabled={loading}
            />
          </div>
        </div>

        {/* Loading overlay step representation */}
        {loading && (
          <div className="mt-4 p-4 bg-emerald-50 border border-emerald-100 rounded-xl text-center space-y-2 animate-pulse">
            <RefreshCw className="w-6 h-6 text-emerald-600 animate-spin mx-auto" />
            <div className="text-sm font-semibold text-emerald-800">{loadingSteps || "Connecting with global market indices..."}</div>
            <div className="text-xs text-emerald-600">The Gemini agent is fetching and grounding real 2025/2026 data. Please wait.</div>
          </div>
        )}

        {error && (
          <div className="mt-4 p-4 bg-rose-50 border border-rose-100 rounded-xl text-left flex items-start gap-3 text-rose-800 text-sm">
            <AlertTriangle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="font-bold">Research Failed (Yahoo Finance API)</p>
              <p className="text-xs text-rose-600 leading-relaxed">{error}</p>
              {retryStatus && (
                <p className="text-amber-700 text-xs font-semibold animate-pulse flex items-center gap-1.5 mt-1.5 pt-1.5 border-t border-rose-100">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  {retryStatus}
                </p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Compare Stocks Switcher Bar */}
      <div id="compare-switcher-bar" className="bg-gradient-to-r from-slate-50 to-emerald-50/20 border border-slate-100 rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-emerald-50 text-emerald-700 rounded-xl">
            <Scale className="w-5 h-5" />
          </div>
          <div className="text-left">
            <h3 className="text-sm font-bold text-slate-800">Visual Stock Comparison Mode</h3>
            <p className="text-slate-500 text-xs text-left">
              Compare <strong>{activeStock.companyName} ({activeStock.symbol})</strong> side by side with a second stock.
            </p>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
          {isCompareMode && (
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <span className="text-xs text-slate-500 font-medium whitespace-nowrap">Compare with:</span>
              <select
                id="select-comparison-stock"
                value={comparisonStockSymbol}
                onChange={(e) => setComparisonStockSymbol(e.target.value)}
                className="w-full sm:w-auto bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-700 font-semibold focus:outline-hidden focus:ring-2 focus:ring-emerald-500 cursor-pointer"
              >
                {Object.keys(PRECOMPILED_STOCKS)
                  .filter((symbol) => symbol !== activeStock.symbol)
                  .map((symbol) => (
                    <option key={symbol} value={symbol}>
                      {PRECOMPILED_STOCKS[symbol].companyName} ({symbol})
                    </option>
                  ))}
              </select>
            </div>
          )}
          <button
            type="button"
            id="toggle-compare-stocks-btn"
            onClick={() => {
              setIsCompareMode(!isCompareMode);
               if (!isCompareMode) {
                const available = Object.keys(PRECOMPILED_STOCKS).filter((s) => s !== activeStock.symbol);
                if (available.length > 0) {
                  setComparisonStockSymbol(available[0]);
                }
              }
            }}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer whitespace-nowrap shadow-xs text-center ${
              isCompareMode
                ? "bg-rose-600 text-white hover:bg-rose-500"
                : "bg-emerald-600 text-white hover:bg-emerald-500"
            }`}
          >
            {isCompareMode ? "Exit Split Comparison" : "Compare Stocks"}
          </button>
        </div>
      </div>

      {/* Main Stock Report Content Area */}
      {loading ? (
        <StockSkeletonLoader />
      ) : isCompareMode ? (
        <SplitScreenStockComparison
          stockA={activeStock}
          stockB={comparisonStock}
          onClose={() => setIsCompareMode(false)}
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8" id="stock-report-content">
          
          {/* Left Column: Essential Metrics & Financial Statements */}
          <div className="lg:col-span-2 space-y-8">

            {/* Key Facts Card */}
          <div className="bg-white rounded-2xl p-6 shadow-xs border border-slate-100 space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-semibold uppercase px-2.5 py-1 bg-slate-100 text-slate-600 rounded-full">
                  {activeStock.sector}
                </span>
                <h1 className="text-2xl font-bold text-slate-800 mt-2">{activeStock.companyName}</h1>
                <p className="text-sm font-mono text-slate-400 mt-0.5">{activeStock.symbol}</p>
              </div>
              <div className="text-right">
                <span className="text-xs text-slate-400 block font-medium uppercase">Current Price</span>
                <span className="text-2xl font-bold text-slate-800 font-mono block">
                  {loading ? (
                    <span className="text-emerald-600 animate-pulse font-sans text-lg font-bold">Fetching...</span>
                  ) : typeof activeStock.currentPrice === "number" ? (
                    `${activeStock.currency === "INR" ? "₹" : "$"}${activeStock.currentPrice.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                  ) : (
                    activeStock.currentPrice
                  )}
                </span>
                <span className="text-xs text-slate-400 block font-mono">Currency: {activeStock.currency}</span>
                {activeStock.fetchedAt ? (
                  <span className="text-[9px] text-emerald-600 bg-emerald-50 border border-emerald-100 px-1.5 py-0.5 rounded-md font-mono inline-block mt-1">
                    fetched: {new Date(activeStock.fetchedAt).toLocaleTimeString()}
                  </span>
                ) : (
                  <span className="text-[9px] text-amber-600 bg-amber-50 border border-amber-100 px-1.5 py-0.5 rounded-md font-mono inline-block mt-1">
                    audited offline view
                  </span>
                )}
              </div>
            </div>

            <p className="text-sm text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100">
              {activeStock.about}
            </p>

            {/* Micro metrics grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-2">
              <div className="bg-slate-50/50 p-3 rounded-xl hover:bg-slate-50 transition-colors">
                <span className="text-xs text-slate-400 block font-medium">Current EPS</span>
                <span className="text-xs font-medium text-slate-400 block mt-1">
                  Not tracked in free tier
                </span>
              </div>
              <div className="bg-slate-50/50 p-3 rounded-xl hover:bg-slate-50 transition-colors">
                <span className="text-xs text-slate-400 block font-medium">P/E Ratio</span>
                <span className="text-xs font-medium text-slate-400 block mt-1">
                  Not tracked in free tier
                </span>
              </div>
              <div className="bg-slate-50/50 p-3 rounded-xl hover:bg-slate-50 transition-colors">
                <span className="text-xs text-slate-400 block font-medium">P/B Ratio</span>
                <span className="text-xs font-medium text-slate-400 block mt-1">
                  Not tracked in free tier
                </span>
              </div>
              <div className="bg-slate-50/50 p-3 rounded-xl hover:bg-slate-50 transition-colors">
                <span className="text-xs text-slate-400 block font-medium">Dividend Yield</span>
                <span className="text-xs font-medium text-slate-400 block mt-1">
                  Not tracked in free tier
                </span>
              </div>
            </div>
          </div>

          {/* Dynamic Risk Assessment Score Card */}
          <div className="bg-white rounded-2xl p-6 shadow-xs border border-slate-100 space-y-6" id="dynamic-risk-assessment-card">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-100">
              <div className="space-y-1">
                <h3 className="text-md font-bold text-slate-800 flex items-center gap-2">
                  <ShieldAlert className="w-5 h-5 text-emerald-600 animate-pulse" />
                  Dynamic Risk Assessment Profile
                </h3>
                <p className="text-slate-500 text-xs">
                  Sourced algorithmically from real-time solvency and short-term liquidity margins.
                </p>
              </div>
              
              {/* Dynamic Badge */}
              <span id="risk-tier-badge" className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider border self-start md:self-auto ${metrics.riskColor}`}>
                {metrics.riskTier} Risk
              </span>
            </div>

            {/* Score Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
              
              {/* Radial Slider Gauge block (Left) */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex flex-col items-center justify-center text-center h-full">
                <span className="text-[10px] text-slate-400 font-semibold uppercase mb-3 tracking-wider">Overall Risk Score</span>
                <div className="relative flex items-center justify-center w-28 h-28">
                  {/* Visual circular progress representation */}
                  <svg className="w-full h-full -rotate-90">
                    <circle cx="56" cy="56" r="46" className="stroke-slate-200 fill-none" strokeWidth="8" />
                    <circle 
                      cx="56" 
                      cy="56" 
                      r="46" 
                      className="fill-none transition-all duration-1000 ease-out"
                      strokeWidth="8" 
                      strokeDasharray="289"
                      strokeDashoffset={289 - (289 * metrics.overallScore) / 100}
                      strokeLinecap="round"
                      stroke={metrics.overallScore <= 22 ? "#10b981" : metrics.overallScore <= 45 ? "#f59e0b" : "#f43f5e"}
                    />
                  </svg>
                  <div className="absolute flex flex-col items-center justify-center">
                    <span className="text-3xl font-extrabold text-slate-800 font-mono tracking-tighter" id="risk-raw-score">{metrics.overallScore}</span>
                    <span className="text-[9px] text-slate-400 uppercase font-semibold">Scale 1-100</span>
                  </div>
                </div>
                <div className="mt-3 text-[10px] text-slate-400">
                  Higher index = Higher leverage risk
                </div>
              </div>

              {/* Solvency and Liquidity Bar Sliders (Right - SPAN 2) */}
              <div className="md:col-span-2 space-y-5">
                <div className="space-y-2">
                  <div className="flex justify-between items-baseline">
                    <span className="text-xs font-semibold text-slate-600 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                      Short-Term Liquidity Cushion Score:
                    </span>
                    <span className="text-sm font-bold font-mono text-slate-800" id="liquidity-metric-score">{metrics.liquidityScore}/100</span>
                  </div>
                  {/* Micro Track bar */}
                  <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-emerald-500 rounded-full transition-all duration-1000" 
                      style={{ width: `${metrics.liquidityScore}%` }}
                    />
                  </div>
                  <p className="text-[10px] text-slate-400 leading-relaxed">
                    Evaluates immediate availability of cash reserves and current assets versus pending short-term debts.
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-baseline">
                    <span className="text-xs font-semibold text-slate-600 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-teal-500"></span>
                      Long-Term Capital Solvency Score:
                    </span>
                    <span className="text-sm font-bold font-mono text-slate-800" id="solvency-metric-score">{metrics.solvencyScore}/100</span>
                  </div>
                  {/* Micro Track bar */}
                  <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-teal-500 rounded-full transition-all duration-1000" 
                      style={{ width: `${metrics.solvencyScore}%` }}
                    />
                  </div>
                  <p className="text-[10px] text-slate-400 leading-relaxed">
                    Measures structural gearing ratios (debt-to-equity leverage limits) and cash-flow interest cover capabilities.
                  </p>
                </div>
              </div>

            </div>

            {/* Verdict Note */}
            <div className="bg-slate-50/70 rounded-xl p-4 border border-slate-100 space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Investment Risk Verdict</span>
              <p className="text-xs text-slate-600 leading-relaxed font-sans mt-0.5">
                {metrics.verdict}
              </p>
            </div>
          </div>

          {/* Net Asset Value (NAV) Analytics Engine & Interactive Balance Sheet Simulator */}
          <div className="bg-white rounded-2xl p-6 shadow-xs border border-slate-100 space-y-6" id="stock-nav-analyzer-card">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-100">
              <div className="space-y-1">
                <h3 className="text-md font-bold text-slate-800 flex items-center gap-2">
                  <Landmark className="w-5 h-5 text-emerald-600 font-bold" />
                  Net Asset Value (NAV) & Book Value Analysis
                </h3>
                <p className="text-slate-500 text-xs">
                  Sourced from audited assets vs senior liabilities of the firm.
                </p>
              </div>
              <span className="px-2.5 py-1 text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-md">
                Equity Balance Sheet Valuation
              </span>
            </div>

            {/* Calculated active stock NAV per share display */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
              
              <div className="p-4 bg-emerald-50/40 rounded-xl border border-emerald-100/50 space-y-2 text-center h-full flex flex-col justify-center">
                <span className="text-[10px] text-emerald-600 font-bold uppercase tracking-wider block">Audited NAV Per Share</span>
                <span className="text-2xl font-black text-emerald-700 font-mono block" id="nav-calculated-value">
                  {typeof activeStock.currentPrice === "number" && typeof activeStock.pbRatio === "number" && activeStock.pbRatio > 0
                    ? `${activeStock.currency === "INR" ? "₹" : "$"}${(activeStock.currentPrice / activeStock.pbRatio).toFixed(2)}`
                    : "Live data unavailable"}
                </span>
                <p className="text-[10px] text-slate-500 leading-snug">
                  Derived precisely via: Share Price ({typeof activeStock.currentPrice === "number" ? `${activeStock.currency === "INR" ? "₹" : "$"}${activeStock.currentPrice}` : activeStock.currentPrice}) / P/B Ratio ({typeof activeStock.pbRatio === "number" ? `${activeStock.pbRatio}x` : activeStock.pbRatio})
                </p>
              </div>

              {/* Dynamic explanations */}
              <div className="md:col-span-2 space-y-4">
                <div className="space-y-1 text-xs text-left">
                  <strong className="text-slate-700 block text-sm">Market Premium versus Book Equity Analysis:</strong>
                  <p className="text-slate-500 leading-relaxed">
                    {activeStock.companyName} is priced at <strong className="text-slate-800 font-bold">{activeStock.pbRatio}x</strong> of its core Net Asset Value (Book Value).
                    {typeof activeStock.pbRatio === "number" && activeStock.pbRatio > 10 ? (
                      <span> This indicates an extremely premium asset-light valuation pattern common for IT industry leaders. Deploys high intangible trademark value, zero heavy plants, and a breathtaking ROE of {activeStock.ratios.efficiency.find(e => e.name.toLowerCase().includes("roe"))?.value || "41"}%.</span>
                    ) : typeof activeStock.pbRatio === "number" && activeStock.pbRatio > 2 ? (
                      <span> This constitutes a moderate, healthy industrial premium matching its capital allocation pipeline.</span>
                    ) : (
                      <span> Trading close to raw Book Value offers a substantial margin of safety for capital preservation. Ideal during turnarounds and undervalued operations.</span>
                    )}
                  </p>
                </div>

                <div className="text-[10px] bg-slate-50 p-3 rounded-lg border border-slate-100 flex gap-2">
                  <span className="text-amber-500 block">💡</span>
                  <p className="text-slate-500 font-medium leading-relaxed">
                    Net Asset Value (NAV) represents the ultimate baseline liquidation valuation of a company's total balance equity structure if all tangible items were sold outright to retire debts today.
                  </p>
                </div>
              </div>
            </div>

            {/* Sandbox Cash/Liability Sandbox controls */}
            <div className="bg-slate-50/70 border border-slate-100 rounded-xl p-5 space-y-4">
              <div className="flex justify-between items-center border-b border-slate-200/60 pb-2">
                <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <HelpCircle className="w-4 h-4 text-emerald-600 block" />
                  Interactive Balance Sheet Sandbox Simulator
                </span>
                <span className="text-[10px] text-slate-400 font-mono">Simulate custom statements</span>
              </div>

              <StockNavSandbox activeStock={activeStock} />
            </div>
          </div>

          {/* Past growth trends of the company (Historical Performance Trends) */}
          <div className="bg-white rounded-2xl p-6 shadow-xs border border-slate-100">
            <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 mb-6">
              <div className="space-y-1">
                <h3 className="text-md font-bold text-slate-800 flex items-center gap-2">
                  <BarChart2 className="w-5 h-5 text-emerald-600" />
                  Historical Performance & Growth trends
                </h3>
                <p className="text-slate-500 text-xs">
                  A dynamic timeline representation of absolute financials and adjusted value performance.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                {/* Date Range Selector */}
                <div id="stock-date-range-selector" className="inline-flex rounded-lg p-0.5 bg-slate-100/80 text-xs border border-slate-200/40 shadow-2xs animate-fade-in">
                  {(["1M", "6M", "1Y", "5Y"] as const).map((r) => (
                    <button
                      key={r}
                      type="button"
                      id={`btn-range-${r}`}
                      onClick={() => setDateRange(r)}
                      className={`px-3 py-1.5 rounded-md font-bold transition-all cursor-pointer ${
                        dateRange === r
                          ? "bg-white text-emerald-700 shadow-xs"
                          : "text-slate-500 hover:text-slate-850"
                      }`}
                    >
                      {r}
                    </button>
                  ))}
                </div>

                {/* Graphical Selector Tabs */}
                <div className="inline-flex rounded-lg p-0.5 bg-slate-100/80 text-xs border border-slate-200/40 shadow-2xs">
                  <button
                    type="button"
                    onClick={() => setChartTab("price")}
                    className={`px-3 py-1.5 rounded-md font-semibold transition-all cursor-pointer ${
                      chartTab === "price"
                        ? "bg-white text-emerald-700 shadow-xs"
                        : "text-slate-500 hover:text-slate-850"
                    }`}
                  >
                    Share Price (Line)
                  </button>
                  <button
                    type="button"
                    onClick={() => setChartTab("growth")}
                    className={`px-3 py-1.5 rounded-md font-semibold transition-all cursor-pointer ${
                      chartTab === "growth"
                        ? "bg-white text-emerald-700 shadow-xs"
                        : "text-slate-500 hover:text-slate-850"
                    }`}
                  >
                    YoY Growth % (Line)
                  </button>
                  <button
                    type="button"
                    onClick={() => setChartTab("absolute")}
                    className={`px-3 py-1.5 rounded-md font-semibold transition-all cursor-pointer ${
                      chartTab === "absolute"
                        ? "bg-white text-emerald-700 shadow-xs"
                        : "text-slate-500 hover:text-slate-850"
                    }`}
                  >
                    Absolute (Area)
                  </button>
                </div>
              </div>
            </div>
            
            <div className="h-[280px] mb-6">
              <ResponsiveContainer width="100%" height="100%">
                {chartTab === "price" ? (
                  <LineChart data={chartTimelineData} margin={{ top: 15, right: 15, left: 5, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="year" tickLine={false} axisLine={false} tick={{ fill: '#64748b', fontSize: 11 }} />
                    <YAxis 
                      tickLine={false} 
                      axisLine={false} 
                      tick={{ fill: '#64748b', fontSize: 11 }}
                      domain={['auto', 'auto']}
                    />
                    <Tooltip 
                      contentStyle={{ borderRadius: "12px", border: "1px solid #f1f5f9", boxShadow: "0 1px 2px 0 rgba(0,0,0,0.05)" }}
                      formatter={(val: any) => [`${activeStock.currency === "INR" ? "₹" : "$"}${Number(val).toLocaleString()}`, "Estimated Share Price"]}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="estimatedPrice" 
                      name="Share Value Progress" 
                      stroke="#059669" 
                      strokeWidth={3} 
                      dot={{ stroke: '#059669', r: 4, strokeWidth: 2, fill: '#ffffff' }} 
                      activeDot={{ r: 6, strokeWidth: 0 }}
                    />
                    <Legend verticalAlign="top" height={36} />
                  </LineChart>
                ) : chartTab === "growth" ? (
                  <LineChart data={chartTimelineData} margin={{ top: 15, right: 15, left: 5, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="year" tickLine={false} axisLine={false} tick={{ fill: '#64748b', fontSize: 11 }} />
                    <YAxis 
                      tickLine={false} 
                      axisLine={false} 
                      tick={{ fill: '#64748b', fontSize: 11 }}
                    />
                    <Tooltip 
                      contentStyle={{ borderRadius: "12px", border: "1px solid #f1f5f9", boxShadow: "0 1px 2px 0 rgba(0,0,0,0.05)" }}
                      formatter={(val: any, name: string) => [`${val}%`, name]}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="revenueGrowth" 
                      name="YoY Revenue Growth" 
                      stroke="#4f46e5" 
                      strokeWidth={2.5} 
                      dot={{ stroke: '#4f46e5', r: 4, strokeWidth: 1.5, fill: '#ffffff' }} 
                    />
                    <Line 
                      type="monotone" 
                      dataKey="profitGrowth" 
                      name="YoY Net Profit Growth" 
                      stroke="#db2777" 
                      strokeWidth={2.5} 
                      dot={{ stroke: '#db2777', r: 4, strokeWidth: 1.5, fill: '#ffffff' }} 
                    />
                    <Line 
                      type="monotone" 
                      dataKey="operatingMargin" 
                      name="Operating Margin" 
                      stroke="#475569" 
                      strokeWidth={2} 
                      strokeDasharray="4 4"
                      dot={{ stroke: '#475569', r: 3, strokeWidth: 1, fill: '#ffffff' }} 
                    />
                    <Legend verticalAlign="top" height={36} />
                  </LineChart>
                ) : (
                  <AreaChart data={chartTimelineData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.15}/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0.01}/>
                      </linearGradient>
                      <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#0f172a" stopOpacity={0.1}/>
                        <stop offset="95%" stopColor="#0f172a" stopOpacity={0.01}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="year" tickLine={false} axisLine={false} tick={{ fill: '#64748b', fontSize: 11 }} />
                    <YAxis tickLine={false} axisLine={false} tick={{ fill: '#64748b', fontSize: 11 }} />
                    <Tooltip 
                      contentStyle={{ borderRadius: "12px", border: "1px solid #f1f5f9", boxShadow: "0 1px 2px 0 rgba(0,0,0,0.05)" }}
                      formatter={(val: any) => [`${val.toLocaleString()} Cr`, ""]}
                    />
                    <Area type="monotone" dataKey="revenue" name="Revenue" stroke="#10b981" strokeWidth={2.5} fillOpacity={1} fill="url(#colorRevenue)" />
                    <Area type="monotone" dataKey="netProfit" name="Net Profit" stroke="#0f172a" strokeWidth={2} fillOpacity={1} fill="url(#colorProfit)" />
                    <Legend verticalAlign="top" height={36} />
                  </AreaChart>
                )}
              </ResponsiveContainer>
            </div>

            {/* Dynamic data table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-400 font-medium">
                    <th className="pb-3 text-xs uppercase tracking-wider font-semibold">Fiscal Year</th>
                    <th className="pb-3 text-xs uppercase tracking-wider font-semibold">Total Revenue</th>
                    <th className="pb-3 text-xs uppercase tracking-wider font-semibold">Net Profit</th>
                    <th className="pb-3 text-xs uppercase tracking-wider font-semibold">Operating Margin</th>
                    <th className="pb-3 text-xs uppercase tracking-wider font-semibold">Growth Delta</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-600 font-mono text-xs">
                  {activeStock.financials.map((yearObj, i) => {
                    const prevRevenue = i > 0 ? activeStock.financials[i - 1].revenue : 0;
                    const growthYoy = prevRevenue ? (((yearObj.revenue - prevRevenue) / prevRevenue) * 100).toFixed(1) : "N/A";
                    return (
                      <tr key={i} className="hover:bg-slate-50/50">
                        <td className="py-3 font-semibold text-slate-800">{yearObj.year}</td>
                        <td className="py-3">{formatAmount(yearObj.revenue, activeStock.currency)}</td>
                        <td className="py-3 text-emerald-600 font-semibold">{formatAmount(yearObj.netProfit, activeStock.currency)}</td>
                        <td className="py-3">{yearObj.operatingMargin}%</td>
                        <td className="py-3">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-sans font-medium ${growthYoy === "N/A" ? "bg-slate-100" : "bg-emerald-50 text-emerald-600"}`}>
                            {growthYoy === "N/A" ? "Baseline" : `+${growthYoy}% YoY`}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Competitors same sector benchmark */}
          <div className="bg-white rounded-2xl p-6 shadow-xs border border-slate-100">
            <h3 className="text-md font-bold text-slate-800 mb-4 flex items-center gap-2">
              <Users className="w-5 h-5 text-emerald-600" />
              Symmetric Competitor Analysis & Benchmarking
            </h3>
            <p className="text-slate-500 text-sm mb-4">
              Comparing {activeStock.companyName} on critical metrics with main sector players.
            </p>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-400 font-medium">
                    <th className="pb-3 text-xs uppercase">Enterprise</th>
                    <th className="pb-3 text-xs uppercase font-mono">P/E</th>
                    <th className="pb-3 text-xs uppercase font-mono">P/B</th>
                    <th className="pb-3 text-xs uppercase font-mono">EPS</th>
                    <th className="pb-3 text-xs uppercase">Premium Cap</th>
                    <th className="pb-3 text-xs uppercase">Div Yield</th>
                    <th className="pb-3 text-xs uppercase text-right">Value Score</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs text-slate-600">
                  {/* Active stock first */}
                  <tr className="bg-emerald-50/30 font-semibold hover:bg-emerald-50/50">
                    <td className="py-3 px-1 text-slate-800 flex items-center gap-1.5 font-sans">
                      <span className="w-1.5 h-1.5 bg-emerald-600 rounded-full"></span>
                      {activeStock.companyName} (Primary)
                    </td>
                    <td className="py-3 text-slate-400 font-normal">Not tracked in free tier</td>
                    <td className="py-3 text-slate-400 font-normal">Not tracked in free tier</td>
                    <td className="py-3 text-slate-400 font-normal">Not tracked in free tier</td>
                    <td className="py-3 font-sans">Primary Search</td>
                    <td className="py-3 text-slate-400 font-normal">Not tracked in free tier</td>
                    <td className="py-3 text-right">
                      <span className="bg-emerald-600 text-white font-sans text-[10px] font-bold px-2 py-0.5 rounded-sm">Primary</span>
                    </td>
                  </tr>
                  {/* Competitors list */}
                  {activeStock.competitors.map((comp, i) => (
                    <tr key={i} className="hover:bg-slate-50/50">
                      <td className="py-3 font-sans text-slate-700">{comp.name}</td>
                      <td className="py-3 text-slate-400 font-normal">Not tracked in free tier</td>
                      <td className="py-3 text-slate-400 font-normal">Not tracked in free tier</td>
                      <td className="py-3 text-slate-400 font-normal">Not tracked in free tier</td>
                      <td className="py-3 font-sans">{comp.marketCap || "N/A"}</td>
                      <td className="py-3 text-slate-400 font-normal">Not tracked in free tier</td>
                      <td className="py-3 text-right font-semibold">
                        <span className="bg-slate-100 text-slate-600 font-sans text-[10px] font-bold px-2 py-0.5 rounded-sm">
                          Peer
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Ratios scorecard cards */}
          <div className="bg-white rounded-2xl p-6 shadow-xs border border-slate-100 space-y-6">
            <h3 className="text-md font-bold text-slate-800 flex items-center gap-2">
              <Landmark className="w-5 h-5 text-emerald-600" />
              Comprehensive Financial Ratios Dashboard
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Liquidity */}
              <div className="space-y-4">
                <div className="border-b border-slate-100 pb-2">
                  <span className="text-xs font-semibold text-slate-400 uppercase block tracking-wider">Liquidity Ratios</span>
                  <span className="text-[10px] text-slate-400 block">Short-term debt coverage solvency</span>
                </div>
                <div className="space-y-3">
                  {activeStock.ratios.liquidity.map((ratio, idx) => (
                    <div key={idx} className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-semibold text-slate-700">{ratio.name}</span>
                        <span className={`text-[10px] px-1.5 py-0.5 font-medium border rounded-md flex items-center gap-1 leading-none ${getHealthColor(ratio.health)}`}>
                          {getHealthIcon(ratio.health)}
                          {ratio.health}
                        </span>
                      </div>
                      <div className="mt-2 flex items-baseline justify-between">
                        <span className="text-lg font-bold font-mono text-slate-800">{ratio.value}</span>
                        <span className="text-[10px] text-slate-400 font-mono">Norm: {ratio.benchmark}</span>
                      </div>
                      <p className="text-[10px] text-slate-500 mt-1">{ratio.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Solvency */}
              <div className="space-y-4">
                <div className="border-b border-slate-100 pb-2">
                  <span className="text-xs font-semibold text-slate-400 uppercase block tracking-wider">Solvency Ratios</span>
                  <span className="text-[10px] text-slate-400 block">Long term structure leverage</span>
                </div>
                <div className="space-y-3">
                  {activeStock.ratios.solvency.map((ratio, idx) => (
                    <div key={idx} className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-semibold text-slate-700">{ratio.name}</span>
                        <span className={`text-[10px] px-1.5 py-0.5 font-medium border rounded-md flex items-center gap-1 leading-none ${getHealthColor(ratio.health)}`}>
                          {getHealthIcon(ratio.health)}
                          {ratio.health}
                        </span>
                      </div>
                      <div className="mt-2 flex items-baseline justify-between">
                        <span className="text-lg font-bold font-mono text-slate-800">{ratio.value}</span>
                        <span className="text-[10px] text-slate-400 font-mono">Norm: {ratio.benchmark}</span>
                      </div>
                      <p className="text-[10px] text-slate-500 mt-1">{ratio.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Efficiency */}
              <div className="space-y-4">
                <div className="border-b border-slate-100 pb-2">
                  <span className="text-xs font-semibold text-slate-400 uppercase block tracking-wider">Efficiency Ratios</span>
                  <span className="text-[10px] text-slate-400 block">Productivity of core assets</span>
                </div>
                <div className="space-y-3">
                  {activeStock.ratios.efficiency.map((ratio, idx) => (
                    <div key={idx} className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-semibold text-slate-700">{ratio.name}</span>
                        <span className={`text-[10px] px-1.5 py-0.5 font-medium border rounded-md flex items-center gap-1 leading-none ${getHealthColor(ratio.health)}`}>
                          {getHealthIcon(ratio.health)}
                          {ratio.health}
                        </span>
                      </div>
                      <div className="mt-2 flex items-baseline justify-between">
                        <span className="text-lg font-bold font-mono text-slate-800">
                          {ratio.name.toLowerCase().includes("roe") || ratio.name.toLowerCase().includes("margin") ? `${ratio.value}%` : ratio.value}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">Norm: {ratio.benchmark}</span>
                      </div>
                      <p className="text-[10px] text-slate-500 mt-1">{ratio.description}</p>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>

        </div>

        {/* Right Column: Dividend, Future Prediction Paths, Research Summaries */}
        <div className="space-y-8">
          
          {/* Dividend History Card */}
          <div className="bg-white rounded-2xl p-6 shadow-xs border border-slate-100">
            <h3 className="text-md font-bold text-slate-800 mb-4 flex items-center gap-2">
              <Percent className="w-5 h-5 text-emerald-600" />
              Dividend Yield & Payout History
            </h3>
            
            {activeStock.dividends && activeStock.dividends.length > 0 ? (
              <div className="space-y-3">
                <div className="bg-emerald-50 text-emerald-800 p-3 rounded-xl text-xs space-y-1">
                  <div className="font-semibold block text-emerald-900">Current Yield: {activeStock.dividendYield}%</div>
                  <div>Consistently returns capital. Dividends are evaluated as passive wealth triggers.</div>
                </div>

                <div className="divide-y divide-slate-100 text-xs font-mono">
                  {activeStock.dividends.map((div, i) => (
                    <div key={i} className="py-2.5 flex justify-between items-center">
                      <span className="text-slate-500 font-sans font-medium">Fiscal Year {div.year} payout</span>
                      <span className="font-bold text-slate-700 font-mono">
                        {activeStock.currency === "INR" ? "₹" : "$"}{div.amount.toFixed(2)} per share
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="p-4 bg-slate-50 text-center rounded-xl text-xs text-slate-500 space-y-1">
                <ShieldAlert className="w-6 h-6 text-slate-400 mx-auto" />
                <div className="font-semibold block">Zero Divider Returns</div>
                <div>This is typical for early growth phase lower-tier companies like turnarounds that retain 100% of earnings for expansion.</div>
              </div>
            )}
          </div>

          {/* Future prediction about Growth and Share price */}
          <div className="bg-white rounded-2xl p-6 shadow-xs border border-slate-100">
            <h3 className="text-md font-bold text-slate-800 mb-2 flex items-center gap-2">
              <Target className="w-5 h-5 text-emerald-600" />
              Future Growth Prediction Path
            </h3>
            <span className="text-[10px] text-amber-600 font-semibold uppercase bg-amber-50 px-2 py-0.5 rounded-full border border-amber-100">
              * Assuming Normal Market Circumstances
            </span>
            
            <p className="text-xs text-slate-500 my-3 leading-relaxed">
              {activeStock.futureGrowth.predictionSummary}
            </p>

            <div className="h-[180px] mb-4">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={activeStock.futureGrowth.years}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="year" tickLine={false} axisLine={false} tick={{ fill: '#64748b', fontSize: 10 }} />
                  <YAxis tickLine={false} axisLine={false} tick={{ fill: '#64748b', fontSize: 10 }} />
                  <Tooltip 
                    contentStyle={{ borderRadius: "12px", border: "1px solid #f1f5f9" }}
                    formatter={(val: any) => [`${activeStock.currency === "INR" ? "₹" : "$"}${val}`, "Predicted Price"]}
                  />
                  <Line type="monotone" dataKey="predictedSharePrice" name="Future Price" stroke="#10b981" strokeWidth={3} dot={{ stroke: '#10b981', r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="space-y-2 text-xs font-mono">
              {activeStock.futureGrowth.years.map((gPoint, i) => (
                <div key={i} className="flex justify-between items-center py-2 border-b border-dashed border-slate-100">
                  <span className="font-semibold font-sans text-slate-600">Year {gPoint.year} Target</span>
                  <div className="text-right">
                    <span className="font-bold text-emerald-600 block">
                      {activeStock.currency === "INR" ? "₹" : "$"}{gPoint.predictedSharePrice.toFixed(0)}
                    </span>
                    <span className="text-[10px] text-slate-400 block font-sans">+{gPoint.predictedRevenueDelta}% Rev Growth</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Research Summary Card */}
          <div className="bg-white rounded-2xl p-6 shadow-xs border border-slate-100 space-y-4">
            <h3 className="text-md font-bold text-slate-800 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-emerald-600" />
              EquiGrowth Research Notes
            </h3>
            <div className="max-h-[350px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-slate-200">
              <div className="prose prose-sm text-slate-600 space-y-3">
                {renderMarkdown(activeStock.investmentResearchSummary)}
              </div>
            </div>
          </div>

        </div>

      </div>
      )}

      {/* Side-by-Side Comparison Workspace */}
      <div className="mt-8 pt-6 border-t border-slate-200">
        <SideBySideStockComparator activeStock={activeStock} onSelectStock={(symbol) => {
          if (PRECOMPILED_STOCKS[symbol]) {
            setActiveStock(PRECOMPILED_STOCKS[symbol]);
          }
        }} />
      </div>

    </div>
  );
}

// Side-by-Side Comparative Analysis Component
interface SideBySideStockComparatorProps {
  activeStock: StockAnalysis;
  onSelectStock: (symbol: string) => void;
}

function SideBySideStockComparator({ activeStock, onSelectStock }: SideBySideStockComparatorProps) {
  const [selectedSymbols, setSelectedSymbols] = useState<string[]>(["TCS", "RELIANCE", "SUZLON"]);
  const [stockDataMap, setStockDataMap] = useState<Record<string, StockAnalysis>>({});
  const [fetchingMap, setFetchingMap] = useState<Record<string, boolean>>({});
  const stockCacheRef = React.useRef<Map<string, { data: StockAnalysis; timestamp: number }>>(new Map());

  // Sync activeStock when parent updates with real-time data
  React.useEffect(() => {
    if (activeStock?.symbol && activeStock.isRealTime) {
      stockCacheRef.current.set(activeStock.symbol, { data: activeStock, timestamp: Date.now() });
      setStockDataMap(prev => ({ ...prev, [activeStock.symbol]: activeStock }));
    }
  }, [activeStock]);

  // Fetch live data for checked symbols on mount and whenever selectedSymbols changes
  React.useEffect(() => {
    const symbolsToFetch: string[] = [];

    selectedSymbols.forEach(symbol => {
      // 1. Check cache first
      const cached = stockCacheRef.current.get(symbol);
      if (cached && Date.now() - cached.timestamp < 5 * 60 * 1000) {
        if (stockDataMap[symbol] !== cached.data) {
          setStockDataMap(prev => ({ ...prev, [symbol]: cached.data }));
        }
        return;
      }

      // 2. Check if activeStock is real-time for this symbol
      if (activeStock?.symbol === symbol && activeStock.isRealTime) {
        stockCacheRef.current.set(symbol, { data: activeStock, timestamp: Date.now() });
        setStockDataMap(prev => ({ ...prev, [symbol]: activeStock }));
        return;
      }

      // 3. Otherwise, queue for live API fetch
      symbolsToFetch.push(symbol);
    });

    if (symbolsToFetch.length === 0) return;

    console.log("[SideBySideStockComparator] symbolsToFetch:", symbolsToFetch);

    // Set fetching state for queued symbols
    setFetchingMap(prev => {
      const next = { ...prev };
      symbolsToFetch.forEach(s => { next[s] = true; });
      return next;
    });

    // Execute parallel fetches with Promise.allSettled
    const fetchPromises = symbolsToFetch.map(async (symbol) => {
      try {
        const res = await fetch("/api/analyze-stock", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ symbol })
        });
        console.log(`[SideBySideStockComparator] Fetch response for ${symbol}: status=${res.status}`);
        if (res.ok) {
          const data = await res.json();
          console.log(`[SideBySideStockComparator] Parsed data for ${symbol}:`, data);
          stockCacheRef.current.set(symbol, { data, timestamp: Date.now() });
          return { symbol, data, success: true };
        }
      } catch (err) {
        console.warn(`SideBySideStockComparator fetch error for ${symbol}:`, err);
      }
      return { symbol, success: false };
    });

    Promise.allSettled(fetchPromises).then(results => {
      const updates: Record<string, StockAnalysis> = {};
      results.forEach(result => {
        if (result.status === "fulfilled" && result.value.success && result.value.data) {
          updates[result.value.symbol] = result.value.data;
        }
      });

      console.log("[SideBySideStockComparator] Merging updates into stockDataMap:", updates);
      setStockDataMap(prev => ({ ...prev, ...updates }));
      setFetchingMap(prev => {
        const next = { ...prev };
        symbolsToFetch.forEach(s => { next[s] = false; });
        return next;
      });
    });
  }, [selectedSymbols]);

  const toggleSelectSymbol = (symbol: string) => {
    if (selectedSymbols.includes(symbol)) {
      if (selectedSymbols.length <= 1) return; // keep at least one
      setSelectedSymbols(selectedSymbols.filter(s => s !== symbol));
    } else {
      setSelectedSymbols([...selectedSymbols, symbol]);
    }
  };

  const comparedStocks = React.useMemo(() => {
    const result = selectedSymbols
      .map(sym => stockDataMap[sym] || (activeStock?.symbol === sym && activeStock.isRealTime ? activeStock : PRECOMPILED_STOCKS[sym]))
      .filter(Boolean);
    console.log("[SideBySideStockComparator] comparedStocks recalculated:", result);
    return result;
  }, [selectedSymbols, stockDataMap, activeStock]);

  const handleDownloadCsv = () => {
    let csv = "Metrics Header,";
    // Header row
    csv += comparedStocks.map(s => `"${s.companyName} (${s.symbol})"`).join(",") + "\n";
    
    // Defined rows
    const rows = [
      { label: "Sector Name", extract: (s: StockAnalysis) => s.sector },
      { label: "Market Price", extract: (s: StockAnalysis) => typeof s.currentPrice === "number" ? `${s.currency === "INR" ? "Rs " : "$"}${s.currentPrice}` : s.currentPrice },
      { label: "EPS", extract: (_s: StockAnalysis) => "Not tracked in free tier" },
      { label: "P/E Valuation Ratio", extract: (_s: StockAnalysis) => "Not tracked in free tier" },
      { label: "P/B Ratio Price-to-Book", extract: (_s: StockAnalysis) => "Not tracked in free tier" },
      { label: "Calculated NAV (Book Value) Per Share", extract: (_s: StockAnalysis) => "Not tracked in free tier" },
      { label: "Dividend Yield", extract: (_s: StockAnalysis) => "Not tracked in free tier" },
      { label: "Growth Rating", extract: (s: StockAnalysis) => s.futureGrowth.years[0]?.predictedRevenueDelta ? `+${s.futureGrowth.years[0].predictedRevenueDelta}%` : "Stable" },
      { label: "Core ROE Productivity", extract: (_s: StockAnalysis) => "Not tracked in free tier" },
      { label: "Debt to Equity ratio", extract: (_s: StockAnalysis) => "Not tracked in free tier" },
      { label: "Research Commentary Note", extract: (s: StockAnalysis) => s.investmentResearchSummary.replace(/"/g, "") }
    ];

    rows.forEach(r => {
      csv += r.label + "," + comparedStocks.map(s => `"${r.extract(s)}"`).join(",") + "\n";
    });

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "equigrowth_side_by_side_stock_comparison.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-white rounded-3xl p-6 md:p-8 shadow-xs border border-slate-100 space-y-6" id="side-by-side-comparator">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div className="space-y-1 text-left">
          <h3 className="text-lg font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Users className="w-5 h-5 text-emerald-600 block" />
            Interactive Side-by-Side Stock Benchmark Matrix
          </h3>
          <p className="text-slate-500 text-xs text-left">
            Mark checkboxes below to compare balance sheet metrics, valuation ratios, and research consensus.
          </p>
        </div>

        {/* Download CSV button */}
        <button
          type="button"
          onClick={handleDownloadCsv}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer"
        >
          <span>📥</span>
          Download Comparative Sheet (CSV)
        </button>
      </div>

      {/* Selector Checkboxes list */}
      <div className="flex flex-wrap gap-2.5 bg-slate-50 p-4 rounded-2xl border border-slate-100 justify-start items-center">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mr-2">Check to Benchmark:</span>
        {Object.keys(PRECOMPILED_STOCKS).map(symbol => {
          const isSelected = selectedSymbols.includes(symbol);
          return (
            <button
              key={symbol}
              type="button"
              onClick={() => toggleSelectSymbol(symbol)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold border flex items-center gap-1.5 transition-all cursor-pointer ${
                isSelected
                  ? "bg-emerald-50 text-emerald-800 border-emerald-300"
                  : "bg-white text-slate-600 border-slate-200 hover:bg-slate-100"
              }`}
            >
              <div className={`w-3.5 h-3.5 rounded-sm border flex items-center justify-center text-[10px] ${isSelected ? "bg-emerald-600 border-emerald-600 text-white" : "border-slate-300 bg-white"}`}>
                {isSelected && "✓"}
              </div>
              <strong className="font-bold">{symbol}</strong>
              <span className="text-[10px] font-normal text-slate-400">({PRECOMPILED_STOCKS[symbol].companyName.split(" ")[0]})</span>
            </button>
          );
        })}
      </div>

      {/* Double Entry Metrics Table Matrix */}
      <div className="overflow-x-auto rounded-xl border border-slate-100">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100 text-slate-500">
              <th className="p-4 font-bold uppercase tracking-wider text-slate-400 text-[10px] w-[200px]">Strategic Factor Metric</th>
              {comparedStocks.map(s => {
                const isActive = activeStock.symbol === s.symbol;
                return (
                  <th key={s.symbol} className="p-4 min-w-[180px] border-l border-slate-100">
                    <div className="flex justify-between items-start gap-2">
                      <div className="text-left">
                        <span className="font-extrabold text-slate-900 block text-sm">{s.symbol}</span>
                        <span className="text-[10px] text-slate-400 font-normal block">{s.companyName}</span>
                      </div>
                      {isActive ? (
                        <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-full text-[9px] font-semibold uppercase">Active</span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => onSelectStock(s.symbol)}
                          className="px-2 py-0.5 bg-slate-200 hover:bg-emerald-50 hover:text-emerald-800 text-slate-600 rounded-full text-[9px] font-semibold transition-all cursor-pointer"
                        >
                          Select
                        </button>
                      )}
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {/* Sector Section */}
            <tr className="hover:bg-slate-50/20 text-left">
              <td className="p-4 font-semibold text-slate-600 text-left">Enterprise Capital Sector</td>
              {comparedStocks.map(s => (
                <td key={s.symbol} className="p-4 border-l border-slate-100 text-slate-700 font-medium font-sans">
                  {s.sector}
                </td>
              ))}
            </tr>
            {/* Price Section */}
            <tr className="hover:bg-slate-50/20 bg-slate-50/10 font-mono text-xs text-left">
              <td className="p-4 font-semibold text-slate-600 font-sans text-left">Current Share Price</td>
              {comparedStocks.map(s => {
                const isFetching = fetchingMap[s.symbol];
                return (
                  <td key={s.symbol} className="p-4 border-l border-slate-100 text-slate-800 font-bold">
                    {isFetching ? (
                      <span className="text-emerald-600 animate-pulse font-sans text-xs font-bold">Fetching...</span>
                    ) : typeof s.currentPrice === "number" ? (
                      `${s.currency === "INR" ? "₹" : "$"}${s.currentPrice.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                    ) : (
                      s.currentPrice
                    )}
                  </td>
                );
              })}
            </tr>
            {/* EPS Section */}
            <tr className="hover:bg-slate-50/20 text-xs text-left">
              <td className="p-4 font-semibold text-slate-600 font-sans text-left">Earning Per Share (EPS)</td>
              {comparedStocks.map(s => (
                <td key={s.symbol} className="p-4 border-l border-slate-100 text-slate-400 font-normal">
                  Not tracked in free tier
                </td>
              ))}
            </tr>
            {/* PE Ratio Section */}
            <tr className="hover:bg-slate-50/20 text-xs text-left">
              <td className="p-4 font-semibold text-slate-600 font-sans text-left">Price-to-Earnings (P/E)</td>
              {comparedStocks.map(s => (
                <td key={s.symbol} className="p-4 border-l border-slate-100 text-slate-400 font-normal">
                  Not tracked in free tier
                </td>
              ))}
            </tr>
            {/* PB Ratio Section */}
            <tr className="hover:bg-slate-50/20 bg-slate-50/10 text-xs text-left">
              <td className="p-4 font-semibold text-slate-600 font-sans text-left">Price-to-Book (P/B)</td>
              {comparedStocks.map(s => (
                <td key={s.symbol} className="p-4 border-l border-slate-100 text-slate-400 font-normal">
                  Not tracked in free tier
                </td>
              ))}
            </tr>
            {/* Calculated NAV per share */}
            <tr className="hover:bg-slate-50/20 text-xs bg-slate-50/10 text-left">
              <td className="p-4 font-semibold text-slate-800 font-sans flex items-center gap-1 text-left">
                <span>📚</span> Audited NAV Per Share
              </td>
              {comparedStocks.map(s => (
                <td key={s.symbol} className="p-4 border-l border-slate-100 text-slate-400 font-normal text-xs">
                  Not tracked in free tier
                </td>
              ))}
            </tr>
            {/* Dividend Yield */}
            <tr className="hover:bg-slate-50/20 text-xs text-left">
              <td className="p-4 font-semibold text-slate-600 font-sans text-left">Dividend Yield (%)</td>
              {comparedStocks.map(s => (
                <td key={s.symbol} className="p-4 border-l border-slate-100 text-slate-400 font-normal">
                  Not tracked in free tier
                </td>
              ))}
            </tr>
            {/* ROE Section */}
            <tr className="hover:bg-slate-50/20 text-xs text-left">
              <td className="p-4 font-semibold text-slate-600 font-sans text-left">Equity Yield Productivity (ROE)</td>
              {comparedStocks.map(s => (
                <td key={s.symbol} className="p-4 border-l border-slate-100 text-slate-400 font-normal">
                  Not tracked in free tier
                </td>
              ))}
            </tr>
            {/* Debt to Equity Ratio Section */}
            <tr className="hover:bg-slate-50/20 bg-slate-50/10 text-xs text-left">
              <td className="p-4 font-semibold text-slate-600 font-sans text-left">Gearing Debt-to-Equity</td>
              {comparedStocks.map(s => (
                <td key={s.symbol} className="p-4 border-l border-slate-100 text-slate-400 font-normal">
                  Not tracked in free tier
                </td>
              ))}
            </tr>
            {/* Research Commentary Note */}
            <tr className="hover:bg-slate-50/20 bg-slate-50/30 text-left">
              <td className="p-4 font-semibold text-slate-800 font-sans text-left">Research Note Commentary</td>
              {comparedStocks.map(s => (
                <td key={s.symbol} className="p-4 border-l border-slate-100 font-sans text-xs text-slate-600 leading-normal">
                  {s.investmentResearchSummary}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Sandbox presets helper
function getPresetSandboxData(symbol: string) {
  switch (symbol.toUpperCase()) {
    case "TCS":
      return { assets: 145000, liabilities: 42000, shares: 365 }; // Cr INR, crores of shares
    case "RELIANCE":
      return { assets: 1750000, liabilities: 1050000, shares: 677 };
    case "YESBANK":
      return { assets: 365000, liabilities: 320000, shares: 2871 };
    case "SUZLON":
      return { assets: 6500, liabilities: 1500, shares: 1363 };
    default:
      return { assets: 100000, liabilities: 40000, shares: 200 };
  }
}

// Sandbox Sub-component for NAV simulation
interface StockNavSandboxProps {
  activeStock: StockAnalysis;
}

function StockNavSandbox({ activeStock }: StockNavSandboxProps) {
  const preset = React.useMemo(() => getPresetSandboxData(activeStock.symbol), [activeStock.symbol]);
  
  const [totalAssets, setTotalAssets] = useState<number>(preset.assets);
  const [totalLiabilities, setTotalLiabilities] = useState<number>(preset.liabilities);
  const [outstandingShares, setOutstandingShares] = useState<number>(preset.shares);

  // Sync state if active stock changes
  React.useEffect(() => {
    const updated = getPresetSandboxData(activeStock.symbol);
    setTotalAssets(updated.assets);
    setTotalLiabilities(updated.liabilities);
    setOutstandingShares(updated.shares);
  }, [activeStock.symbol]);

  const rawNetAssetValue = Math.max(0, totalAssets - totalLiabilities);
  const calculatedBookValuePerShare = outstandingShares > 0 ? (rawNetAssetValue / outstandingShares) : 0; 

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-sans text-left">
      <div className="space-y-3 col-span-1">
        <div>
          <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Total Book Assets (₹ Crore)</label>
          <input
            type="number"
            value={totalAssets}
            onChange={(e) => setTotalAssets(Math.max(0, Number(e.target.value)))}
            className="w-full bg-white border border-slate-200 rounded-lg py-1 px-2.5 font-medium font-mono text-slate-700"
          />
        </div>
        <div>
          <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Senior Liabilities & Debts (₹ Crore)</label>
          <input
            type="number"
            value={totalLiabilities}
            onChange={(e) => setTotalLiabilities(Math.max(0, Number(e.target.value)))}
            className="w-full bg-white border border-slate-200 rounded-lg py-1 px-2.5 font-medium font-mono text-slate-700"
          />
        </div>
        <div>
          <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Outstanding Shares (Crore Units)</label>
          <input
            type="number"
            value={outstandingShares}
            onChange={(e) => setOutstandingShares(Math.max(1, Number(e.target.value)))}
            className="w-full bg-white border border-slate-200 rounded-lg py-1 px-2.5 font-medium font-mono text-slate-700"
          />
        </div>
      </div>

      <div className="bg-slate-900 text-white rounded-xl p-4 flex flex-col justify-between border border-slate-800 space-y-3 text-left">
        <div>
          <span className="text-[10px] text-emerald-400 uppercase font-bold tracking-wider block font-sans">Sandbox Net Asset Value (Book Equity)</span>
          <span className="text-lg font-extrabold font-mono text-white block mt-1">₹{rawNetAssetValue.toLocaleString()} Crore</span>
        </div>

        <div className="border-t border-slate-800 pt-2">
          <span className="text-[10px] text-slate-400 uppercase tracking-widest block font-sans">Sandbox calculated BVPS (NAV Per Share)</span>
          <span className="text-xl font-extrabold font-mono text-emerald-400 block mt-0.5 font-mono">₹{calculatedBookValuePerShare.toFixed(2)}</span>
        </div>

        <p className="text-[9.5px] text-slate-400 leading-relaxed pt-1 select-none font-sans text-left">
          Formula: (Assets - Liabilities) / Shares Outstanding. Current market price (<strong>{typeof activeStock.currentPrice === "number" ? `₹${activeStock.currentPrice}` : activeStock.currentPrice}</strong>) trades at <strong>{typeof activeStock.currentPrice === "number" && calculatedBookValuePerShare > 0 ? (activeStock.currentPrice / calculatedBookValuePerShare).toFixed(1) + "x" : "N/A"}</strong> book value.
        </p>
      </div>
    </div>
  );
}
