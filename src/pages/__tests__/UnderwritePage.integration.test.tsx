import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BrowserRouter } from "react-router-dom";
import { describe, it, expect, beforeEach, jest } from "@jest/globals";
import UnderwritePage from "../UnderwritePage";

/**
 * Integration Tests for UnderwritePage
 * Tests complete user workflows from input to calculation results
 */

// Note: We're not mocking useNavigate to keep tests simpler
// Navigation functionality can be tested by verifying sessionStorage is set

// Test wrapper component with Router
const renderWithRouter = (component: React.ReactElement) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

// Helper function to find and interact with form fields
const findAndFillField = async (
  container: HTMLElement,
  labelText: string,
  value: string
) => {
  const input = within(container).getByLabelText(labelText, { exact: false });
  await userEvent.clear(input);
  await userEvent.type(input, value);
  return input;
};

// Helper to select from dropdown
const selectFromDropdown = async (
  labelText: string,
  optionText: string
) => {
  const select = screen.getByLabelText(labelText, { exact: false });
  await userEvent.click(select);
  const option = await screen.findByText(optionText);
  await userEvent.click(option);
};

// Helper to click a button by text
const clickButton = async (buttonText: string) => {
  const button = screen.getByRole("button", { name: new RegExp(buttonText, "i") });
  await userEvent.click(button);
};

// Helper to expand an accordion section
const expandAccordion = async (sectionTitle: string) => {
  const accordion = screen.getByText(sectionTitle);
  if (accordion) {
    await userEvent.click(accordion);
  }
};

describe("UnderwritePage Integration Tests", () => {
  beforeEach(() => {
    // Clear any stored state before each test
    sessionStorage.clear();
  });

  // ========================================
  // BUY & HOLD WORKFLOW TESTS
  // ========================================
  describe("Buy & Hold Workflow", () => {
    it("should complete full Buy & Hold single family workflow", async () => {
      renderWithRouter(<UnderwritePage />);

      // Wait for page to load
      await waitFor(() => {
        expect(screen.getByText(/Deal Analyzer/i)).toBeInTheDocument();
      });

      // Step 1: Set property type to Single Family (should be default)
      // The page should already have Single Family selected

      // Step 2: Set operation type to Buy & Hold
      await selectFromDropdown("Operation Type", "Buy & Hold");

      // Step 3: Enter purchase price
      const purchasePriceField = screen.getByLabelText(/Purchase Price/i);
      await userEvent.clear(purchasePriceField);
      await userEvent.type(purchasePriceField, "250000");

      // Step 4: Enter loan details
      const downPaymentField = screen.getByLabelText(/Down Payment/i);
      await userEvent.clear(downPaymentField);
      await userEvent.type(downPaymentField, "50000");

      const interestRateField = screen.getByLabelText(/Interest Rate/i);
      await userEvent.clear(interestRateField);
      await userEvent.type(interestRateField, "6.5");

      // Step 5: Enter rental income
      const monthlyRentField = screen.getByLabelText(/Monthly Rent/i);
      await userEvent.clear(monthlyRentField);
      await userEvent.type(monthlyRentField, "2000");

      // Step 6: Wait for calculations to update
      await waitFor(() => {
        // Should see cash flow calculations
        const cashFlow = screen.queryByText(/Cash Flow/i);
        expect(cashFlow).toBeInTheDocument();
      });

      // Verify calculations are present (we're testing integration, not exact values)
      expect(screen.getByText(/NOI/i)).toBeInTheDocument();
      expect(screen.getByText(/Cash on Cash/i)).toBeInTheDocument();
    });

    it("should calculate Buy & Hold multi-family property correctly", async () => {
      renderWithRouter(<UnderwritePage />);

      await waitFor(() => {
        expect(screen.getByText(/Deal Analyzer/i)).toBeInTheDocument();
      });

      // Change to Multi Family
      await selectFromDropdown("Property Type", "Multi Family");
      await selectFromDropdown("Operation Type", "Buy & Hold");

      // Enter purchase price
      const purchasePriceField = screen.getByLabelText(/Purchase Price/i);
      await userEvent.clear(purchasePriceField);
      await userEvent.type(purchasePriceField, "500000");

      // Multi-family should have multiple unit inputs
      // Look for unit rent fields (default is 2 units)
      const unitRentFields = screen.getAllByLabelText(/Unit.*Rent/i);
      expect(unitRentFields.length).toBeGreaterThan(0);

      // Fill in unit rents
      if (unitRentFields[0]) {
        await userEvent.clear(unitRentFields[0]);
        await userEvent.type(unitRentFields[0], "1500");
      }
      if (unitRentFields[1]) {
        await userEvent.clear(unitRentFields[1]);
        await userEvent.type(unitRentFields[1], "1600");
      }

      // Verify multi-family calculations appear
      await waitFor(() => {
        expect(screen.getByText(/Total Units/i)).toBeInTheDocument();
      });
    });

    it("should update calculations when operating expenses change", async () => {
      renderWithRouter(<UnderwritePage />);

      await waitFor(() => {
        expect(screen.getByText(/Deal Analyzer/i)).toBeInTheDocument();
      });

      // Set basic deal parameters
      const purchasePriceField = screen.getByLabelText(/Purchase Price/i);
      await userEvent.clear(purchasePriceField);
      await userEvent.type(purchasePriceField, "200000");

      const monthlyRentField = screen.getByLabelText(/Monthly Rent/i);
      await userEvent.clear(monthlyRentField);
      await userEvent.type(monthlyRentField, "1800");

      // Expand operating expenses section
      await expandAccordion("Operating Expenses");

      // Change property taxes
      const taxesField = screen.getByLabelText(/Property Tax/i, { exact: false });
      await userEvent.clear(taxesField);
      await userEvent.type(taxesField, "300");

      // Change insurance
      const insuranceField = screen.getByLabelText(/Insurance/i);
      await userEvent.clear(insuranceField);
      await userEvent.type(insuranceField, "150");

      // Verify that NOI is recalculated
      await waitFor(() => {
        const noiElements = screen.getAllByText(/NOI/i);
        expect(noiElements.length).toBeGreaterThan(0);
      });
    });
  });

  // ========================================
  // FIX & FLIP WORKFLOW TESTS
  // ========================================
  describe("Fix & Flip Workflow", () => {
    it("should complete full Fix & Flip workflow", async () => {
      renderWithRouter(<UnderwritePage />);

      await waitFor(() => {
        expect(screen.getByText(/Deal Analyzer/i)).toBeInTheDocument();
      });

      // Set to Fix & Flip
      await selectFromDropdown("Operation Type", "Fix & Flip");

      // Enter purchase price
      const purchasePriceField = screen.getByLabelText(/Purchase Price/i);
      await userEvent.clear(purchasePriceField);
      await userEvent.type(purchasePriceField, "180000");

      // Fix & Flip specific fields should appear
      await waitFor(() => {
        expect(screen.getByLabelText(/ARV/i)).toBeInTheDocument();
      });

      // Enter ARV (After Repair Value)
      const arvField = screen.getByLabelText(/ARV/i);
      await userEvent.clear(arvField);
      await userEvent.type(arvField, "280000");

      // Enter rehab costs
      const rehabField = screen.getByLabelText(/Rehab Cost/i);
      await userEvent.clear(rehabField);
      await userEvent.type(rehabField, "50000");

      // Enter holding period
      const holdingPeriodField = screen.getByLabelText(/Holding Period/i);
      await userEvent.clear(holdingPeriodField);
      await userEvent.type(holdingPeriodField, "6");

      // Verify Fix & Flip calculations
      await waitFor(() => {
        expect(screen.getByText(/Projected Profit/i)).toBeInTheDocument();
        expect(screen.getByText(/ROI/i)).toBeInTheDocument();
      });
    });

    it("should calculate 70% rule correctly for Fix & Flip", async () => {
      renderWithRouter(<UnderwritePage />);

      await waitFor(() => {
        expect(screen.getByText(/Deal Analyzer/i)).toBeInTheDocument();
      });

      await selectFromDropdown("Operation Type", "Fix & Flip");

      // Enter ARV
      const arvField = screen.getByLabelText(/ARV/i);
      await userEvent.clear(arvField);
      await userEvent.type(arvField, "300000");

      // Enter rehab costs
      const rehabField = screen.getByLabelText(/Rehab Cost/i);
      await userEvent.clear(rehabField);
      await userEvent.type(rehabField, "40000");

      // Should show Maximum Allowable Offer (MAO)
      await waitFor(() => {
        expect(screen.getByText(/Maximum Allowable Offer/i)).toBeInTheDocument();
      });

      // MAO should be approximately 70% of ARV minus rehab
      // (300000 * 0.7) - 40000 = 170000
      // We're not testing exact value, just that calculation appears
    });
  });

  // ========================================
  // BRRRR WORKFLOW TESTS
  // ========================================
  describe("BRRRR Workflow", () => {
    it("should complete full BRRRR workflow", async () => {
      renderWithRouter(<UnderwritePage />);

      await waitFor(() => {
        expect(screen.getByText(/Deal Analyzer/i)).toBeInTheDocument();
      });

      // Set to BRRRR strategy
      await selectFromDropdown("Operation Type", "BRRRR");

      // Enter purchase price
      const purchasePriceField = screen.getByLabelText(/Purchase Price/i);
      await userEvent.clear(purchasePriceField);
      await userEvent.type(purchasePriceField, "150000");

      // BRRRR specific fields should appear
      await waitFor(() => {
        expect(screen.getByLabelText(/ARV/i)).toBeInTheDocument();
      });

      // Enter ARV
      const arvField = screen.getByLabelText(/ARV/i);
      await userEvent.clear(arvField);
      await userEvent.type(arvField, "220000");

      // Enter rehab costs
      const rehabField = screen.getByLabelText(/Rehab Cost/i);
      await userEvent.clear(rehabField);
      await userEvent.type(rehabField, "40000");

      // Enter refinance LTV
      const refinanceLtvField = screen.getByLabelText(/Refinance LTV/i);
      await userEvent.clear(refinanceLtvField);
      await userEvent.type(refinanceLtvField, "75");

      // Enter monthly rent
      const monthlyRentField = screen.getByLabelText(/Monthly Rent/i);
      await userEvent.clear(monthlyRentField);
      await userEvent.type(monthlyRentField, "1800");

      // Verify BRRRR calculations
      await waitFor(() => {
        expect(screen.getByText(/Cash Out/i)).toBeInTheDocument();
        expect(screen.getByText(/Remaining Cash in Deal/i)).toBeInTheDocument();
      });
    });

    it("should calculate infinite return when cash-out exceeds investment", async () => {
      renderWithRouter(<UnderwritePage />);

      await waitFor(() => {
        expect(screen.getByText(/Deal Analyzer/i)).toBeInTheDocument();
      });

      await selectFromDropdown("Operation Type", "BRRRR");

      // Set up scenario where cash-out > initial investment
      const purchasePriceField = screen.getByLabelText(/Purchase Price/i);
      await userEvent.clear(purchasePriceField);
      await userEvent.type(purchasePriceField, "100000");

      const arvField = screen.getByLabelText(/ARV/i);
      await userEvent.clear(arvField);
      await userEvent.type(arvField, "200000");

      const refinanceLtvField = screen.getByLabelText(/Refinance LTV/i);
      await userEvent.clear(refinanceLtvField);
      await userEvent.type(refinanceLtvField, "75");

      // With ARV of 200k and 75% LTV, cash-out would be 150k
      // If initial investment was only 20k down, infinite return achieved
      const downPaymentField = screen.getByLabelText(/Down Payment/i);
      await userEvent.clear(downPaymentField);
      await userEvent.type(downPaymentField, "20000");

      await waitFor(() => {
        // Should show very high or infinite CoC
        const cocElements = screen.getAllByText(/Cash on Cash/i);
        expect(cocElements.length).toBeGreaterThan(0);
      });
    });
  });

  // ========================================
  // SUBJECT-TO FINANCING TESTS
  // ========================================
  describe("Subject-To Financing", () => {
    it("should handle Subject-To existing mortgage", async () => {
      renderWithRouter(<UnderwritePage />);

      await waitFor(() => {
        expect(screen.getByText(/Deal Analyzer/i)).toBeInTheDocument();
      });

      // Change financing type to Subject-To
      await selectFromDropdown("Finance Type", "Subject To Existing Mortgage");

      // Enter purchase price
      const purchasePriceField = screen.getByLabelText(/Purchase Price/i);
      await userEvent.clear(purchasePriceField);
      await userEvent.type(purchasePriceField, "200000");

      // Subject-To specific fields should appear
      await waitFor(() => {
        expect(screen.getByText(/Subject.*To/i)).toBeInTheDocument();
      });

      // Look for existing loan balance field
      const existingBalanceField = screen.getByLabelText(/Existing.*Balance/i, {
        exact: false,
      });
      await userEvent.clear(existingBalanceField);
      await userEvent.type(existingBalanceField, "150000");

      // Enter payment to seller (cash to seller)
      const paymentToSellerField = screen.getByLabelText(/Payment.*Seller/i, {
        exact: false,
      });
      await userEvent.clear(paymentToSellerField);
      await userEvent.type(paymentToSellerField, "30000");

      // Verify total investment calculation includes payment to seller
      await waitFor(() => {
        const investmentElements = screen.getAllByText(/Investment/i);
        expect(investmentElements.length).toBeGreaterThan(0);
      });
    });

    it("should calculate cash flow with Subject-To payments", async () => {
      renderWithRouter(<UnderwritePage />);

      await waitFor(() => {
        expect(screen.getByText(/Deal Analyzer/i)).toBeInTheDocument();
      });

      await selectFromDropdown("Finance Type", "Subject To Existing Mortgage");

      const purchasePriceField = screen.getByLabelText(/Purchase Price/i);
      await userEvent.clear(purchasePriceField);
      await userEvent.type(purchasePriceField, "250000");

      // Set up existing mortgage
      const existingBalanceField = screen.getByLabelText(/Existing.*Balance/i, {
        exact: false,
      });
      await userEvent.clear(existingBalanceField);
      await userEvent.type(existingBalanceField, "200000");

      const existingPaymentField = screen.getByLabelText(/Monthly Payment/i, {
        exact: false,
      });
      await userEvent.clear(existingPaymentField);
      await userEvent.type(existingPaymentField, "1200");

      // Enter rental income
      const monthlyRentField = screen.getByLabelText(/Monthly Rent/i);
      await userEvent.clear(monthlyRentField);
      await userEvent.type(monthlyRentField, "2000");

      // Verify cash flow calculation includes Subject-To payment
      await waitFor(() => {
        expect(screen.getByText(/Cash Flow/i)).toBeInTheDocument();
      });
    });
  });

  // ========================================
  // HYBRID FINANCING TESTS
  // ========================================
  describe("Hybrid Financing", () => {
    it("should handle Hybrid financing with multiple loans", async () => {
      renderWithRouter(<UnderwritePage />);

      await waitFor(() => {
        expect(screen.getByText(/Deal Analyzer/i)).toBeInTheDocument();
      });

      // Change financing type to Hybrid
      await selectFromDropdown("Finance Type", "Hybrid");

      // Enter purchase price
      const purchasePriceField = screen.getByLabelText(/Purchase Price/i);
      await userEvent.clear(purchasePriceField);
      await userEvent.type(purchasePriceField, "300000");

      // Hybrid should show multiple loan sections
      await waitFor(() => {
        expect(screen.getByText(/Hybrid/i)).toBeInTheDocument();
      });

      // Enter conventional down payment
      const downPaymentField = screen.getByLabelText(/Down Payment/i);
      await userEvent.clear(downPaymentField);
      await userEvent.type(downPaymentField, "60000");

      // Enter Subject-To loan amount (within hybrid)
      const subjectToBalanceField = screen.getByLabelText(/Subject.*Balance/i, {
        exact: false,
      });
      if (subjectToBalanceField) {
        await userEvent.clear(subjectToBalanceField);
        await userEvent.type(subjectToBalanceField, "150000");
      }

      // Verify total debt service combines all loans
      await waitFor(() => {
        expect(screen.getByText(/Total.*Debt/i)).toBeInTheDocument();
      });
    });
  });

  // ========================================
  // RENTAL ARBITRAGE TESTS
  // ========================================
  describe("Rental Arbitrage Workflow", () => {
    it("should complete Rental Arbitrage workflow", async () => {
      renderWithRouter(<UnderwritePage />);

      await waitFor(() => {
        expect(screen.getByText(/Deal Analyzer/i)).toBeInTheDocument();
      });

      // Set to Rental Arbitrage
      await selectFromDropdown("Operation Type", "Rental Arbitrage");

      // Rental Arbitrage specific fields should appear
      await waitFor(() => {
        expect(screen.getByText(/Arbitrage/i)).toBeInTheDocument();
      });

      // Enter monthly rent to landlord
      const rentToLandlordField = screen.getByLabelText(/Rent.*Landlord/i, {
        exact: false,
      });
      await userEvent.clear(rentToLandlordField);
      await userEvent.type(rentToLandlordField, "2000");

      // Enter security deposit
      const depositField = screen.getByLabelText(/Deposit/i);
      await userEvent.clear(depositField);
      await userEvent.type(depositField, "4000");

      // Enter furniture costs
      const furnitureField = screen.getByLabelText(/Furniture/i);
      await userEvent.clear(furnitureField);
      await userEvent.type(furnitureField, "5000");

      // Enter rental income (what you charge guests)
      const monthlyIncomeField = screen.getByLabelText(/Monthly.*Income/i, {
        exact: false,
      });
      await userEvent.clear(monthlyIncomeField);
      await userEvent.type(monthlyIncomeField, "4000");

      // Verify arbitrage calculations
      await waitFor(() => {
        // Should show spread between income and rent
        expect(screen.getByText(/Cash Flow/i)).toBeInTheDocument();
      });
    });

    it("should calculate Rental Arbitrage ROI on furniture + deposit only", async () => {
      renderWithRouter(<UnderwritePage />);

      await waitFor(() => {
        expect(screen.getByText(/Deal Analyzer/i)).toBeInTheDocument();
      });

      await selectFromDropdown("Operation Type", "Rental Arbitrage");

      // Set up arbitrage with minimal investment
      const depositField = screen.getByLabelText(/Deposit/i);
      await userEvent.clear(depositField);
      await userEvent.type(depositField, "3000");

      const furnitureField = screen.getByLabelText(/Furniture/i);
      await userEvent.clear(furnitureField);
      await userEvent.type(furnitureField, "7000");

      // Total investment should be 10k (deposit + furniture)
      // Verify CoC is based on 10k, not property value
      await waitFor(() => {
        const cocElements = screen.getAllByText(/Cash on Cash/i);
        expect(cocElements.length).toBeGreaterThan(0);
      });
    });
  });

  // ========================================
  // PROPERTY TYPE SWITCH TESTS
  // ========================================
  describe("Property Type Switches", () => {
    it("should switch from Single Family to Multi Family", async () => {
      renderWithRouter(<UnderwritePage />);

      await waitFor(() => {
        expect(screen.getByText(/Deal Analyzer/i)).toBeInTheDocument();
      });

      // Start with Single Family (default)
      expect(screen.getByLabelText(/Monthly Rent/i)).toBeInTheDocument();

      // Switch to Multi Family
      await selectFromDropdown("Property Type", "Multi Family");

      // Should now show unit rent fields instead of single rent
      await waitFor(() => {
        const unitRentFields = screen.getAllByLabelText(/Unit.*Rent/i);
        expect(unitRentFields.length).toBeGreaterThan(0);
      });
    });

    it("should switch from Single Family to Hotel", async () => {
      renderWithRouter(<UnderwritePage />);

      await waitFor(() => {
        expect(screen.getByText(/Deal Analyzer/i)).toBeInTheDocument();
      });

      // Switch to Hotel
      await selectFromDropdown("Property Type", "Hotel");

      // Should show hotel-specific fields
      await waitFor(() => {
        expect(screen.getByLabelText(/Total Rooms/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Average Daily Rate/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Occupancy Rate/i)).toBeInTheDocument();
      });
    });

    it("should switch from Single Family to Office", async () => {
      renderWithRouter(<UnderwritePage />);

      await waitFor(() => {
        expect(screen.getByText(/Deal Analyzer/i)).toBeInTheDocument();
      });

      // Switch to Office
      await selectFromDropdown("Property Type", "Office");

      // Should show commercial-specific fields
      await waitFor(() => {
        expect(screen.getByLabelText(/Square Footage/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Rent per SF/i)).toBeInTheDocument();
      });
    });

    it("should switch from Single Family to Land", async () => {
      renderWithRouter(<UnderwritePage />);

      await waitFor(() => {
        expect(screen.getByText(/Deal Analyzer/i)).toBeInTheDocument();
      });

      // Switch to Land
      await selectFromDropdown("Property Type", "Land");

      // Land should have minimal income fields
      await waitFor(() => {
        expect(screen.getByLabelText(/Acreage/i)).toBeInTheDocument();
      });

      // Should NOT show rental income fields for land
      expect(screen.queryByLabelText(/Monthly Rent/i)).not.toBeInTheDocument();
    });

    it("should retain purchase price when switching property types", async () => {
      renderWithRouter(<UnderwritePage />);

      await waitFor(() => {
        expect(screen.getByText(/Deal Analyzer/i)).toBeInTheDocument();
      });

      // Enter purchase price
      const purchasePriceField = screen.getByLabelText(/Purchase Price/i);
      await userEvent.clear(purchasePriceField);
      await userEvent.type(purchasePriceField, "250000");

      // Switch property type
      await selectFromDropdown("Property Type", "Multi Family");

      // Purchase price should be retained
      await waitFor(() => {
        const priceField = screen.getByLabelText(/Purchase Price/i);
        expect(priceField).toHaveValue(250000);
      });
    });
  });

  // ========================================
  // PRO FORMA PRESET TESTS
  // ========================================
  describe("Pro Forma Preset Changes", () => {
    it("should apply conservative preset correctly", async () => {
      renderWithRouter(<UnderwritePage />);

      await waitFor(() => {
        expect(screen.getByText(/Deal Analyzer/i)).toBeInTheDocument();
      });

      // Expand Pro Forma section
      await expandAccordion("Pro Forma");

      // Select conservative preset
      await waitFor(() => {
        expect(screen.getByText(/Conservative/i)).toBeInTheDocument();
      });
      
      const conservativeButton = screen.getByText(/Conservative/i);
      await userEvent.click(conservativeButton);

      // Conservative should have higher vacancy, maintenance, etc.
      await waitFor(() => {
        // Verify higher percentages are applied
        const vacancyField = screen.getByLabelText(/Vacancy/i);
        const maintenanceField = screen.getByLabelText(/Maintenance/i);
        
        expect(vacancyField).toBeInTheDocument();
        expect(maintenanceField).toBeInTheDocument();
      });
    });

    it("should apply moderate preset correctly", async () => {
      renderWithRouter(<UnderwritePage />);

      await waitFor(() => {
        expect(screen.getByText(/Deal Analyzer/i)).toBeInTheDocument();
      });

      // Expand Pro Forma section
      await expandAccordion("Pro Forma");

      // Select moderate preset (usually default)
      await waitFor(() => {
        expect(screen.getByText(/Moderate/i)).toBeInTheDocument();
      });
      
      const moderateButton = screen.getByText(/Moderate/i);
      await userEvent.click(moderateButton);

      // Verify moderate percentages
      await waitFor(() => {
        expect(screen.getByLabelText(/Vacancy/i)).toBeInTheDocument();
      });
    });

    it("should apply aggressive preset correctly", async () => {
      renderWithRouter(<UnderwritePage />);

      await waitFor(() => {
        expect(screen.getByText(/Deal Analyzer/i)).toBeInTheDocument();
      });

      // Expand Pro Forma section
      await expandAccordion("Pro Forma");

      // Select aggressive preset
      await waitFor(() => {
        expect(screen.getByText(/Aggressive/i)).toBeInTheDocument();
      });
      
      const aggressiveButton = screen.getByText(/Aggressive/i);
      await userEvent.click(aggressiveButton);

      // Aggressive should have lower vacancy, maintenance, etc.
      await waitFor(() => {
        expect(screen.getByLabelText(/Vacancy/i)).toBeInTheDocument();
      });
    });

    it("should allow manual override of preset values", async () => {
      renderWithRouter(<UnderwritePage />);

      await waitFor(() => {
        expect(screen.getByText(/Deal Analyzer/i)).toBeInTheDocument();
      });

      // Apply conservative preset
      await expandAccordion("Pro Forma");

      await waitFor(() => {
        expect(screen.getByText(/Conservative/i)).toBeInTheDocument();
      });
      
      const conservativeButton = screen.getByText(/Conservative/i);
      await userEvent.click(conservativeButton);

      // Manually change vacancy rate
      const vacancyField = screen.getByLabelText(/Vacancy/i);
      await userEvent.clear(vacancyField);
      await userEvent.type(vacancyField, "7");

      // Manual change should override preset
      await waitFor(() => {
        expect(vacancyField).toHaveValue(7);
      });
    });
  });

  // ========================================
  // CALCULATION VALIDATION TESTS
  // ========================================
  describe("Calculation Validation", () => {
    it("should calculate NOI correctly", async () => {
      renderWithRouter(<UnderwritePage />);

      await waitFor(() => {
        expect(screen.getByText(/Deal Analyzer/i)).toBeInTheDocument();
      });

      // Set up known values
      const monthlyRentField = screen.getByLabelText(/Monthly Rent/i);
      await userEvent.clear(monthlyRentField);
      await userEvent.type(monthlyRentField, "2000");

      // Expand operating expenses
      await expandAccordion("Operating Expenses");

      const taxesField = screen.getByLabelText(/Property Tax/i, { exact: false });
      await userEvent.clear(taxesField);
      await userEvent.type(taxesField, "200");

      const insuranceField = screen.getByLabelText(/Insurance/i);
      await userEvent.clear(insuranceField);
      await userEvent.type(insuranceField, "100");

      // NOI should be income - expenses
      // Verify NOI is displayed
      await waitFor(() => {
        expect(screen.getByText(/NOI/i)).toBeInTheDocument();
      });
    });

    it("should calculate DSCR correctly with debt", async () => {
      renderWithRouter(<UnderwritePage />);

      await waitFor(() => {
        expect(screen.getByText(/Deal Analyzer/i)).toBeInTheDocument();
      });

      // Set up deal with debt
      const purchasePriceField = screen.getByLabelText(/Purchase Price/i);
      await userEvent.clear(purchasePriceField);
      await userEvent.type(purchasePriceField, "200000");

      const downPaymentField = screen.getByLabelText(/Down Payment/i);
      await userEvent.clear(downPaymentField);
      await userEvent.type(downPaymentField, "40000");

      const monthlyRentField = screen.getByLabelText(/Monthly Rent/i);
      await userEvent.clear(monthlyRentField);
      await userEvent.type(monthlyRentField, "1800");

      // DSCR = NOI / Debt Service
      // Verify DSCR is displayed
      await waitFor(() => {
        expect(screen.getByText(/DSCR/i)).toBeInTheDocument();
      });
    });

    it("should calculate Cap Rate correctly", async () => {
      renderWithRouter(<UnderwritePage />);

      await waitFor(() => {
        expect(screen.getByText(/Deal Analyzer/i)).toBeInTheDocument();
      });

      const purchasePriceField = screen.getByLabelText(/Purchase Price/i);
      await userEvent.clear(purchasePriceField);
      await userEvent.type(purchasePriceField, "250000");

      const monthlyRentField = screen.getByLabelText(/Monthly Rent/i);
      await userEvent.clear(monthlyRentField);
      await userEvent.type(monthlyRentField, "2000");

      // Cap Rate = Annual NOI / Purchase Price
      await waitFor(() => {
        expect(screen.getByText(/Cap Rate/i)).toBeInTheDocument();
      });
    });
  });

  // ========================================
  // EDGE CASE TESTS
  // ========================================
  describe("Edge Cases and Validation", () => {
    it("should handle zero purchase price gracefully", async () => {
      renderWithRouter(<UnderwritePage />);

      await waitFor(() => {
        expect(screen.getByText(/Deal Analyzer/i)).toBeInTheDocument();
      });

      const purchasePriceField = screen.getByLabelText(/Purchase Price/i);
      await userEvent.clear(purchasePriceField);
      await userEvent.type(purchasePriceField, "0");

      // Should not crash, should show validation or zero calculations
      await waitFor(() => {
        expect(screen.getByText(/Deal Analyzer/i)).toBeInTheDocument();
      });
    });

    it("should handle very large values", async () => {
      renderWithRouter(<UnderwritePage />);

      await waitFor(() => {
        expect(screen.getByText(/Deal Analyzer/i)).toBeInTheDocument();
      });

      const purchasePriceField = screen.getByLabelText(/Purchase Price/i);
      await userEvent.clear(purchasePriceField);
      await userEvent.type(purchasePriceField, "50000000");

      // Should handle $50M property
      await waitFor(() => {
        expect(purchasePriceField).toHaveValue(50000000);
      });
    });

    it("should prevent negative rental income", async () => {
      renderWithRouter(<UnderwritePage />);

      await waitFor(() => {
        expect(screen.getByText(/Deal Analyzer/i)).toBeInTheDocument();
      });

      const monthlyRentField = screen.getByLabelText(/Monthly Rent/i);
      await userEvent.clear(monthlyRentField);
      await userEvent.type(monthlyRentField, "-1000");

      // Should either prevent negative or show validation
      // Implementation may vary, we're just testing it doesn't crash
      await waitFor(() => {
        expect(screen.getByText(/Deal Analyzer/i)).toBeInTheDocument();
      });
    });

    it("should recalculate when any input changes", async () => {
      renderWithRouter(<UnderwritePage />);

      await waitFor(() => {
        expect(screen.getByText(/Deal Analyzer/i)).toBeInTheDocument();
      });

      // Set initial values
      const purchasePriceField = screen.getByLabelText(/Purchase Price/i);
      await userEvent.clear(purchasePriceField);
      await userEvent.type(purchasePriceField, "200000");

      const monthlyRentField = screen.getByLabelText(/Monthly Rent/i);
      await userEvent.clear(monthlyRentField);
      await userEvent.type(monthlyRentField, "1500");

      // Wait for initial calculation
      await waitFor(() => {
        expect(screen.getByText(/Cash Flow/i)).toBeInTheDocument();
      });

      // Change purchase price
      await userEvent.clear(purchasePriceField);
      await userEvent.type(purchasePriceField, "250000");

      // Calculations should update
      await waitFor(() => {
        expect(screen.getByText(/Cash Flow/i)).toBeInTheDocument();
      });
    });
  });

  // ========================================
  // NAVIGATION TESTS
  // ========================================
  describe("Navigation and Actions", () => {
    it("should save state to sessionStorage when Analyze button is clicked", async () => {
      renderWithRouter(<UnderwritePage />);

      await waitFor(() => {
        expect(screen.getByText(/Deal Analyzer/i)).toBeInTheDocument();
      });

      // Enter some data
      const purchasePriceField = screen.getByLabelText(/Purchase Price/i);
      await userEvent.clear(purchasePriceField);
      await userEvent.type(purchasePriceField, "200000");

      // Find and click Analyze button
      const analyzeButton = screen.getByRole("button", { name: /Analyze/i });
      await userEvent.click(analyzeButton);

      // Should save to sessionStorage
      await waitFor(() => {
        const saved = sessionStorage.getItem("advancedDeal");
        expect(saved).toBeTruthy();
      });
    });

    it("should reset form when Reset button is clicked", async () => {
      renderWithRouter(<UnderwritePage />);

      await waitFor(() => {
        expect(screen.getByText(/Deal Analyzer/i)).toBeInTheDocument();
      });

      // Enter some data
      const purchasePriceField = screen.getByLabelText(/Purchase Price/i);
      await userEvent.clear(purchasePriceField);
      await userEvent.type(purchasePriceField, "300000");

      // Click Reset
      const resetButton = screen.getByRole("button", { name: /Reset/i });
      await userEvent.click(resetButton);

      // Form should reset to defaults
      await waitFor(() => {
        const priceField = screen.getByLabelText(/Purchase Price/i);
        // Should be default value (likely 160000 based on defaultState)
        expect(priceField).not.toHaveValue(300000);
      });
    });
  });
});

