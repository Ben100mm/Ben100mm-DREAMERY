import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  Container,
  Chip,
  Avatar,
  Divider,
  Link,
  IconButton,
  Tabs,
  Tab,
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
  LinearProgress
} from '@mui/material';
import {
  Phone as PhoneIcon,
  Star as StarIcon,
  ArrowForward as ArrowForwardIcon,
  CheckCircle as CheckCircleIcon,
  Calculate as CalculateIcon,
  Description as DescriptionIcon,
  Flag as FlagIcon,
  AttachMoney as MoneyIcon,
  Home as HomeIcon,
  School as SchoolIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const PageContainer = styled.div`
  height: 100vh;
  background: white;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  
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
  background: white;
  padding: 1rem 2rem;
  border-bottom: 1px solid #e0e0e0;
  position: sticky;
  top: 0;
  z-index: 100;
`;

const HeroSection = styled.div`
  background: white;
  color: #1a365d;
  padding: 3rem 1.5rem;
  text-align: center;
`;

const BuyAbilityCard = styled(Card)`
  background: white;
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  margin: 0;
  max-width: 400px;
  position: relative;
  z-index: 10;
`;

const FeatureCard = styled(Card)`
  height: 100%;
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  transition: transform 0.2s ease;
  
  &:hover {
    transform: translateY(-4px);
  }
`;

const ProcessSection = styled.div`
  background: white;
  color: #1a365d;
  padding: 3rem 1.5rem;
`;

const ProcessCard = styled(Card)`
  background: white;
  color: #333;
  border-radius: 12px;
  margin-bottom: 1rem;
  border-left: 4px solid #1a365d;
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

const TestimonialCard = styled(Card)`
  background: ${props => props.color || '#1a365d'};
  color: white;
  border-radius: 12px;
  height: 200px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 2rem;
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
  background: white;
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

const TimelineWrap = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  overflow-x: auto;
  padding-bottom: 0.5rem;
`;

const TimelineDot = styled.div`
  width: 36px;
  height: 36px;
  background: #1a365d;
  color: white;
  border-radius: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  flex: 0 0 auto;
`;

const TimelineCard = styled(Card)`
  width: 100%;
  height: 80px;
  display: flex;
  align-items: center;
`;

const MortgagePage: React.FC = () => {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [selectedLoan, setSelectedLoan] = useState<any>(null);
  const [showDreamAbilityModal, setShowDreamAbilityModal] = useState(false);
  const [showDreamAbilityResults, setShowDreamAbilityResults] = useState(false);
  const [showWhatThisMeans, setShowWhatThisMeans] = useState(false);
  const [showTargetPaymentBreakdown, setShowTargetPaymentBreakdown] = useState(false);
  const [showDownPaymentDetails, setShowDownPaymentDetails] = useState(false);
  const [showInterestRateDetails, setShowInterestRateDetails] = useState(false);
  const [showAprDetails, setShowAprDetails] = useState(false);
  const [dreamAbilityForm, setDreamAbilityForm] = useState({
    location: '',
    annualIncome: '',
    downPayment: '',
    creditScore: '',
    monthlyDebt: ''
  });
  // Carousel sizing constants
  const CARDS_PER_SLIDE = 3;
  const CARD_WIDTH_PX = 320; // must match LearningCard width
  const GAP_PX = 16; // must match the gap used between cards
  const SLIDE_WIDTH_PX = CARD_WIDTH_PX * CARDS_PER_SLIDE + GAP_PX * (CARDS_PER_SLIDE - 1);

  // Mortgage calculation constants
  const LOAN_AMOUNT = 1000000; // $1,000,000
  const CLOSING_COSTS = 15000; // $15,000 in closing costs
  const PROPERTY_TAX_RATE = 0.012; // 1.2% annual property tax
  const INSURANCE_RATE = 0.005; // 0.5% annual insurance
  const PMI_RATE = 0.008; // 0.8% annual PMI (for FHA)

  // Mortgage payment calculation function
  const calculateMonthlyPayment = (principal: number, annualRate: number, years: number) => {
    const monthlyRate = annualRate / 12 / 100;
    const totalPayments = years * 12;
    if (monthlyRate === 0) return principal / totalPayments;
    return principal * (monthlyRate * Math.pow(1 + monthlyRate, totalPayments)) / (Math.pow(1 + monthlyRate, totalPayments) - 1);
  };

  // APR calculation function
  const calculateAPR = (rate: number, points: number, years: number, loanAmount: number) => {
    const monthlyRate = rate / 12 / 100;
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
      
      const derivative = totalPayments * payment / (1 + monthlyAPR);
      apr = apr - costDifference / derivative;
    }
    
    return Math.min(apr, rate + 2); // Cap APR at rate + 2%
  };

  // Calculate points cost
  const calculatePointsCost = (points: number) => {
    return (points / 100) * LOAN_AMOUNT;
  };

  const handleBack = () => {
    navigate('/');
  };

  // CSV helpers for Airtable shared views (read-only; no secrets)
  const parseCsv = (text: string) => {
    const lines = text.trim().split(/\r?\n/);
    if (lines.length === 0) return [] as any[];
    const headers = lines[0].split(',').map((h) => h.replace(/^"|"$/g, ''));
    return lines.slice(1).map((row) => {
      const cells = (row.match(/(".*?"|[^,]+)(?=,|$)/g) || []).map((c) => c.replace(/^"|"$/g, ''));
      const obj: Record<string, string> = {};
      headers.forEach((h, i) => {
        obj[h] = cells[i] ?? '';
      });
      return obj;
    });
  };

  const useCsvPoll = <T,>(url: string | undefined, ms = 60000, fallback: T[]) => {
    const [data, setData] = useState<T[]>(fallback);
    React.useEffect(() => {
      if (!url) return;
      let cancelled = false;
      const load = async () => {
        try {
          const r = await fetch(`${url}${url.includes('?') ? '&' : '?'}ts=${Date.now()}`, { cache: 'no-store' });
          if (!r.ok) return;
          const txt = await r.text();
          if (!cancelled) setData(parseCsv(txt) as unknown as T[]);
        } catch {
          // ignore network errors in polling
        }
      };
      load();
      const id = setInterval(load, ms);
      return () => { cancelled = true; clearInterval(id); };
    }, [url, ms]);
    return data;
  };

  // --- Investment Sections (inline components) ---
  type LenderRow = {
    name: string; type: string; rate: number; term: number; points: number; dscrReq?: number; prepay?: string; applyUrl?: string;
  };

  const MortgageCalculatorSection: React.FC = () => {
    const [address, setAddress] = useState('');
    const [purchase, setPurchase] = useState(600000);
    const [rehab, setRehab] = useState(40000);
    const [closing, setClosing] = useState(15000);
    const [downPct, setDownPct] = useState(20);
    const [rate, setRate] = useState(6.25);
    const [term, setTerm] = useState(30);

    const prefills = useCsvPoll<any>(process.env.REACT_APP_AT_RATES_CSV, 60000, []);
    const monthlyInsurance = (purchase * 0.003) / 12;
    const monthlyTaxes = (purchase * 0.012) / 12;
    const rent = 3800; // placeholder until RentCast is wired
    const expenses = Math.round(monthlyInsurance + monthlyTaxes);
    const arv = Math.round(purchase * 1.08);

    const loanAmount = Math.max(0, (purchase + rehab + closing) - (purchase * (downPct / 100)));
    const debtService = calculateMonthlyPayment(loanAmount, rate, term);
    const dscr = debtService ? (rent - expenses) / debtService : 0;
    const ltv = purchase ? loanAmount / purchase : 0;
    const ltc = (purchase + rehab + closing) ? loanAmount / (purchase + rehab + closing) : 0;

    return (
      <Card>
        <CardContent>
          <Typography variant="h5" sx={{ fontWeight: 700, color: '#1a365d', mb: 2 }}>Mortgage Calculator</Typography>
          <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' } }}>
            <TextField fullWidth label="Property address" value={address} onChange={(e)=>setAddress(e.target.value)} />
            <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr 1fr', md: 'repeat(3, 1fr)' } }}>
              <TextField fullWidth label="Purchase" type="number" value={purchase} onChange={(e)=>setPurchase(Number(e.target.value))} />
              <TextField fullWidth label="Rehab" type="number" value={rehab} onChange={(e)=>setRehab(Number(e.target.value))} />
              <TextField fullWidth label="Closing" type="number" value={closing} onChange={(e)=>setClosing(Number(e.target.value))} />
              <TextField fullWidth label="Down %" type="number" value={downPct} onChange={(e)=>setDownPct(Number(e.target.value))} />
              <TextField fullWidth label="Rate %" type="number" value={rate} onChange={(e)=>setRate(Number(e.target.value))} />
              <TextField fullWidth label="Term (yrs)" type="number" value={term} onChange={(e)=>setTerm(Number(e.target.value))} />
            </Box>

            <Box sx={{ p: 2, border: '1px solid #e0e0e0', borderRadius: 1 }}>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>Auto data</Typography>
              <Box sx={{ display: 'grid', gap: 1, gridTemplateColumns: { xs: '1fr 1fr', md: '1fr 1fr' } }}>
                <TextField fullWidth label="Monthly rent" type="number" value={rent} />
                <TextField fullWidth label="Monthly expenses" type="number" value={expenses} />
                <Box sx={{ gridColumn: '1 / -1' }}>
                  <TextField fullWidth label="ARV (from comps)" type="number" value={arv} />
                </Box>
              </Box>
            </Box>

            <Box sx={{ p: 2, border: '1px solid #e0e0e0', borderRadius: 1 }}>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>Results</Typography>
              <Box sx={{ display: 'grid', gap: 1, gridTemplateColumns: { xs: '1fr 1fr', md: 'repeat(3, 1fr)' } }}>
                <Typography>Loan: ${loanAmount.toLocaleString()}</Typography>
                <Typography>Debt svc: ${Math.round(debtService).toLocaleString()}/mo</Typography>
                <Typography>DSCR: {dscr.toFixed(2)}</Typography>
                <Typography>LTV: {(ltv*100).toFixed(1)}%</Typography>
                <Typography>LTC: {(ltc*100).toFixed(1)}%</Typography>
              </Box>
            </Box>
          </Box>
        </CardContent>
      </Card>
    );
  };

  const LenderComparisonSection: React.FC = () => {
    const [type, setType] = useState<'dscr'|'fixflip'|'bridge'|'conventional'|'hard'>('dscr');
    const [maxRate, setMaxRate] = useState<number>(12);
    const [maxPoints, setMaxPoints] = useState<number>(4);
    const raw = useCsvPoll<any>(process.env.REACT_APP_AT_LENDERS_CSV, 60000, []);
    const lenders: LenderRow[] = raw.map((r: any) => ({
      name: r.name,
      type: (r.type || '').toLowerCase(),
      rate: Number(r.rate),
      term: Number(r.term),
      points: Number(r.points),
      dscrReq: r.dscrReq ? Number(r.dscrReq) : undefined,
      prepay: r.prepay,
      applyUrl: r.applyUrl
    }));
    const filtered = lenders.filter(l => (!type || l.type === type) && (isNaN(maxRate) || l.rate <= maxRate) && (isNaN(maxPoints) || l.points <= maxPoints));

    return (
      <Card>
        <CardContent>
          <Typography variant="h5" sx={{ fontWeight: 700, color: '#1a365d', mb: 2 }}>Compare Other Lenders</Typography>
          <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, mb: 2 }}>
            <Select fullWidth value={type} onChange={(e)=>setType(e.target.value as any)}>
              <MenuItem value="dscr">DSCR</MenuItem>
              <MenuItem value="fixflip">Fix & Flip</MenuItem>
              <MenuItem value="bridge">Bridge</MenuItem>
              <MenuItem value="conventional">Conventional</MenuItem>
              <MenuItem value="hard">Hard Money</MenuItem>
            </Select>
            <TextField fullWidth label="Max rate %" type="number" value={maxRate} onChange={(e)=>setMaxRate(Number(e.target.value))} />
            <TextField fullWidth label="Max points" type="number" value={maxPoints} onChange={(e)=>setMaxPoints(Number(e.target.value))} />
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
                  <TableCell sx={{ textTransform: 'uppercase' }}>{l.type}</TableCell>
                  <TableCell>{isNaN(l.rate) ? '-' : `${l.rate.toFixed(2)}%`}</TableCell>
                  <TableCell>{isNaN(l.term) ? '-' : `${l.term} mo`}</TableCell>
                  <TableCell>{isNaN(l.points) ? '-' : l.points.toFixed(2)}</TableCell>
                  <TableCell>{l.dscrReq ? l.dscrReq.toFixed(2) : '-'}</TableCell>
                  <TableCell>{l.prepay || '-'}</TableCell>
                  <TableCell align="right"><Button size="small" variant="outlined" sx={{ borderColor: '#1a365d', color: '#1a365d' }} href={l.applyUrl || '#'}>Apply</Button></TableCell>
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
    const [form, setForm] = useState({ name: '', email: '', address: '', income: '', credit: '' });
    const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));
    return (
      <Card>
        <CardContent>
          <Typography variant="h5" sx={{ fontWeight: 700, color: '#1a365d', mb: 2 }}>Apply for Pre-Approval</Typography>
          <LinearProgress variant="determinate" value={(step+1)*33.33} sx={{ mb: 2, height: 8, borderRadius: 1 }} />
          {step===0 && (
            <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' } }}>
              <TextField fullWidth label="Full name" value={form.name} onChange={e=>set('name', e.target.value)} />
              <TextField fullWidth label="Email" value={form.email} onChange={e=>set('email', e.target.value)} />
              <Box sx={{ gridColumn: '1 / -1' }}>
                <FormControlLabel control={<Switch checked={soft} onChange={e=>setSoft(e.target.checked)} />} label="Soft credit check" />
              </Box>
            </Box>
          )}
          {step===1 && (
            <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' } }}>
              <Box sx={{ gridColumn: '1 / -1' }}>
                <TextField fullWidth label="Property address" value={form.address} onChange={e=>set('address', e.target.value)} />
              </Box>
              <TextField fullWidth label="Annual income ($)" value={form.income} onChange={e=>set('income', e.target.value)} />
              <Select fullWidth value={form.credit} onChange={e=>set('credit', String(e.target.value))}>
                <MenuItem value="740+">740+</MenuItem>
                <MenuItem value="670-739">670-739</MenuItem>
                <MenuItem value="580-669">580-669</MenuItem>
                <MenuItem value="<580">{'<'}580</MenuItem>
              </Select>
            </Box>
          )}
          {step===2 && (
            <Box>
              <Typography sx={{ mb: 1, color: '#666' }}>Next Steps</Typography>
              <ul style={{ margin: 0, paddingLeft: 16 }}>
                <li>Upload income docs</li>
                <li>Verify identity</li>
                <li>Connect bank statements</li>
              </ul>
            </Box>
          )}
          <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
            {step>0 && <Button variant="outlined" onClick={()=>setStep(s=>s-1)} sx={{ borderColor: '#1a365d', color: '#1a365d' }}>Back</Button>}
            {step<2 ? <Button variant="contained" onClick={()=>setStep(s=>s+1)} sx={{ backgroundColor: '#1a365d' }}>Next</Button> : <Button variant="contained" sx={{ backgroundColor: '#1a365d' }}>Submit</Button>}
          </Box>
        </CardContent>
      </Card>
    );
  };

  const CreativeFinancingSection: React.FC = () => {
    const [tab, setTab] = useState(0);
    // Simple calculator state mirroring Mortgage Calculator fields
    const [purchase, setPurchase] = useState(500000);
    const [rehab, setRehab] = useState(40000);
    const [closing, setClosing] = useState(15000);
    const [downPct, setDownPct] = useState(20);
    const [rate, setRate] = useState(9.5);
    const [term, setTerm] = useState(30);

    const loanAmount = Math.max(0, (purchase + rehab + closing) - (purchase * (downPct / 100)));
    const monthly = calculateMonthlyPayment(loanAmount, rate, term);

    return (
      <Card>
        <CardContent>
          <Typography variant="h5" sx={{ fontWeight: 700, color: '#1a365d', mb: 2 }}>Creative Financing</Typography>
          <Tabs value={tab} onChange={(_, v)=>setTab(v)} sx={{ mb: 2 }}>
            <Tab label="Calculator" />
            <Tab label="Financing Options" />
          </Tabs>
          {tab===0 && (
            <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' } }}>
              <TextField fullWidth label="Purchase" type="number" value={purchase} onChange={(e)=>setPurchase(Number(e.target.value))} />
              <TextField fullWidth label="Rehab" type="number" value={rehab} onChange={(e)=>setRehab(Number(e.target.value))} />
              <TextField fullWidth label="Closing" type="number" value={closing} onChange={(e)=>setClosing(Number(e.target.value))} />
              <TextField fullWidth label="Down %" type="number" value={downPct} onChange={(e)=>setDownPct(Number(e.target.value))} />
              <TextField fullWidth label="Rate %" type="number" value={rate} onChange={(e)=>setRate(Number(e.target.value))} />
              <TextField fullWidth label="Term (yrs)" type="number" value={term} onChange={(e)=>setTerm(Number(e.target.value))} />
              <Box sx={{ gridColumn: '1 / -1', p: 2, border: '1px solid #e0e0e0', borderRadius: 1 }}>
                <Typography>Loan amount: ${loanAmount.toLocaleString()}</Typography>
                <Typography>Estimated monthly: ${Math.round(monthly).toLocaleString()}</Typography>
              </Box>
            </Box>
          )}
          {tab===1 && (
            <Box>
              <Tabs value={0} sx={{ mb: 2 }} TabIndicatorProps={{ style: { display: 'none' } }}>
                <Tab label="Seller financing" />
                <Tab label="Subject-To Existing Mortgage" />
                <Tab label="JV Capital" />
                <Tab label="Bridge-to-Perm" />
              </Tabs>
              <Typography>Seller financing templates and guides.</Typography>
            </Box>
          )}
        </CardContent>
      </Card>
    );
  };

  // RateTrackerSection removed per request

  const handleNextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % Math.ceil(learningArticles.length / 3));
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
      location: '',
      annualIncome: '',
      downPayment: '',
      creditScore: '',
      monthlyDebt: ''
    });
  };

  const handleCloseDreamAbilityResults = () => {
    setShowDreamAbilityResults(false);
    setDreamAbilityForm({
      location: '',
      annualIncome: '',
      downPayment: '',
      creditScore: '',
      monthlyDebt: ''
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
    setDreamAbilityForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleCalculateDreamAbility = () => {
    // Calculate DreamAbility based on form inputs
    // This would typically involve complex mortgage calculations
    console.log('Calculating DreamAbility with:', dreamAbilityForm);
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
      color: "#4caf50"
    },
    {
      title: "30-Year FHA",
      tag: "Lower credit profiles",
      rate: 6.000,
      apr: calculateAPR(6.000, 1.607, 30, LOAN_AMOUNT),
      points: 1.607,
      pointsCost: calculatePointsCost(1.607),
      monthlyPayment: calculateMonthlyPayment(LOAN_AMOUNT, 6.000, 30),
      features: ["3.5% min down payment", "Looser credit/debt requirements"],
      color: "#4caf50"
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
      color: "#4caf50"
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
      color: "#4caf50"
    },
    {
      title: "15-Year Fixed",
      tag: "Faster payoff",
      rate: 5.500,
      apr: calculateAPR(5.500, 1.792, 15, LOAN_AMOUNT),
      points: 1.792,
      pointsCost: calculatePointsCost(1.792),
      monthlyPayment: calculateMonthlyPayment(LOAN_AMOUNT, 5.500, 15),
      features: ["5% min down payment", "Pay less interest due to shorter term"],
      color: "#4caf50"
    }
  ];

  const processSteps = [
    {
      step: "1",
      title: "Calculate your DreamAbility™",
      description: "Get a real-time estimate of what you can afford with Zillow Home Loans.",
      icon: <CalculateIcon />
    },
    {
      step: "2",
      title: "Get pre-approved",
      description: "Make strong offers on homes with a Verified Pre-approval letter from us.",
      icon: <DescriptionIcon />
    },
    {
      step: "3",
      title: "Make an offer",
      description: "Confirm that a home fits your budget with us and determine a fair offer price.",
      icon: <FlagIcon />
    },
    {
      step: "4",
      title: "Apply for a mortgage",
      description: "After your offer is accepted, you'll complete your full loan application.",
      icon: <MoneyIcon />
    },
    {
      step: "5",
      title: "Close on your home",
      description: "Congrats, homeowner! Sign the closing paperwork and we'll finalize the sale.",
      icon: <HomeIcon />
    }
  ];

  const testimonials = [
    {
      quote: "As a first time home buyer, my loan officer made me feel at ease and welcomed all questions I had with so much patience.",
      author: "Michelle",
      location: "Arizona",
      color: "#9c27b0"
    },
    {
      quote: "My loan officer was incredibly professional, knowledgeable, and genuinely committed to helping me find the best financial solution.",
      author: "Ruslan",
      location: "New Jersey",
      color: "#4caf50"
    }
  ];

  const learningArticles = [
    {
      title: "Pre-qualified vs. pre-approved: What's the difference?",
      image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop",
      link: "#"
    },
    {
      title: "How your credit score is calculated",
      image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=300&fit=crop",
      link: "#"
    },
    {
      title: "How are mortgage rates determined?",
      image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&h=300&fit=crop",
      link: "#"
    },
    {
      title: "Understanding closing costs",
      image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=300&fit=crop",
      link: "#"
    },
    {
      title: "First-time homebuyer guide",
      image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&h=300&fit=crop",
      link: "#"
    },
    {
      title: "Down payment assistance programs",
      image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop",
      link: "#"
    },
    {
      title: "Mortgage insurance explained",
      image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=300&fit=crop",
      link: "#"
    },
    {
      title: "Refinancing your mortgage",
      image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&h=300&fit=crop",
      link: "#"
    },
    {
      title: "Home inspection checklist",
      image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop",
      link: "#"
    },
    {
      title: "Property tax considerations",
      image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=300&fit=crop",
      link: "#"
    }
  ];

  return (
    <PageContainer>
      {/* Header */}
      <HeaderSection>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="h6" sx={{ color: '#1a365d', fontWeight: 600 }}>
              Dreamery Home Loans
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              onClick={handleBack}
              sx={{ color: '#666666', textTransform: 'none' }}
            >
              Back to Home
            </Button>
            <Button
              variant="contained"
              sx={{
                backgroundColor: '#1a365d',
                color: 'white',
                textTransform: 'none',
                fontWeight: 600,
                '&:hover': {
                  backgroundColor: '#0d2340',
                }
              }}
            >
              Get pre-approved
            </Button>
          </Box>
        </Box>
      </HeaderSection>

      {/* Split Hero with Sticky DreamAbility */}
      <SplitSection>
        <SplitWrap>
          <LeftCol>
            <Typography variant="h2" sx={{ fontWeight: 800, mb: 2, color: '#1a365d' }}>
              Get a mortgage from Dreamery Home Loans
            </Typography>
            <Typography variant="h6" sx={{ mb: 3, color: '#666' }}>
              Competitive rates, clear fees, and guidance at every step. Get your DreamAbility™ to see what you can afford in real time.
            </Typography>
            <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
              <Button
                variant="contained"
                sx={{ backgroundColor: '#1a365d', color: 'white', textTransform: 'none', fontWeight: 600 }}
              >
                Start DreamAbility
              </Button>
              <Button
                variant="outlined"
                sx={{ borderColor: '#1a365d', color: '#1a365d', textTransform: 'none', fontWeight: 600 }}
              >
                Talk to a loan officer
              </Button>
            </Box>
            <Typography variant="body1" sx={{ mt: 2 }}>
              Already working with us? <Link href="#" sx={{ color: '#1a365d', textDecoration: 'none' }}>Access your dashboard</Link>
            </Typography>
          </LeftCol>
          <RightCol>
            <BuyAbilityCard>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ mb: 2, textAlign: 'center', color: '#1a365d', fontWeight: 700 }}>
                  Your DreamAbility™ today
                </Typography>
                <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 2, mb: 2 }}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h5" sx={{ fontWeight: 700, color: '#1a365d' }}>
                      ${LOAN_AMOUNT.toLocaleString()}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#666' }}>
                      Target price
                    </Typography>
                  </Box>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h5" sx={{ fontWeight: 700, color: '#1a365d' }}>
                      ${LOAN_AMOUNT.toLocaleString()}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#666' }}>
                      DreamAbility™
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  columnGap: 4,
                  alignItems: 'center',
                  mt: 2,
                  width: '100%'
                }}>
                  <Box sx={{ textAlign: 'center', flex: 1, minWidth: 0 }}>
                    <Typography variant="h6" sx={{ fontWeight: 700, color: '#1a365d', mb: 0.5 }}>
                      ${Math.round(mortgageOptions[0].monthlyPayment).toLocaleString()}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#666', fontSize: '0.75rem' }}>
                      Mo. payment
                    </Typography>
                  </Box>
                  <Box sx={{ textAlign: 'center', flex: 1, minWidth: 0 }}>
                    <Typography variant="h6" sx={{ fontWeight: 700, color: '#1a365d', mb: 0.5 }}>
                      {mortgageOptions[0].rate.toFixed(3)}%
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#666', fontSize: '0.75rem' }}>
                      Rate
                    </Typography>
                  </Box>
                  <Box sx={{ textAlign: 'center', flex: 1, minWidth: 0 }}>
                    <Typography variant="h6" sx={{ fontWeight: 700, color: '#1a365d', mb: 0.5 }}>
                      {mortgageOptions[0].apr.toFixed(3)}%
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#666', fontSize: '0.75rem' }}>
                      APR
                    </Typography>
                  </Box>
                </Box>
                <Button 
                  fullWidth 
                  variant="contained" 
                  onClick={handleOpenDreamAbilityModal}
                  sx={{ backgroundColor: '#1a365d', color: 'white', textTransform: 'none', fontWeight: 600 }}
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
        <Typography variant="h3" sx={{ textAlign: 'center', fontWeight: 700, mb: 2 }}>
          Find the right mortgage with Dreamery Home Loans
        </Typography>
        <Typography variant="body1" sx={{ textAlign: 'center', color: '#666', mb: 4 }}>
          Explore programs and compare rates. Get pre-approved with confidence.
        </Typography>
        <Box sx={{ display: 'grid', gap: 4, gridTemplateColumns: { xs: '1fr', md: '1fr 1fr', lg: 'repeat(3,1fr)' } }}>
          {mortgageOptions.map((option, index) => (
            <Box key={index}>
              <MortgageOptionCard>
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      {option.title}
                    </Typography>
                    <Chip label={option.tag} size="small" sx={{ backgroundColor: option.color, color: 'white', fontWeight: 600 }} />
                  </Box>
                  <Box sx={{ display: 'flex', gap: 3, mb: 2, alignItems: 'baseline' }}>
                    <Typography variant="h4" sx={{ fontWeight: 700, color: '#1a365d' }}>{option.rate.toFixed(3)}%</Typography>
                    <Typography variant="body2" sx={{ color: '#666' }}>Rate</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', gap: 3, mb: 2, alignItems: 'baseline' }}>
                    <Typography variant="h5" sx={{ fontWeight: 600, color: '#1a365d' }}>{option.apr.toFixed(3)}%</Typography>
                    <Typography variant="body2" sx={{ color: '#666' }}>APR</Typography>
                  </Box>
                  <Typography variant="body2" sx={{ color: '#666', mb: 2 }}>
                    Points (cost) {option.points.toFixed(3)} (${option.pointsCost.toLocaleString()})
                  </Typography>
                  <Box sx={{ mb: 2 }}>
                    {option.features.map((feature, idx) => (
                      <Typography key={idx} variant="body2" sx={{ color: '#666' }}>• {feature}</Typography>
                    ))}
                  </Box>
                  <Button fullWidth variant="outlined" sx={{ borderColor: '#1a365d', color: '#1a365d', textTransform: 'none', fontWeight: 600, mb: 1 }}>
                    Get pre-approved
                  </Button>
                  <Link 
                    onClick={() => handleShowLoanTerms(option)}
                    sx={{ 
                      color: '#1a365d', 
                      textDecoration: 'none', 
                      fontSize: '0.875rem',
                      cursor: 'pointer',
                      '&:hover': {
                        textDecoration: 'underline'
                      }
                    }}
                  >
                    See sample loan terms
                  </Link>
                </CardContent>
              </MortgageOptionCard>
            </Box>
          ))}
        </Box>
      </Container>

      {/* Why Choose Us Section removed per request */}

      {/* Vertical Timeline */}
      <Container maxWidth="lg" sx={{ mb: 6 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 4, color: '#1a365d', textAlign: 'center' }}>
          Your path to homeownership
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {processSteps.map((s, i) => (
            <TimelineCard key={i}>
              <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 3, width: '100%', py: 2 }}>
                <TimelineDot>{s.step}</TimelineDot>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="h6" sx={{ fontWeight: 700, color: '#1a365d', mb: 0.5 }}>{s.title}</Typography>
                  <Typography variant="body2" sx={{ color: '#666' }}>{s.description}</Typography>
                </Box>
              </CardContent>
            </TimelineCard>
          ))}
        </Box>
      </Container>

      {/* Process Steps Section removed - duplicate of horizontal timeline */}

      {/* Personalized CTA */}
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Box sx={{ display: 'grid', gap: 6, gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, alignItems: 'center' }}>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 2 }}>
              Get a personalized rate in minutes
            </Typography>
            <Typography variant="body1" sx={{ color: '#666', mb: 3 }}>
              Mortgage rates aren't one size fits all. We'll estimate based on your unique details.
            </Typography>
            <Button variant="contained" sx={{ backgroundColor: '#1a365d', color: 'white', textTransform: 'none', fontWeight: 600 }}>
              Get your personalized rate
            </Button>
          </Box>
          <Box>
            <Box sx={{ width: '100%', height: 260, borderRadius: 2, backgroundColor: '#f5f5f5' }} />
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
        <CreativeFinancingSection />
      </Container>

      {/* Learning Center Carousel */}
      <Box sx={{ backgroundColor: 'white', color: '#1a365d', py: 6 }}>
        <Container maxWidth="lg">
          <Typography variant="h3" sx={{ textAlign: 'center', fontWeight: 700, mb: 4 }}>
            Learn more about home financing
          </Typography>
          
          <Box sx={{ position: 'relative', mb: 4 }}>
            {/* Viewport strictly clamps the visible area to exactly 3 cards */}
            <Box sx={{
              width: `${SLIDE_WIDTH_PX}px`,
              mx: 'auto',
              overflow: 'hidden'
            }}>
              <Box sx={{ 
                display: 'flex', 
                gap: 2, 
                width: 'max-content',
                scrollBehavior: 'smooth',
                transform: `translateX(-${currentSlide * SLIDE_WIDTH_PX}px)`,
                transition: 'transform 0.3s ease-in-out'
              }}>
              {learningArticles.map((article, index) => (
                <LearningCard key={index}>
                  <Box sx={{ 
                    height: 160, 
                    backgroundColor: '#f5f5f5',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <Typography variant="h6" sx={{ color: '#666' }}>
                      [Article Image]
                    </Typography>
                  </Box>
                  <CardContent sx={{ p: 2 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 1, fontSize: '0.9rem' }}>
                      {article.title}
                    </Typography>
                    <Link href={article.link} sx={{ color: '#1a365d', textDecoration: 'none', fontSize: '0.875rem' }}>
                      Read article
                    </Link>
                  </CardContent>
                </LearningCard>
              ))}
              </Box>
            </Box>
            
            {/* Carousel Navigation */}
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, mt: 3 }}>
              <Button
                onClick={handlePrevSlide}
                sx={{ 
                  minWidth: 40, 
                  height: 40, 
                  borderRadius: '50%',
                  backgroundColor: '#1a365d',
                  color: 'white',
                  '&:hover': {
                    backgroundColor: '#0d2340',
                  }
                }}
              >
                ‹
              </Button>
              <Box sx={{ display: 'flex', gap: 0.5, alignItems: 'center' }}>
                {Array.from({ length: Math.ceil(learningArticles.length / 3) }, (_, i) => (
                  <Box
                    key={i}
                    sx={{
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      backgroundColor: i === currentSlide ? '#1a365d' : '#e0e0e0',
                      cursor: 'pointer'
                    }}
                    onClick={() => setCurrentSlide(i)}
                  />
                ))}
              </Box>
              <Button
                onClick={handleNextSlide}
                sx={{ 
                  minWidth: 40, 
                  height: 40, 
                  borderRadius: '50%',
                  backgroundColor: '#1a365d',
                  color: 'white',
                  '&:hover': {
                    backgroundColor: '#0d2340',
                  }
                }}
              >
                ›
              </Button>
            </Box>
          </Box>
          
          <Box sx={{ textAlign: 'center', mt: 4 }}>
            <Typography variant="body1" sx={{ mb: 2 }}>
              Looking for additional resources? 
              <Link href="#" sx={{ color: '#1a365d', textDecoration: 'none', ml: 1 }}>
                Visit our Learning Center
              </Link>
            </Typography>
          </Box>
        </Container>
      </Box>

      {/* Footer */}
      <Box sx={{ backgroundColor: '#f5f5f5', py: 3, minHeight: '160px' }}>
        <Container maxWidth="lg">
          <Box sx={{ display: 'grid', gap: 4, gridTemplateColumns: { xs: '1fr', md: 'repeat(3,1fr)' } }}>
            <Box>
              <Typography variant="body2" sx={{ color: '#666', mb: 1 }}>
                <Link href="#" sx={{ color: '#1a365d', textDecoration: 'none' }}>
                  Terms of use
                </Link>
              </Typography>
              <Typography variant="body2" sx={{ color: '#666' }}>
                <Link href="#" sx={{ color: '#1a365d', textDecoration: 'none' }}>
                  Privacy policy
                </Link>
              </Typography>
            </Box>
            <Box>
              <Typography variant="body2" sx={{ color: '#666', mb: 1 }}>
                Dreamery Home Loans
              </Typography>
              <Typography variant="body2" sx={{ color: '#666', mb: 1 }}>
                1500 Dreamery Boulevard, Suite 500
              </Typography>
              <Typography variant="body2" sx={{ color: '#666', mb: 1 }}>
                Austin, TX 78701
              </Typography>
              <Typography variant="body2" sx={{ color: '#666' }}>
                855-372-6337
              </Typography>
            </Box>
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <HomeIcon sx={{ mr: 1, color: '#1a365d' }} />
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  EQUAL HOUSING LENDER
                </Typography>
              </Box>
              <Typography variant="body2" sx={{ color: '#666', mb: 1 }}>
                © Dreamery Home Loans, LLC
              </Typography>
              <Typography variant="body2" sx={{ color: '#666', mb: 1 }}>
                An Equal Housing Lender
              </Typography>
              <Typography variant="body2" sx={{ color: '#666', mb: 1 }}>
                NMLS ID#: 10287
              </Typography>
              <Link href="#" sx={{ color: '#1a365d', textDecoration: 'none', fontSize: '0.875rem' }}>
                www.nmlsconsumeraccess.org
              </Link>
            </Box>
          </Box>
          
          <Divider sx={{ my: 3 }} />
          
          <Typography variant="body2" sx={{ color: '#666', textAlign: 'center' }}>
            Dreamery Group is committed to ensuring digital accessibility for individuals with disabilities. 
            We are continuously working to improve the accessibility of our website and digital services.
          </Typography>
        </Container>
      </Box>
      {/* Removed filler; content is now compact without empty space */}

      {/* Sample Loan Terms Modal */}
      {showModal && selectedLoan && (
        <Box
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1300,
            p: 2
          }}
          onClick={handleCloseModal}
        >
          <Box
            sx={{
              backgroundColor: 'white',
              borderRadius: 2,
              p: 4,
              maxWidth: 600,
              width: '100%',
              maxHeight: '90vh',
              overflow: 'auto'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h5" sx={{ fontWeight: 700, color: '#1a365d' }}>
                Sample loan terms
              </Typography>
              <IconButton onClick={handleCloseModal} sx={{ color: '#666' }}>
                <CloseIcon />
              </IconButton>
            </Box>

            {/* Content */}
            <Typography variant="body1" sx={{ mb: 3, color: '#666' }}>
              Loan interest rates and APR (Annual Percentage Rate) are dependent on the specific characteristics of the transaction and the individual's credit history. These figures are for estimation purposes only and may not reflect the exact terms of your loan. This is not a commitment to lend.
            </Typography>

            <Typography variant="body2" sx={{ mb: 3, color: '#666' }}>
              Rates current as of: {new Date().toLocaleDateString('en-US', { month: 'numeric', day: 'numeric', year: 'numeric' })}
            </Typography>

            {/* Loan Example */}
            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: '#1a365d' }}>
                {selectedLoan.title} Example
              </Typography>
              
              {selectedLoan.title === "30-Year FHA" ? (
                <>
                  <Typography variant="body1" sx={{ mb: 2, color: '#666' }}>
                    FHA Loan Example includes a one-time upfront mortgage insurance premium equal to 1.75% of base loan amount will be charged and paid at closing. A monthly mortgage insurance premium (MIP) equal to 0.5% of the base loan amount will apply and is included in monthly mortgage payments. For mortgages with an initial loan-to-value (LTV) ratio of 80%, the monthly MIP will be paid for the first 11 years of the loan only; greater LTVs require payment of MIP for the life of the loan.
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 2, color: '#666' }}>
                    Interest rate of 6.000% (6.678% APR) calculated for a mortgage loan of $275,000, with a monthly payment of $1,792.00. Rate assumes a down payment of 20% and includes 1.607 points, paid at closing. Payment amount is for principal interest, and monthly mortgage insurance premium only and does not include taxes or other types of insurance; actual payment obligation will be greater.
                  </Typography>
                </>
              ) : selectedLoan.title === "30-Year VA" ? (
                <>
                  <Typography variant="body1" sx={{ mb: 2, color: '#666' }}>
                    Interest rate of 6.125% (6.419% APR) calculated for a mortgage loan of $275,000, with a monthly payment of $1,692.00. Rate assumes a down payment of 20% and includes 1.816 points, paid at closing. Payment amount is for principal and interest only and does not include taxes or insurance; actual payment obligation will be greater.
                  </Typography>
                </>
              ) : (
                <>
                  <Typography variant="body1" sx={{ mb: 2, color: '#666' }}>
                    Interest rate of {selectedLoan.rate.toFixed(3)}% ({selectedLoan.apr.toFixed(3)}% APR) calculated for a mortgage loan of ${LOAN_AMOUNT.toLocaleString()}, with a monthly payment of ${Math.round(selectedLoan.monthlyPayment).toLocaleString()}.
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#666' }}>
                    Rate assumes a down payment of 20% and includes {selectedLoan.points.toFixed(3)} points, paid at closing. Payment amount is for principal and interest only and does not include taxes or insurance; actual payment obligation will be greater.
                  </Typography>
                </>
              )}
            </Box>

            {/* Assumptions */}
            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: '#1a365d' }}>
                For all rates shown, unless otherwise noted, we assumed:
              </Typography>
              <Box component="ul" sx={{ pl: 2, color: '#666' }}>
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
                  Loan is to secure a single-family home used as a primary residence
                </Typography>
              </Box>
            </Box>

            {/* Action Button */}
            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                variant="contained"
                sx={{
                  backgroundColor: '#1a365d',
                  color: 'white',
                  textTransform: 'none',
                  fontWeight: 600,
                  '&:hover': {
                    backgroundColor: '#0d2340',
                  }
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
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1300,
            p: 2
          }}
          onClick={handleCloseDreamAbilityModal}
        >
                      <Box
              sx={{
                backgroundColor: 'white',
                borderRadius: 2,
                p: 4,
                maxWidth: 500,
                width: '100%',
                maxHeight: '90vh',
                overflow: 'auto'
              }}
              onClick={(e) => e.stopPropagation()}
            >
            {/* Header */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h5" sx={{ fontWeight: 700, color: '#1a365d' }}>
                DreamAbility™
              </Typography>
              <IconButton onClick={handleCloseDreamAbilityModal} sx={{ color: '#666' }}>
                <CloseIcon />
              </IconButton>
            </Box>



            {/* Content */}
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 1, color: '#1a365d' }}>
              Find homes in your budget
            </Typography>
            <Typography variant="body1" sx={{ mb: 4, color: '#666' }}>
              See a real-time view of what you can afford in today's market.
            </Typography>

            {/* Form */}
            <Box sx={{ display: 'grid', gap: 3, gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, mb: 4 }}>
              {/* Left Column */}
              <Box>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" sx={{ mb: 1, fontWeight: 600, color: '#333' }}>
                    Location
                  </Typography>
                  <select
                    value={dreamAbilityForm.location}
                    onChange={(e) => handleDreamAbilityFormChange('location', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #ddd',
                      borderRadius: '4px',
                      fontSize: '14px'
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
                  <Typography variant="body2" sx={{ mb: 1, fontWeight: 600, color: '#333' }}>
                    Annual income
                  </Typography>
                  <Box sx={{ position: 'relative' }}>
                    <Typography 
                      component="span" 
                      sx={{ 
                        position: 'absolute', 
                        left: 12, 
                        top: '50%', 
                        transform: 'translateY(-50%)',
                        color: '#666'
                      }}
                    >
                      $
                    </Typography>
                    <input
                      type="text"
                      value={dreamAbilityForm.annualIncome}
                      onChange={(e) => handleDreamAbilityFormChange('annualIncome', e.target.value)}
                      style={{
                        width: '100%',
                        padding: '12px 12px 12px 24px',
                        border: '1px solid #ddd',
                        borderRadius: '4px',
                        fontSize: '14px'
                      }}
                    />
                    <Typography 
                      component="span" 
                      sx={{ 
                        position: 'absolute', 
                        right: 12, 
                        top: '50%', 
                        transform: 'translateY(-50%)',
                        color: '#666'
                      }}
                    >
                      /year
                    </Typography>
                  </Box>
                  <Typography variant="caption" sx={{ color: '#666', mt: 0.5, display: 'block' }}>
                    Pre-tax income
                  </Typography>
                </Box>

                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" sx={{ mb: 1, fontWeight: 600, color: '#333' }}>
                    Down payment
                  </Typography>
                  <Box sx={{ position: 'relative' }}>
                    <Typography 
                      component="span" 
                      sx={{ 
                        position: 'absolute', 
                        left: 12, 
                        top: '50%', 
                        transform: 'translateY(-50%)',
                        color: '#666'
                      }}
                    >
                      $
                    </Typography>
                    <input
                      type="text"
                      value={dreamAbilityForm.downPayment}
                      onChange={(e) => handleDreamAbilityFormChange('downPayment', e.target.value)}
                      style={{
                        width: '100%',
                        padding: '12px 12px 12px 24px',
                        border: '1px solid #ddd',
                        borderRadius: '4px',
                        fontSize: '14px'
                      }}
                    />
                  </Box>
                  <Typography variant="caption" sx={{ color: '#666', mt: 0.5, display: 'block' }}>
                    At least $1,500
                  </Typography>
                </Box>
              </Box>

              {/* Right Column */}
              <Box>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" sx={{ mb: 1, fontWeight: 600, color: '#333' }}>
                    Credit score
                  </Typography>
                  <select
                    value={dreamAbilityForm.creditScore}
                    onChange={(e) => handleDreamAbilityFormChange('creditScore', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #ddd',
                      borderRadius: '4px',
                      fontSize: '14px'
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
                  <Typography variant="body2" sx={{ mb: 1, fontWeight: 600, color: '#333' }}>
                    Monthly debt
                  </Typography>
                  <Box sx={{ position: 'relative' }}>
                    <Typography 
                      component="span" 
                      sx={{ 
                        position: 'absolute', 
                        left: 12, 
                        top: '50%', 
                        transform: 'translateY(-50%)',
                        color: '#666'
                      }}
                    >
                      $
                    </Typography>
                    <input
                      type="text"
                      value={dreamAbilityForm.monthlyDebt}
                      onChange={(e) => handleDreamAbilityFormChange('monthlyDebt', e.target.value)}
                      style={{
                        width: '100%',
                        padding: '12px 12px 12px 24px',
                        border: '1px solid #ddd',
                        borderRadius: '4px',
                        fontSize: '14px'
                      }}
                    />
                    <Typography 
                      component="span" 
                      sx={{ 
                        position: 'absolute', 
                        right: 12, 
                        top: '50%', 
                        transform: 'translateY(-50%)',
                        color: '#666'
                      }}
                    >
                      /month
                    </Typography>
                  </Box>
                  <Typography variant="caption" sx={{ color: '#666', mt: 0.5, display: 'block' }}>
                    Loans, credit cards, alimony
                  </Typography>
                </Box>
              </Box>
            </Box>

            {/* Action Button */}
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <Button
                variant="contained"
                onClick={handleCalculateDreamAbility}
                sx={{
                  backgroundColor: '#1a365d',
                  color: 'white',
                  textTransform: 'none',
                  fontWeight: 600,
                  px: 4,
                  py: 1.5,
                  fontSize: '1.1rem',
                  '&:hover': {
                    backgroundColor: '#0d2340',
                  }
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
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1300,
            p: 2
          }}
          onClick={handleCloseDreamAbilityResults}
        >
          <Box
            sx={{
              backgroundColor: 'white',
              borderRadius: 2,
              p: 4,
              maxWidth: 600,
              width: '100%',
              maxHeight: '90vh',
              overflow: 'auto'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="body2" sx={{ color: '#1a365d', cursor: 'pointer' }}>
                Edit
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 700, color: '#1a365d' }}>
                Your DreamAbility™
              </Typography>
              <IconButton onClick={handleCloseDreamAbilityResults} sx={{ color: '#666' }}>
                <CloseIcon />
              </IconButton>
            </Box>

            {/* Today's Target Price */}
            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 1, color: '#1a365d' }}>
                Today's target price
              </Typography>
              <Typography variant="h3" sx={{ fontWeight: 700, color: '#4caf50', mb: 1 }}>
                $739,853
              </Typography>
              <Link 
                onClick={handleShowWhatThisMeans}
                sx={{ color: '#1a365d', textDecoration: 'underline', cursor: 'pointer' }}
              >
                What this means
              </Link>
            </Box>

            {/* Payment Details */}
            <Box sx={{ mb: 4 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Typography variant="body2" sx={{ fontWeight: 600, color: '#333' }}>
                      Target payment
                    </Typography>
                    <Box 
                      onClick={handleShowTargetPaymentBreakdown}
                      sx={{ 
                        ml: 1, 
                        width: 16, 
                        height: 16, 
                        borderRadius: '50%', 
                        backgroundColor: '#1a365d', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        cursor: 'pointer',
                        '&:hover': {
                          backgroundColor: '#0d2340'
                        }
                      }}
                    >
                      <Typography variant="caption" sx={{ color: 'white', fontWeight: 600 }}>
                        i
                      </Typography>
                    </Box>
                  </Box>
                <Box sx={{ 
                  backgroundColor: '#f5f5f5', 
                  px: 2, 
                  py: 1, 
                  borderRadius: 1,
                  minWidth: 120,
                  textAlign: 'center'
                }}>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    $ 5,276 /mo
                  </Typography>
                </Box>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: '#333' }}>
                    Down payment
                  </Typography>
                  <Box 
                    onClick={handleShowDownPaymentDetails}
                    sx={{ 
                      ml: 1, 
                      width: 16, 
                      height: 16, 
                      borderRadius: '50%', 
                      backgroundColor: '#1a365d', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      cursor: 'pointer',
                      '&:hover': {
                        backgroundColor: '#0d2340'
                      }
                    }}
                  >
                    <Typography variant="caption" sx={{ color: 'white', fontWeight: 600 }}>
                      i
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ 
                  backgroundColor: '#f5f5f5', 
                  px: 2, 
                  py: 1, 
                  borderRadius: 1,
                  minWidth: 120,
                  textAlign: 'center'
                }}>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    $ 75,000
                  </Typography>
                </Box>
              </Box>
            </Box>

            {/* Dreamery Home Loans Offer */}
            <Box sx={{ mb: 4, border: '1px solid #e0e0e0', borderRadius: 2, p: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: '#1a365d' }}>
                What Dreamery Home Loans could offer
              </Typography>
              <Box sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body2" sx={{ color: '#666' }}>
                    Max home price
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    $1,101,762
                  </Typography>
                </Box>
              </Box>
              <Box sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body2" sx={{ color: '#666' }}>
                    Max payment
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    $8,417/mo
                  </Typography>
                </Box>
              </Box>
              
              <Divider sx={{ my: 2 }} />
              
              <Box sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body2" sx={{ color: '#666' }}>
                    Loan option
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    30 Year Fixed
                  </Typography>
                </Box>
              </Box>
              <Box sx={{ mb: 2 }}>
                                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Typography variant="body2" sx={{ color: '#666' }}>
                        Your est. interest rate
                      </Typography>
                      <Box 
                        onClick={handleShowInterestRateDetails}
                        sx={{ 
                          ml: 1, 
                          width: 16, 
                          height: 16, 
                          borderRadius: '50%', 
                          backgroundColor: '#1a365d', 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center',
                          cursor: 'pointer',
                          '&:hover': {
                            backgroundColor: '#0d2340'
                          }
                        }}
                      >
                        <Typography variant="caption" sx={{ color: 'white', fontWeight: 600 }}>
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
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Typography variant="body2" sx={{ color: '#666' }}>
                      APR
                    </Typography>
                    <Box 
                      onClick={handleShowAprDetails}
                      sx={{ 
                        ml: 1, 
                        width: 16, 
                        height: 16, 
                        borderRadius: '50%', 
                        backgroundColor: '#1a365d', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        cursor: 'pointer',
                        '&:hover': {
                          backgroundColor: '#0d2340'
                        }
                      }}
                    >
                      <Typography variant="caption" sx={{ color: 'white', fontWeight: 600 }}>
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
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body2" sx={{ color: '#666' }}>
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
                  backgroundColor: '#1a365d',
                  color: 'white',
                  textTransform: 'none',
                  fontWeight: 600,
                  py: 1.5,
                  mb: 2,
                  '&:hover': {
                    backgroundColor: '#0d2340',
                  }
                }}
              >
                Get pre-qualified
              </Button>
              <Typography variant="caption" sx={{ color: '#666', textAlign: 'center', display: 'block' }}>
                powered by Dreamery Home Loans
              </Typography>
            </Box>

            {/* Disclaimer */}
            <Typography variant="caption" sx={{ color: '#666', textAlign: 'center', display: 'block', mb: 3 }}>
              All calculations are estimates and provided by Dreamery, Inc. for informational purposes only. Actual amounts may vary.
            </Typography>

            {/* Save Preferences */}
            <Box sx={{ textAlign: 'center' }}>
              <Button
                variant="contained"
                sx={{
                  backgroundColor: '#1a365d',
                  color: 'white',
                  textTransform: 'none',
                  fontWeight: 600,
                  px: 4,
                  py: 1.5,
                  mb: 2,
                  '&:hover': {
                    backgroundColor: '#0d2340',
                  }
                }}
              >
                Save preferences
              </Button>
              <Typography variant="caption" sx={{ color: '#666', display: 'block' }}>
                We'll store your data according to the{' '}
                <Link sx={{ color: '#1a365d', textDecoration: 'underline', cursor: 'pointer' }}>
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
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1400,
            p: 2
          }}
          onClick={handleCloseWhatThisMeans}
        >
          <Box
            sx={{
              backgroundColor: 'white',
              borderRadius: 2,
              p: 3,
              maxWidth: 400,
              width: '100%',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Box sx={{ 
                  width: 20, 
                  height: 20, 
                  borderRadius: '50%', 
                  backgroundColor: '#1a365d', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  mr: 1
                }}>
                  <Typography variant="caption" sx={{ color: 'white', fontWeight: 600, fontSize: '12px' }}>
                    i
                  </Typography>
                </Box>
                <Typography variant="h6" sx={{ fontWeight: 600, color: '#1a365d' }}>
                  What DreamAbility™ means
                </Typography>
              </Box>
              <IconButton onClick={handleCloseWhatThisMeans} sx={{ color: '#666' }}>
                <CloseIcon />
              </IconButton>
            </Box>

            {/* Content */}
            <Typography variant="body1" sx={{ color: '#333', lineHeight: 1.5 }}>
              DreamAbility™ is a real-time estimate of what you can afford in today's market.
            </Typography>
          </Box>
        </Box>
      )}

      {/* Target Payment Breakdown Modal */}
      {showTargetPaymentBreakdown && (
        <Box
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1500,
            p: 2
          }}
          onClick={handleCloseTargetPaymentBreakdown}
        >
          <Box
            sx={{
              backgroundColor: 'white',
              borderRadius: 2,
              p: 3,
              maxWidth: 450,
              width: '100%',
              maxHeight: '80vh',
              overflow: 'auto',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Box sx={{ 
                  width: 20, 
                  height: 20, 
                  borderRadius: '50%', 
                  backgroundColor: '#1a365d', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  mr: 1
                }}>
                  <Typography variant="caption" sx={{ color: 'white', fontWeight: 600, fontSize: '12px' }}>
                    i
                  </Typography>
                </Box>
                <Typography variant="h6" sx={{ fontWeight: 600, color: '#1a365d' }}>
                  Target payment
                </Typography>
              </Box>
              <IconButton onClick={handleCloseTargetPaymentBreakdown} sx={{ color: '#666' }}>
                <CloseIcon />
              </IconButton>
            </Box>

            {/* Description */}
            <Typography variant="body2" sx={{ color: '#666', mb: 3 }}>
              The amount you tell us you feel comfortable spending per month.
            </Typography>

            {/* Loan Terms */}
            <Typography variant="body2" sx={{ color: '#666', mb: 3 }}>
              30 Year Fixed, 6.130%
            </Typography>

            {/* Payment Breakdown */}
            <Box sx={{ mb: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="body2" sx={{ color: '#333' }}>
                  Target payment
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  $5,276
                </Typography>
              </Box>
              
              <Divider sx={{ my: 2 }} />
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="body2" sx={{ color: '#333' }}>
                  Principal and interest
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  $4,042
                </Typography>
              </Box>
              <Typography variant="caption" sx={{ color: '#666', display: 'block', mb: 2 }}>
                30 Year Fixed, 6.130%
              </Typography>
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="body2" sx={{ color: '#333' }}>
                  Taxes*
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  $666
                </Typography>
              </Box>
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="body2" sx={{ color: '#333' }}>
                  Homeowners insurance
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  $247
                </Typography>
              </Box>
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="body2" sx={{ color: '#333' }}>
                  Private Mortgage Insurance (PMI)
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  $321
                </Typography>
              </Box>
            </Box>

            {/* Disclaimer */}
            <Typography variant="caption" sx={{ color: '#666', display: 'block', lineHeight: 1.4 }}>
              *To estimate your property taxes, we multiply the home value you provide by the county's effective{' '}
              <Link sx={{ color: '#1a365d', textDecoration: 'underline', cursor: 'pointer' }}>
                property tax rate
              </Link>
              . The specific{' '}
              <Link sx={{ color: '#1a365d', textDecoration: 'underline', cursor: 'pointer' }}>
                process
              </Link>
              {' '}and formula used to calculate property taxes can vary based on where the property is located and regulations set by the local governing authority there.
            </Typography>
          </Box>
        </Box>
      )}

      {/* Down Payment Details Modal */}
      {showDownPaymentDetails && (
        <Box
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1600,
            p: 2
          }}
          onClick={handleCloseDownPaymentDetails}
        >
          <Box
            sx={{
              backgroundColor: 'white',
              borderRadius: 2,
              p: 3,
              maxWidth: 400,
              width: '100%',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Box sx={{ 
                  width: 20, 
                  height: 20, 
                  borderRadius: '50%', 
                  backgroundColor: '#1a365d', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  mr: 1
                }}>
                  <Typography variant="caption" sx={{ color: 'white', fontWeight: 600, fontSize: '12px' }}>
                    i
                  </Typography>
                </Box>
                <Typography variant="h6" sx={{ fontWeight: 600, color: '#1a365d' }}>
                  Down payment
                </Typography>
              </Box>
              <IconButton onClick={handleCloseDownPaymentDetails} sx={{ color: '#666' }}>
                <CloseIcon />
              </IconButton>
            </Box>

            {/* Description */}
            <Typography variant="body2" sx={{ color: '#666', mb: 3 }}>
              A down payment is a percentage of the home price you pay upfront before you close.
            </Typography>

            {/* Down Payment Details */}
            <Box sx={{ 
              backgroundColor: '#f5f5f5', 
              borderRadius: 1, 
              p: 2, 
              mb: 3,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <Box>
                <Typography variant="body2" sx={{ color: '#666' }}>
                  Down payment
                </Typography>
                <Typography variant="body2" sx={{ color: '#666' }}>
                  10.1% of $739,853
                </Typography>
              </Box>
              <Typography variant="h6" sx={{ fontWeight: 700, color: '#1a365d' }}>
                $75,000
              </Typography>
            </Box>

            {/* Lender Requirement */}
            <Typography variant="body2" sx={{ color: '#666' }}>
              Most lenders require at least 3% down.
            </Typography>
          </Box>
        </Box>
      )}

      {/* APR Details Modal */}
      {showAprDetails && (
        <Box
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1800,
            p: 2
          }}
          onClick={handleCloseAprDetails}
        >
          <Box
            sx={{
              backgroundColor: 'white',
              borderRadius: 2,
              p: 3,
              maxWidth: 450,
              width: '100%',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Box sx={{ 
                  width: 20, 
                  height: 20, 
                  borderRadius: '50%', 
                  backgroundColor: '#1a365d', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  mr: 1
                }}>
                  <Typography variant="caption" sx={{ color: 'white', fontWeight: 600, fontSize: '12px' }}>
                    i
                  </Typography>
                </Box>
                <Typography variant="h6" sx={{ fontWeight: 600, color: '#1a365d' }}>
                  What is APR?
                </Typography>
              </Box>
              <IconButton onClick={handleCloseAprDetails} sx={{ color: '#666' }}>
                <CloseIcon />
              </IconButton>
            </Box>

            {/* Content */}
            <Typography variant="body2" sx={{ color: '#333', lineHeight: 1.5 }}>
              Annual Percentage Rate (APR) is a way of expressing the cost of a loan that includes the interest rate and loan-related fees, such as origination fees, points, and mortgage insurance.
            </Typography>
          </Box>
        </Box>
      )}

      {/* Interest Rate Details Modal */}
      {showInterestRateDetails && (
        <Box
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1700,
            p: 2
          }}
          onClick={handleCloseInterestRateDetails}
        >
          <Box
            sx={{
              backgroundColor: 'white',
              borderRadius: 2,
              p: 3,
              maxWidth: 450,
              width: '100%',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Box sx={{ 
                  width: 20, 
                  height: 20, 
                  borderRadius: '50%', 
                  backgroundColor: '#1a365d', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  mr: 1
                }}>
                  <Typography variant="caption" sx={{ color: 'white', fontWeight: 600, fontSize: '12px' }}>
                    i
                  </Typography>
                </Box>
                <Typography variant="h6" sx={{ fontWeight: 600, color: '#1a365d' }}>
                  Your estimated interest rate
                </Typography>
              </Box>
              <IconButton onClick={handleCloseInterestRateDetails} sx={{ color: '#666' }}>
                <CloseIcon />
              </IconButton>
            </Box>

            {/* Content */}
            <Typography variant="body2" sx={{ color: '#333', mb: 2, lineHeight: 1.5 }}>
              Dreamery Home Loans mortgage interest rates are dependent on a number of factors, including credit score, down payment, and loan term.
            </Typography>
            <Typography variant="body2" sx={{ color: '#333', mb: 2, lineHeight: 1.5 }}>
              Interest rates updated daily as of 2AM UTC and includes up to two (2) buydown points of the loan amount on a conforming fixed-rate loan.
            </Typography>
            <Typography variant="body2" sx={{ color: '#333', lineHeight: 1.5 }}>
              The actual payment obligation may be greater.
            </Typography>
          </Box>
        </Box>
      )}
    </PageContainer>
  );
};

export default MortgagePage; 