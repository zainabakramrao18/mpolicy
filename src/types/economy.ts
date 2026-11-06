/**
 * SBP PolicyPulse - Core Economic Types
 * State Bank of Pakistan (SBP) & Ministry of Finance Fiscal & Monetary Observatory
 */

export type PolicyStance = 'Easing' | 'Tightening' | 'Neutral' | 'Pause';

export interface KeyDrivers {
  inflationOutlook: string;
  realInterestRates: string;
  externalAccount: string;
  fiscalDiscipline: string;
  commodityPrices: string;
  demandPressures: string;
}

export interface PolicyRateDecision {
  id: string;
  meetingDate: string; // YYYY-MM-DD
  effectiveDate: string;
  previousRate: number; // e.g. 12.00
  newRate: number; // e.g. 11.00
  changeBps: number; // e.g. -100
  stance: PolicyStance;
  primaryReason: string;
  keyDrivers: KeyDrivers;
  mpcConsensus: string; // e.g. "Unanimous" or "Majority vote"
  fullStatementExcerpt: string;
  cpiAtAnnouncement: number; // e.g. 5.6
  realRateAtAnnouncement: number; // e.g. +5.4
  sbpReservesAtTimeUSD_B: number;
}

export interface RateCorridor {
  policyRate: number; // SBP Target Policy Rate
  reverseRepoCeiling: number; // SBP Reverse Repo (Ceiling) = Policy Rate + 100 bps
  repoFloor: number; // SBP Repo Facility (Floor) = Policy Rate - 100 bps
  kibor6M: number;
  kibor3M: number;
  mtb3M: number; // 3-Month Treasury Bill cut-off yield
  mtb6M: number; // 6-Month Treasury Bill cut-off yield
  mtb12M: number; // 12-Month Treasury Bill cut-off yield
  pib3Y: number; // 3-Year Pakistan Investment Bond yield
  pib5Y: number; // 5-Year PIB
  pib10Y: number; // 10-Year PIB
  lastUpdated: string;
}

export interface InflationDataPoint {
  date: string; // "2024-08"
  displayDate: string; // "Aug 2024"
  headlineCPI: number; // YoY %
  momCPI: number; // MoM %
  coreNFNE: number; // Non-Food Non-Energy %
  trimmedMean: number; // 20% trimmed mean %
  foodCPI: number; // Food inflation YoY %
  energyCPI: number; // Housing, Water, Electricity, Gas YoY %
  transportCPI: number; // Transport YoY %
  spi: number; // Sensitive Price Indicator YoY %
  wpi: number; // Wholesale Price Index YoY %
  policyRate: number; // SBP Policy rate at month end
  realInterestRate: number; // PolicyRate - headlineCPI
}

export interface CPIBasketCategory {
  id: string;
  category: string;
  weight: number; // percentage in CPI basket (PBS 2015-16 base)
  currentYoY: number; // %
  previousYoY: number; // %
  momChange: number; // %
  driverNote: string;
  status: 'deflating' | 'moderating' | 'elevated' | 'high';
}

export interface FiscalMetricYear {
  fiscalYear: string; // "FY24", "FY25", "FY26 (Proj)"
  nominalGDP_PKR_Trillion: number;
  fbrTarget_PKR_Trillion: number;
  fbrActual_PKR_Trillion: number;
  fbrTaxToGDP_Pct: number;
  totalFederalExpenditure_PKR_Trillion: number;
  debtServicingMarkup_PKR_Trillion: number;
  markupShareOfRevenue_Pct: number; // Debt servicing as % of net federal revenue
  psdpAllocation_PKR_Trillion: number;
  fiscalDeficitPctGDP: number; // target vs actual
  primaryBalancePctGDP: number; // + is surplus, - is deficit
  domesticDebt_PKR_Trillion: number;
  externalDebt_USD_Billion: number;
  imfProgramStatus: string;
}

export interface HistoricalMacroRecord {
  date: string; // "YYYY-MM"
  displayDate: string; // "Jun 2024"
  policyRate: number;
  cpiYoY: number;
  sbpReservesUSD_B: number;
  totalReservesUSD_B: number;
  pkrToUSD: number;
  currentAccountUSD_M: number;
  remittancesUSD_M: number;
  exportsUSD_M: number;
  importsUSD_M: number;
}

export interface MacroeconomicSimulationResult {
  deltaRateBps: number;
  newRate: number;
  annualDebtServicingImpactPKR_B: number; // Savings or cost to govt
  projectedYearEndCPI: number;
  realInterestRateGap: number;
  creditToPrivateSectorGrowthPct: number;
  exchangeRateRiskLevel: 'Low' | 'Moderate' | 'High' | 'Severe';
  projectedFiscalDeficitPctGDP: number;
  projectedPrimaryBalancePctGDP: number;
  mpcAdvisoryStance: string;
  recommendationRationale: string[];
}

export interface EconomicReport {
  id: string;
  title: string;
  date: string;
  category: 'Monetary' | 'Fiscal' | 'Inflation' | 'External';
  readTime: string;
  authorAgency: string;
  executiveSummary: string;
  keyHighlights: string[];
  analyticalDeepDive: {
    sectionTitle: string;
    body: string;
    dataPoints?: { label: string; value: string }[];
  }[];
  policyRecommendations: string[];
}
