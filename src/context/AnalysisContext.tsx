import React, { createContext, useContext, useMemo, useState } from 'react';
import { type DealState, type MarketConditions, type RiskFactors, type PropertyAgeFactors, type SeasonalFactors } from '../types/deal';

interface AnalysisContextValue {
  dealState: DealState | null;
  setDealState: React.Dispatch<React.SetStateAction<DealState | null>>;
  marketConditions: MarketConditions | null;
  setMarketConditions: React.Dispatch<React.SetStateAction<MarketConditions | null>>;
  riskFactors: RiskFactors | null;
  setRiskFactors: React.Dispatch<React.SetStateAction<RiskFactors | null>>;
  propertyAge: PropertyAgeFactors | null;
  setPropertyAge: React.Dispatch<React.SetStateAction<PropertyAgeFactors | null>>;
  seasonalFactors: SeasonalFactors | null;
  setSeasonalFactors: React.Dispatch<React.SetStateAction<SeasonalFactors | null>>;
}

const AnalysisContext = createContext<AnalysisContextValue | undefined>(undefined);

export const AnalysisProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [dealState, setDealState] = useState<DealState | null>(null);
  const [marketConditions, setMarketConditions] = useState<MarketConditions | null>(null);
  const [riskFactors, setRiskFactors] = useState<RiskFactors | null>(null);
  const [propertyAge, setPropertyAge] = useState<PropertyAgeFactors | null>(null);
  const [seasonalFactors, setSeasonalFactors] = useState<SeasonalFactors | null>(null);

  const value = useMemo(
    () => ({
      dealState,
      setDealState,
      marketConditions,
      setMarketConditions,
      riskFactors,
      setRiskFactors,
      propertyAge,
      setPropertyAge,
      seasonalFactors,
      setSeasonalFactors,
    }),
    [dealState, marketConditions, riskFactors, propertyAge, seasonalFactors]
  );

  return <AnalysisContext.Provider value={value}>{children}</AnalysisContext.Provider>;
};

export const useAnalysis = (): AnalysisContextValue => {
  const ctx = useContext(AnalysisContext);
  if (!ctx) throw new Error('useAnalysis must be used within an AnalysisProvider');
  return ctx;
};


