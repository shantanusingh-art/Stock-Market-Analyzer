export interface RatioItem {
  name: string;
  value: number;
  health: string;
  benchmark: string;
  description: string;
}

export interface FinancialData {
  year: string;
  revenue: number;
  netProfit: number;
  operatingMargin: number;
}

export interface DividendHistory {
  year: string;
  amount: number;
}

export interface CompetitorData {
  name: string;
  price: number;
  peRatio: number;
  pbRatio: number;
  eps: number;
  marketCap: string;
  devYield: number;
  score: number;
}

export interface FutureGrowthPoint {
  year: string;
  predictedRevenueDelta: number;
  predictedSharePrice: number;
}

export interface StockAnalysis {
  companyName: string;
  symbol: string;
  sector: string;
  about: string;
  currentPrice: number | string;
  currency: string;
  eps: number | string;
  peRatio: number | string;
  pbRatio: number | string;
  dividendYield: number | string;
  dividends: DividendHistory[];
  financials: FinancialData[];
  ratios: {
    liquidity: RatioItem[];
    solvency: RatioItem[];
    efficiency: RatioItem[];
  };
  competitors: CompetitorData[];
  futureGrowth: {
    predictionSummary: string;
    years: FutureGrowthPoint[];
  };
  investmentResearchSummary: string;
  offlineSimulation?: boolean;
  isRealTime?: boolean;
  fetchedAt?: string | null;
}

export interface MutualFund {
  schemeCode?: string;
  fundName: string;
  category: string;
  vintageYears: number;
  risk: string;
  historicalReturn3Y: number | string;
  historicalReturn5Y: number | string;
  expenseRatio: number;
  aum: string;
  reason: string;
  similarFunds: string[];
  offlineSimulation?: boolean;
  isRealTime?: boolean;
  currentNav?: number | string;
  fetchedAt?: string | null;
}
