import React from 'react';
import { ThemeProvider, createTheme } from '@mui/material';
import styled from 'styled-components';
import Header from './components/Header';
import Hero from './components/Hero';
import Navigation from './components/Navigation';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1a365d',
    },
  },
  typography: {
    fontFamily: '"Inter", "Helvetica", "Arial", sans-serif',
  },
});

const AppContainer = styled.div`
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  position: relative;
`;

function App() {
  return (
    <ThemeProvider theme={theme}>
      <AppContainer>
        <Header />
        <Hero />
        <Navigation />
      </AppContainer>
    </ThemeProvider>
  );
}

export default App;