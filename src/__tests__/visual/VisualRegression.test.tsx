import React from "react";
import { render } from "@testing-library/react";
import { describe, it, expect } from "@jest/globals";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import { brandColors } from "../../theme";

/**
 * Visual Regression Tests
 * 
 * These tests create snapshots of UI components to detect unintended visual changes.
 * 
 * INTEGRATION WITH VISUAL TESTING TOOLS:
 * 
 * For production-grade visual regression testing, integrate with:
 * - Percy (https://percy.io/) - Automated visual testing
 * - Chromatic (https://www.chromatic.com/) - Visual testing for Storybook
 * 
 * To enable Percy:
 * 1. npm install --save-dev @percy/cli @percy/puppeteer
 * 2. Set PERCY_TOKEN environment variable
 * 3. Run: npx percy exec -- npm test
 * 
 * To enable Chromatic:
 * 1. npm install --save-dev chromatic
 * 2. Set CHROMATIC_PROJECT_TOKEN environment variable
 * 3. Run: npx chromatic --project-token=<token>
 */

// Test theme configuration
const theme = createTheme({
  palette: {
    primary: {
      main: brandColors.primary,
    },
    secondary: {
      main: brandColors.secondary,
    },
  },
});

// Helper to render component with theme
const renderWithTheme = (component: React.ReactElement) => {
  return render(
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {component}
    </ThemeProvider>
  );
};

// Helper to set viewport size for responsive tests
const setViewport = (width: number, height: number) => {
  Object.defineProperty(window, "innerWidth", {
    writable: true,
    configurable: true,
    value: width,
  });
  Object.defineProperty(window, "innerHeight", {
    writable: true,
    configurable: true,
    value: height,
  });
};

describe("Visual Regression Tests", () => {
  // ========================================
  // MAJOR SECTIONS SNAPSHOTS
  // ========================================
  describe("Major Sections", () => {
    it("should match snapshot for Card component", () => {
      const { container } = renderWithTheme(
        <Card>
          <CardContent>
            <Typography variant="h5" component="div">
              Property Analysis
            </Typography>
            <Typography variant="body2">
              This is a sample property analysis card with standard styling.
            </Typography>
          </CardContent>
        </Card>
      );
      expect(container.firstChild).toMatchSnapshot();
    });

    it("should match snapshot for form section", () => {
      const { container } = renderWithTheme(
        <Box sx={{ p: 2 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Property Details
          </Typography>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <TextField
              fullWidth
              label="Purchase Price"
              type="number"
              defaultValue="250000"
            />
            <TextField
              fullWidth
              label="Down Payment"
              type="number"
              defaultValue="50000"
            />
            <TextField
              fullWidth
              label="Interest Rate"
              type="number"
              defaultValue="6.5"
            />
          </Box>
        </Box>
      );
      expect(container.firstChild).toMatchSnapshot();
    });

    it("should match snapshot for results section", () => {
      const { container } = renderWithTheme(
        <Card sx={{ mt: 2 }}>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Analysis Results
            </Typography>
            <Box sx={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 2 }}>
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Cash Flow
                </Typography>
                <Typography variant="h4" color="success.main">
                  $450
                </Typography>
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Cap Rate
                </Typography>
                <Typography variant="h4" color="primary">
                  8.5%
                </Typography>
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Cash on Cash
                </Typography>
                <Typography variant="h4" color="success.main">
                  12.3%
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      );
      expect(container.firstChild).toMatchSnapshot();
    });

    it("should match snapshot for navigation header", () => {
      const { container } = renderWithTheme(
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            p: 2,
            bgcolor: brandColors.primary,
            color: "white",
          }}
        >
          <Typography variant="h6">Dreamery Analytics</Typography>
          <Box sx={{ display: "flex", gap: 2 }}>
            <Button variant="text" sx={{ color: "white" }}>
              Analyze
            </Button>
            <Button variant="text" sx={{ color: "white" }}>
              Underwrite
            </Button>
            <Button variant="text" sx={{ color: "white" }}>
              Profile
            </Button>
          </Box>
        </Box>
      );
      expect(container.firstChild).toMatchSnapshot();
    });
  });

  // ========================================
  // RESPONSIVE LAYOUT TESTS
  // ========================================
  describe("Responsive Layouts", () => {
    it("should match snapshot for mobile viewport (375px)", () => {
      setViewport(375, 667);
      const { container } = renderWithTheme(
        <Box sx={{ width: "100%", p: 2 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Mobile Layout
          </Typography>
          <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, gap: 2 }}>
            <TextField fullWidth label="Field 1" />
            <TextField fullWidth label="Field 2" />
          </Box>
        </Box>
      );
      expect(container.firstChild).toMatchSnapshot();
    });

    it("should match snapshot for tablet viewport (768px)", () => {
      setViewport(768, 1024);
      const { container } = renderWithTheme(
        <Box sx={{ width: "100%", p: 2 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Tablet Layout
          </Typography>
          <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" }, gap: 2 }}>
            <TextField fullWidth label="Field 1" />
            <TextField fullWidth label="Field 2" />
            <TextField fullWidth label="Field 3" />
            <TextField fullWidth label="Field 4" />
          </Box>
        </Box>
      );
      expect(container.firstChild).toMatchSnapshot();
    });

    it("should match snapshot for desktop viewport (1920px)", () => {
      setViewport(1920, 1080);
      const { container } = renderWithTheme(
        <Box sx={{ width: "100%", p: 2 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Desktop Layout
          </Typography>
          <Box sx={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 2 }}>
            <TextField fullWidth label="Field 1" />
            <TextField fullWidth label="Field 2" />
            <TextField fullWidth label="Field 3" />
            <TextField fullWidth label="Field 4" />
          </Box>
        </Box>
      );
      expect(container.firstChild).toMatchSnapshot();
    });

    it("should match snapshot for responsive card grid", () => {
      const { container } = renderWithTheme(
        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", md: "repeat(3, 1fr)" }, gap: 2 }}>
          {[1, 2, 3].map((num) => (
            <Card key={num}>
              <CardContent>
                <Typography variant="h6">Card {num}</Typography>
                <Typography variant="body2">Content for card {num}</Typography>
              </CardContent>
            </Card>
          ))}
        </Box>
      );
      expect(container.firstChild).toMatchSnapshot();
    });
  });

  // ========================================
  // ACCORDION STATE TESTS
  // ========================================
  describe("Accordion States", () => {
    it("should match snapshot for collapsed accordion", () => {
      const { container } = renderWithTheme(
        <Accordion defaultExpanded={false}>
          <AccordionSummary>
            <Typography>Operating Expenses</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              Property taxes, insurance, HOA fees, utilities, and maintenance costs.
            </Typography>
          </AccordionDetails>
        </Accordion>
      );
      expect(container.firstChild).toMatchSnapshot();
    });

    it("should match snapshot for expanded accordion", () => {
      const { container } = renderWithTheme(
        <Accordion defaultExpanded={true}>
          <AccordionSummary>
            <Typography>Operating Expenses</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <TextField fullWidth label="Property Taxes" type="number" defaultValue="200" />
              <TextField fullWidth label="Insurance" type="number" defaultValue="150" />
              <TextField fullWidth label="HOA" type="number" defaultValue="100" />
            </Box>
          </AccordionDetails>
        </Accordion>
      );
      expect(container.firstChild).toMatchSnapshot();
    });

    it("should match snapshot for multiple accordions with mixed states", () => {
      const { container } = renderWithTheme(
        <Box>
          <Accordion defaultExpanded={true}>
            <AccordionSummary>
              <Typography>Section 1 - Expanded</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>Content for section 1</Typography>
            </AccordionDetails>
          </Accordion>
          <Accordion defaultExpanded={false}>
            <AccordionSummary>
              <Typography>Section 2 - Collapsed</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>Content for section 2</Typography>
            </AccordionDetails>
          </Accordion>
          <Accordion defaultExpanded={true}>
            <AccordionSummary>
              <Typography>Section 3 - Expanded</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>Content for section 3</Typography>
            </AccordionDetails>
          </Accordion>
        </Box>
      );
      expect(container.firstChild).toMatchSnapshot();
    });
  });

  // ========================================
  // ERROR STATE TESTS
  // ========================================
  describe("Error States", () => {
    it("should match snapshot for form field error state", () => {
      const { container } = renderWithTheme(
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <TextField
            fullWidth
            label="Purchase Price"
            error
            helperText="Purchase price must be greater than zero"
            defaultValue="0"
          />
          <TextField
            fullWidth
            label="Down Payment"
            error
            helperText="Down payment cannot exceed purchase price"
            defaultValue="300000"
          />
        </Box>
      );
      expect(container.firstChild).toMatchSnapshot();
    });

    it("should match snapshot for error alert", () => {
      const { container } = renderWithTheme(
        <Alert severity="error" sx={{ mb: 2 }}>
          <Typography variant="body2" sx={{ fontWeight: 600 }}>
            Validation Error
          </Typography>
          <Typography variant="body2">
            Please correct the following issues before continuing:
          </Typography>
          <ul style={{ margin: "8px 0 0 0", paddingLeft: "20px" }}>
            <li>Purchase price is required</li>
            <li>Interest rate must be between 0 and 20%</li>
            <li>Monthly rent cannot be negative</li>
          </ul>
        </Alert>
      );
      expect(container.firstChild).toMatchSnapshot();
    });

    it("should match snapshot for warning state", () => {
      const { container } = renderWithTheme(
        <Alert severity="warning" sx={{ mb: 2 }}>
          <Typography variant="body2">
            <strong>Warning:</strong> Your cash-on-cash return is below 8%. This deal may not meet your investment criteria.
          </Typography>
        </Alert>
      );
      expect(container.firstChild).toMatchSnapshot();
    });

    it("should match snapshot for info state", () => {
      const { container } = renderWithTheme(
        <Alert severity="info" sx={{ mb: 2 }}>
          <Typography variant="body2">
            <strong>Tip:</strong> Consider adjusting your down payment to improve cash flow.
          </Typography>
        </Alert>
      );
      expect(container.firstChild).toMatchSnapshot();
    });

    it("should match snapshot for success state", () => {
      const { container } = renderWithTheme(
        <Alert severity="success" sx={{ mb: 2 }}>
          <Typography variant="body2">
            <strong>Great deal!</strong> This property meets all your investment criteria.
          </Typography>
        </Alert>
      );
      expect(container.firstChild).toMatchSnapshot();
    });

    it("should match snapshot for disabled button state", () => {
      const { container } = renderWithTheme(
        <Box sx={{ display: "flex", gap: 2 }}>
          <Button variant="contained" disabled>
            Disabled Primary
          </Button>
          <Button variant="outlined" disabled>
            Disabled Outlined
          </Button>
          <Button variant="text" disabled>
            Disabled Text
          </Button>
        </Box>
      );
      expect(container.firstChild).toMatchSnapshot();
    });
  });

  // ========================================
  // VALIDATION MESSAGE TESTS
  // ========================================
  describe("Validation Messages", () => {
    it("should match snapshot for inline validation (success)", () => {
      const { container } = renderWithTheme(
        <TextField
          fullWidth
          label="Purchase Price"
          type="number"
          defaultValue="250000"
          helperText="✓ Valid purchase price"
          sx={{
            "& .MuiFormHelperText-root": {
              color: "success.main",
            },
          }}
        />
      );
      expect(container.firstChild).toMatchSnapshot();
    });

    it("should match snapshot for inline validation (error)", () => {
      const { container } = renderWithTheme(
        <TextField
          fullWidth
          label="Interest Rate"
          type="number"
          defaultValue="25"
          error
          helperText="✗ Interest rate must be between 0% and 20%"
        />
      );
      expect(container.firstChild).toMatchSnapshot();
    });

    it("should match snapshot for multiple field validation", () => {
      const { container } = renderWithTheme(
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <TextField
            fullWidth
            label="Purchase Price"
            error
            helperText="Required field"
          />
          <TextField
            fullWidth
            label="Down Payment"
            error
            helperText="Cannot exceed purchase price"
          />
          <TextField
            fullWidth
            label="Monthly Rent"
            defaultValue="2000"
            helperText="✓ Valid"
            sx={{
              "& .MuiFormHelperText-root": {
                color: "success.main",
              },
            }}
          />
        </Box>
      );
      expect(container.firstChild).toMatchSnapshot();
    });

    it("should match snapshot for validation summary card", () => {
      const { container } = renderWithTheme(
        <Card sx={{ bgcolor: "error.light" }}>
          <CardContent>
            <Typography variant="h6" sx={{ color: "error.dark", mb: 1 }}>
              Validation Errors (3)
            </Typography>
            <Box component="ul" sx={{ m: 0, pl: 2, color: "error.dark" }}>
              <li>Purchase price is required</li>
              <li>Down payment must be at least 3.5%</li>
              <li>Interest rate is out of acceptable range</li>
            </Box>
            <Button
              variant="contained"
              color="error"
              sx={{ mt: 2 }}
              size="small"
            >
              Fix Errors
            </Button>
          </CardContent>
        </Card>
      );
      expect(container.firstChild).toMatchSnapshot();
    });

    it("should match snapshot for contextual help message", () => {
      const { container } = renderWithTheme(
        <Box>
          <TextField
            fullWidth
            label="Cap Rate"
            type="number"
            defaultValue="8.5"
            helperText="Cap Rate = Annual NOI / Purchase Price"
          />
          <Alert severity="info" sx={{ mt: 1 }}>
            <Typography variant="caption">
              A cap rate between 8-12% is typically considered good for residential investment properties.
            </Typography>
          </Alert>
        </Box>
      );
      expect(container.firstChild).toMatchSnapshot();
    });
  });

  // ========================================
  // BUTTON VARIANTS AND STATES
  // ========================================
  describe("Button Variants", () => {
    it("should match snapshot for button variants", () => {
      const { container } = renderWithTheme(
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <Box sx={{ display: "flex", gap: 2 }}>
            <Button variant="contained">Contained</Button>
            <Button variant="outlined">Outlined</Button>
            <Button variant="text">Text</Button>
          </Box>
          <Box sx={{ display: "flex", gap: 2 }}>
            <Button variant="contained" color="primary">
              Primary
            </Button>
            <Button variant="contained" color="secondary">
              Secondary
            </Button>
            <Button variant="contained" color="success">
              Success
            </Button>
            <Button variant="contained" color="error">
              Error
            </Button>
          </Box>
          <Box sx={{ display: "flex", gap: 2 }}>
            <Button variant="contained" size="small">
              Small
            </Button>
            <Button variant="contained" size="medium">
              Medium
            </Button>
            <Button variant="contained" size="large">
              Large
            </Button>
          </Box>
        </Box>
      );
      expect(container.firstChild).toMatchSnapshot();
    });
  });

  // ========================================
  // LOADING STATES
  // ========================================
  describe("Loading States", () => {
    it("should match snapshot for loading card", () => {
      const { container } = renderWithTheme(
        <Card>
          <CardContent>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Box
                sx={{
                  width: 24,
                  height: 24,
                  borderRadius: "50%",
                  border: "3px solid",
                  borderColor: "primary.main",
                  borderTopColor: "transparent",
                  animation: "spin 1s linear infinite",
                  "@keyframes spin": {
                    "0%": { transform: "rotate(0deg)" },
                    "100%": { transform: "rotate(360deg)" },
                  },
                }}
              />
              <Typography>Loading analysis results...</Typography>
            </Box>
          </CardContent>
        </Card>
      );
      expect(container.firstChild).toMatchSnapshot();
    });
  });

  // ========================================
  // DARK MODE / THEME VARIANTS
  // ========================================
  describe("Theme Variants", () => {
    it("should match snapshot for dark theme", () => {
      const darkTheme = createTheme({
        palette: {
          mode: "dark",
          primary: {
            main: brandColors.primary,
          },
        },
      });

      const { container } = render(
        <ThemeProvider theme={darkTheme}>
          <CssBaseline />
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Dark Mode Card
              </Typography>
              <TextField fullWidth label="Input Field" defaultValue="Test" />
              <Button variant="contained" sx={{ mt: 2 }}>
                Submit
              </Button>
            </CardContent>
          </Card>
        </ThemeProvider>
      );
      expect(container.firstChild).toMatchSnapshot();
    });
  });
});

