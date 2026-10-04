import React, { useState } from "react";
import { 
  BookOpen, HelpCircle, TrendingUp, Landmark, Percent, 
  HelpCircleIcon, Award, DollarSign, ArrowRight, Lightbulb, CheckCircle2 
} from "lucide-react";

export default function EducationAcademyTab() {
  const [activeConcept, setActiveConcept] = useState<"nav" | "pe" | "dividend" | "stepup">("nav");

  // Dynamic Simulators state
  // 1. NAV Simulator state
  const [mfAssets, setMfAssets] = useState<number>(500000000); // 50 Cr
  const [mfLiabilities, setMfLiabilities] = useState<number>(50000000); // 5 Cr
  const [mfUnits, setMfUnits] = useState<number>(15000000); // 1.5 Cr units Outstanding

  // 2. PE Simulator state
  const [companySharePrice, setCompanySharePrice] = useState<number>(3500);
  const [companyEarnings, setCompanyEarnings] = useState<number>(120);

  // 3. Dividend yield calculator state
  const [sharePriceDiv, setSharePriceDiv] = useState<number>(600);
  const [annualPaymentDiv, setAnnualPaymentDiv] = useState<number>(18);

  const calculatedMfNav = React.useMemo(() => {
    const netAssets = mfAssets - mfLiabilities;
    return mfUnits > 0 ? (netAssets / mfUnits) : 0;
  }, [mfAssets, mfLiabilities, mfUnits]);

  const calculatedPe = React.useMemo(() => {
    return companyEarnings > 0 ? (companySharePrice / companyEarnings) : 0;
  }, [companySharePrice, companyEarnings]);

  const calculatedDivYield = React.useMemo(() => {
    return sharePriceDiv > 0 ? ((annualPaymentDiv / sharePriceDiv) * 100) : 0;
  }, [sharePriceDiv, annualPaymentDiv]);

  // PE category helper
  const getPeCategory = (pe: number) => {
    if (pe < 12) return { text: "Deep Value / Undervalued", color: "text-emerald-500", bg: "bg-emerald-500/10 border-emerald-500/20" };
    if (pe <= 22) return { text: "Fairly Valued Standard", color: "text-blue-500", bg: "bg-blue-500/10 border-blue-500/20" };
    if (pe <= 35) return { text: "Premium Growth Pricing", color: "text-amber-500", bg: "bg-amber-500/10 border-amber-500/20" };
    return { text: "Bubble Territory / Hyper-speculative", color: "text-rose-500", bg: "bg-rose-500/10 border-rose-500/20" };
  };

  return (
    <div className="space-y-8 animate-fadeIn" id="investor-education-academy">
      
      {/* Academy Header Intro */}
      <div className="bg-gradient-to-r from-emerald-900 to-slate-900 text-white rounded-3xl p-6 md:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shadow-md border border-emerald-800/40">
        <div className="space-y-2 text-left">
          <div className="flex items-center gap-2">
            <span className="p-1 px-2 text-[10px] uppercase font-mono tracking-wider font-extrabold bg-emerald-500 text-white rounded-md">
              Level 1: Novice to Pro
            </span>
            <span className="text-slate-300 text-xs">• Interactive Curriculum</span>
          </div>
          <h2 className="text-2xl font-black tracking-tight">EquiGrowth Academic Learning Portal</h2>
          <p className="text-slate-300 text-xs max-w-2xl leading-relaxed">
            Skip the math jargon. Learn critical investment valuation parameters using real-time interactive sandboxes, practical examples, and guided asset simulators.
          </p>
        </div>
        <BookOpen className="w-12 h-12 text-emerald-400 shrink-0 select-none hidden md:block" />
      </div>

      {/* Grid Switchers layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Course Concepts Index */}
        <div className="lg:col-span-1 space-y-3">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block pl-2">Concept Catalog:</span>
          
          <button
            onClick={() => setActiveConcept("nav")}
            className={`w-full text-left p-4 rounded-2xl border transition-all cursor-pointer flex gap-3 items-start ${
              activeConcept === "nav"
                ? "bg-white border-emerald-500 shadow-xs ring-1 ring-emerald-500/10"
                : "bg-slate-50/50 border-slate-100/80 hover:bg-white"
            }`}
          >
            <span className={`p-2 rounded-xl block shrink-0 ${activeConcept === "nav" ? "bg-emerald-50 text-emerald-600" : "bg-slate-100 text-slate-500"}`}>
              <Landmark className="w-5 h-5" />
            </span>
            <div className="space-y-0.5 text-left">
              <strong className="text-xs font-bold text-slate-800 block">1. Net Asset Value (NAV)</strong>
              <span className="text-[10px] text-slate-400 line-clamp-1">Mutual funds price valuation</span>
            </div>
          </button>

          <button
            onClick={() => setActiveConcept("pe")}
            className={`w-full text-left p-4 rounded-2xl border transition-all cursor-pointer flex gap-3 items-start ${
              activeConcept === "pe"
                ? "bg-white border-emerald-500 shadow-xs ring-1 ring-emerald-500/10"
                : "bg-slate-50/50 border-slate-100/80 hover:bg-white"
            }`}
          >
            <span className={`p-2 rounded-xl block shrink-0 ${activeConcept === "pe" ? "bg-emerald-50 text-emerald-600" : "bg-slate-100 text-slate-500"}`}>
              <TrendingUp className="w-5 h-5" />
            </span>
            <div className="space-y-0.5 text-left">
              <strong className="text-xs font-bold text-slate-800 block">2. P/E Valuation Ratio</strong>
              <span className="text-[10px] text-slate-400 line-clamp-1">Earnings vs market capital multiplier</span>
            </div>
          </button>

          <button
            onClick={() => setActiveConcept("dividend")}
            className={`w-full text-left p-4 rounded-2xl border transition-all cursor-pointer flex gap-3 items-start ${
              activeConcept === "dividend"
                ? "bg-white border-emerald-500 shadow-xs ring-1 ring-emerald-500/10"
                : "bg-slate-50/50 border-slate-100/80 hover:bg-white"
            }`}
          >
            <span className={`p-2 rounded-xl block shrink-0 ${activeConcept === "dividend" ? "bg-emerald-50 text-emerald-600" : "bg-slate-100 text-slate-500"}`}>
              <Percent className="w-5 h-5" />
            </span>
            <div className="space-y-0.5 text-left">
              <strong className="text-xs font-bold text-slate-800 block">3. Dividend Rate & Yield</strong>
              <span className="text-[10px] text-slate-400 line-clamp-1">Passive payouts & yield indicators</span>
            </div>
          </button>

          <button
            onClick={() => setActiveConcept("stepup")}
            className={`w-full text-left p-4 rounded-2xl border transition-all cursor-pointer flex gap-3 items-start ${
              activeConcept === "stepup"
                ? "bg-white border-emerald-500 shadow-xs ring-1 ring-emerald-500/10"
                : "bg-slate-50/50 border-slate-100/80 hover:bg-white"
            }`}
          >
            <span className={`p-2 rounded-xl block shrink-0 ${activeConcept === "stepup" ? "bg-emerald-50 text-emerald-600" : "bg-slate-100 text-slate-500"}`}>
              <DollarSign className="w-5 h-5" />
            </span>
            <div className="space-y-0.5 text-left">
              <strong className="text-xs font-bold text-slate-800 block">4. Step-Up Compounding</strong>
              <span className="text-[10px] text-slate-400 line-clamp-1">Turbocharge compounding outcomes</span>
            </div>
          </button>
        </div>

        {/* Dynamic Interactive Lesson Column (SPAN 3) */}
        <div className="lg:col-span-3">
          
          {activeConcept === "nav" && (
            <div className="bg-white rounded-3xl p-6 md:p-8 shadow-xs border border-slate-100 space-y-6">
              
              {/* Educational Deck */}
              <div className="space-y-2 text-left">
                <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest block">Chapter One: Valuation Baselines</span>
                <h3 className="text-xl font-bold text-slate-900">Understanding Net Asset Value (NAV)</h3>
                <p className="text-slate-500 text-xs leading-relaxed">
                  Net Asset Value is simply the unit pricing of a Mutual Fund scheme or ETF. Imagine you and 9 friends gather ₹10,000 each (Total fund: ₹1,00,000) to buy a bucket of various bluechip tech shares. 
                  If you divide this fund into 1,000 corporate units, each unit has a starting <strong>NAV of ₹100</strong>. 
                  If the Bluechip tech stocks grow in valuation to ₹1,40,000 next year, the Net Asset Value (NAV) rises to <strong>₹140 per unit</strong> ({`₹1,40,000 / 1,000 units`}).
                </p>
              </div>

              {/* Formula Blueprint */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                <span className="text-[9px] uppercase font-bold text-slate-400 block mb-1">Standard Equation:</span>
                <span className="text-sm font-semibold text-slate-800 font-mono">
                  NAV = (Total Market Value of Stocks + Cash Assets - Liabilities) / Outstanding Units
                </span>
              </div>

              {/* Interactive Mutual Fund Simulator */}
              <div className="bg-slate-950 text-slate-100 rounded-3xl p-6 border border-slate-900 space-y-6">
                <div>
                  <h4 className="text-sm font-bold text-white flex items-center gap-1.5 justify-start">
                    <span className="text-emerald-400 font-bold">✨</span>
                    Dynamic Mutual Fund Unit Price (NAV) Simulator
                  </h4>
                  <p className="text-slate-400 text-[10px] mt-1 text-left">
                    Alter the parameters below to see how stock performance (assets), debt expenses (liabilities), or total subscriber count (units) impacts unit price.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-bold text-slate-400 block justify-between">
                        <span>Portfolio Assets</span>
                      </label>
                      <input 
                        type="number"
                        value={mfAssets}
                        onChange={(e) => setMfAssets(Math.max(100000, Number(e.target.value)))}
                        className="w-full bg-slate-900 text-white rounded-lg border border-slate-800 p-2 font-mono text-xs font-bold"
                      />
                      <p className="text-[9px] text-slate-400">Value of held equities (INR)</p>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-bold text-slate-400 block">Fund liabilities</label>
                      <input 
                        type="number"
                        value={mfLiabilities}
                        onChange={(e) => setMfLiabilities(Math.max(0, Number(e.target.value)))}
                        className="w-full bg-slate-900 text-white rounded-lg border border-slate-800 p-2 font-mono text-xs font-bold"
                      />
                      <p className="text-[9px] text-slate-400">Taxes & manager salaries (INR)</p>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-bold text-slate-400 block">Total Units Released</label>
                      <input 
                        type="number"
                        value={mfUnits}
                        onChange={(e) => setMfUnits(Math.max(10, Number(e.target.value)))}
                        className="w-full bg-slate-900 text-white rounded-lg border border-slate-800 p-2 font-mono text-xs font-bold"
                      />
                      <p className="text-[9px] text-slate-400">Total units issued to clients</p>
                    </div>
                  </div>

                  <div className="md:col-span-2 bg-slate-900/50 rounded-2xl p-6 border border-slate-800/80 flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest block">Active Real-Time Calculation Path</span>
                      <div className="text-xs text-slate-300 space-y-1.5 font-mono">
                        <div>1. Total Net Asset Pool: ₹{(mfAssets - mfLiabilities).toLocaleString()}</div>
                        <div>2. Outstanding subscribers: {mfUnits.toLocaleString()} units</div>
                        <div>3. Unit Division value: {`₹${(mfAssets - mfLiabilities).toLocaleString()} Core Equity / ${mfUnits.toLocaleString()} Units`}</div>
                      </div>
                    </div>

                    <div className="border-t border-slate-800/80 pt-4 flex items-center justify-between">
                      <span className="text-xs text-slate-300 font-bold block">Live Unit Price (NAV):</span>
                      <span className="text-3xl font-black font-mono text-emerald-400 inline-block">
                        ₹{calculatedMfNav.toFixed(4)}
                      </span>
                    </div>

                    <div className="bg-slate-950 p-3 rounded-xl border border-slate-850 text-[10px] leading-relaxed text-slate-400 flex gap-1 items-start text-left">
                      <Lightbulb className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>
                        <strong>Practical Lesson:</strong> If active stock markets surge, Portfolios Assets increase, which boosts the unit **NAV price** instantly. However, if new units are issued synchronously, the NAV price unchanged, but capital deployment changes.
                      </span>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          )}

          {activeConcept === "pe" && (
            <div className="bg-white rounded-3xl p-6 md:p-8 shadow-xs border border-slate-100 space-y-6">
              
              {/* Educational Deck */}
              <div className="space-y-2 text-left">
                <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest block">Chapter Two: Relative Pricing</span>
                <h3 className="text-xl font-bold text-slate-900">Demystifying Price-to-Earnings (P/E) Ratio</h3>
                <p className="text-slate-500 text-xs leading-relaxed">
                  The P/E Ratio (Price-to-Earnings) is a gauge of how expensive a stock is relative to the profit it generates for shareholders. 
                  Think of a small bakery in your neighborhood that earns ₹1,00,000 in net profit a year. If the owner offers to sell the bakery to you for ₹10,000,000, the bakery trades at a <strong>P/E ratio of 100x</strong> (100 years of earnings to recoup capital). If they offer it for ₹10,000, the bakery is priced at a highly bargain <strong>P/E ratio of 0.1x</strong>!
                </p>
              </div>

              {/* Equation */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                <span className="text-[9px] uppercase font-bold text-slate-400 block mb-1">Standard Equation:</span>
                <span className="text-sm font-semibold text-slate-800 font-mono">
                  P/E Ratio = Market Share Price / Annual Earnings Per Share (EPS)
                </span>
              </div>

              {/* Interactive PE Sandbox */}
              <div className="bg-slate-950 text-slate-100 rounded-3xl p-6 border border-slate-900 space-y-6">
                <div>
                  <h4 className="text-sm font-bold text-white flex items-center gap-1.5 justify-start font-sans">
                    <span className="text-emerald-400 font-bold">✨</span>
                    Interactive Multiplier (P/E) Sandbox Simulator
                  </h4>
                  <p className="text-slate-400 text-[10px] mt-1 text-left">
                    Alter share price and annual EPS to view how valuation classes shift dynamically between Deep Value and Bubbles.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-bold text-slate-400">Market Share Price (₹)</label>
                      <input 
                        type="number"
                        value={companySharePrice}
                        onChange={(e) => setCompanySharePrice(Math.max(1, Number(e.target.value)))}
                        className="w-full bg-slate-900 text-white rounded-lg border border-slate-800 p-2 font-mono text-xs font-bold"
                      />
                      <p className="text-[9px] text-slate-400">Current traded retail price</p>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-bold text-slate-400">Annual EPS (₹ / Share)</label>
                      <input 
                        type="number"
                        value={companyEarnings}
                        onChange={(e) => setCompanyEarnings(Math.max(1, Number(e.target.value)))}
                        className="w-full bg-slate-900 text-white rounded-lg border border-slate-800 p-2 font-mono text-xs font-bold"
                      />
                      <p className="text-[9px] text-slate-400">Corporate net earnings per share</p>
                    </div>
                  </div>

                  <div className="md:col-span-2 bg-slate-900/50 rounded-2xl p-6 border border-slate-800/80 flex flex-col justify-between space-y-4">
                    <div className="space-y-4">
                      
                      <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                        <span className="text-xs text-slate-300 font-bold block">Live Valuation Multiple:</span>
                        <span className="text-3xl font-black font-mono text-emerald-400 inline-block font-mono">
                          {calculatedPe.toFixed(1)}x
                        </span>
                      </div>

                      {/* Decoded class badge */}
                      <div className={`p-4 border rounded-xl space-y-1.5 transition-all ${getPeCategory(calculatedPe).bg}`}>
                        <span className="text-[10px] uppercase text-slate-400 font-bold block">Valuation Interpretation Bracket</span>
                        <strong className={`text-sm font-black tracking-tight block ${getPeCategory(calculatedPe).color}`}>
                          {getPeCategory(calculatedPe).text}
                        </strong>
                        <p className="text-[10.5px] text-slate-400 leading-relaxed font-sans">
                          {calculatedPe < 12 
                            ? "Highly typical for legacy heavy utilities, wind energy power plants, or companies with turnaround risks. Highly secure floor margin of safety but carries execution locks." 
                            : calculatedPe <= 22 
                            ? "Traded sweet spot. Reliance Industries or similar balanced giants standard valuation matrix." 
                            : calculatedPe <= 35 
                            ? "Typical pricing for software leaders like TCS or SaaS corporations deploy elite intellectual compounding asset scales." 
                            : "Bubble risk! High speculative expectations on future earnings which if delayed triggers correction crashes."}
                        </p>
                      </div>

                    </div>
                  </div>
                </div>
              </div>

            </div>
          )}

          {activeConcept === "dividend" && (
            <div className="bg-white rounded-3xl p-6 md:p-8 shadow-xs border border-slate-100 space-y-6 animate-fadeIn">
              
              {/* Educational Deck */}
              <div className="space-y-2 text-left">
                <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest block">Chapter Three: Cash Flows</span>
                <h3 className="text-xl font-bold text-slate-900">Understanding Dividend Rate vs. Dividend Yield</h3>
                <p className="text-slate-500 text-xs leading-relaxed">
                  Many companies pay a portion of their profits back to shareholders as a cash reward. 
                  New investors often confuse <strong>Dividend Rate</strong> (the absolute currency amount paid out per share, e.g. ₹18) with <strong>Dividend Yield (%)</strong> which measures that payout relative to current stock price. 
                  If Bank of India pays ₹15 per share, and stock trades at ₹150, the yield is an incredible 10% cash return. If it paid ₹15 but the stock traded at ₹1,500, the cash yield is just 1%.
                </p>
              </div>

              {/* Equation */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-slate-50 rounded-2xl border border-dashed border-slate-200 text-left">
                <div>
                  <span className="text-[9px] uppercase font-bold text-slate-400 block mb-1">Dividend Rate:</span>
                  <span className="text-xs font-semibold text-slate-700 font-mono block">
                    Absolute ₹ declared payout per unit per year
                  </span>
                </div>
                <div>
                  <span className="text-[9px] uppercase font-bold text-slate-400 block mb-1">Dividend Yield (%):</span>
                  <span className="text-xs font-semibold text-slate-700 font-mono block">
                    (Annual Dividend Amount / Traded Share Price) * 100
                  </span>
                </div>
              </div>

              {/* Custom micro simulator */}
              <div className="bg-slate-950 text-slate-100 rounded-3xl p-6 border border-slate-900 space-y-6">
                <div>
                  <h4 className="text-sm font-bold text-white flex items-center gap-1.5 justify-start">
                    <span className="text-emerald-400 font-bold">✨</span>
                    Live Passive Yield Calculator Playground
                  </h4>
                  <p className="text-slate-400 text-[10px] mt-1 text-left">
                    Alter share price and declared payout rate to view how real cash flow yield scales in comparison to fixed FD interest layers.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-bold text-slate-400">Share Traded Price (₹)</label>
                      <input 
                        type="number"
                        value={sharePriceDiv}
                        onChange={(e) => setSharePriceDiv(Math.max(1, Number(e.target.value)))}
                        className="w-full bg-slate-900 text-white rounded-lg border border-slate-800 p-2 font-mono text-xs font-bold"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-bold text-slate-400">Annual Declared Dividend (₹)</label>
                      <input 
                        type="number"
                        value={annualPaymentDiv}
                        onChange={(e) => setAnnualPaymentDiv(Math.max(0, Number(e.target.value)))}
                        className="w-full bg-slate-900 text-white rounded-lg border border-slate-800 p-2 font-mono text-xs font-bold"
                      />
                    </div>
                  </div>

                  <div className="md:col-span-2 bg-slate-900/50 rounded-2xl p-6 border border-slate-800/80 flex flex-col justify-between space-y-4">
                    <div className="space-y-1 border-b border-slate-800 pb-3">
                      <span className="text-xs text-slate-300 font-bold block">Live Cash Dividend Yield:</span>
                      <strong className="text-3xl font-black font-mono text-emerald-400 inline-block font-mono">
                        {calculatedDivYield.toFixed(2)}%
                      </strong>
                    </div>

                    <div className="bg-slate-950 p-3 rounded-xl border border-slate-850 text-[10px] leading-relaxed text-slate-400 flex gap-2">
                      <Lightbulb className="w-4.5 h-4.5 text-emerald-400 shrink-0 mt-0.5" />
                      <span>
                        <strong>Expert insight:</strong> High growth tech giants (e.g. TCS) trade at high share prices relative to absolute dividend payments, locking lower dividend yields (1.5% - 2.5%) but rewarding compounding capital. Mature state entities (Coal India / banks) often pay enormous 7-10% dividend yields.
                      </span>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          )}

          {activeConcept === "stepup" && (
            <div className="bg-white rounded-3xl p-6 md:p-8 shadow-xs border border-slate-100 space-y-6">
              
              {/* Educational Deck */}
              <div className="space-y-2 text-left">
                <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest block">Chapter Four: Supercharged wealth</span>
                <h3 className="text-xl font-bold text-slate-900">What is a Step-Up SIP and how it multiplies wealth?</h3>
                <p className="text-slate-500 text-xs leading-relaxed">
                  Many calculators assume you will invest the exact same ₹5,000 month-after-month for 20 years. 
                  But as your career scales, your salary naturally grows. A **Step-Up SIP** means increasing your monthly contribution by a small percentage (e.g., 10%) every year.
                  This small step multiplies compounding momentum dramatically. Over 20 years, a standard ₹5,000 SIP yields ₹75 Lakhs, while a small 10% annual Step-Up SIP yields ₹1.67 Crores!
                </p>
              </div>

              {/* Grid comparative items */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left font-sans text-xs">
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-slate-800">Standard SIP (Constant)</span>
                    <span className="px-1.5 py-0.5 text-[9px] uppercase font-bold text-slate-400 border border-slate-300 rounded">Static</span>
                  </div>
                  <p className="text-slate-500 text-[11px] leading-relaxed">
                    You invest ₹10,000 every month continuously for 15 years.
                  </p>
                  <div className="border-t border-slate-200/60 pt-2 font-mono">
                    <div className="text-slate-400 text-[10px]">Total Invested: ₹18.00 Lakhs</div>
                    <div className="text-slate-800 font-bold">Maturity Pool (at 14%): ₹61.2 Lakhs</div>
                  </div>
                </div>

                <div className="p-4 bg-emerald-50 text-emerald-950 rounded-2xl border border-emerald-100 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-emerald-900">10% Step-Up SIP (Dynamic)</span>
                    <span className="px-1.5 py-0.5 text-[9px] uppercase font-bold text-emerald-600 bg-emerald-100 border border-emerald-300 rounded">Supercharged</span>
                  </div>
                  <p className="text-emerald-700 text-[11px] leading-relaxed">
                    Year 1: ₹10,000/mo, Year 2: ₹11,000/mo, Year 3: ₹12,100/mo...
                  </p>
                  <div className="border-t border-emerald-200 pt-2 font-mono">
                    <div className="text-emerald-700 text-[10px]">Total Invested: ₹38.1 Lakhs</div>
                    <div className="text-emerald-900 font-bold text-sm">Maturity Pool (at 14%): ₹1.02 Crore</div>
                  </div>
                </div>
              </div>

            </div>
          )}

        </div>

      </div>

      {/* Bonus Dictionary definitions */}
      <div className="bg-slate-50 rounded-3xl p-6 md:p-8 space-y-5 text-left border border-slate-100/60">
        <h3 className="text-md font-bold text-slate-800 flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-emerald-600" />
          The Fast Jargon Dictionary (For New Investors)
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-1 bg-white p-4 rounded-2xl border border-slate-100">
            <h4 className="font-bold text-slate-800 text-xs">Debt-to-Equity (D/E)</h4>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Measures corporate leverage. A ratio of <strong>0.2</strong> means only 20 paise of senior debt stands for every rupee of shareholder book capital. Low D/E protects against solvency risks.
            </p>
          </div>

          <div className="space-y-1 bg-white p-4 rounded-2xl border border-slate-100">
            <h4 className="font-bold text-slate-800 text-xs">Return on Equity (ROE)</h4>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Tells you how efficient corporate managers are at multiplying your investment money. An ROE of <strong>15%</strong> or more is standard. TCS generates of ROE of 41%.
            </p>
          </div>

          <div className="space-y-1 bg-white p-4 rounded-2xl border border-slate-100">
            <h4 className="font-bold text-slate-800 text-xs">Direct vs. Regular Funds</h4>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Regular funds pay ongoing broker commissions out of your money. **Direct plans** offer identical portfolios but skip intermediaries, gaining 0.5%–1.5% higher direct compound returns per year.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
}
