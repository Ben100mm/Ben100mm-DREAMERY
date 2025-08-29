import React, { Suspense } from "react";
import { Box } from "@mui/material";
import ComprehensiveRefinanceCalculator from "../ComprehensiveRefinanceCalculator";

const ComprehensiveRefinanceCalculatorLazy = () => {
  return (
    <Suspense fallback={<Box sx={{ p: 2 }}>Loading Calculator...</Box>}>
      <ComprehensiveRefinanceCalculator />
    </Suspense>
  );
};

export default ComprehensiveRefinanceCalculatorLazy;
