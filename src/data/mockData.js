// ── Mock Data ─────────────────────────────────────────────────────
export const investors = [
  { id: 1, name: 'Arjun Mehta', email: 'arjun@techwave.io', country: 'IN', kyc: 'Approved', invested: 42500, purchasedTokens: 85000, airdropTokens: 5000, joined: '2024-03-12' },
  { id: 2, name: 'Sofia Reyes', email: 'sofia@nexgen.co', country: 'MX', kyc: 'Pending', invested: 18000, purchasedTokens: 36000, airdropTokens: 0, joined: '2024-04-02' },
  { id: 3, name: "James O'Brien", email: 'james@capvault.ie', country: 'IE', kyc: 'Approved', invested: 95000, purchasedTokens: 190000, airdropTokens: 10000, joined: '2024-02-18' },
  { id: 4, name: 'Yuki Tanaka', email: 'yuki@blockfin.jp', country: 'JP', kyc: 'Manual Review', invested: 28000, purchasedTokens: 56000, airdropTokens: 2500, joined: '2024-03-29' },
  { id: 5, name: 'Priya Sharma', email: 'priya@defilab.in', country: 'IN', kyc: 'Rejected', invested: 0, purchasedTokens: 0, airdropTokens: 1000, joined: '2024-04-10' },
  { id: 6, name: 'Marco Bianchi', email: 'marco@tokeniq.it', country: 'IT', kyc: 'Approved', invested: 67000, purchasedTokens: 134000, airdropTokens: 7500, joined: '2024-01-25' },
  { id: 7, name: 'Aisha Kamara', email: 'aisha@afrivest.ng', country: 'NG', kyc: 'Pending', invested: 12500, purchasedTokens: 25000, airdropTokens: 0, joined: '2024-04-15' },
  { id: 8, name: 'Chen Wei', email: 'chen@cryptobase.cn', country: 'CN', kyc: 'Approved', invested: 110000, purchasedTokens: 220000, airdropTokens: 15000, joined: '2024-01-10' },
];

export const kycItems = [
  { id: 1, name: 'Sofia Reyes', email: 'sofia@nexgen.co', doc: 'Passport', submitted: '2024-04-02', status: 'Pending', country: 'MX', docType: 'ID + Selfie' },
  { id: 2, name: 'Yuki Tanaka', email: 'yuki@blockfin.jp', doc: 'Driver License', submitted: '2024-03-29', status: 'Manual Review', country: 'JP', docType: 'DL + Proof of Address' },
  { id: 3, name: 'Aisha Kamara', email: 'aisha@afrivest.ng', doc: 'National ID', submitted: '2024-04-15', status: 'Pending', country: 'NG', docType: 'NID + Utility Bill' },
  { id: 4, name: 'Raj Patel', email: 'raj@finstack.in', doc: 'Aadhaar', submitted: '2024-04-16', status: 'Pending', country: 'IN', docType: 'Aadhaar + PAN' },
];

export const payments = [
  { id: 'PAY-001', investor: 'Arjun Mehta', amount: 42500, method: 'Bank Transfer', date: '2024-04-01', status: 'Completed', ref: 'NEFT/234561', actionBy: 'Alex Morgan', actionAt: '02 Apr 2024, 10:15' },
  { id: 'PAY-002', investor: 'Sofia Reyes', amount: 18000, method: 'USDT', date: '2024-04-02', status: 'Pending', ref: '0x8f3a...c9e2' },
  { id: 'PAY-003', investor: "James O'Brien", amount: 95000, method: 'Wire Transfer', date: '2024-03-28', status: 'Completed', ref: 'SWIFT/88420', actionBy: 'Sam Torres', actionAt: '29 Mar 2024, 09:40' },
  { id: 'PAY-004', investor: 'Aisha Kamara', amount: 12500, method: 'Bank Transfer', date: '2024-04-15', status: 'Pending', ref: 'NEFT/290012' },
  { id: 'PAY-005', investor: 'Chen Wei', amount: 110000, method: 'USDT', date: '2024-04-18', status: 'Pending', ref: '0x4d7b...f102' },
];

export const withdrawals = [
  { id: 'WD-001', investor: 'Arjun Mehta', amount: 5000, wallet: '0x8f3a...c9e2', requested: '2024-04-18', status: 'Pending' },
  { id: 'WD-002', investor: 'Marco Bianchi', amount: 12000, wallet: '0x1a2b...7df8', requested: '2024-04-17', status: 'Pending' },
  { id: 'WD-003', investor: 'Chen Wei', amount: 20000, wallet: '0x9c4e...2b31', requested: '2024-04-16', status: 'Approved', actionBy: 'Alex Morgan', actionAt: '17 Apr 2024, 11:05' },
];

export const referrals = [
  { id: 1, investor: 'Arjun Mehta', tier: 'L1', referred: 4, totalInvest: 62000, commission: 3100, status: 'Active' },
  { id: 2, investor: "James O'Brien", tier: 'L1', referred: 7, totalInvest: 145000, commission: 7250, status: 'Active' },
  { id: 3, investor: 'Chen Wei', tier: 'L2', referred: 2, totalInvest: 28000, commission: 840, status: 'Active' },
  { id: 4, investor: 'Marco Bianchi', tier: 'L3', referred: 1, totalInvest: 9000, commission: 135, status: 'Active' },
];

export const adminRoles = [
  { id: 1, name: 'Alex Morgan', email: 'alex@growith.io', role: 'Master Admin', permissions: ['all'], status: 'Active' },
  { id: 2, name: 'Sam Torres', email: 'sam@growith.io', role: 'Admin', permissions: ['kyc', 'payments', 'investors'], status: 'Active' },
  { id: 3, name: 'Dana Lee', email: 'dana@growith.io', role: 'KYC Manager', permissions: ['kyc'], status: 'Active' },
];

export const notifications = [
  { id: 1, title: 'New KYC Submission', body: 'Raj Patel submitted documents for review', time: '2m ago' },
  { id: 2, title: 'Payment Pending', body: 'Chen Wei — $110,000 USDT awaiting verification', time: '15m ago' },
  { id: 3, title: 'Withdrawal Request', body: 'Marco Bianchi requested $12,000 withdrawal', time: '1h ago' },
  { id: 4, title: 'KYC Approved', body: 'Arjun Mehta KYC was auto-approved', time: '3h ago' },
];

export const affiliateLinks = [
  { id: 'LNK-001', affiliate: 'Arjun Mehta', campaign: 'Q2 Launch', code: 'ARJUN2024', clicks: 142, signups: 18, converted: 4, revenue: 62000, created: '2024-03-12', status: 'Active' },
  { id: 'LNK-002', affiliate: "James O'Brien", campaign: 'Ireland Push', code: 'JAMES-IE', clicks: 89, signups: 12, converted: 7, revenue: 145000, created: '2024-02-18', status: 'Active' },
  { id: 'LNK-003', affiliate: 'Chen Wei', campaign: 'Asia Campaign', code: 'CHEN-ASIA', clicks: 210, signups: 31, converted: 2, revenue: 28000, created: '2024-01-10', status: 'Active' },
  { id: 'LNK-004', affiliate: 'Marco Bianchi', campaign: 'Italy DeFi', code: 'MRK-DEFI', clicks: 67, signups: 8, converted: 1, revenue: 9000, created: '2024-01-25', status: 'Paused' },
];

export const affiliatePayouts = [
  { id: 'PO-001', affiliate: 'Arjun Mehta', amount: 3100, method: 'Bank Transfer', wallet: 'HDFC/ARJUN', requested: '2024-04-20', status: 'Pending' },
  { id: 'PO-002', affiliate: "James O'Brien", amount: 7250, method: 'Wire Transfer', wallet: 'IBAN/IE29...', requested: '2024-04-19', status: 'Pending' },
  { id: 'PO-003', affiliate: 'Chen Wei', amount: 840, method: 'USDT', wallet: '0x9c4e...2b31', requested: '2024-04-18', status: 'Approved', actionBy: 'Sam Torres', actionAt: '19 Apr 2024, 14:22' },
  { id: 'PO-004', affiliate: 'Marco Bianchi', amount: 135, method: 'Bank Transfer', wallet: 'IT60...', requested: '2024-04-15', status: 'Approved', actionBy: 'Alex Morgan', actionAt: '16 Apr 2024, 09:10' },
];

// ── Affiliate Programs ────────────────────────────────────────────
export const affiliatePrograms = [
  {
    id: 'PROG-001',
    name: 'ShivAI Launch Campaign',
    tokenId: 'shivai', tokenName: 'ShivAI', ticker: 'SHVAI',
    description: 'Global affiliate program for the ShivAI token launch — Q1/Q2 2024.',
    status: 'Active',
    affiliates: 4, totalRaised: 62000,
    l1: 5, l2: 3, l3: 1.5,
    startDate: '2024-03-01', endDate: '2024-12-31',
    code: 'SHVAI-LAUNCH-X9K',
    minInvest: 1000, maxAffiliates: '', cookieDays: 30, payoutThreshold: 100,
    created: '2024-03-01',
  },
];

// ── Token Management ──────────────────────────────────────────────
export const tokenList = [
  {
    id: 'shivai', name: 'ShivAI', ticker: 'SHVAI',
    description: 'AI Infrastructure Token — EU-registered private placement on Polygon',
    status: 'LIVE', blockchain: 'Polygon', standard: 'ERC-20',
    issuancePrice: 0.01, totalSupply: 10_000_000_000, targetRaise: 5_000_000,
    totalRaised: 892_500, holders: 47, tokensMinted: 89_250_000, pendingMints: 2,
    launchDate: 'Jan 2024', accessType: 'OPEN', lockPeriod: '12 months',
    contractAddress: '0x742d35Cc6634C0532925a3b8D4C9b8E2a1F2D1a5',
  },
  {
    id: 'greenvolt', name: 'GreenVolt', ticker: 'GVT',
    description: 'Clean Energy Series A — Tokenized infrastructure investment',
    status: 'COMING SOON', blockchain: 'Polygon', standard: 'ERC-20',
    issuancePrice: null, totalSupply: null, targetRaise: null,
    totalRaised: 0, holders: 0, tokensMinted: 0, pendingMints: 0,
    launchDate: 'Q3 2026', accessType: 'CLOSED', lockPeriod: 'TBA', contractAddress: null,
  },
  {
    id: 'novamed', name: 'NovaMed', ticker: 'NMD',
    description: 'HealthTech Token — Private placement structure',
    status: 'COMING SOON', blockchain: 'Polygon', standard: 'ERC-20',
    issuancePrice: null, totalSupply: null, targetRaise: null,
    totalRaised: 0, holders: 0, tokensMinted: 0, pendingMints: 0,
    launchDate: 'Q4 2026', accessType: 'CLOSED', lockPeriod: 'TBA', contractAddress: null,
  },
  {
    id: 'quantumpay', name: 'QuantumPay', ticker: 'QPY',
    description: 'Fintech Series B — Payment infrastructure token',
    status: 'COMING SOON', blockchain: 'Polygon', standard: 'ERC-20',
    issuancePrice: null, totalSupply: null, targetRaise: null,
    totalRaised: 0, holders: 0, tokensMinted: 0, pendingMints: 0,
    launchDate: 'Q1 2027', accessType: 'CLOSED', lockPeriod: 'TBA', contractAddress: null,
  },
];

export const shivaiRaiseHistory = [
  { month: 'Jan 2024', raised: 85000, investors: 4 },
  { month: 'Feb 2024', raised: 204000, investors: 11 },
  { month: 'Mar 2024', raised: 380000, investors: 28 },
  { month: 'Apr 2024', raised: 892500, investors: 47 },
];

export const tokenInvestors = [
  { id: 1, name: 'Chen Wei',      email: 'chen@cryptobase.cn',  country: 'CN', invested: 110000, tokens: 11000000, vestingPct: 0,  lockExpiry: '2025-04-18', mintStatus: 'Pending Mint', mintDate: null,         paymentRef: '0x4d7b...f102', kyc: 'Approved' },
  { id: 2, name: "James O'Brien", email: 'james@capvault.ie',   country: 'IE', invested: 95000,  tokens: 9500000,  vestingPct: 40, lockExpiry: '2025-03-28', mintStatus: 'Minted',       mintDate: '2024-03-28', paymentRef: 'SWIFT/88420',   kyc: 'Approved' },
  { id: 3, name: 'Arjun Mehta',   email: 'arjun@techwave.io',   country: 'IN', invested: 42500,  tokens: 4250000,  vestingPct: 40, lockExpiry: '2025-04-01', mintStatus: 'Minted',       mintDate: '2024-04-01', paymentRef: 'NEFT/234561',   kyc: 'Approved' },
  { id: 4, name: 'Marco Bianchi', email: 'marco@tokeniq.it',    country: 'IT', invested: 67000,  tokens: 6700000,  vestingPct: 40, lockExpiry: '2025-01-25', mintStatus: 'Minted',       mintDate: '2024-01-25', paymentRef: 'SWIFT/ITL002',  kyc: 'Approved' },
  { id: 5, name: 'Yuki Tanaka',   email: 'yuki@blockfin.jp',    country: 'JP', invested: 28000,  tokens: 2800000,  vestingPct: 0,  lockExpiry: '2025-03-29', mintStatus: 'KYC Review',   mintDate: null,         paymentRef: 'SWIFT/JP3309',  kyc: 'Manual Review' },
  { id: 6, name: 'Aisha Kamara',  email: 'aisha@afrivest.ng',   country: 'NG', invested: 12500,  tokens: 1250000,  vestingPct: 0,  lockExpiry: '2025-04-15', mintStatus: 'Pending Mint', mintDate: null,         paymentRef: 'NEFT/290012',   kyc: 'Approved' },
  { id: 7, name: 'Sofia Reyes',   email: 'sofia@nexgen.co',     country: 'MX', invested: 18000,  tokens: 1800000,  vestingPct: 0,  lockExpiry: null,         mintStatus: 'KYC Pending',  mintDate: null,         paymentRef: '0x8f3a...c9e2', kyc: 'Pending' },
];

export const pendingMints = [
  { id: 'MINT-001', investor: 'Chen Wei',     email: 'chen@cryptobase.cn', amount: 110000, tokens: 11000000, paymentRef: '0x4d7b...f102', method: 'USDT (TRC20)',   paymentDate: '2024-04-18', kyc: 'Approved', wallet: '0x9c4e...2b31' },
  { id: 'MINT-002', investor: 'Aisha Kamara', email: 'aisha@afrivest.ng',  amount: 12500,  tokens: 1250000,  paymentRef: 'NEFT/290012',   method: 'Bank Transfer',  paymentDate: '2024-04-15', kyc: 'Approved', wallet: 'Pending Generation' },
];

export const vestingSchedule = [
  { milestone: 'TGE',      date: 'Apr 2024', releaseType: 'Lock Begin', pct: 0,  tokens: 0,        status: 'Released', note: 'No tokens released at TGE' },
  { milestone: 'Month 3',  date: 'Jul 2024', releaseType: 'Partial',    pct: 10, tokens: 8925000,  status: 'Released', note: null },
  { milestone: 'Month 6',  date: 'Oct 2024', releaseType: 'Partial',    pct: 15, tokens: 13387500, status: 'Released', note: null },
  { milestone: 'Month 9',  date: 'Jan 2025', releaseType: 'Partial',    pct: 15, tokens: 13387500, status: 'Upcoming', note: null },
  { milestone: 'Month 12', date: 'Apr 2025', releaseType: 'Partial',    pct: 20, tokens: 17850000, status: 'Upcoming', note: null },
  { milestone: 'Month 18', date: 'Oct 2025', releaseType: 'Partial',    pct: 20, tokens: 17850000, status: 'Upcoming', note: null },
  { milestone: 'Month 24', date: 'Apr 2026', releaseType: 'Final',      pct: 20, tokens: 17850000, status: 'Upcoming', note: 'Full unlock at 24 months' },
];

// ── Token Purchase Requests ───────────────────────────────────────
export const tokenRequests = [
  { id: 'TR-001', investor: 'Chen Wei',      email: 'chen@cryptobase.cn',  country: 'CN', kyc: 'Approved',       token: 'ShivAI', ticker: 'SHVAI', amount: 110000, tokensRequested: 11000000, method: 'USDT (TRC20)',  paymentRef: '0x4d7b...f102', walletAddress: '0x9c4e...2b31', requestedAt: '2024-04-18', status: 'Pending' },
  { id: 'TR-002', investor: 'Aisha Kamara',  email: 'aisha@afrivest.ng',   country: 'NG', kyc: 'Approved',       token: 'ShivAI', ticker: 'SHVAI', amount: 12500,  tokensRequested: 1250000,  method: 'Bank Transfer', paymentRef: 'NEFT/290012',   walletAddress: 'Pending',       requestedAt: '2024-04-15', status: 'Pending' },
  { id: 'TR-003', investor: "James O'Brien", email: 'james@capvault.ie',   country: 'IE', kyc: 'Approved',       token: 'ShivAI', ticker: 'SHVAI', amount: 95000,  tokensRequested: 9500000,  method: 'Wire Transfer', paymentRef: 'SWIFT/88420',   walletAddress: '0x7ab1...d221', requestedAt: '2024-03-28', status: 'Approved', actionBy: 'Alex Morgan', actionAt: '2024-03-29' },
  { id: 'TR-004', investor: 'Arjun Mehta',   email: 'arjun@techwave.io',   country: 'IN', kyc: 'Approved',       token: 'ShivAI', ticker: 'SHVAI', amount: 42500,  tokensRequested: 4250000,  method: 'Bank Transfer', paymentRef: 'NEFT/234561',   walletAddress: '0x3fe2...a910', requestedAt: '2024-03-12', status: 'Approved', actionBy: 'Sam Torres',  actionAt: '2024-03-13' },
  { id: 'TR-005', investor: 'Yuki Tanaka',   email: 'yuki@blockfin.jp',    country: 'JP', kyc: 'Manual Review',  token: 'ShivAI', ticker: 'SHVAI', amount: 28000,  tokensRequested: 2800000,  method: 'Wire Transfer', paymentRef: 'SWIFT/JP3309',  walletAddress: '0x1cf4...b003', requestedAt: '2024-03-29', status: 'Pending' },
  { id: 'TR-006', investor: 'Sofia Reyes',   email: 'sofia@nexgen.co',     country: 'MX', kyc: 'Pending',        token: 'ShivAI', ticker: 'SHVAI', amount: 18000,  tokensRequested: 1800000,  method: 'USDT',          paymentRef: '0x8f3a...c9e2', walletAddress: '0x5da9...ef01', requestedAt: '2024-04-02', status: 'Rejected', actionBy: 'Alex Morgan', actionAt: '2024-04-03' },
  { id: 'TR-007', investor: 'Marco Bianchi', email: 'marco@tokeniq.it',    country: 'IT', kyc: 'Approved',       token: 'ShivAI', ticker: 'SHVAI', amount: 67000,  tokensRequested: 6700000,  method: 'Wire Transfer', paymentRef: 'SWIFT/ITL002',  walletAddress: '0x1a2b...7df8', requestedAt: '2024-01-25', status: 'Approved', actionBy: 'Sam Torres',  actionAt: '2024-01-26' },
];
