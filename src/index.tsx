import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./AppWithRouting";
import reportWebVitals from "./reportWebVitals";
import { brandColors } from "./theme";
import ErrorBoundary from "./components/ErrorBoundary";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement,
);
root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>,
);

reportWebVitals();
