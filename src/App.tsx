/**
 * Copyright (c) 2024 Dreamery Software LLC. All rights reserved.
 * Proprietary and confidential. Unauthorized copying, distribution, or use is prohibited.
 */

import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@mui/material";
import styled from "styled-components";
import { theme } from "./theme";
import Header from "./components/Header";
import Hero from "./components/Hero";
import Navigation from "./components/Navigation";
import AuthPage from "./pages/AuthPage";
import ProfessionalSignupPage from "./pages/ProfessionalSignupPage";
import BusinessSignupPage from "./pages/BusinessSignupPage";
import BuyPage from "./pages/BuyPage";
import RentPage from "./pages/RentPage";



const AppContainer = styled.div`
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  position: relative;
`;

const HomePage = () => (
  <>
    <Header />
    <Hero />
    <Navigation />
  </>
);

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <AppContainer>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route
              path="/professional-signup"
              element={<ProfessionalSignupPage />}
            />
            <Route path="/business-signup" element={<BusinessSignupPage />} />
            <Route path="/buy" element={<BuyPage />} />
            <Route path="/rent" element={<RentPage />} />

          </Routes>
        </AppContainer>
      </Router>
    </ThemeProvider>
  );
}

export default App;
