import React, { createContext, useContext, useState } from "react";

interface AnalysisData {
  accuracy: number;
  filename: string;
  image: string;
  loss: number;
  message: string;
}

interface AnalysisContextProps {
  analysisData: AnalysisData | null;
  setAnalysisData: (data: AnalysisData | null) => void;
}

const AnalysisContext = createContext<AnalysisContextProps | undefined>(
  undefined
);

export const AnalysisProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [analysisData, setAnalysisData] = useState<AnalysisData | null>(null);

  return (
    <AnalysisContext.Provider value={{ analysisData, setAnalysisData }}>
      {children}
    </AnalysisContext.Provider>
  );
};

export const useAnalysis = () => {
  const context = useContext(AnalysisContext);
  if (!context) {
    throw new Error("useAnalysis must be used within an AnalysisProvider");
  }
  return context;
};
