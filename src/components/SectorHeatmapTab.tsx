import React, { useState, useMemo } from "react";
import { 
  Grid, Search, SlidersHorizontal, ArrowUpRight, ArrowDownRight, 
  Sparkles, RefreshCw, Layers, ShieldAlert, Zap, Coins, Info, 
  ChevronRight, TrendingUp, Sliders, Play, TrendingDown
} from "lucide-react";
import { PRECOMPILED_STOCKS } from "../data";
import { VERIFIED_SYMBOL_REGISTRY } from "../symbolRegistry";

// Type definitions for Sector and active Shock Simulations
interface ConstituentStock {
  symbol: string;
  companyName: string;
  price: number;
  weight: number;
  change: number; // custom daily change
}

interface SectorData {
  id: string;
  name: string;
  icon: string;
  indexCode: string;
  indexValue: number;
  dailyChange: number;
  weeklyChange: number;
  ytdChange: number;
  marketCapTrillion: number; // in INR
  avgPe: number;
  avgPb: number;
  avgDivYield: number;
  constituents: ConstituentStock[];
  description: string;
}

interface MacroShock {
  id: string;
  title: string;
  badge: string;
  description: string;
  energyConglomeratesDelta: number;
  itTitansDelta: number;
  greenPowerDelta: number;
  bankNiftyDelta: number;
  autoSpeedDelta: number;
  pharmaDelta: number;
  fmcgDelta: number;
  metallicDelta: number;
}

// Fixed core baseline sectors datasets
const BASELINE_SECTORS: SectorData[] = [
  {
    id: "it",
    name: "Information Technology",
    icon: "💻",
    indexCode: "NIFTY IT Titans",
    indexValue: 35482.10,
    dailyChange: 1.28,
    weeklyChange: 2.45,
    ytdChange: 18.40,
    marketCapTrillion: 18.2,
    avgPe: 26.50,
    avgPb: 8.20,
    avgDivYield: 1.45,
    description: "Technology consulting, software development, cloud computing services, and enterprise artificial intelligence engines.",
    constituents: [
      { symbol: "TCS", companyName: "Tata Consultancy Services Ltd", price: 2161.10, weight: 35, change: 1.28 },
      { symbol: "INFY", companyName: "Infosys Ltd", price: 1475.2, weight: 28, change: 0.95 },
      { symbol: "HCLTECH", companyName: "HCL Technologies Ltd", price: 1350.1, weight: 20, change: 1.55 },
      { symbol: "WIPRO", companyName: "Wipro Ltd", price: 465.3, weight: 17, change: 0.82 }
    ]
  },
  {
    id: "bfsi",
    name: "Banking & Financials",
    icon: "🏦",
    indexCode: "BANK Nifty",
    indexValue: 49850.30,
    dailyChange: 0.42,
    weeklyChange: -0.75,
    ytdChange: 12.15,
    marketCapTrillion: 24.5,
    avgPe: 18.20,
    avgPb: 2.10,
    avgDivYield: 1.10,
    description: "Commercial banking, private credit, non-banking financial products (NBFCs), housing microfinance, and asset managements.",
    constituents: [
      { symbol: "HDFCBANK", companyName: "HDFC Bank Ltd", price: 1650.0, weight: 45, change: 0.35 },
      { symbol: "YESBANK", companyName: "Yes Bank Ltd", price: 24.2, weight: 15, change: 1.15 },
      { symbol: "IDFCFIRSTB", companyName: "IDFC First Bank Ltd", price: 78.5, weight: 12, change: -0.22 },
      { symbol: "SBIN", companyName: "State Bank of India", price: 810.4, weight: 28, change: 0.54 }
    ]
  },
  {
    id: "renewables",
    name: "Renewable Energy & Power",
    icon: "🌱",
    indexCode: "NIFTY Wind & Green",
    indexValue: 18242.45,
    dailyChange: 2.45,
    weeklyChange: 6.12,
    ytdChange: 42.80,
    marketCapTrillion: 6.8,
    avgPe: 45.00,
    avgPb: 9.80,
    avgDivYield: 0.15,
    description: "Wind energy infrastructure, PV solar plants, batteries power storage storage systems, and domestic green hydrogen developers.",
    constituents: [
      { symbol: "SUZLON", companyName: "Suzlon Energy Ltd", price: 45.8, weight: 42, change: 2.45 },
      { symbol: "INOXWIND", companyName: "Inox Wind Ltd", price: 142.5, weight: 28, change: 1.85 },
      { symbol: "WAAREE", companyName: "Waaree Energies Ltd", price: 1650.0, weight: 18, change: 3.10 },
      { symbol: "TATAPOWER", companyName: "Tata Power Co Ltd", price: 442.2, weight: 12, change: 2.15 }
    ]
  },
  {
    id: "energy",
    name: "Conglomerates & Energy",
    icon: "⚡",
    indexCode: "NIFTY Energy Conglo",
    indexValue: 28150.40,
    dailyChange: 0.74,
    weeklyChange: 1.80,
    ytdChange: 14.60,
    marketCapTrillion: 21.0,
    avgPe: 24.20,
    avgPb: 2.90,
    avgDivYield: 0.40,
    description: "Complex capital-intensive conglomerates running oil-refining assets, heavy retail infrastructure pipelines, and logistics.",
    constituents: [
      { symbol: "RELIANCE", companyName: "Reliance Industries Ltd", price: 1422.60, weight: 60, change: 0.74 },
      { symbol: "ADANIENT", companyName: "Adani Enterprises Ltd", price: 3120.5, weight: 20, change: 1.25 },
      { symbol: "IOC", companyName: "Indian Oil Corp Ltd", price: 168.3, weight: 12, change: -0.45 },
      { symbol: "LT", companyName: "Larsen & Toubro Ltd", price: 3550.0, weight: 8, change: 0.95 }
    ]
  },
  {
    id: "auto",
    name: "Automotive & EV",
    icon: "🚗",
    indexCode: "NIFTY Auto Speed",
    indexValue: 11450.80,
    dailyChange: 1.15,
    weeklyChange: 2.10,
    ytdChange: 26.50,
    marketCapTrillion: 11.4,
    avgPe: 19.50,
    avgPb: 4.20,
    avgDivYield: 0.95,
    description: "Electric vehicle developers, heavy utility SUVs, family sedans, two-wheeler mobility, and OEM automotive systems.",
    constituents: [
      { symbol: "TATAMOTORS", companyName: "Tata Motors Ltd", price: 928.1, weight: 35, change: 1.45 },
      { symbol: "M&M", companyName: "Mahindra & Mahindra Ltd", price: 2145.5, weight: 25, change: 0.85 },
      { symbol: "MARUTI", companyName: "Maruti Suzuki India Ltd", price: 12150.0, weight: 25, change: 1.10 },
      { symbol: "BAJAJ-AUTO", companyName: "Bajaj Auto Ltd", price: 9120.0, weight: 15, change: 1.20 }
    ]
  },
  {
    id: "pharma",
    name: "Pharmaceuticals",
    icon: "💊",
    indexCode: "NIFTY Pharma Care",
    indexValue: 15920.15,
    dailyChange: -0.35,
    weeklyChange: 0.85,
    ytdChange: 9.40,
    marketCapTrillion: 9.2,
    avgPe: 23.80,
    avgPb: 3.80,
    avgDivYield: 0.80,
    description: "Sustained defensive growth based on generic formulations, active APIs, biomedical trials, and international export pipelines.",
    constituents: [
      { symbol: "SUNPHARMA", companyName: "Sun Pharmaceutical Industries", price: 1540.3, weight: 40, change: -0.22 },
      { symbol: "DRREDDY", companyName: "Dr Reddy's Laboratories", price: 6150.4, weight: 25, change: -0.55 },
      { symbol: "CIPLA", companyName: "Cipla Ltd", price: 1420.2, weight: 20, change: 0.12 },
      { symbol: "APOLLOHOSP", companyName: "Apollo Hospitals Enterprise", price: 5880.0, weight: 15, change: -0.85 }
    ]
  },
  {
    id: "fmcg",
    name: "FMCG Staples",
    icon: "🍪",
    indexCode: "NIFTY FMCG Pioneers",
    indexValue: 19820.75,
    dailyChange: -0.15,
    weeklyChange: -1.20,
    ytdChange: 6.80,
    marketCapTrillion: 13.1,
    avgPe: 42.10,
    avgPb: 11.50,
    avgDivYield: 2.25,
    description: "Highly secure cash-rich giants producing daily consumer goods, dairy staples, personal care products, and agricultural food lines.",
    constituents: [
      { symbol: "HINDUNILVR", companyName: "Hindustan Unilever Ltd", price: 2380.0, weight: 48, change: -0.45 },
      { symbol: "ITC", companyName: "ITC Ltd", price: 428.4, weight: 32, change: 0.25 },
      { symbol: "NESTLEIND", companyName: "Nestle India Ltd", price: 2450.0, weight: 12, change: -0.10 },
      { symbol: "BRITANNIA", companyName: "Britannia Industries Ltd", price: 5120.0, weight: 8, change: -0.35 }
    ]
  },
  {
    id: "metals",
    name: "Metals & Commodore",
    icon: "🏗️",
    indexCode: "NIFTY Metallic Core",
    indexValue: 8420.30,
    dailyChange: 1.85,
    weeklyChange: -2.15,
    ytdChange: 15.20,
    marketCapTrillion: 7.9,
    avgPe: 14.50,
    avgPb: 1.80,
    avgDivYield: 3.10,
    description: "Heavy metallurgy refinement complexes supplying structural carbon steels, architectural aluminum alloys, and base ore extractions.",
    constituents: [
      { symbol: "TATASTEEL", companyName: "Tata Steel Ltd", price: 158.4, weight: 38, change: 1.95 },
      { symbol: "JSWSTEEL", companyName: "JSW Steel Ltd", price: 890.3, weight: 27, change: 2.20 },
      { symbol: "HINDALCO", companyName: "Hindalco Industries Ltd", price: 615.2, weight: 20, change: 1.45 },
      { symbol: "VEDL", companyName: "Vedanta Ltd", price: 442.2, weight: 15, change: 1.80 }
    ]
  }
];

const MACRO_SHOCKS: MacroShock[] = [
  {
    id: "ai_surge",
    title: "AI Boom & Digitalisation Wave",
    badge: "💻 Tech Surge",
    description: "Unprecedented global demand for GenAI automation tools. Massive cloud scaling licenses are renewed across international consulting majors, boosting software and telecom networks.",
    energyConglomeratesDelta: 0.8,
    itTitansDelta: 5.4,
    greenPowerDelta: 1.6,
    bankNiftyDelta: 1.2,
    autoSpeedDelta: 0.5,
    pharmaDelta: -0.2,
    fmcgDelta: 0.1,
    metallicDelta: 0.4
  },
  {
    id: "rate_cut",
    title: "Reserve Bank Interest Rate Cut",
    badge: "🏛️ Gearing Lift",
    description: "Central bank announces a surprise 50 bps repo rate cut to stimulate infrastructure capital. Slashes borrowing costs for domestic home buyers and automotive fleets.",
    energyConglomeratesDelta: 2.5,
    itTitansDelta: 1.8,
    greenPowerDelta: 3.2,
    bankNiftyDelta: 3.9,
    autoSpeedDelta: 3.1,
    pharmaDelta: 1.1,
    fmcgDelta: 1.5,
    metallicDelta: 2.8
  },
  {
    id: "oil_shock",
    title: "Global Crude Oil Supply Deficit",
    badge: "🛢️ Carbon Headwind",
    description: "Middle East geopolitics trigger structural supply caps. Brent crude surges to $105/barrel, raising transport logistics and refining cost lines while penalizing heavy manufacturing.",
    energyConglomeratesDelta: -2.8,
    itTitansDelta: 0.4,
    greenPowerDelta: 4.8, // Renewables surge as alternative
    bankNiftyDelta: -1.9,
    autoSpeedDelta: -3.5,
    pharmaDelta: -0.8,
    fmcgDelta: -1.8,
    metallicDelta: -2.2
  },
  {
    id: "monsoon_boom",
    title: "Monsoon Surplus & Rural Boost",
    badge: "🌾 Consumer Rally",
    description: "Widespread premium rainfalls refresh domestic agricultural yields. Direct rural disposable income surges, triggering massive consumption cycles across micro-banking and packaged products.",
    energyConglomeratesDelta: 1.2,
    itTitansDelta: 0.5,
    greenPowerDelta: 1.0,
    bankNiftyDelta: 2.8,
    autoSpeedDelta: 3.2,
    pharmaDelta: 0.5,
    fmcgDelta: 4.8,
    metallicDelta: 1.9
  },
  {
    id: "green_subsidy",
    title: "Global Green Energy Mandate",
    badge: "☀️ Renewables Rush",
    description: "Sovereign carbon tax offsets double. Government awards mega multi-gigawatt solar-panel and offshore wind infrastructure projects under zero tax credit schemes core capital injections.",
    energyConglomeratesDelta: -0.6,
    itTitansDelta: 0.8,
    greenPowerDelta: 6.8,
    bankNiftyDelta: 1.5,
    autoSpeedDelta: 1.8,
    pharmaDelta: 0.2,
    fmcgDelta: -0.4,
    metallicDelta: 3.1 // steel needed for wind towers!
  },
  {
    id: "bear_liquidation",
    title: "Global Institutional Selloff Panic",
    badge: "📉 Liquidation Event",
    description: "US interest rates are raised unexpectedly. Sovereign wealth funds trigger margin-call liquidations across emerging markets, causing a synchronized passive equity index drop.",
    energyConglomeratesDelta: -3.2,
    itTitansDelta: -2.8,
    greenPowerDelta: -4.1,
    bankNiftyDelta: -3.8,
    autoSpeedDelta: -3.5,
    pharmaDelta: -1.4,
    fmcgDelta: -1.0,
    metallicDelta: -4.5
  }
];

interface SectorHeatmapTabProps {
  setActiveStock?: (stock: any) => void;
  setActiveTab?: (tab: any) => void;
}

export default function SectorHeatmapTab({ setActiveStock, setActiveTab }: SectorHeatmapTabProps) {
  const [timeframe, setTimeframe] = useState<"daily" | "weekly" | "ytd">("daily");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"performance" | "marketCap" | "name">("performance");
  const [sortOrder, setSortOrder] = useState<"desc" | "asc">("desc");
  const [selectedSectorId, setSelectedSectorId] = useState<string>("renewables");
  const [activeShockId, setActiveShockId] = useState<string | null>(null);

  // Dynamic values accounting for macro simulation shock states
  const sectorsData = useMemo(() => {
    if (!activeShockId) return BASELINE_SECTORS;
    
    // Find selected macro shock multipliers
    const shock = MACRO_SHOCKS.find(s => s.id === activeShockId);
    if (!shock) return BASELINE_SECTORS;

    return BASELINE_SECTORS.map(sec => {
      let delta = 0;
      switch (sec.id) {
        case "it": delta = shock.itTitansDelta; break;
        case "bfsi": delta = shock.bankNiftyDelta; break;
        case "renewables": delta = shock.greenPowerDelta; break;
        case "energy": delta = shock.energyConglomeratesDelta; break;
        case "auto": delta = shock.autoSpeedDelta; break;
        case "pharma": delta = shock.pharmaDelta; break;
        case "fmcg": delta = shock.fmcgDelta; break;
        case "metals": delta = shock.metallicDelta; break;
      }

      // Compute shifted indices and growth deltas
      const originalDaily = sec.dailyChange;
      const originalWeekly = sec.weeklyChange;
      const originalYtd = sec.ytdChange;
      
      const multiplierFactor = 1 + (delta / 100);

      return {
        ...sec,
        // Apply shocks directly
        dailyChange: Number((originalDaily + delta).toFixed(2)),
        weeklyChange: Number((originalWeekly + delta * 1.5).toFixed(2)),
        ytdChange: Number((originalYtd + delta * 3.0).toFixed(2)),
        indexValue: Math.round(sec.indexValue * multiplierFactor),
        // Adjust individual constituents changes for visualization
        constituents: sec.constituents.map(c => ({
          ...c,
          change: Number((c.change + delta * (0.8 + Math.random() * 0.4)).toFixed(2)),
          price: Number((c.price * (1 + (delta * (0.8 + Math.random() * 0.4)) / 100)).toFixed(2))
        }))
      };
    });
  }, [activeShockId]);

  // Compute selected sector index data
  const selectedSector = useMemo(() => {
    return sectorsData.find(s => s.id === selectedSectorId) || sectorsData[0];
  }, [sectorsData, selectedSectorId]);

  // Sorting + Filtering implementation
  const processedSectors = useMemo(() => {
    let result = [...sectorsData];

    // 1. Search Query filtering
    if (searchQuery.trim() !== "") {
      const q = searchQuery.toLowerCase();
      result = result.filter(sec => 
        sec.name.toLowerCase().includes(q) ||
        sec.indexCode.toLowerCase().includes(q) ||
        sec.constituents.some(c => c.symbol.toLowerCase().includes(q) || c.companyName.toLowerCase().includes(q))
      );
    }

    // 2. Sort metrics extraction
    result.sort((a, b) => {
      let metricA = 0;
      let metricB = 0;

      if (sortBy === "name") {
        return sortOrder === "asc" 
          ? a.name.localeCompare(b.name) 
          : b.name.localeCompare(a.name);
      } else if (sortBy === "marketCap") {
        metricA = a.marketCapTrillion;
        metricB = b.marketCapTrillion;
      } else {
        // Performance
        metricA = timeframe === "daily" ? a.dailyChange : timeframe === "weekly" ? a.weeklyChange : a.ytdChange;
        metricB = timeframe === "daily" ? b.dailyChange : timeframe === "weekly" ? b.weeklyChange : b.ytdChange;
      }

      return sortOrder === "desc" ? metricB - metricA : metricA - metricB;
    });

    return result;
  }, [sectorsData, searchQuery, sortBy, sortOrder, timeframe]);

  // Helper mapping values to live cell coloring classnames
  const getHeatmapColorClass = (value: number) => {
    if (value >= 5.0) {
      return "bg-emerald-950 border-emerald-400 text-white shadow-md ring-2 ring-emerald-500/35";
    }
    if (value >= 2.0) {
      return "bg-emerald-900 border-emerald-500 text-white";
    }
    if (value >= 0.5) {
      return "bg-emerald-800/80 border-emerald-600/85 text-emerald-100";
    }
    if (value >= 0.0) {
      return "bg-slate-800 border-slate-700 text-slate-300";
    }
    if (value >= -0.5) {
      return "bg-slate-850 border-slate-800 text-slate-400";
    }
    if (value >= -2.0) {
      return "bg-rose-950/40 border-rose-900/60 text-rose-300";
    }
    if (value >= -4.0) {
      return "bg-rose-900 border-rose-600 text-rose-100";
    }
    return "bg-rose-950 border-rose-400 text-white shadow-sm ring-2 ring-rose-500/35";
  };

  const getPercentageSpan = (val: number) => {
    const isPositive = val >= 0;
    return (
      <span className={`inline-flex items-center gap-0.5 font-mono font-bold text-xs ${isPositive ? "text-emerald-400" : "text-rose-400"}`}>
        {isPositive ? "+" : ""}{val.toFixed(2)}%
        {isPositive ? <ArrowUpRight className="w-3_5 h-3_5" /> : <ArrowDownRight className="w-3_5 h-3_5" />}
      </span>
    );
  };

  // Safe wrapper to redirect user to core stock analyzer
  const handleNavToStock = (symbol: string) => {
    const upperSym = symbol.toUpperCase();
    if (PRECOMPILED_STOCKS[upperSym]) {
      if (setActiveStock) {
        setActiveStock(PRECOMPILED_STOCKS[upperSym]);
      }
      if (setActiveTab) {
        setActiveTab("stocks");
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    } else {
      // Find or build a stock analysis shell and redirect
      const registryMatch = VERIFIED_SYMBOL_REGISTRY.find(e => e.ticker.toUpperCase().includes(upperSym) || e.name.toUpperCase().includes(upperSym));
      if (setActiveStock) {
        setActiveStock({
          companyName: registryMatch ? registryMatch.name : symbol,
          symbol: upperSym,
          sector: registryMatch ? registryMatch.sector : "Market Equities",
          about: `${symbol} equity asset.`,
          currentPrice: "Live data unavailable",
          currency: "INR",
          eps: "Not tracked in free tier",
          peRatio: "Not tracked in free tier",
          pbRatio: "Not tracked in free tier",
          dividendYield: "Not tracked in free tier",
          dividends: [],
          financials: [],
          ratios: { liquidity: [], solvency: [], efficiency: [] },
          competitors: [],
          futureGrowth: { predictionSummary: "Live growth predictions unavailable.", years: [] },
          investmentResearchSummary: `Real-time data for ${symbol} tracked via exchange proxy.`
        });
      }
      if (setActiveTab) {
        setActiveTab("stocks");
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn" id="sector-heatmap-workspace">
      
      {/* Intro Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 text-white rounded-3xl p-6 md:p-8 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 shadow-md border border-slate-800">
        <div className="space-y-2 text-left">
          <div className="flex items-center gap-2">
            <span className="p-1 px-2 text-[10px] uppercase font-mono tracking-widest font-extrabold bg-emerald-600 text-white rounded-md flex items-center gap-1">
              <Zap className="w-3.5 h-3.5 fill-current text-white" />
              Live Visual Indices
            </span>
            <span className="text-slate-300 text-xs font-sans">• Heatmap Visualisation Platform</span>
          </div>
          <h2 className="text-2xl font-black tracking-tight" id="heatmap-core-title">Sector Valuation Heatmap & Cluster Grid</h2>
          <p className="text-slate-300 text-xs max-w-3xl leading-relaxed">
            Diagnose relative asset heatmaps across key industry sectors instantly. Compare structural valuation multipliers, identify historical PE premium bubbles, and simulate major macroeconomic shocks to view real-time stress testing color transformations.
          </p>
        </div>
        <Grid className="w-12 h-12 text-emerald-500 shrink-0 select-none hidden lg:block" />
      </div>

      {/* Primary Grid Layout: Interactive Heatmap Grid (Left) & Valuation Inspector (Right) */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 items-start">
        
        {/* Heatmap controller and Grid (SPAN 2) */}
        <div className="xl:col-span-2 space-y-6">
          
          <div className="bg-slate-900 text-white rounded-3xl p-6 border border-slate-800 space-y-6">
            
            {/* Filter Hub Toolbar */}
            <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center border-b border-slate-800 pb-5">
              
              {/* Left Side: Timeframe Selector */}
              <div className="space-y-1 text-left">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Select Performance Span</span>
                <div className="flex bg-slate-950 p-1 rounded-lg border border-slate-800">
                  <button
                    onClick={() => setTimeframe("daily")}
                    className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all cursor-pointer ${
                      timeframe === "daily" ? "bg-emerald-600 text-white shadow-xs" : "text-slate-400 hover:text-white"
                    }`}
                  >
                    1 Day
                  </button>
                  <button
                    onClick={() => setTimeframe("weekly")}
                    className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all cursor-pointer ${
                      timeframe === "weekly" ? "bg-emerald-600 text-white shadow-xs" : "text-slate-400 hover:text-white"
                    }`}
                  >
                    1 Week
                  </button>
                  <button
                    onClick={() => setTimeframe("ytd")}
                    className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all cursor-pointer ${
                      timeframe === "ytd" ? "bg-emerald-600 text-white shadow-xs" : "text-slate-400 hover:text-white"
                    }`}
                  >
                    YTD Change
                  </button>
                </div>
              </div>

              {/* Right Side: Search and Sorting controls */}
              <div className="flex flex-wrap md:flex-nowrap gap-3 items-end w-full md:w-auto">
                
                {/* Search query input */}
                <div className="relative w-full md:w-48">
                  <span className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-slate-500">
                    <Search className="w-3.5 h-3.5" />
                  </span>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search stock, sector..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg py-1.5 pl-8 pr-3 text-xs text-slate-200 font-medium placeholder:text-slate-600 focus:outline-hidden focus:ring-1 focus:ring-emerald-500 font-sans"
                  />
                </div>

                {/* Sorting Select Option */}
                <div className="flex gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="bg-transparent border-0 text-slate-300 text-[11px] font-bold py-1 px-2 focus:outline-hidden cursor-pointer"
                  >
                    <option value="performance" className="bg-slate-950 text-white">Performance</option>
                    <option value="marketCap" className="bg-slate-950 text-white">Market Capital</option>
                    <option value="name" className="bg-slate-950 text-white">Name</option>
                  </select>
                  
                  <button
                    onClick={() => setSortOrder(prev => prev === "desc" ? "asc" : "desc")}
                    className="p-1 text-slate-400 hover:text-white rounded-md text-xs font-mono font-bold"
                    title={sortOrder === "desc" ? "High to Low" : "Low to High"}
                  >
                    {sortOrder === "desc" ? "↓" : "↑"}
                  </button>
                </div>

              </div>
            </div>

            {/* Simulated shock indicator banner */}
            {activeShockId && (
              <div className="bg-emerald-950/40 border border-emerald-990/60 rounded-2xl p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 text-left">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 bg-emerald-500 text-white text-[9px] font-black rounded uppercase animate-pulse">● LIVE SIMULATION MATRIX ON</span>
                    <strong className="text-white text-xs font-black">
                      {MACRO_SHOCKS.find(s => s.id === activeShockId)?.title}
                    </strong>
                  </div>
                  <p className="text-slate-300 text-[10.5px] leading-relaxed max-w-xl">
                    Stress-tested prices and performance indices are active in coordinates. Standard Indian market baselines are shifted.
                  </p>
                </div>
                <button
                  onClick={() => setActiveShockId(null)}
                  className="px-3 py-1.5 text-[10px] font-extrabold bg-slate-950 border border-slate-800 hover:bg-slate-850 text-slate-300 rounded-lg flex items-center gap-1 cursor-pointer select-none transition-all"
                >
                  <RefreshCw className="w-3 h-3" />
                  Restore Live Feeds
                </button>
              </div>
            )}

            {/* Grid-Based Heatmap Visualizer */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4" id="heatmap-cells-grid">
              {processedSectors.length === 0 ? (
                <div className="col-span-full py-16 text-center text-slate-500 text-xs">
                  No industry sectors match your query criteria. Use a different filter or search.
                </div>
              ) : (
                processedSectors.map((sec) => {
                  const val = timeframe === "daily" ? sec.dailyChange : timeframe === "weekly" ? sec.weeklyChange : sec.ytdChange;
                  const isSelected = sec.id === selectedSectorId;
                  const colorClass = getHeatmapColorClass(val);

                  return (
                    <button
                      key={sec.id}
                      onClick={() => setSelectedSectorId(sec.id)}
                      className={`h-40 rounded-2xl text-left p-4 p-y-5 border flex flex-col justify-between transition-all duration-300 relative overflow-hidden select-none cursor-pointer ${colorClass} ${
                        isSelected 
                          ? "ring-3 ring-emerald-400 ring-offset-2 ring-offset-slate-900 border-emerald-300 scale-[1.02] shadow-xl" 
                          : "hover:scale-[1.01] hover:brightness-[1.10] shadow-sm"
                      }`}
                    >
                      {/* Grid background visual decorations */}
                      <span className="absolute bottom-1 right-2 text-6xl opacity-10 pointer-events-none select-none">
                        {sec.icon}
                      </span>

                      {/* Header Segment */}
                      <div className="space-y-0.5">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-[10px] font-black uppercase tracking-wider opacity-85 block truncate">
                            {sec.indexCode}
                          </span>
                          <span className="text-[11px] block">{sec.icon}</span>
                        </div>
                        <h4 className="font-extrabold text-sm leading-tight tracking-tight line-clamp-2">
                          {sec.name}
                        </h4>
                      </div>

                      {/* Value and Change Segment */}
                      <div className="space-y-1.5 z-10">
                        <div className="text-[10px] opacity-75 font-semibold font-mono block">
                          Index: {sec.indexValue.toLocaleString()}
                        </div>
                        <div className="flex items-baseline justify-between border-t border-white/10 pt-1.5">
                          <span className="text-[9px] uppercase tracking-wider opacity-75 block font-semibold">
                            {timeframe === "daily" ? "Daily" : timeframe === "weekly" ? "Weekly" : "YTD"} Yield
                          </span>
                          <span className="font-mono font-black text-sm block">
                            {val >= 0 ? "+" : ""}{val.toFixed(2)}%
                          </span>
                        </div>
                      </div>
                    </button>
                  );
                })
              )}
            </div>

            {/* Extra Jargon Help */}
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-[11px] leading-relaxed text-slate-400 flex gap-2 items-start text-left font-sans shadow-inner">
              <Info className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <span className="text-white font-bold text-xs block">Technical Note on the Sector Heatmap Methodology:</span>
                <p>
                  Sector coordinate cells represent index capitalisation weights. Dark green cells depict strong overperforming growth sectors (&gt;2% return) while rose shades depict active sell-off corrections. Tap on any sector card to query constituents list, calculate relative valuations, or simulate macroeconomic actions.
                </p>
              </div>
            </div>

          </div>

          {/* New Macro Stress Test Control Center Panel */}
          <div className="bg-slate-900 text-white rounded-3xl p-6 md:p-8 border border-slate-800 space-y-6">
            
            <div className="flex items-start justify-between border-b border-slate-800 pb-4">
              <div className="space-y-1 text-left">
                <h3 className="text-md font-bold text-white flex items-center gap-1.5">
                  <Sliders className="w-5 h-5 text-emerald-500 block" />
                  Interactive Financial Macro Shock Simulator
                </h3>
                <p className="text-slate-400 text-xs">
                  Select a sandbox macro scenario below under direct simulation. stress-test how systemic factors change indices:
                </p>
              </div>
              
              {activeShockId && (
                <button
                  type="button"
                  onClick={() => setActiveShockId(null)}
                  className="px-2.5 py-1 text-[10px] font-black text-emerald-400 hover:text-white bg-emerald-950/60 border border-emerald-900 rounded-md transition-all cursor-pointer select-none uppercase tracking-wider"
                >
                  Reset Shock
                </button>
              )}
            </div>

            {/* List of Scenarios cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {MACRO_SHOCKS.map(shock => {
                const isActive = shock.id === activeShockId;
                return (
                  <button
                    key={shock.id}
                    onClick={() => setActiveShockId(isActive ? null : shock.id)}
                    className={`p-4 rounded-2xl border text-left flex flex-col justify-between gap-3 transition-all select-none cursor-pointer ${
                      isActive 
                        ? "bg-emerald-950/50 border-emerald-500 shadow-md ring-1 ring-emerald-500/20" 
                        : "bg-slate-950 border-slate-850/70 hover:border-slate-700/80 hover:bg-slate-950/80"
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-[9px] uppercase font-mono tracking-widest bg-slate-900 text-slate-300 p-0.5 px-2 border border-slate-800 rounded">
                          {shock.badge}
                        </span>
                        {isActive && (
                          <span className="flex h-2 w-2 relative">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                          </span>
                        )}
                      </div>
                      <strong className="text-xs font-extrabold tracking-tight text-white block">
                        {shock.title}
                      </strong>
                    </div>

                    <p className="text-[10.5px] leading-relaxed text-slate-400 line-clamp-3">
                      {shock.description}
                    </p>

                    <div className="flex items-center gap-1 bg-slate-900 p-1.5 px-2 rounded-lg text-[9.5px] font-mono text-slate-300">
                      <span className="text-emerald-400 uppercase font-bold">Stress Vector:</span>
                      <span className="truncate">
                        IT ({shock.itTitansDelta >= 0 ? "+" : ""}{shock.itTitansDelta}%) • BFSI ({shock.bankNiftyDelta >= 0 ? "+" : ""}{shock.bankNiftyDelta}%) • Renew ({shock.greenPowerDelta >= 0 ? "+" : ""}{shock.greenPowerDelta}%)
                      </span>
                    </div>

                  </button>
                );
              })}
            </div>

          </div>

        </div>

        {/* Valuation inspector Card (SPAN 1) */}
        <div className="space-y-6">
          
          {/* Detailed breakdown card */}
          <div className="bg-white rounded-3xl p-6 shadow-xs border border-slate-100 space-y-6 text-left" id="sector-details-pane">
            
            {/* Header */}
            <div className="border-b border-slate-100 pb-4 space-y-1">
              <span className="text-[10px] bg-slate-100 text-slate-600 border border-slate-200 p-0.5 px-2 rounded-md font-bold inline-block select-none">
                Live Valuation Benchmarks
              </span>
              <div className="flex justify-between items-center gap-2">
                <h3 className="text-md font-black text-slate-900 flex items-center gap-1.5">
                  <span className="text-lg">{selectedSector.icon}</span>
                  {selectedSector.name}
                </h3>
                {getPercentageSpan(timeframe === "daily" ? selectedSector.dailyChange : timeframe === "weekly" ? selectedSector.weeklyChange : selectedSector.ytdChange)}
              </div>
              <span className="text-[10.5px] font-mono text-slate-400 block uppercase">
                {selectedSector.indexCode} index • ₹{selectedSector.indexValue.toLocaleString()}
              </span>
            </div>

            {/* Sector Description paragraph */}
            <p className="text-[11.5px] leading-relaxed text-slate-500">
              {selectedSector.description}
            </p>

            {/* Average Valuation Ratios Multipliers */}
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-center space-y-0.5 shadow-inner">
                <span className="text-[9px] uppercase font-bold text-slate-400 block leading-none">Sector PE</span>
                <span className="text-sm font-black font-mono text-slate-800 block leading-none pt-1">
                  {selectedSector.avgPe}x
                </span>
                <span className="text-[8.5px] text-slate-400 block leading-none pt-1">
                  {selectedSector.avgPe > 30 ? "Premium" : selectedSector.avgPe < 15 ? "Deep Value" : "Balanced"}
                </span>
              </div>

              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-center space-y-0.5 shadow-inner">
                <span className="text-[9px] uppercase font-bold text-slate-400 block leading-none">Sector PB</span>
                <span className="text-sm font-black font-mono text-slate-800 block leading-none pt-1">
                  {selectedSector.avgPb}x
                </span>
                <span className="text-[8.5px] text-slate-400 block leading-none pt-1">
                  Asset Ratio
                </span>
              </div>

              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-center space-y-0.5 shadow-inner">
                <span className="text-[9px] uppercase font-bold text-slate-400 block leading-none">Avg Yield</span>
                <span className="text-sm font-black font-mono text-slate-800 block leading-none pt-1">
                  {selectedSector.avgDivYield}%
                </span>
                <span className="text-[8.5px] text-slate-400 block leading-none pt-1">
                  Cash Return
                </span>
              </div>
            </div>

            {/* Sector weight and general sizing indicators */}
            <div className="space-y-2 bg-slate-50 p-4 rounded-2xl border border-slate-100/80">
              <span className="text-[10px] font-bold text-slate-400 tracking-wider uppercase block">Index Capital Weighting</span>
              
              <div className="space-y-1">
                <div className="flex justify-between text-[11px] font-semibold text-slate-700">
                  <span>Sovereign Market Cap Size</span>
                  <span className="font-mono">₹{selectedSector.marketCapTrillion} Trillion</span>
                </div>
                {/* Visual meter bar comparing to global BFSI scale */}
                <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-emerald-600 transition-all duration-1000"
                    style={{ width: `${(selectedSector.marketCapTrillion / 25.0) * 100}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Constituents Stock list list */}
            <div className="space-y-3.5">
              <span className="text-[10px] font-bold text-slate-400 tracking-widest uppercase block border-b border-slate-100 pb-1">
                Constituents index mapping
              </span>

              <div className="space-y-2.5">
                {selectedSector.constituents.map(stock => {
                  const upperSym = stock.symbol.toUpperCase();
                  const canClick = true;
                  
                  return (
                    <div 
                      key={stock.symbol}
                      className="p-3 bg-slate-50/50 hover:bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between gap-3 text-left"
                    >
                      <div className="space-y-0.5 flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono font-bold text-xs text-slate-800">{stock.symbol}</span>
                          <span className="text-[9px] text-slate-400 font-bold px-1.5 bg-slate-100 border border-slate-200 rounded">
                            Weight {stock.weight}%
                          </span>
                        </div>
                        <span className="text-[10.5px] text-slate-400 block truncate">{stock.companyName}</span>
                      </div>

                      <div className="text-right space-y-0.5">
                        <span className="font-mono font-bold text-xs text-slate-800 block">
                          ₹{stock.price.toLocaleString(undefined, { minimumFractionDigits: 1 })}
                        </span>
                        <span className={`inline-flex items-center font-mono font-bold text-[10px] leading-none ${stock.change >= 0 ? "text-emerald-600" : "text-rose-600"}`}>
                          {stock.change >= 0 ? "+" : ""}{stock.change.toFixed(2)}%
                        </span>
                      </div>

                      {canClick && (
                        <button
                          type="button"
                          onClick={() => handleNavToStock(stock.symbol)}
                          className="p-1 text-slate-300 hover:text-emerald-600 hover:bg-emerald-50 rounded-md transition-all cursor-pointer"
                          title={`Benzmark details in Stock Market Analyzer`}
                        >
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* CTA action helper */}
            <div className="bg-emerald-50 text-emerald-850 p-4 rounded-2xl border border-emerald-100/50 text-[11px] leading-relaxed flex gap-2">
              <Sparkles className="w-4.5 h-4.5 text-emerald-600 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <strong>Instant Tab Link Integration:</strong>
                <p>
                  Constituents printed with a right chevron button can be clicked to automatically select and examine that asset inside the precompiled ratios screen.
                </p>
              </div>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
