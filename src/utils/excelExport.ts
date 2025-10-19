/**
 * Excel Export Utility
 * 
 * Exports cash flow projections to Excel workbook with multiple sheets
 */

import * as XLSX from 'xlsx';
import { CashFlowProjectionResults, YearlyProjection, LoanPaydownEntry } from './cashFlowProjections';

// ============================================================================
// Types
// ============================================================================

export interface ExcelExportOptions {
  fileName?: string;
  includeSummary?: boolean;
  includeYearlyDetails?: boolean;
  includeLoanSchedule?: boolean;
  includeCapitalEvents?: boolean;
}

// ============================================================================
// Export Functions
// ============================================================================

/**
 * Export cash flow projections to Excel
 */
export function exportCashFlowProjectionsToExcel(
  results: CashFlowProjectionResults,
  options: ExcelExportOptions = {}
): void {
  const {
    fileName = `CashFlowProjections_${new Date().toISOString().split('T')[0]}.xlsx`,
    includeSummary = true,
    includeYearlyDetails = true,
    includeLoanSchedule = true,
    includeCapitalEvents = true
  } = options;

  // Create workbook
  const workbook = XLSX.utils.book_new();

  // Add summary sheet
  if (includeSummary) {
    const summarySheet = createSummarySheet(results);
    XLSX.utils.book_append_sheet(workbook, summarySheet, 'Summary');
  }

  // Add yearly details sheet
  if (includeYearlyDetails) {
    const yearlySheet = createYearlyDetailsSheet(results.yearlyProjections);
    XLSX.utils.book_append_sheet(workbook, yearlySheet, 'Year-by-Year');
  }

  // Add loan schedule sheet
  if (includeLoanSchedule && results.loanPaydownSchedule.length > 0) {
    const loanSheet = createLoanScheduleSheet(results.loanPaydownSchedule);
    XLSX.utils.book_append_sheet(workbook, loanSheet, 'Loan Schedule');
  }

  // Add capital events sheet
  if (includeCapitalEvents) {
    const capitalEventsData = results.yearlyProjections
      .flatMap(proj => proj.capitalEvents.map(event => ({
        ...event,
        projectionYear: proj.year
      })));
    
    if (capitalEventsData.length > 0) {
      const eventsSheet = createCapitalEventsSheet(capitalEventsData);
      XLSX.utils.book_append_sheet(workbook, eventsSheet, 'Capital Events');
    }
  }

  // Write file
  XLSX.writeFile(workbook, fileName);
}

/**
 * Create summary sheet
 */
function createSummarySheet(results: CashFlowProjectionResults): XLSX.WorkSheet {
  const { summary, yearlyProjections } = results;

  const data = [
    ['Cash Flow Projection Summary'],
    [''],
    ['Metric', 'Value'],
    ['Projection Period (Years)', yearlyProjections.length],
    [''],
    ['RETURNS'],
    ['Total Cash Flow', summary.totalCashFlow],
    ['Total Principal Paydown', summary.totalPrincipalPaydown],
    ['Total Appreciation', summary.totalAppreciation],
    ['Total Return', summary.totalReturn],
    ['Annualized Return (%)', summary.annualizedReturn],
    [''],
    ['FINAL POSITION'],
    ['Final Equity', summary.finalEquity],
    ['Total Capital Events', summary.totalCapitalEvents],
    [''],
    ['FIRST YEAR METRICS'],
    ['Year 1 Monthly Rent', yearlyProjections[0]?.monthlyRent || 0],
    ['Year 1 NOI', yearlyProjections[0]?.noi || 0],
    ['Year 1 Cash Flow', yearlyProjections[0]?.cashFlowAfterCapEx || 0],
    ['Year 1 Cash-on-Cash (%)', yearlyProjections[0]?.cashOnCashReturn || 0],
    ['Year 1 Cap Rate (%)', yearlyProjections[0]?.capRate || 0],
    [''],
    ['FINAL YEAR METRICS'],
    ['Final Year Monthly Rent', yearlyProjections[yearlyProjections.length - 1]?.monthlyRent || 0],
    ['Final Year NOI', yearlyProjections[yearlyProjections.length - 1]?.noi || 0],
    ['Final Year Cash Flow', yearlyProjections[yearlyProjections.length - 1]?.cashFlowAfterCapEx || 0],
    ['Final Year Cash-on-Cash (%)', yearlyProjections[yearlyProjections.length - 1]?.cashOnCashReturn || 0],
    ['Final Year Cap Rate (%)', yearlyProjections[yearlyProjections.length - 1]?.capRate || 0],
  ];

  const worksheet = XLSX.utils.aoa_to_sheet(data);

  // Set column widths
  worksheet['!cols'] = [
    { wch: 30 }, // Metric column
    { wch: 20 }  // Value column
  ];

  // Apply formatting (bold headers)
  if (worksheet['A1']) worksheet['A1'].s = { font: { bold: true, sz: 14 } };
  if (worksheet['A3']) worksheet['A3'].s = { font: { bold: true } };
  if (worksheet['B3']) worksheet['B3'].s = { font: { bold: true } };

  return worksheet;
}

/**
 * Create yearly details sheet
 */
function createYearlyDetailsSheet(yearlyProjections: YearlyProjection[]): XLSX.WorkSheet {
  const headers = [
    'Year',
    'Monthly Rent',
    'Annual Rent',
    'Gross Income',
    'Expenses',
    'NOI',
    'Debt Service',
    'Principal',
    'Interest',
    'Capital Events',
    'Cash Flow Before CapEx',
    'Cash Flow After CapEx',
    'Cumulative Cash Flow',
    'Loan Balance',
    'Property Value',
    'Equity',
    'CoC Return (%)',
    'ROI (%)',
    'Cap Rate (%)'
  ];

  const data = [
    headers,
    ...yearlyProjections.map(proj => [
      proj.year,
      proj.monthlyRent,
      proj.annualRent,
      proj.annualGrossIncome,
      proj.totalExpenses,
      proj.noi,
      proj.totalDebtService,
      proj.principalPayment,
      proj.interestPayment,
      proj.totalCapitalEvents,
      proj.cashFlowBeforeCapEx,
      proj.cashFlowAfterCapEx,
      proj.cumulativeCashFlow,
      proj.loanBalance,
      proj.propertyValue,
      proj.equity,
      proj.cashOnCashReturn,
      proj.roi,
      proj.capRate
    ])
  ];

  const worksheet = XLSX.utils.aoa_to_sheet(data);

  // Set column widths
  worksheet['!cols'] = headers.map(() => ({ wch: 15 }));

  // Freeze header row
  worksheet['!freeze'] = { xSplit: 0, ySplit: 1 };

  return worksheet;
}

/**
 * Create loan schedule sheet
 */
function createLoanScheduleSheet(loanSchedule: LoanPaydownEntry[]): XLSX.WorkSheet {
  const headers = [
    'Year',
    'Month',
    'Payment',
    'Principal',
    'Interest',
    'Balance'
  ];

  const data = [
    headers,
    ...loanSchedule.map(entry => [
      entry.year,
      entry.month,
      entry.payment,
      entry.principal,
      entry.interest,
      entry.balance
    ])
  ];

  const worksheet = XLSX.utils.aoa_to_sheet(data);

  // Set column widths
  worksheet['!cols'] = headers.map(() => ({ wch: 15 }));

  // Freeze header row
  worksheet['!freeze'] = { xSplit: 0, ySplit: 1 };

  return worksheet;
}

/**
 * Create capital events sheet
 */
function createCapitalEventsSheet(capitalEvents: any[]): XLSX.WorkSheet {
  const headers = [
    'Year',
    'Type',
    'Description',
    'Amount',
    'Capital Improvement',
    'Value Add %'
  ];

  const data = [
    headers,
    ...capitalEvents.map(event => [
      event.projectionYear,
      event.type,
      event.description,
      event.amount,
      event.isCapitalImprovement ? 'Yes' : 'No',
      event.valueAddPercentage ? (event.valueAddPercentage * 100) : 0
    ])
  ];

  const worksheet = XLSX.utils.aoa_to_sheet(data);

  // Set column widths
  worksheet['!cols'] = [
    { wch: 8 },   // Year
    { wch: 20 },  // Type
    { wch: 30 },  // Description
    { wch: 15 },  // Amount
    { wch: 18 },  // Capital Improvement
    { wch: 12 }   // Value Add %
  ];

  // Freeze header row
  worksheet['!freeze'] = { xSplit: 0, ySplit: 1 };

  return worksheet;
}

/**
 * Export single year details to CSV
 */
export function exportYearToCsv(projection: YearlyProjection, fileName?: string): void {
  const data = [
    ['Metric', 'Value'],
    ['Year', projection.year],
    ['Monthly Rent', projection.monthlyRent],
    ['Annual Rent', projection.annualRent],
    ['Gross Income', projection.annualGrossIncome],
    ['Total Expenses', projection.totalExpenses],
    ['NOI', projection.noi],
    ['Debt Service', projection.totalDebtService],
    ['Principal Payment', projection.principalPayment],
    ['Interest Payment', projection.interestPayment],
    ['Capital Events', projection.totalCapitalEvents],
    ['Cash Flow Before CapEx', projection.cashFlowBeforeCapEx],
    ['Cash Flow After CapEx', projection.cashFlowAfterCapEx],
    ['Cumulative Cash Flow', projection.cumulativeCashFlow],
    ['Loan Balance', projection.loanBalance],
    ['Property Value', projection.propertyValue],
    ['Equity', projection.equity],
    ['Cash-on-Cash Return (%)', projection.cashOnCashReturn],
    ['ROI (%)', projection.roi],
    ['Cap Rate (%)', projection.capRate]
  ];

  const worksheet = XLSX.utils.aoa_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, `Year ${projection.year}`);

  const file = fileName || `Year_${projection.year}_${new Date().toISOString().split('T')[0]}.csv`;
  XLSX.writeFile(workbook, file, { bookType: 'csv' });
}

/**
 * Create a formatted Excel buffer for download (browser)
 */
export function createExcelBuffer(
  results: CashFlowProjectionResults,
  options: ExcelExportOptions = {}
): ArrayBuffer {
  const {
    includeSummary = true,
    includeYearlyDetails = true,
    includeLoanSchedule = true,
    includeCapitalEvents = true
  } = options;

  const workbook = XLSX.utils.book_new();

  if (includeSummary) {
    const summarySheet = createSummarySheet(results);
    XLSX.utils.book_append_sheet(workbook, summarySheet, 'Summary');
  }

  if (includeYearlyDetails) {
    const yearlySheet = createYearlyDetailsSheet(results.yearlyProjections);
    XLSX.utils.book_append_sheet(workbook, yearlySheet, 'Year-by-Year');
  }

  if (includeLoanSchedule && results.loanPaydownSchedule.length > 0) {
    const loanSheet = createLoanScheduleSheet(results.loanPaydownSchedule);
    XLSX.utils.book_append_sheet(workbook, loanSheet, 'Loan Schedule');
  }

  if (includeCapitalEvents) {
    const capitalEventsData = results.yearlyProjections
      .flatMap(proj => proj.capitalEvents.map(event => ({
        ...event,
        projectionYear: proj.year
      })));
    
    if (capitalEventsData.length > 0) {
      const eventsSheet = createCapitalEventsSheet(capitalEventsData);
      XLSX.utils.book_append_sheet(workbook, eventsSheet, 'Capital Events');
    }
  }

  return XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
}

/**
 * Trigger download in browser
 */
export function downloadExcelFile(
  results: CashFlowProjectionResults,
  fileName?: string,
  options: ExcelExportOptions = {}
): void {
  const buffer = createExcelBuffer(results, options);
  const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName || `CashFlowProjections_${new Date().toISOString().split('T')[0]}.xlsx`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

