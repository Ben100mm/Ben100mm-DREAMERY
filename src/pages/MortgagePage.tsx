import React, { useState, useRef } from "react";
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Container,
  Divider,
  Link,
  IconButton,
  Chip,
  TextField,
  Select,
  MenuItem,
  FormControlLabel,
  Switch,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  LinearProgress,
} from "@mui/material";
import {
  LoadingSpinner,
  LoadingOverlayComponent,
  SuccessMessage,
  ErrorMessage,
  EnhancedTextFieldWithValidation,
  EnhancedNumberInput,
  FormSection,
  useFormValidation,
  CompletionProgress,
  HelpTooltip,
  RequiredFieldIndicator,
} from "../components";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { brandColors } from "../theme";
import { PageAppBar } from "../components/Header";
import { LENDER_TYPES, PROPERTY_TYPES, LOAN_PURPOSES, CREDIT_SCORE_RANGES, DOWN_PAYMENT_OPTIONS } from "../data";

// Lazy load icons to reduce initial bundle size
const LazyCalculateIcon = React.lazy(() => import("@mui/icons-material/Calculate"));
const LazyDescriptionIcon = React.lazy(() => import("@mui/icons-material/Description"));
const LazyFlagIcon = React.lazy(() => import("@mui/icons-material/Flag"));
const LazyMoneyIcon = React.lazy(() => import("@mui/icons-material/AttachMoney"));
const LazyHomeIcon = React.lazy(() => import("@mui/icons-material/Home"));
const LazyCloseIcon = React.lazy(() => import("@mui/icons-material/Close"));

const PageContainer = styled.div`
  height: 100vh;
  background: brandColors.backgrounds.primary;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  margin-top: 64px; /* Account for fixed AppBar */

  /* Ensure scrollbar appears on the far right */
  &::-webkit-scrollbar {
    width: 12px;
  }

  &::-webkit-scrollbar-track {
    background: #f1f1f1;
  }

  &::-webkit-scrollbar-thumb {
    background: #c1c1c1;
    border-radius: 6px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: #a8a8a8;
  }
`;

const HeaderSection = styled.div`
  background: brandColors.backgrounds.primary;
  padding: 1rem 2rem;
  border-bottom: 1px solid brandColors.borders.secondary;
  position: sticky;
  top: 0;
  z-index: 100;
`;

const BuyAbilityCard = styled(Card)`
  background: brandColors.backgrounds.primary;
  border-radius: 16px;
  box-shadow: 0 8px 32px brandColors.shadows.light;
  margin: 0;
  max-width: 400px;
  position: relative;
  z-index: 10;
`;

const MortgageOptionCard = styled(Card)`
  height: 100%;
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  transition: transform 0.2s ease;

  &:hover {
    transform: translateY(-4px);
  }
`;

const LearningCard = styled(Card)`
  width: 320px;
  height: 280px;
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  flex-shrink: 0;
`;

// New layout building blocks
const SplitSection = styled.section`
  background: brandColors.backgrounds.primary;
  padding: 2rem 1.5rem 2.5rem;
`;

const SplitWrap = styled.div`
  display: flex;
  gap: 2rem;
  align-items: flex-start;
  max-width: 1100px;
  margin: 0 auto;

  @media (max-width: 960px) {
    flex-direction: column;
  }
`;

const LeftCol = styled.div`
  flex: 1;
  min-width: 0;
`;

const RightCol = styled.div`
  width: 380px;
  max-width: 100%;
  position: sticky;
  top: 88px; /* below sticky header */
`;

const MortgagePage: React.FC = () => {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [selectedLoan, setSelectedLoan] = useState<any>(null);
  const [showDreamAbilityModal, setShowDreamAbilityModal] = useState(false);
  const [showDreamAbilityResults, setShowDreamAbilityResults] = useState(false);
  const [showWhatThisMeans, setShowWhatThisMeans] = useState(false);
  const [showTargetPaymentBreakdown, setShowTargetPaymentBreakdown] =
    useState(false);
  const [showDownPaymentDetails, setShowDownPaymentDetails] = useState(false);
  const [showInterestRateDetails, setShowInterestRateDetails] = useState(false);
  const [showAprDetails, setShowAprDetails] = useState(false);
  const [isCalculating, setIsCalculating] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [dreamAbilityForm, setDreamAbilityForm] = useState({
    location: "",
    annualIncome: "",
    downPayment: "",
    creditScore: "",
    monthlyDebt: "",
  });
  // Carousel sizing constants
  const CARDS_PER_SLIDE = 3;
  const CARD_WIDTH_PX = 320; // must match LearningCard width
  const GAP_PX = 16; // must match the gap used between cards
  const SLIDE_WIDTH_PX =
    CARD_WIDTH_PX * CARDS_PER_SLIDE + GAP_PX * (CARDS_PER_SLIDE - 1);

  // Mortgage calculation constants
  const LOAN_AMOUNT = 1000000; // $1,000,000
  const CLOSING_COSTS = 15000; // $15,000 in closing costs

  // Mortgage payment calculation function
  const calculateMonthlyPayment = (
    principal: number,
    annualRate: number,
    years: number,
  ) => {
    const monthlyRate = annualRate / 12 / 100;
    const totalPayments = years * 12;
    if (monthlyRate === 0) return principal / totalPayments;
    return (
      (principal * (monthlyRate * Math.pow(1 + monthlyRate, totalPayments))) /
      (Math.pow(1 + monthlyRate, totalPayments) - 1)
    );
  };

  // APR calculation function
  const calculateAPR = (
    rate: number,
    points: number,
    years: number,
    loanAmount: number,
  ) => {
    const totalPayments = years * 12;
    const pointsCost = (points / 100) * loanAmount;
    const totalCost = pointsCost + CLOSING_COSTS;

    // Calculate APR using Newton's method approximation
    let apr = rate;
    for (let i = 0; i < 10; i++) {
      const monthlyAPR = apr / 12 / 100;
      const payment = calculateMonthlyPayment(loanAmount, apr, years);
      const totalPaymentsValue = payment * totalPayments;
      const costDifference = totalPaymentsValue - (loanAmount - totalCost);

      if (Math.abs(costDifference) < 0.01) break;

      const derivative = (totalPayments * payment) / (1 + monthlyAPR);
      apr = apr - costDifference / derivative;
    }

    return Math.min(apr, rate + 2); // Cap APR at rate + 2%
  };

  // Calculate points cost
  const calculatePointsCost = (points: number) => {
    return (points / 100) * LOAN_AMOUNT;
  };



  const handleNavigateToPreApproval = () => {
    navigate("/pre-approval");
  };

  // CSV helpers for Airtable shared views (read-only; no secrets)
  const parseCsv = (text: string) => {
    const lines = text.trim().split(/\r?\n/);
    if (lines.length === 0) return [] as any[];
    const headers = lines[0].split(",").map((h) => h.replace(/^"|"$/g, ""));
    return lines.slice(1).map((row) => {
      const cells = (row.match(/(".*?"|[^,]+)(?=,|$)/g) || []).map((c) =>
        c.replace(/^"|"$/g, ""),
      );
      const obj: Record<string, string> = {};
      headers.forEach((h, i) => {
        obj[h] = cells[i] ?? "";
      });
      return obj;
    });
  };

  const useCsvPoll = <T,>(
    url: string | undefined,
    ms = 60000,
    fallback: T[],
  ) => {
    const [data, setData] = useState<T[]>(fallback);
    React.useEffect(() => {
      if (!url) return;
      let cancelled = false;
      const load = async () => {
        try {
          const r = await fetch(
            `${url}url.includes("?") ? "&" : "?"ts=${Date.now()}`,
            { cache: "no-store" },
          );
          if (!r.ok) return;
          const txt = await r.text();
          if (!cancelled) setData(parseCsv(txt) as unknown as T[]);
        } catch {
          // ignore network errors in polling
        }
      };
      load();
      const id = setInterval(load, ms);
      return () => {
        cancelled = true;
        clearInterval(id);
      };
    }, [url, ms]);
    return data;
  };

  // --- Investment Sections (inline components) ---
  type LenderRow = {
    name: string;
    type: string;
    rate: number;
    term: number;
    points: number;
    dscrReq?: number;
    prepay?: string;
    applyUrl?: string;
  };

  const MortgageCalculatorSection: React.FC = () => {
    const [address, setAddress] = useState("");
    const [purchase, setPurchase] = useState(600000);
    const [rehab, setRehab] = useState(40000);
    const [closing, setClosing] = useState(15000);
    const [downPct, setDownPct] = useState(20);
    const [rate, setRate] = useState(6.25);
    const [term, setTerm] = useState(30);

    const monthlyInsurance = (purchase * 0.003) / 12;
    const monthlyTaxes = (purchase * 0.012) / 12;
    const rent = 3800; // placeholder until RentCast is wired
    const expenses = Math.round(monthlyInsurance + monthlyTaxes);
    const arv = Math.round(purchase * 1.08);

    const loanAmount = Math.max(
      0,
      purchase + rehab + closing - purchase * (downPct / 100),
    );
    const debtService = calculateMonthlyPayment(loanAmount, rate, term);
    const dscr = debtService ? (rent - expenses) / debtService : 0;
    const ltv = purchase ? loanAmount / purchase : 0;
    const ltc =
      purchase + rehab + closing
        ? loanAmount / (purchase + rehab + closing)
        : 0;

    return (
      <Card
        sx={{
          minHeight: "fit-content",
          overflow: "hidden",
          transition: "all 0.2s ease-in-out",
        }}
      >
        <CardContent
          sx={{
            minHeight: "fit-content",
            width: "100%",
            boxSizing: "border-box",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
            <Typography variant="h5" sx={{ fontWeight: 700, color: brandColors.primary }}>
              Mortgage Calculator
            </Typography>
            <HelpTooltip title="Calculate your monthly mortgage payment and total costs" />
          </Box>

          {/* Progress indicator */}
          <CompletionProgress
            completed={
              [address, purchase, rehab, closing, downPct, rate, term].filter(
                Boolean,
              ).length
            }
            total={7}
            label="Calculator Completion"
          />

          <Box
            sx={{
              display: "grid",
              gap: 2,
              gridTemplateColumns: { xs: "1fr", md: "repeat(2, 1fr)" },
              minHeight: "fit-content",
              gridAutoRows: "min-content",
              alignContent: "start",
            }}
          >
            <EnhancedTextFieldWithValidation
              label="Property Address"
              value={address}
              onChange={setAddress}
              required
              hint="Enter the property's full street address"
              tooltip="This should include street number, name, city, state, and ZIP code"
              placeholder="123 Main St, City, State 12345"
              multiline
              rows={2}
            />
            <Box
              sx={{
                display: "grid",
                gap: 2,
                gridTemplateColumns: { xs: "1fr 1fr", md: "repeat(3, 1fr)" },
                minHeight: "fit-content",
                gridAutoRows: "min-content",
                alignContent: "start",
              }}
            >
              <EnhancedNumberInput
                label="Purchase Price"
                value={purchase}
                onChange={setPurchase}
                format="currency"
                required
                hint="Enter the purchase price in dollars"
                min={0}
                max={10000000}
              />
              <EnhancedNumberInput
                label="Rehab Costs"
                value={rehab}
                onChange={setRehab}
                format="currency"
                hint="Enter estimated rehabilitation costs"
                min={0}
                max={1000000}
              />
              <EnhancedNumberInput
                label="Closing Costs"
                value={closing}
                onChange={setClosing}
                format="currency"
                hint="Enter estimated closing costs"
                min={0}
                max={50000}
              />
              <EnhancedNumberInput
                label="Down Payment %"
                value={downPct}
                onChange={setDownPct}
                format="percentage"
                required
                hint="Enter down payment percentage"
                min={0}
                max={100}
                step={0.1}
              />
              <EnhancedNumberInput
                label="Interest Rate %"
                value={rate}
                onChange={setRate}
                format="percentage"
                required
                hint="Enter annual interest rate"
                min={0}
                max={20}
                step={0.01}
              />
              <EnhancedNumberInput
                label="Loan Term (years)"
                value={term}
                onChange={setTerm}
                required
                hint="Enter loan term in years"
                min={1}
                max={50}
                step={1}
              />
            </Box>

            <Box
              sx={{
                p: 2,
                border: "1px solid brandColors.borders.secondary",
                borderRadius: 1,
                minHeight: "fit-content",
              }}
            >
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                Auto data
              </Typography>
              <Box
                sx={{
                  display: "grid",
                  gap: 1,
                  gridTemplateColumns: { xs: "1fr 1fr", md: "1fr 1fr" },
                  minHeight: "fit-content",
                  gridAutoRows: "min-content",
                  alignContent: "start",
                }}
              >
                <TextField
                  fullWidth
                  label="Monthly rent"
                  type="number"
                  value={rent}
                  sx={{
                    minHeight: "56px",
                    "& .MuiInputBase-root": {
                      minHeight: "56px",
                    },
                  }}
                />
                <TextField
                  fullWidth
                  label="Monthly expenses"
                  type="number"
                  value={expenses}
                  sx={{
                    minHeight: "56px",
                    "& .MuiInputBase-root": {
                      minHeight: "56px",
                    },
                  }}
                />
                <Box sx={{ gridColumn: "1 / -1" }}>
                  <TextField
                    fullWidth
                    label="ARV (from comps)"
                    type="number"
                    value={arv}
                    sx={{
                      minHeight: "56px",
                      "& .MuiInputBase-root": {
                        minHeight: "56px",
                      },
                    }}
                  />
                </Box>
              </Box>
            </Box>

            <Box
              sx={{
                p: 2,
                border: "1px solid brandColors.borders.secondary",
                borderRadius: 1,
                minHeight: "fit-content",
              }}
            >
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                Results
              </Typography>

              <LoadingOverlayComponent
                loading={isCalculating}
                message="Calculating mortgage..."
              >
                <Box
                  sx={{
                    display: "grid",
                    gap: 1,
                    gridTemplateColumns: {
                      xs: "1fr 1fr",
                      md: "repeat(3, 1fr)",
                    },
                    minHeight: "fit-content",
                    gridAutoRows: "min-content",
                    alignContent: "start",
                  }}
                >
                  <Typography>Loan: loanAmount.toLocaleString()</Typography>
                  <Typography>
                    Debt svc: Math.round(debtService).toLocaleString()/mo
                  </Typography>
                  <Typography>DSCR: {dscr.toFixed(2)}</Typography>
                  <Typography>LTV: {(ltv * 100).toFixed(1)}%</Typography>
                  <Typography>LTC: {(ltc * 100).toFixed(1)}%</Typography>
                </Box>
              </LoadingOverlayComponent>

              <Box sx={{ mt: 2, display: "flex", gap: 2 }}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => {
                    setIsCalculating(true);
                    // Simulate calculation
                    setTimeout(() => {
                      setIsCalculating(false);
                      setShowSuccess(true);
                    }, 2000);
                  }}
                  disabled={isCalculating}
                  startIcon={
                    <React.Suspense fallback={<Box sx={{ width: 24, height: 24 }} />}>
                      <LazyCalculateIcon />
                    </React.Suspense>
                  }
                  sx={{
                    backgroundColor: brandColors.primary,
                    textTransform: "none",
                    fontWeight: 600,
                  }}
                >
                  {isCalculating ? "Calculating..." : "Calculate Payment"}
                </Button>

                <Button
                  variant="outlined"
                  onClick={() => {
                    // Reset form
                    setAddress("");
                    setPurchase(0);
                    setRehab(0);
                    setClosing(0);
                    setDownPct(0);
                    setRate(0);
                    setTerm(0);
                  }}
                  sx={{
                    borderColor: brandColors.primary,
                    color: brandColors.primary,
                    textTransform: "none",
                    fontWeight: 600,
                  }}
                >
                  Reset
                </Button>
              </Box>
            </Box>
          </Box>
        </CardContent>
      </Card>
    );
  };

  const LenderComparisonSection: React.FC = () => {
    const [type, setType] = useState<
      "dscr" | "fixflip" | "bridge" | "conventional" | "hard"
    >("dscr");
    const [maxRate, setMaxRate] = useState<number>(12);
    const [maxPoints, setMaxPoints] = useState<number>(4);
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const [uploadedRows, setUploadedRows] = useState<LenderRow[] | null>(null);
    const raw = useCsvPoll<any>(
      process.env.REACT_APP_AT_LENDERS_CSV,
      60000,
      [],
    );
    const lenders: LenderRow[] = raw.map((r: any) => {
      const m: Record<string, string> = Object.entries(r).reduce(
        (acc: Record<string, string>, [k, v]) => {
          const key = k
            .trim()
            .toLowerCase()
            .replace(/[^a-z0-9]/g, "");
          acc[key] = String(v);
          return acc;
        },
        {},
      );
      const get = (key: string) => m[key] ?? "";
      const num = (key: string) => Number(get(key));
      return {
        name: get("name"),
        type: (get("type") || "").toLowerCase(),
        rate: num("rate"),
        term: num("term"),
        points: num("points"),
        dscrReq: m["dscrrequirement"]
          ? Number(m["dscrrequirement"])
          : undefined,
        prepay: get("prepay"),
        applyUrl: m["applyurl"] || get("applyurl"),
      };
    });
    const source = uploadedRows ?? lenders;
    const filtered = source.filter(
      (l) =>
        (!type || l.type === type) &&
        (isNaN(maxRate) || l.rate <= maxRate) &&
        (isNaN(maxPoints) || l.points <= maxPoints),
    );

    const handleUploadCsv = (text: string) => {
      try {
        const rows = parseCsv(text);
        const mapped: LenderRow[] = rows.map((r: any) => {
          const m: Record<string, string> = Object.entries(r).reduce(
            (acc: Record<string, string>, [k, v]) => {
              const key = String(k)
                .trim()
                .toLowerCase()
                .replace(/[^a-z0-9]/g, "");
              acc[key] = String(v);
              return acc;
            },
            {},
          );
          const get = (key: string) => m[key] ?? "";
          const num = (key: string) => Number(get(key));
          return {
            name: get("name"),
            type: (get("type") || "").toLowerCase(),
            rate: num("rate"),
            term: num("term"),
            points: num("points"),
            dscrReq: m["dscrrequirement"]
              ? Number(m["dscrrequirement"])
              : undefined,
            prepay: get("prepay"),
            applyUrl: m["applyurl"] || get("applyurl"),
          };
        });
        setUploadedRows(mapped);
      } catch {}
    };

    const onChooseFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      const text = await file.text();
      handleUploadCsv(text);
      e.target.value = "";
    };

    return (
      <Card>
        <CardContent>
          <Typography
            variant="h5"
            sx={{ fontWeight: 700, color: brandColors.primary, mb: 2 }}
          >
            Compare Other Lenders
          </Typography>
          <Box
            sx={{
              display: "grid",
              gap: 2,
              gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" },
              mb: 2,
            }}
          >
            <Select
              fullWidth
              value={type}
              onChange={(e) => setType(e.target.value as any)}
            >
              <MenuItem value="dscr">DSCR</MenuItem>
              <MenuItem value="fixflip">Fix & Flip</MenuItem>
              <MenuItem value="bridge">Bridge</MenuItem>
              <MenuItem value="conventional">Conventional</MenuItem>
              <MenuItem value="hard">Hard Money</MenuItem>
            </Select>
            <TextField
              fullWidth
              label="Max rate %"
              type="number"
              value={maxRate}
              onChange={(e) => setMaxRate(Number(e.target.value))}
            />
            <TextField
              fullWidth
              label="Max points"
              type="number"
              value={maxPoints}
              onChange={(e) => setMaxPoints(Number(e.target.value))}
            />
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 1 }}>
            <Button
              variant="outlined"
              onClick={() => fileInputRef.current?.click()}
              sx={{ borderColor: brandColors.primary, color: brandColors.primary }}
            >
              Upload lenders CSV
            </Button>
            {uploadedRows && (
              <Typography variant="caption" sx={{ color: brandColors.neutral[800] }}>
                Loaded {uploadedRows.length} rows from CSV (overrides live feed
                until refresh)
              </Typography>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv,text/csv"
              style={{ display: "none" }}
              onChange={onChooseFile}
            />
          </Box>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Lender</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Rate</TableCell>
                <TableCell>Term</TableCell>
                <TableCell>Points</TableCell>
                <TableCell>DSCR Req.</TableCell>
                <TableCell>Prepay</TableCell>
                <TableCell align="right">Apply</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filtered.map((l, i) => (
                <TableRow key={i}>
                  <TableCell>{l.name}</TableCell>
                  <TableCell sx={{ textTransform: "uppercase" }}>
                    {l.type}
                  </TableCell>
                  <TableCell>
                    {isNaN(l.rate) ? "-" : `${l.rate.toFixed(2)}%`}
                  </TableCell>
                  <TableCell>{isNaN(l.term) ? "-" : `${l.term} mo`}</TableCell>
                  <TableCell>
                    {isNaN(l.points) ? "-" : l.points.toFixed(2)}
                  </TableCell>
                  <TableCell>
                    {l.dscrReq ? l.dscrReq.toFixed(2) : "-"}
                  </TableCell>
                  <TableCell>{l.prepay || "-"}</TableCell>
                  <TableCell align="right">
                    <Button
                      size="small"
                      variant="outlined"
                      sx={{ borderColor: brandColors.primary, color: brandColors.primary }}
                      href={l.applyUrl || "#"}
                    >
                      Apply
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    );
  };

  const PreApprovalSection: React.FC = () => {
    const [step, setStep] = useState(0);
    const [soft, setSoft] = useState(true);
    const [form, setForm] = useState({
      name: "",
      email: "",
      address: "",
      income: "",
      credit: "",
    });
    const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));
    return (
      <Card>
        <CardContent>
          <Typography
            variant="h5"
            sx={{ fontWeight: 700, color: brandColors.primary, mb: 2 }}
          >
            Apply for Pre-Approval with our Partners
          </Typography>
          <LinearProgress
            variant="determinate"
            value={(step + 1) * 33.33}
            sx={{ mb: 2, height: 8, borderRadius: 1 }}
          />
          {step === 0 && (
            <Box
              sx={{
                display: "grid",
                gap: 2,
                gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
              }}
            >
              <TextField
                fullWidth
                label="Full name"
                value={form.name}
                onChange={(e) => set("name", e.target.value)}
              />
              <TextField
                fullWidth
                label="Email"
                value={form.email}
                onChange={(e) => set("email", e.target.value)}
              />
              <Box sx={{ gridColumn: "1 / -1" }}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={soft}
                      onChange={(e) => setSoft(e.target.checked)}
                    />
                  }
                  label="Soft credit check"
                />
              </Box>
            </Box>
          )}
          {step === 1 && (
            <Box
              sx={{
                display: "grid",
                gap: 2,
                gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
              }}
            >
              <Box sx={{ gridColumn: "1 / -1" }}>
                <TextField
                  fullWidth
                  label="Property address"
                  value={form.address}
                  onChange={(e) => set("address", e.target.value)}
                />
              </Box>
              <TextField
                fullWidth
                label="Annual income ($)"
                value={form.income}
                onChange={(e) => set("income", e.target.value)}
              />
              <Select
                fullWidth
                value={form.credit}
                onChange={(e) => set("credit", String(e.target.value))}
              >
                <MenuItem value="740+">740+</MenuItem>
                <MenuItem value="670-739">670-739</MenuItem>
                <MenuItem value="580-669">580-669</MenuItem>
                <MenuItem value="<580">{"<"}580</MenuItem>
              </Select>
            </Box>
          )}
          {step === 2 && (
            <Box>
              <Typography sx={{ mb: 1, color: brandColors.neutral[800] }}>Next Steps</Typography>
              <ul style={{ margin: 0, paddingLeft: 16 }}>
                <li>Upload income docs</li>
                <li>Verify identity</li>
                <li>Connect bank statements</li>
              </ul>
            </Box>
          )}
          <Box sx={{ mt: 2, display: "flex", gap: 1 }}>
            {step > 0 && (
              <Button
                variant="outlined"
                onClick={() => setStep((s) => s - 1)}
                sx={{ borderColor: brandColors.primary, color: brandColors.primary }}
              >
                Back
              </Button>
            )}
            {step < 2 ? (
              <Button
                variant="contained"
                onClick={() => setStep((s) => s + 1)}
                sx={{ backgroundColor: brandColors.primary }}
              >
                Next
              </Button>
            ) : (
              <Button variant="contained" sx={{ backgroundColor: brandColors.primary }}>
                Submit
              </Button>
            )}
          </Box>
        </CardContent>
      </Card>
    );
  };

  const handleNextSlide = () => {
    setCurrentSlide(
      (prev) => (prev + 1) % Math.ceil(learningArticles.length / 3),
    );
  };

  const handlePrevSlide = () => {
    setCurrentSlide((prev) => {
      const maxSlides = Math.ceil(learningArticles.length / 3);
      return prev === 0 ? maxSlides - 1 : prev - 1;
    });
  };

  const handleShowLoanTerms = (loan: any) => {
    setSelectedLoan(loan);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedLoan(null);
  };

  const handleOpenDreamAbilityModal = () => {
    setShowDreamAbilityModal(true);
  };

  const handleCloseDreamAbilityModal = () => {
    setShowDreamAbilityModal(false);
    setDreamAbilityForm({
      location: "",
      annualIncome: "",
      downPayment: "",
      creditScore: "",
      monthlyDebt: "",
    });
  };

  const handleCloseDreamAbilityResults = () => {
    setShowDreamAbilityResults(false);
    setDreamAbilityForm({
      location: "",
      annualIncome: "",
      downPayment: "",
      creditScore: "",
      monthlyDebt: "",
    });
  };

  const handleShowWhatThisMeans = () => {
    setShowWhatThisMeans(true);
  };

  const handleCloseWhatThisMeans = () => {
    setShowWhatThisMeans(false);
  };

  const handleShowTargetPaymentBreakdown = () => {
    setShowTargetPaymentBreakdown(true);
  };

  const handleCloseTargetPaymentBreakdown = () => {
    setShowTargetPaymentBreakdown(false);
  };

  const handleShowDownPaymentDetails = () => {
    setShowDownPaymentDetails(true);
  };

  const handleCloseDownPaymentDetails = () => {
    setShowDownPaymentDetails(false);
  };

  const handleShowInterestRateDetails = () => {
    setShowInterestRateDetails(true);
  };

  const handleCloseInterestRateDetails = () => {
    setShowInterestRateDetails(false);
  };

  const handleShowAprDetails = () => {
    setShowAprDetails(true);
  };

  const handleCloseAprDetails = () => {
    setShowAprDetails(false);
  };

  const handleDreamAbilityFormChange = (field: string, value: string) => {
    setDreamAbilityForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleCalculateDreamAbility = () => {
    // Calculate DreamAbility based on form inputs
    // This would typically involve complex mortgage calculations
    // Close the form modal and show results
    setShowDreamAbilityModal(false);
    setShowDreamAbilityResults(true);
  };

  const mortgageOptions = [
    {
      title: "30-Year Fixed",
      tag: "Most popular",
      rate: 6.375,
      apr: calculateAPR(6.375, 1.844, 30, LOAN_AMOUNT),
      points: 1.844,
      pointsCost: calculatePointsCost(1.844),
      monthlyPayment: calculateMonthlyPayment(LOAN_AMOUNT, 6.375, 30),
      features: ["3% min down payment", "Lower payments due to longer term"],
      color: brandColors.accent.success,
    },
    {
      title: "30-Year FHA",
      tag: "Lower credit profiles",
      rate: 6.0,
      apr: calculateAPR(6.0, 1.607, 30, LOAN_AMOUNT),
      points: 1.607,
      pointsCost: calculatePointsCost(1.607),
      monthlyPayment: calculateMonthlyPayment(LOAN_AMOUNT, 6.0, 30),
      features: ["3.5% min down payment", "Looser credit/debt requirements"],
      color: brandColors.accent.success,
    },
    {
      title: "30-Year VA",
      tag: "Eligible military",
      rate: 6.125,
      apr: calculateAPR(6.125, 1.816, 30, LOAN_AMOUNT),
      points: 1.816,
      pointsCost: calculatePointsCost(1.816),
      monthlyPayment: calculateMonthlyPayment(LOAN_AMOUNT, 6.125, 30),
      features: ["0% down payment", "No private mortgage insurance"],
      color: brandColors.accent.success,
    },
    {
      title: "20-Year Fixed",
      tag: "Save on interest",
      rate: 6.125,
      apr: calculateAPR(6.125, 1.696, 20, LOAN_AMOUNT),
      points: 1.696,
      pointsCost: calculatePointsCost(1.696),
      monthlyPayment: calculateMonthlyPayment(LOAN_AMOUNT, 6.125, 20),
      features: ["5% min down payment"],
      color: brandColors.accent.success,
    },
    {
      title: "15-Year Fixed",
      tag: "Faster payoff",
      rate: 5.5,
      apr: calculateAPR(5.5, 1.792, 15, LOAN_AMOUNT),
      points: 1.792,
      pointsCost: calculatePointsCost(1.792),
      monthlyPayment: calculateMonthlyPayment(LOAN_AMOUNT, 5.5, 15),
      features: [
        "5% min down payment",
        "Pay less interest due to shorter term",
      ],
      color: brandColors.accent.success,
    },
  ];

  const processSteps = [
    {
      step: "1",
      title: "Calculate your DreamAbility™",
      description:
        "Get a real-time estimate of what you can afford with Zillow Home Loans.",
      icon: (
        <React.Suspense fallback={<Box sx={{ width: 24, height: 24 }} />}>
          <LazyCalculateIcon />
        </React.Suspense>
      ),
    },
    {
      step: "2",
      title: "Get pre-approved",
      description:
        "Make strong offers on homes with a Verified Pre-approval letter from us.",
      icon: (
        <React.Suspense fallback={<Box sx={{ width: 24, height: 24 }} />}>
          <LazyDescriptionIcon />
        </React.Suspense>
      ),
    },
    {
      step: "3",
      title: "Make an offer",
      description:
        "Confirm that a home fits your budget with us and determine a fair offer price.",
      icon: (
        <React.Suspense fallback={<Box sx={{ width: 24, height: 24 }} />}>
          <LazyFlagIcon />
        </React.Suspense>
      ),
    },
    {
      step: "4",
      title: "Apply for a mortgage",
      description:
        "After your offer is accepted, you'll complete your full loan application.",
      icon: (
        <React.Suspense fallback={<Box sx={{ width: 24, height: 24 }} />}>
          <LazyMoneyIcon />
        </React.Suspense>
      ),
    },
    {
      step: "5",
      title: "Close on your home",
      description:
        "Congrats, homeowner! Sign the closing paperwork and we'll finalize the sale.",
      icon: (
        <React.Suspense fallback={<Box sx={{ width: 24, height: 24 }} />}>
          <LazyHomeIcon />
        </React.Suspense>
      ),
    },
  ];

  const learningArticles = [
    {
      title: "Pre-qualified vs. pre-approved: What's the difference?",
      image:
        "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop",
      link: "#",
    },
    {
      title: "How your credit score is calculated",
      image:
        "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=300&fit=crop",
      link: "#",
    },
    {
      title: "How are mortgage rates determined?",
      image:
        "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&h=300&fit=crop",
      link: "#",
    },
    {
      title: "Understanding closing costs",
      image:
        "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=300&fit=crop",
      link: "#",
    },
    {
      title: "First-time homebuyer guide",
      image:
        "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&h=300&fit=crop",
      link: "#",
    },
    {
      title: "Down payment assistance programs",
      image:
        "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop",
      link: "#",
    },
    {
      title: "Mortgage insurance explained",
      image:
        "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=300&fit=crop",
      link: "#",
    },
    {
      title: "Refinancing your mortgage",
      image:
        "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&h=300&fit=crop",
      link: "#",
    },
    {
      title: "Home inspection checklist",
      image:
        "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop",
      link: "#",
    },
    {
      title: "Property tax considerations",
      image:
        "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=300&fit=crop",
      link: "#",
    },
  ];

  return (
    <>
              <PageAppBar title="Dreamery Home Loans" />
      <PageContainer>
      {/* Header */}
      <HeaderSection>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
        </Box>
      </HeaderSection>

      {/* Split Hero with Sticky DreamAbility */}
      <SplitSection>
        <SplitWrap>
          <LeftCol>
            <Typography
              variant="h2"
              sx={{ fontWeight: 800, mb: 2, color: brandColors.primary }}
            >
              Get a mortgage from Dreamery Home Loans
            </Typography>
            <Typography variant="h6" sx={{ mb: 3, color: brandColors.neutral[800] }}>
              Competitive rates, clear fees, and guidance at every step. Get
              your DreamAbility™ to see what you can afford in real time.
            </Typography>
            <Typography variant="body1" sx={{ mt: 2 }}>
              Already working with us?{" "}
              <Link href="#" sx={{ color: brandColors.primary, textDecoration: "none" }}>
                Access your dashboard
              </Link>
            </Typography>
          </LeftCol>
          <RightCol>
            <BuyAbilityCard>
              <CardContent sx={{ p: 3 }}>
                <Typography
                  variant="h6"
                  sx={{
                    mb: 2,
                    textAlign: "center",
                    color: brandColors.primary,
                    fontWeight: 700,
                  }}
                >
                  Your DreamAbility™ today
                </Typography>
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: "repeat(2, 1fr)",
                    gap: 2,
                    mb: 2,
                  }}
                >
                  <Box sx={{ textAlign: "center" }}>
                    <Typography
                      variant="h5"
                      sx={{ fontWeight: 700, color: brandColors.primary }}
                    >
                      LOAN_AMOUNT.toLocaleString()
                    </Typography>
                    <Typography variant="body2" sx={{ color: brandColors.neutral[800] }}>
                      Target price
                    </Typography>
                  </Box>
                  <Box sx={{ textAlign: "center" }}>
                    <Typography
                      variant="h5"
                      sx={{ fontWeight: 700, color: brandColors.primary }}
                    >
                      LOAN_AMOUNT.toLocaleString()
                    </Typography>
                    <Typography variant="body2" sx={{ color: brandColors.neutral[800] }}>
                      DreamAbility™
                    </Typography>
                  </Box>
                </Box>
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: "repeat(3, 1fr)",
                    columnGap: 4,
                    alignItems: "center",
                    mt: 2,
                    width: "100%",
                  }}
                >
                  <Box sx={{ textAlign: "center", flex: 1, minWidth: 0 }}>
                    <Typography
                      variant="h6"
                      sx={{ fontWeight: 700, color: brandColors.primary, mb: 0.5 }}
                    >
                      $
                      {Math.round(
                        mortgageOptions[0].monthlyPayment,
                      ).toLocaleString()}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ color: brandColors.neutral[800], fontSize: "0.75rem" }}
                    >
                      Mo. payment
                    </Typography>
                  </Box>
                  <Box sx={{ textAlign: "center", flex: 1, minWidth: 0 }}>
                    <Typography
                      variant="h6"
                      sx={{ fontWeight: 700, color: brandColors.primary, mb: 0.5 }}
                    >
                      {mortgageOptions[0].rate.toFixed(3)}%
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ color: brandColors.neutral[800], fontSize: "0.75rem" }}
                    >
                      Rate
                    </Typography>
                  </Box>
                  <Box sx={{ textAlign: "center", flex: 1, minWidth: 0 }}>
                    <Typography
                      variant="h6"
                      sx={{ fontWeight: 700, color: brandColors.primary, mb: 0.5 }}
                    >
                      {mortgageOptions[0].apr.toFixed(3)}%
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ color: brandColors.neutral[800], fontSize: "0.75rem" }}
                    >
                      APR
                    </Typography>
                  </Box>
                </Box>
                <Button
                  fullWidth
                  variant="contained"
                  onClick={handleOpenDreamAbilityModal}
                  sx={{
                    backgroundColor: brandColors.primary,
                    color: brandColors.backgrounds.primary,
                    textTransform: "none",
                    fontWeight: 600,
                    mt: 3,
                  }}
                >
                  Get your DreamAbility
                </Button>
              </CardContent>
            </BuyAbilityCard>
          </RightCol>
        </SplitWrap>
      </SplitSection>

      {/* Rates first, then Why Choose Us */}
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography
          variant="h3"
          sx={{ textAlign: "center", fontWeight: 700, mb: 2 }}
        >
          Find the right mortgage with Dreamery Home Loans
        </Typography>
        <Typography
          variant="body1"
          sx={{ textAlign: "center", color: brandColors.neutral[800], mb: 4 }}
        >
          Explore programs and compare rates. Get pre-approved with confidence.
        </Typography>
        <Box
          sx={{
            display: "grid",
            gap: 4,
            gridTemplateColumns: {
              xs: "1fr",
              md: "1fr 1fr",
              lg: "repeat(3,1fr)",
            },
            gridTemplateRows: { lg: "auto auto" },
          }}
        >
          {mortgageOptions.map((option, index) => (
            <Box
              key={index}
              sx={{
                gridColumn: {
                  lg: index < 3 ? `${index + 1}` : index === 3 ? "1" : "2",
                },
                gridRow: { lg: index < 3 ? "1" : "2" },
              }}
            >
              <MortgageOptionCard>
                <CardContent sx={{ p: 3 }}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      mb: 2,
                    }}
                  >
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      {option.title}
                    </Typography>
                    <Chip
                      label={option.tag}
                      size="small"
                      sx={{
                        backgroundColor: option.color,
                        color: brandColors.backgrounds.primary,
                        fontWeight: 600,
                      }}
                    />
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      gap: 3,
                      mb: 2,
                      alignItems: "baseline",
                    }}
                  >
                    <Typography
                      variant="h4"
                      sx={{ fontWeight: 700, color: brandColors.primary }}
                    >
                      {option.rate.toFixed(3)}%
                    </Typography>
                    <Typography variant="body2" sx={{ color: brandColors.neutral[800] }}>
                      Rate
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      gap: 3,
                      mb: 2,
                      alignItems: "baseline",
                    }}
                  >
                    <Typography
                      variant="h5"
                      sx={{ fontWeight: 600, color: brandColors.primary }}
                    >
                      {option.apr.toFixed(3)}%
                    </Typography>
                    <Typography variant="body2" sx={{ color: brandColors.neutral[800] }}>
                      APR
                    </Typography>
                  </Box>
                  <Typography variant="body2" sx={{ color: brandColors.neutral[800], mb: 2 }}>
                    Points (cost) {option.points.toFixed(3)} ($
                    {option.pointsCost.toLocaleString()})
                  </Typography>
                  <Box sx={{ mb: 2 }}>
                    {option.features.map((feature, idx) => (
                      <Typography
                        key={idx}
                        variant="body2"
                        sx={{ color: brandColors.neutral[800] }}
                      >
                        - {feature}
                      </Typography>
                    ))}
                  </Box>
                  <Button
                    fullWidth
                    variant="outlined"
                    onClick={handleNavigateToPreApproval}
                    sx={{
                      borderColor: brandColors.primary,
                      color: brandColors.primary,
                      textTransform: "none",
                      fontWeight: 600,
                      mb: 1,
                    }}
                  >
                    Get pre-approved
                  </Button>
                  <Link
                    onClick={() => handleShowLoanTerms(option)}
                    sx={{
                      color: brandColors.primary,
                      textDecoration: "none",
                      fontSize: "0.875rem",
                      cursor: "pointer",
                      "&:hover": {
                        textDecoration: "underline",
                      },
                    }}
                  >
                    See sample loan terms
                  </Link>
                </CardContent>
              </MortgageOptionCard>
            </Box>
          ))}
          {/* Talk to a loan officer button positioned below 30-Year VA and to the right of 15-Year Fixed */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gridColumn: { lg: "3" },
              gridRow: { lg: "2" },
            }}
          >
            <Button
              variant="outlined"
              sx={{
                borderColor: brandColors.primary,
                color: brandColors.primary,
                textTransform: "none",
                fontWeight: 600,
                py: 2,
                px: 4,
                fontSize: "1.1rem",
              }}
            >
              Talk to a loan officer
            </Button>
          </Box>
        </Box>
      </Container>

      {/* Why Choose Us Section removed per request */}

      {/* Vertical Timeline */}

      {/* Personalized CTA */}
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Box
          sx={{
            display: "grid",
            gap: 6,
            gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
            alignItems: "center",
          }}
        >
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 2 }}>
              Get a personalized rate in minutes
            </Typography>
            <Typography variant="body1" sx={{ color: brandColors.neutral[800], mb: 3 }}>
              Mortgage rates aren't one size fits all. We'll estimate based on
              your unique details.
            </Typography>
            <Button
              variant="contained"
              sx={{
                backgroundColor: brandColors.primary,
                color: brandColors.backgrounds.primary,
                textTransform: "none",
                fontWeight: 600,
              }}
            >
              Get your personalized rate
            </Button>
          </Box>
          <Box>
            <Box
              sx={{
                width: "100%",
                height: 260,
                borderRadius: 2,
                backgroundColor: brandColors.neutral[100],
              }}
            />
          </Box>
        </Box>
      </Container>

      {/* Investment Tools Sections */}
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <LenderComparisonSection />
        <Box sx={{ my: 4 }} />
        <MortgageCalculatorSection />
        <Box sx={{ my: 4 }} />
        <PreApprovalSection />
        <Box sx={{ my: 4 }} />
      </Container>

      {/* Learning Center Carousel */}
      <Box sx={{ backgroundColor: brandColors.backgrounds.primary, color: brandColors.primary, py: 6 }}>
        <Container maxWidth="lg">
          <Typography
            variant="h3"
            sx={{ textAlign: "center", fontWeight: 700, mb: 4 }}
          >
            Learn more about home financing
          </Typography>

          <Box sx={{ position: "relative", mb: 4 }}>
            {/* Viewport strictly clamps the visible area to exactly 3 cards */}
            <Box
              sx={{
                width: `${SLIDE_WIDTH_PX}px`,
                mx: "auto",
                overflow: "hidden",
                padding: "8px", // Increased padding to prevent border cutoff
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  gap: 2,
                  width: "max-content",
                  scrollBehavior: "smooth",
                  transform: `translateX(-currentSlide * SLIDE_WIDTH_PXpx)`,
                  transition: "transform 0.3s ease-in-out",
                }}
              >
                {learningArticles.map((article, index) => (
                  <Box key={index} sx={{ margin: "4px" }}>
                    <LearningCard>
                      <Box
                        sx={{
                          height: 160,
                          backgroundColor: brandColors.neutral[100],
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Typography variant="h6" sx={{ color: brandColors.neutral[800] }}>
                          [Article Image]
                        </Typography>
                      </Box>
                      <CardContent sx={{ p: 2 }}>
                        <Typography
                          variant="h6"
                          sx={{ fontWeight: 600, mb: 1, fontSize: "0.9rem" }}
                        >
                          {article.title}
                        </Typography>
                        <Link
                          href={article.link}
                          sx={{
                            color: brandColors.primary,
                            textDecoration: "none",
                            fontSize: "0.875rem",
                          }}
                        >
                          Read article
                        </Link>
                      </CardContent>
                    </LearningCard>
                  </Box>
                ))}
              </Box>
            </Box>

            {/* Carousel Navigation */}
            <Box
              sx={{ display: "flex", justifyContent: "center", gap: 1, mt: 3 }}
            >
              <Button
                onClick={handlePrevSlide}
                sx={{
                  minWidth: 40,
                  height: 40,
                  borderRadius: "50%",
                  backgroundColor: brandColors.primary,
                  color: brandColors.backgrounds.primary,
                  "&:hover": {
                    backgroundColor: brandColors.secondary,
                  },
                }}
              >
                ‹
              </Button>
              <Box sx={{ display: "flex", gap: 0.5, alignItems: "center" }}>
                {Array.from(
                  { length: Math.ceil(learningArticles.length / 3) },
                  (_, i) => (
                    <Box
                      key={i}
                      sx={{
                        width: 8,
                        height: 8,
                        borderRadius: "50%",
                        backgroundColor:
                          i === currentSlide ? brandColors.primary : brandColors.borders.secondary,
                        cursor: "pointer",
                      }}
                      onClick={() => setCurrentSlide(i)}
                    />
                  ),
                )}
              </Box>
              <Button
                onClick={handleNextSlide}
                sx={{
                  minWidth: 40,
                  height: 40,
                  borderRadius: "50%",
                  backgroundColor: brandColors.primary,
                  color: brandColors.backgrounds.primary,
                  "&:hover": {
                    backgroundColor: brandColors.secondary,
                  },
                }}
              >
                ›
              </Button>
            </Box>
          </Box>

          <Box sx={{ textAlign: "center", mt: 4 }}>
            <Typography variant="body1" sx={{ mb: 2 }}>
              Looking for additional resources?
              <Link
                href="#"
                sx={{ color: brandColors.primary, textDecoration: "none", ml: 1 }}
              >
                Visit our Learning Center
              </Link>
            </Typography>
          </Box>
        </Container>
      </Box>

      {/* Footer */}
      <Box sx={{ backgroundColor: brandColors.neutral[100], py: 3, minHeight: "160px" }}>
        <Container maxWidth="lg">
          <Box
            sx={{
              display: "grid",
              gap: 4,
              gridTemplateColumns: { xs: "1fr", md: "repeat(3,1fr)" },
            }}
          >
            <Box>
              <Typography variant="body2" sx={{ color: brandColors.neutral[800], mb: 1 }}>
                <Link
                  href="#"
                  sx={{ color: brandColors.primary, textDecoration: "none" }}
                >
                  Terms of use
                </Link>
              </Typography>
              <Typography variant="body2" sx={{ color: brandColors.neutral[800] }}>
                <Link
                  href="#"
                  sx={{ color: brandColors.primary, textDecoration: "none" }}
                >
                  Privacy policy
                </Link>
              </Typography>
            </Box>
            <Box>
              <Typography variant="body2" sx={{ color: brandColors.neutral[800], mb: 1 }}>
                Dreamery Home Loans
              </Typography>
              <Typography variant="body2" sx={{ color: brandColors.neutral[800], mb: 1 }}>
                1500 Dreamery Boulevard, Suite 500
              </Typography>
              <Typography variant="body2" sx={{ color: brandColors.neutral[800], mb: 1 }}>
                Austin, TX 78701
              </Typography>
              <Typography variant="body2" sx={{ color: brandColors.neutral[800] }}>
                855-372-6337
              </Typography>
            </Box>
            <Box>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <React.Suspense fallback={<Box sx={{ width: 24, height: 24, mr: 1, color: brandColors.primary }} />}>
                  <LazyHomeIcon sx={{ mr: 1, color: brandColors.primary }} />
                </React.Suspense>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  EQUAL HOUSING LENDER
                </Typography>
              </Box>
              <Typography variant="body2" sx={{ color: brandColors.neutral[800], mb: 1 }}>
                © Dreamery Home Loans, LLC
              </Typography>
              <Typography variant="body2" sx={{ color: brandColors.neutral[800], mb: 1 }}>
                An Equal Housing Lender
              </Typography>
              <Typography variant="body2" sx={{ color: brandColors.neutral[800], mb: 1 }}>
                NMLS ID#: 10287
              </Typography>
              <Link
                href="#"
                sx={{
                  color: brandColors.primary,
                  textDecoration: "none",
                  fontSize: "0.875rem",
                }}
              >
                www.nmlsconsumeraccess.org
              </Link>
            </Box>
          </Box>

          <Divider sx={{ my: 3 }} />

          <Typography
            variant="body2"
            sx={{ color: brandColors.neutral[800], textAlign: "center" }}
          >
            Dreamery Group is committed to ensuring digital accessibility for
            individuals with disabilities. We are continuously working to
            improve the accessibility of our website and digital services.
          </Typography>
        </Container>
      </Box>
      {/* Removed filler; content is now compact without empty space */}

      {/* Sample Loan Terms Modal */}
      {showModal && selectedLoan && (
        <Box
          sx={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: brandColors.surfaces.overlay,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1300,
            p: 2,
          }}
          onClick={handleCloseModal}
        >
          <Box
            sx={{
              backgroundColor: brandColors.backgrounds.primary,
              borderRadius: 2,
              p: 4,
              maxWidth: 600,
              width: "100%",
              maxHeight: "90vh",
              overflow: "auto",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 3,
              }}
            >
              <Typography
                variant="h5"
                sx={{ fontWeight: 700, color: brandColors.primary }}
              >
                Sample loan terms
              </Typography>
              <IconButton onClick={handleCloseModal} sx={{ color: brandColors.neutral[800] }}>
                <React.Suspense fallback={<Box sx={{ width: 24, height: 24 }} />}>
                  <LazyCloseIcon />
                </React.Suspense>
              </IconButton>
            </Box>

            {/* Content */}
            <Typography variant="body1" sx={{ mb: 3, color: brandColors.neutral[800] }}>
              Loan interest rates and APR (Annual Percentage Rate) are dependent
              on the specific characteristics of the transaction and the
              individual's credit history. These figures are for estimation
              purposes only and may not reflect the exact terms of your loan.
              This is not a commitment to lend.
            </Typography>

            <Typography variant="body2" sx={{ mb: 3, color: brandColors.neutral[800] }}>
              Rates current as of:{" "}
              {new Date().toLocaleDateString("en-US", {
                month: "numeric",
                day: "numeric",
                year: "numeric",
              })}
            </Typography>

            {/* Loan Example */}
            <Box sx={{ mb: 4 }}>
              <Typography
                variant="h6"
                sx={{ fontWeight: 600, mb: 2, color: brandColors.primary }}
              >
                {selectedLoan.title} Example
              </Typography>

              {selectedLoan.title === "30-Year FHA" ? (
                <>
                  <Typography variant="body1" sx={{ mb: 2, color: brandColors.neutral[800] }}>
                    FHA Loan Example includes a one-time upfront mortgage
                    insurance premium equal to 1.75% of base loan amount will be
                    charged and paid at closing. A monthly mortgage insurance
                    premium (MIP) equal to 0.5% of the base loan amount will
                    apply and is included in monthly mortgage payments. For
                    mortgages with an initial loan-to-value (LTV) ratio of 80%,
                    the monthly MIP will be paid for the first 11 years of the
                    loan only; greater LTVs require payment of MIP for the life
                    of the loan.
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 2, color: brandColors.neutral[800] }}>
                    Interest rate of 6.000% (6.678% APR) calculated for a
                    mortgage loan of $275,000, with a monthly payment of
                    $1,792.00. Rate assumes a down payment of 20% and includes
                    1.607 points, paid at closing. Payment amount is for
                    principal interest, and monthly mortgage insurance premium
                    only and does not include taxes or other types of insurance;
                    actual payment obligation will be greater.
                  </Typography>
                </>
              ) : selectedLoan.title === "30-Year VA" ? (
                <>
                  <Typography variant="body1" sx={{ mb: 2, color: brandColors.neutral[800] }}>
                    Interest rate of 6.125% (6.419% APR) calculated for a
                    mortgage loan of $275,000, with a monthly payment of
                    $1,692.00. Rate assumes a down payment of 20% and includes
                    1.816 points, paid at closing. Payment amount is for
                    principal and interest only and does not include taxes or
                    insurance; actual payment obligation will be greater.
                  </Typography>
                </>
              ) : (
                <>
                  <Typography variant="body1" sx={{ mb: 2, color: brandColors.neutral[800] }}>
                    Interest rate of {selectedLoan.rate.toFixed(3)}% (
                    {selectedLoan.apr.toFixed(3)}% APR) calculated for a
                    mortgage loan of LOAN_AMOUNT.toLocaleString(), with a
                    monthly payment of $
                    {Math.round(selectedLoan.monthlyPayment).toLocaleString()}.
                  </Typography>
                  <Typography variant="body2" sx={{ color: brandColors.neutral[800] }}>
                    Rate assumes a down payment of 20% and includes{" "}
                    {selectedLoan.points.toFixed(3)} points, paid at closing.
                    Payment amount is for principal and interest only and does
                    not include taxes or insurance; actual payment obligation
                    will be greater.
                  </Typography>
                </>
              )}
            </Box>

            {/* Assumptions */}
            <Box sx={{ mb: 4 }}>
              <Typography
                variant="h6"
                sx={{ fontWeight: 600, mb: 2, color: brandColors.primary }}
              >
                For all rates shown, unless otherwise noted, we assumed:
              </Typography>
              <Box component="ul" sx={{ pl: 2, color: brandColors.neutral[800] }}>
                <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                  Debt-to-income ratio less than 43%
                </Typography>
                <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                  Credit score of 740 or greater
                </Typography>
                <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                  Closing costs, including points, are paid at closing
                </Typography>
                <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                  Loan is to secure a single-family home used as a primary
                  residence
                </Typography>
              </Box>
            </Box>

            {/* Action Button */}
            <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
              <Button
                variant="contained"
                onClick={handleNavigateToPreApproval}
                sx={{
                  backgroundColor: brandColors.primary,
                  color: brandColors.backgrounds.primary,
                  textTransform: "none",
                  fontWeight: 600,
                  "&:hover": {
                    backgroundColor: brandColors.secondary,
                  },
                }}
              >
                Get pre-approved
              </Button>
            </Box>
          </Box>
        </Box>
      )}

      {/* DreamAbility Modal */}
      {showDreamAbilityModal && (
        <Box
          sx={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: brandColors.surfaces.overlay,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1300,
            p: 2,
          }}
          onClick={handleCloseDreamAbilityModal}
        >
          <Box
            sx={{
              backgroundColor: brandColors.backgrounds.primary,
              borderRadius: 2,
              p: 4,
              maxWidth: 500,
              width: "100%",
              maxHeight: "90vh",
              overflow: "auto",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 3,
              }}
            >
              <Typography
                variant="h5"
                sx={{ fontWeight: 700, color: brandColors.primary }}
              >
                DreamAbility™
              </Typography>
              <IconButton
                onClick={handleCloseDreamAbilityModal}
                sx={{ color: brandColors.neutral[800] }}
              >
                <React.Suspense fallback={<Box sx={{ width: 24, height: 24 }} />}>
                  <LazyCloseIcon />
                </React.Suspense>
              </IconButton>
            </Box>

            {/* Content */}
            <Typography
              variant="h6"
              sx={{ fontWeight: 600, mb: 1, color: brandColors.primary }}
            >
              Find homes in your budget
            </Typography>
            <Typography variant="body1" sx={{ mb: 4, color: brandColors.neutral[800] }}>
              See a real-time view of what you can afford in today's market.
            </Typography>

            {/* Form */}
            <Box
              sx={{
                display: "grid",
                gap: 3,
                gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
                mb: 4,
              }}
            >
              {/* Left Column */}
              <Box>
                <Box sx={{ mb: 2 }}>
                  <Typography
                    variant="body2"
                    sx={{ mb: 1, fontWeight: 600, color: brandColors.text.primary }}
                  >
                    Location
                  </Typography>
                  <select
                    value={dreamAbilityForm.location}
                    onChange={(e) =>
                      handleDreamAbilityFormChange("location", e.target.value)
                    }
                    style={{
                      width: "100%",
                      padding: "12px",
                      border: "1px solid #ddd",
                      borderRadius: "4px",
                      fontSize: "14px",
                    }}
                  >
                    <option value="">Select a state</option>
                    <option value="AL">Alabama</option>
                    <option value="AK">Alaska</option>
                    <option value="AZ">Arizona</option>
                    <option value="AR">Arkansas</option>
                    <option value="CA">California</option>
                    <option value="CO">Colorado</option>
                    <option value="CT">Connecticut</option>
                    <option value="DE">Delaware</option>
                    <option value="FL">Florida</option>
                    <option value="GA">Georgia</option>
                    <option value="HI">Hawaii</option>
                    <option value="ID">Idaho</option>
                    <option value="IL">Illinois</option>
                    <option value="IN">Indiana</option>
                    <option value="IA">Iowa</option>
                    <option value="KS">Kansas</option>
                    <option value="KY">Kentucky</option>
                    <option value="LA">Louisiana</option>
                    <option value="ME">Maine</option>
                    <option value="MD">Maryland</option>
                    <option value="MA">Massachusetts</option>
                    <option value="MI">Michigan</option>
                    <option value="MN">Minnesota</option>
                    <option value="MS">Mississippi</option>
                    <option value="MO">Missouri</option>
                    <option value="MT">Montana</option>
                    <option value="NE">Nebraska</option>
                    <option value="NV">Nevada</option>
                    <option value="NH">New Hampshire</option>
                    <option value="NJ">New Jersey</option>
                    <option value="NM">New Mexico</option>
                    <option value="NY">New York</option>
                    <option value="NC">North Carolina</option>
                    <option value="ND">North Dakota</option>
                    <option value="OH">Ohio</option>
                    <option value="OK">Oklahoma</option>
                    <option value="OR">Oregon</option>
                    <option value="PA">Pennsylvania</option>
                    <option value="RI">Rhode Island</option>
                    <option value="SC">South Carolina</option>
                    <option value="SD">South Dakota</option>
                    <option value="TN">Tennessee</option>
                    <option value="TX">Texas</option>
                    <option value="UT">Utah</option>
                    <option value="VT">Vermont</option>
                    <option value="VA">Virginia</option>
                    <option value="WA">Washington</option>
                    <option value="WV">West Virginia</option>
                    <option value="WI">Wisconsin</option>
                    <option value="WY">Wyoming</option>
                  </select>
                </Box>

                <Box sx={{ mb: 2 }}>
                  <Typography
                    variant="body2"
                    sx={{ mb: 1, fontWeight: 600, color: brandColors.text.primary }}
                  >
                    Annual income
                  </Typography>
                  <Box sx={{ position: "relative" }}>
                    <Typography
                      component="span"
                      sx={{
                        position: "absolute",
                        left: 12,
                        top: "50%",
                        transform: "translateY(-50%)",
                        color: brandColors.neutral[800],
                      }}
                    >
                      $
                    </Typography>
                    <input
                      type="text"
                      value={dreamAbilityForm.annualIncome}
                      onChange={(e) =>
                        handleDreamAbilityFormChange(
                          "annualIncome",
                          e.target.value,
                        )
                      }
                      style={{
                        width: "100%",
                        padding: "12px 12px 12px 24px",
                        border: "1px solid #ddd",
                        borderRadius: "4px",
                        fontSize: "14px",
                      }}
                    />
                    <Typography
                      component="span"
                      sx={{
                        position: "absolute",
                        right: 12,
                        top: "50%",
                        transform: "translateY(-50%)",
                        color: brandColors.neutral[800],
                      }}
                    >
                      /year
                    </Typography>
                  </Box>
                  <Typography
                    variant="caption"
                    sx={{ color: brandColors.neutral[800], mt: 0.5, display: "block" }}
                  >
                    Pre-tax income
                  </Typography>
                </Box>

                <Box sx={{ mb: 2 }}>
                  <Typography
                    variant="body2"
                    sx={{ mb: 1, fontWeight: 600, color: brandColors.text.primary }}
                  >
                    Down payment
                  </Typography>
                  <Box sx={{ position: "relative" }}>
                    <Typography
                      component="span"
                      sx={{
                        position: "absolute",
                        left: 12,
                        top: "50%",
                        transform: "translateY(-50%)",
                        color: brandColors.neutral[800],
                      }}
                    >
                      $
                    </Typography>
                    <input
                      type="text"
                      value={dreamAbilityForm.downPayment}
                      onChange={(e) =>
                        handleDreamAbilityFormChange(
                          "downPayment",
                          e.target.value,
                        )
                      }
                      style={{
                        width: "100%",
                        padding: "12px 12px 12px 24px",
                        border: "1px solid #ddd",
                        borderRadius: "4px",
                        fontSize: "14px",
                      }}
                    />
                  </Box>
                  <Typography
                    variant="caption"
                    sx={{ color: brandColors.neutral[800], mt: 0.5, display: "block" }}
                  >
                    At least $1,500
                  </Typography>
                </Box>
              </Box>

              {/* Right Column */}
              <Box>
                <Box sx={{ mb: 2 }}>
                  <Typography
                    variant="body2"
                    sx={{ mb: 1, fontWeight: 600, color: brandColors.text.primary }}
                  >
                    Credit score
                  </Typography>
                  <select
                    value={dreamAbilityForm.creditScore}
                    onChange={(e) =>
                      handleDreamAbilityFormChange(
                        "creditScore",
                        e.target.value,
                      )
                    }
                    style={{
                      width: "100%",
                      padding: "12px",
                      border: "1px solid #ddd",
                      borderRadius: "4px",
                      fontSize: "14px",
                    }}
                  >
                    <option value="">Select credit score</option>
                    <option value="740+">740+</option>
                    <option value="670-739">670-739</option>
                    <option value="580-669">580-669</option>
                    <option value="300-579">300-579</option>
                  </select>
                </Box>

                <Box sx={{ mb: 2 }}>
                  <Typography
                    variant="body2"
                    sx={{ mb: 1, fontWeight: 600, color: brandColors.text.primary }}
                  >
                    Monthly debt
                  </Typography>
                  <Box sx={{ position: "relative" }}>
                    <Typography
                      component="span"
                      sx={{
                        position: "absolute",
                        left: 12,
                        top: "50%",
                        transform: "translateY(-50%)",
                        color: brandColors.neutral[800],
                      }}
                    >
                      $
                    </Typography>
                    <input
                      type="text"
                      value={dreamAbilityForm.monthlyDebt}
                      onChange={(e) =>
                        handleDreamAbilityFormChange(
                          "monthlyDebt",
                          e.target.value,
                        )
                      }
                      style={{
                        width: "100%",
                        padding: "12px 12px 12px 24px",
                        border: "1px solid #ddd",
                        borderRadius: "4px",
                        fontSize: "14px",
                      }}
                    />
                    <Typography
                      component="span"
                      sx={{
                        position: "absolute",
                        right: 12,
                        top: "50%",
                        transform: "translateY(-50%)",
                        color: brandColors.neutral[800],
                      }}
                    >
                      /month
                    </Typography>
                  </Box>
                  <Typography
                    variant="caption"
                    sx={{ color: brandColors.neutral[800], mt: 0.5, display: "block" }}
                  >
                    Loans, credit cards, alimony
                  </Typography>
                </Box>
              </Box>
            </Box>

            {/* Action Button */}
            <Box sx={{ display: "flex", justifyContent: "center" }}>
              <Button
                variant="contained"
                onClick={handleCalculateDreamAbility}
                sx={{
                  backgroundColor: brandColors.primary,
                  color: brandColors.backgrounds.primary,
                  textTransform: "none",
                  fontWeight: 600,
                  px: 4,
                  py: 1.5,
                  fontSize: "1.1rem",
                  "&:hover": {
                    backgroundColor: brandColors.secondary,
                  },
                }}
              >
                Get your DreamAbility™
              </Button>
            </Box>
          </Box>
        </Box>
      )}

      {/* DreamAbility Results Modal */}
      {showDreamAbilityResults && (
        <Box
          sx={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: brandColors.surfaces.overlay,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1300,
            p: 2,
          }}
          onClick={handleCloseDreamAbilityResults}
        >
          <Box
            sx={{
              backgroundColor: brandColors.backgrounds.primary,
              borderRadius: 2,
              p: 4,
              maxWidth: 600,
              width: "100%",
              maxHeight: "90vh",
              overflow: "auto",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 3,
              }}
            >
              <Typography
                variant="body2"
                sx={{ color: brandColors.primary, cursor: "pointer" }}
              >
                Edit
              </Typography>
              <Typography
                variant="h5"
                sx={{ fontWeight: 700, color: brandColors.primary }}
              >
                Your DreamAbility™
              </Typography>
              <IconButton
                onClick={handleCloseDreamAbilityResults}
                sx={{ color: brandColors.neutral[800] }}
              >
                <React.Suspense fallback={<Box sx={{ width: 24, height: 24 }} />}>
                  <LazyCloseIcon />
                </React.Suspense>
              </IconButton>
            </Box>

            {/* Today's Target Price */}
            <Box sx={{ mb: 4 }}>
              <Typography
                variant="h6"
                sx={{ fontWeight: 600, mb: 1, color: brandColors.primary }}
              >
                Today's target price
              </Typography>
              <Typography
                variant="h3"
                sx={{ fontWeight: 700, color: brandColors.accent.success, mb: 1 }}
              >
                $739,853
              </Typography>
              <Link
                onClick={handleShowWhatThisMeans}
                sx={{
                  color: brandColors.primary,
                  textDecoration: "underline",
                  cursor: "pointer",
                }}
              >
                What this means
              </Link>
            </Box>

            {/* Payment Details */}
            <Box sx={{ mb: 4 }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 2,
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Typography
                    variant="body2"
                    sx={{ fontWeight: 600, color: brandColors.text.primary }}
                  >
                    Target payment
                  </Typography>
                  <Box
                    onClick={handleShowTargetPaymentBreakdown}
                    sx={{
                      ml: 1,
                      width: 16,
                      height: 16,
                      borderRadius: "50%",
                      backgroundColor: brandColors.primary,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                      "&:hover": {
                        backgroundColor: brandColors.secondary,
                      },
                    }}
                  >
                    <Typography
                      variant="caption"
                      sx={{ color: brandColors.backgrounds.primary, fontWeight: 600 }}
                    >
                      i
                    </Typography>
                  </Box>
                </Box>
                <Box
                  sx={{
                    backgroundColor: brandColors.neutral[100],
                    px: 2,
                    py: 1,
                    borderRadius: 1,
                    minWidth: 120,
                    textAlign: "center",
                  }}
                >
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    $ 5,276 /mo
                  </Typography>
                </Box>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Typography
                    variant="body2"
                    sx={{ fontWeight: 600, color: brandColors.text.primary }}
                  >
                    Down payment
                  </Typography>
                  <Box
                    onClick={handleShowDownPaymentDetails}
                    sx={{
                      ml: 1,
                      width: 16,
                      height: 16,
                      borderRadius: "50%",
                      backgroundColor: brandColors.primary,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                      "&:hover": {
                        backgroundColor: brandColors.secondary,
                      },
                    }}
                  >
                    <Typography
                      variant="caption"
                      sx={{ color: brandColors.backgrounds.primary, fontWeight: 600 }}
                    >
                      i
                    </Typography>
                  </Box>
                </Box>
                <Box
                  sx={{
                    backgroundColor: brandColors.neutral[100],
                    px: 2,
                    py: 1,
                    borderRadius: 1,
                    minWidth: 120,
                    textAlign: "center",
                  }}
                >
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    $ 75,000
                  </Typography>
                </Box>
              </Box>
            </Box>

            {/* Dreamery Home Loans Offer */}
            <Box
              sx={{ mb: 4, border: "1px solid brandColors.borders.secondary", borderRadius: 2, p: 3 }}
            >
              <Typography
                variant="h6"
                sx={{ fontWeight: 600, mb: 2, color: brandColors.primary }}
              >
                What Dreamery Home Loans could offer
              </Typography>
              <Box sx={{ mb: 2 }}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Typography variant="body2" sx={{ color: brandColors.neutral[800] }}>
                    Max home price
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    $1,101,762
                  </Typography>
                </Box>
              </Box>
              <Box sx={{ mb: 2 }}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Typography variant="body2" sx={{ color: brandColors.neutral[800] }}>
                    Max payment
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    $8,417/mo
                  </Typography>
                </Box>
              </Box>

              <Divider sx={{ my: 2 }} />

              <Box sx={{ mb: 2 }}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Typography variant="body2" sx={{ color: brandColors.neutral[800] }}>
                    Loan option
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    30 Year Fixed
                  </Typography>
                </Box>
              </Box>
              <Box sx={{ mb: 2 }}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Typography variant="body2" sx={{ color: brandColors.neutral[800] }}>
                      Your est. interest rate
                    </Typography>
                    <Box
                      onClick={handleShowInterestRateDetails}
                      sx={{
                        ml: 1,
                        width: 16,
                        height: 16,
                        borderRadius: "50%",
                        backgroundColor: brandColors.primary,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                        "&:hover": {
                          backgroundColor: brandColors.secondary,
                        },
                      }}
                    >
                      <Typography
                        variant="caption"
                        sx={{ color: brandColors.backgrounds.primary, fontWeight: 600 }}
                      >
                        i
                      </Typography>
                    </Box>
                  </Box>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    6.13%
                  </Typography>
                </Box>
              </Box>
              <Box sx={{ mb: 2 }}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Typography variant="body2" sx={{ color: brandColors.neutral[800] }}>
                      APR
                    </Typography>
                    <Box
                      onClick={handleShowAprDetails}
                      sx={{
                        ml: 1,
                        width: 16,
                        height: 16,
                        borderRadius: "50%",
                        backgroundColor: brandColors.primary,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                        "&:hover": {
                          backgroundColor: brandColors.secondary,
                        },
                      }}
                    >
                      <Typography
                        variant="caption"
                        sx={{ color: brandColors.backgrounds.primary, fontWeight: 600 }}
                      >
                        i
                      </Typography>
                    </Box>
                  </Box>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    6.49%
                  </Typography>
                </Box>
              </Box>
              <Box sx={{ mb: 3 }}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Typography variant="body2" sx={{ color: brandColors.neutral[800] }}>
                    Points
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    $12,353 (2 points)
                  </Typography>
                </Box>
              </Box>
              <Button
                fullWidth
                variant="contained"
                sx={{
                  backgroundColor: brandColors.primary,
                  color: brandColors.backgrounds.primary,
                  textTransform: "none",
                  fontWeight: 600,
                  py: 1.5,
                  mb: 2,
                  "&:hover": {
                    backgroundColor: brandColors.secondary,
                  },
                }}
              >
                Get pre-qualified
              </Button>
              <Typography
                variant="caption"
                sx={{ color: brandColors.neutral[800], textAlign: "center", display: "block" }}
              >
                powered by Dreamery Home Loans
              </Typography>
            </Box>

            {/* Disclaimer */}
            <Typography
              variant="caption"
              sx={{
                color: brandColors.neutral[800],
                textAlign: "center",
                display: "block",
                mb: 3,
              }}
            >
              All calculations are estimates and provided by Dreamery, Inc. for
              informational purposes only. Actual amounts may vary.
            </Typography>

            {/* Save Preferences */}
            <Box sx={{ textAlign: "center" }}>
              <Button
                variant="contained"
                sx={{
                  backgroundColor: brandColors.primary,
                  color: brandColors.backgrounds.primary,
                  textTransform: "none",
                  fontWeight: 600,
                  px: 4,
                  py: 1.5,
                  mb: 2,
                  "&:hover": {
                    backgroundColor: brandColors.secondary,
                  },
                }}
              >
                Save preferences
              </Button>
              <Typography
                variant="caption"
                sx={{ color: brandColors.neutral[800], display: "block" }}
              >
                We'll store your data according to the{" "}
                <Link
                  sx={{
                    color: brandColors.primary,
                    textDecoration: "underline",
                    cursor: "pointer",
                  }}
                >
                  Dreamery Home Loans privacy policy
                </Link>
              </Typography>
            </Box>
          </Box>
        </Box>
      )}

      {/* What This Means Modal */}
      {showWhatThisMeans && (
        <Box
          sx={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: brandColors.surfaces.overlay,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1400,
            p: 2,
          }}
          onClick={handleCloseWhatThisMeans}
        >
          <Box
            sx={{
              backgroundColor: brandColors.backgrounds.primary,
              borderRadius: 2,
              p: 3,
              maxWidth: 400,
              width: "100%",
              boxShadow: "0 4px 20px brandColors.shadows.medium",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 2,
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Box
                  sx={{
                    width: 20,
                    height: 20,
                    borderRadius: "50%",
                    backgroundColor: brandColors.primary,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    mr: 1,
                  }}
                >
                  <Typography
                    variant="caption"
                    sx={{ color: brandColors.backgrounds.primary, fontWeight: 600, fontSize: "12px" }}
                  >
                    i
                  </Typography>
                </Box>
                <Typography
                  variant="h6"
                  sx={{ fontWeight: 600, color: brandColors.primary }}
                >
                  What DreamAbility™ means
                </Typography>
              </Box>
              <IconButton
                onClick={handleCloseWhatThisMeans}
                sx={{ color: brandColors.neutral[800] }}
              >
                <React.Suspense fallback={<Box sx={{ width: 24, height: 24 }} />}>
                  <LazyCloseIcon />
                </React.Suspense>
              </IconButton>
            </Box>

            {/* Content */}
            <Typography variant="body1" sx={{ color: brandColors.text.primary, lineHeight: 1.5 }}>
              DreamAbility™ is a real-time estimate of what you can afford in
              today's market.
            </Typography>
          </Box>
        </Box>
      )}

      {/* Target Payment Breakdown Modal */}
      {showTargetPaymentBreakdown && (
        <Box
          sx={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: brandColors.surfaces.overlay,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1500,
            p: 2,
          }}
          onClick={handleCloseTargetPaymentBreakdown}
        >
          <Box
            sx={{
              backgroundColor: brandColors.backgrounds.primary,
              borderRadius: 2,
              p: 3,
              maxWidth: 450,
              width: "100%",
              maxHeight: "80vh",
              overflow: "auto",
              boxShadow: "0 4px 20px brandColors.shadows.medium",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 3,
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Box
                  sx={{
                    width: 20,
                    height: 20,
                    borderRadius: "50%",
                    backgroundColor: brandColors.primary,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    mr: 1,
                  }}
                >
                  <Typography
                    variant="caption"
                    sx={{ color: brandColors.backgrounds.primary, fontWeight: 600, fontSize: "12px" }}
                  >
                    i
                  </Typography>
                </Box>
                <Typography
                  variant="h6"
                  sx={{ fontWeight: 600, color: brandColors.primary }}
                >
                  Target payment
                </Typography>
              </Box>
              <IconButton
                onClick={handleCloseTargetPaymentBreakdown}
                sx={{ color: brandColors.neutral[800] }}
              >
                <React.Suspense fallback={<Box sx={{ width: 24, height: 24 }} />}>
                  <LazyCloseIcon />
                </React.Suspense>
              </IconButton>
            </Box>

            {/* Description */}
            <Typography variant="body2" sx={{ color: brandColors.neutral[800], mb: 3 }}>
              The amount you tell us you feel comfortable spending per month.
            </Typography>

            {/* Loan Terms */}
            <Typography variant="body2" sx={{ color: brandColors.neutral[800], mb: 3 }}>
              30 Year Fixed, 6.130%
            </Typography>

            {/* Payment Breakdown */}
            <Box sx={{ mb: 3 }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 2,
                }}
              >
                <Typography variant="body2" sx={{ color: brandColors.text.primary }}>
                  Target payment
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  $5,276
                </Typography>
              </Box>

              <Divider sx={{ my: 2 }} />

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 2,
                }}
              >
                <Typography variant="body2" sx={{ color: brandColors.text.primary }}>
                  Principal and interest
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  $4,042
                </Typography>
              </Box>
              <Typography
                variant="caption"
                sx={{ color: brandColors.neutral[800], display: "block", mb: 2 }}
              >
                30 Year Fixed, 6.130%
              </Typography>

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 2,
                }}
              >
                <Typography variant="body2" sx={{ color: brandColors.text.primary }}>
                  Taxes*
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  $666
                </Typography>
              </Box>

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 2,
                }}
              >
                <Typography variant="body2" sx={{ color: brandColors.text.primary }}>
                  Homeowners insurance
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  $247
                </Typography>
              </Box>

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 2,
                }}
              >
                <Typography variant="body2" sx={{ color: brandColors.text.primary }}>
                  Private Mortgage Insurance (PMI)
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  $321
                </Typography>
              </Box>
            </Box>

            {/* Disclaimer */}
            <Typography
              variant="caption"
              sx={{ color: brandColors.neutral[800], display: "block", lineHeight: 1.4 }}
            >
              *To estimate your property taxes, we multiply the home value you
              provide by the county's effective{" "}
              <Link
                sx={{
                  color: brandColors.primary,
                  textDecoration: "underline",
                  cursor: "pointer",
                }}
              >
                property tax rate
              </Link>
              . The specific{" "}
              <Link
                sx={{
                  color: brandColors.primary,
                  textDecoration: "underline",
                  cursor: "pointer",
                }}
              >
                process
              </Link>{" "}
              and formula used to calculate property taxes can vary based on
              where the property is located and regulations set by the local
              governing authority there.
            </Typography>
          </Box>
        </Box>
      )}

      {/* Down Payment Details Modal */}
      {showDownPaymentDetails && (
        <Box
          sx={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: brandColors.surfaces.overlay,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1600,
            p: 2,
          }}
          onClick={handleCloseDownPaymentDetails}
        >
          <Box
            sx={{
              backgroundColor: brandColors.backgrounds.primary,
              borderRadius: 2,
              p: 3,
              maxWidth: 400,
              width: "100%",
              boxShadow: "0 4px 20px brandColors.shadows.medium",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 3,
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Box
                  sx={{
                    width: 20,
                    height: 20,
                    borderRadius: "50%",
                    backgroundColor: brandColors.primary,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    mr: 1,
                  }}
                >
                  <Typography
                    variant="caption"
                    sx={{ color: brandColors.backgrounds.primary, fontWeight: 600, fontSize: "12px" }}
                  >
                    i
                  </Typography>
                </Box>
                <Typography
                  variant="h6"
                  sx={{ fontWeight: 600, color: brandColors.primary }}
                >
                  Down payment
                </Typography>
              </Box>
              <IconButton
                onClick={handleCloseDownPaymentDetails}
                sx={{ color: brandColors.neutral[800] }}
              >
                <React.Suspense fallback={<Box sx={{ width: 24, height: 24 }} />}>
                  <LazyCloseIcon />
                </React.Suspense>
              </IconButton>
            </Box>

            {/* Description */}
            <Typography variant="body2" sx={{ color: brandColors.neutral[800], mb: 3 }}>
              A down payment is a percentage of the home price you pay upfront
              before you close.
            </Typography>

            {/* Down Payment Details */}
            <Box
              sx={{
                backgroundColor: brandColors.neutral[100],
                borderRadius: 1,
                p: 2,
                mb: 3,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Box>
                <Typography variant="body2" sx={{ color: brandColors.neutral[800] }}>
                  Down payment
                </Typography>
                <Typography variant="body2" sx={{ color: brandColors.neutral[800] }}>
                  10.1% of $739,853
                </Typography>
              </Box>
              <Typography
                variant="h6"
                sx={{ fontWeight: 700, color: brandColors.primary }}
              >
                $75,000
              </Typography>
            </Box>

            {/* Lender Requirement */}
            <Typography variant="body2" sx={{ color: brandColors.neutral[800] }}>
              Most lenders require at least 3% down.
            </Typography>
          </Box>
        </Box>
      )}

      {/* APR Details Modal */}
      {showAprDetails && (
        <Box
          sx={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: brandColors.surfaces.overlay,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1800,
            p: 2,
          }}
          onClick={handleCloseAprDetails}
        >
          <Box
            sx={{
              backgroundColor: brandColors.backgrounds.primary,
              borderRadius: 2,
              p: 3,
              maxWidth: 450,
              width: "100%",
              boxShadow: "0 4px 20px brandColors.shadows.medium",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 3,
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Box
                  sx={{
                    width: 20,
                    height: 20,
                    borderRadius: "50%",
                    backgroundColor: brandColors.primary,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    mr: 1,
                  }}
                >
                  <Typography
                    variant="caption"
                    sx={{ color: brandColors.backgrounds.primary, fontWeight: 600, fontSize: "12px" }}
                  >
                    i
                  </Typography>
                </Box>
                <Typography
                  variant="h6"
                  sx={{ fontWeight: 600, color: brandColors.primary }}
                >
                  What is APR?
                </Typography>
              </Box>
              <IconButton
                onClick={handleCloseAprDetails}
                sx={{ color: brandColors.neutral[800] }}
              >
                <React.Suspense fallback={<Box sx={{ width: 24, height: 24 }} />}>
                  <LazyCloseIcon />
                </React.Suspense>
              </IconButton>
            </Box>

            {/* Content */}
            <Typography variant="body2" sx={{ color: brandColors.text.primary, lineHeight: 1.5 }}>
              Annual Percentage Rate (APR) is a way of expressing the cost of a
              loan that includes the interest rate and loan-related fees, such
              as origination fees, points, and mortgage insurance.
            </Typography>
          </Box>
        </Box>
      )}

      {/* Interest Rate Details Modal */}
      {showInterestRateDetails && (
        <Box
          sx={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: brandColors.surfaces.overlay,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1700,
            p: 2,
          }}
          onClick={handleCloseInterestRateDetails}
        >
          <Box
            sx={{
              backgroundColor: brandColors.backgrounds.primary,
              borderRadius: 2,
              p: 3,
              maxWidth: 450,
              width: "100%",
              boxShadow: "0 4px 20px brandColors.shadows.medium",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 3,
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Box
                  sx={{
                    width: 20,
                    height: 20,
                    borderRadius: "50%",
                    backgroundColor: brandColors.primary,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    mr: 1,
                  }}
                >
                  <Typography
                    variant="caption"
                    sx={{ color: brandColors.backgrounds.primary, fontWeight: 600, fontSize: "12px" }}
                  >
                    i
                  </Typography>
                </Box>
                <Typography
                  variant="h6"
                  sx={{ fontWeight: 600, color: brandColors.primary }}
                >
                  Your estimated interest rate
                </Typography>
              </Box>
              <IconButton
                onClick={handleCloseInterestRateDetails}
                sx={{ color: brandColors.neutral[800] }}
              >
                <React.Suspense fallback={<Box sx={{ width: 24, height: 24 }} />}>
                  <LazyCloseIcon />
                </React.Suspense>
              </IconButton>
            </Box>

            {/* Content */}
            <Typography
              variant="body2"
              sx={{ color: brandColors.text.primary, mb: 2, lineHeight: 1.5 }}
            >
              Dreamery Home Loans mortgage interest rates are dependent on a
              number of factors, including credit score, down payment, and loan
              term.
            </Typography>
            <Typography
              variant="body2"
              sx={{ color: brandColors.text.primary, mb: 2, lineHeight: 1.5 }}
            >
              Interest rates updated daily as of 2AM UTC and includes up to two
              (2) buydown points of the loan amount on a conforming fixed-rate
              loan.
            </Typography>
            <Typography variant="body2" sx={{ color: brandColors.text.primary, lineHeight: 1.5 }}>
              The actual payment obligation may be greater.
            </Typography>
          </Box>
        </Box>
      )}

      {/* Success/Error Messages */}
      {showSuccess && (
        <SuccessMessage
          message="Mortgage calculation completed successfully!"
          onClose={() => setShowSuccess(false)}
        />
      )}
      {showError && (
        <ErrorMessage
          message="Please check your input values and try again"
          onClose={() => setShowError(false)}
        />
      )}
        </PageContainer>
      </>
    );
  };

export default MortgagePage;
