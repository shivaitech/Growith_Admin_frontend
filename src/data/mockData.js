// ── Mock Data ─────────────────────────────────────────────────────
export const investors = [
  { id: 1, name: 'Arjun Mehta', email: 'arjun@techwave.io', country: 'IN', kyc: 'Approved', invested: 42500, tokens: 85000, joined: '2024-03-12' },
  { id: 2, name: 'Sofia Reyes', email: 'sofia@nexgen.co', country: 'MX', kyc: 'Pending', invested: 18000, tokens: 36000, joined: '2024-04-02' },
  { id: 3, name: "James O'Brien", email: 'james@capvault.ie', country: 'IE', kyc: 'Approved', invested: 95000, tokens: 190000, joined: '2024-02-18' },
  { id: 4, name: 'Yuki Tanaka', email: 'yuki@blockfin.jp', country: 'JP', kyc: 'Manual Review', invested: 28000, tokens: 56000, joined: '2024-03-29' },
  { id: 5, name: 'Priya Sharma', email: 'priya@defilab.in', country: 'IN', kyc: 'Rejected', invested: 0, tokens: 0, joined: '2024-04-10' },
  { id: 6, name: 'Marco Bianchi', email: 'marco@tokeniq.it', country: 'IT', kyc: 'Approved', invested: 67000, tokens: 134000, joined: '2024-01-25' },
  { id: 7, name: 'Aisha Kamara', email: 'aisha@afrivest.ng', country: 'NG', kyc: 'Pending', invested: 12500, tokens: 25000, joined: '2024-04-15' },
  { id: 8, name: 'Chen Wei', email: 'chen@cryptobase.cn', country: 'CN', kyc: 'Approved', invested: 110000, tokens: 220000, joined: '2024-01-10' },
];

export const kycItems = [
  { id: 1, name: 'Sofia Reyes', email: 'sofia@nexgen.co', doc: 'Passport', submitted: '2024-04-02', status: 'Pending', country: 'MX', docType: 'ID + Selfie' },
  { id: 2, name: 'Yuki Tanaka', email: 'yuki@blockfin.jp', doc: 'Driver License', submitted: '2024-03-29', status: 'Manual Review', country: 'JP', docType: 'DL + Proof of Address' },
  { id: 3, name: 'Aisha Kamara', email: 'aisha@afrivest.ng', doc: 'National ID', submitted: '2024-04-15', status: 'Pending', country: 'NG', docType: 'NID + Utility Bill' },
  { id: 4, name: 'Raj Patel', email: 'raj@finstack.in', doc: 'Aadhaar', submitted: '2024-04-16', status: 'Pending', country: 'IN', docType: 'Aadhaar + PAN' },
];

export const payments = [
  { id: 'PAY-001', investor: 'Arjun Mehta', amount: 42500, method: 'Bank Transfer', date: '2024-04-01', status: 'Completed', ref: 'NEFT/234561' },
  { id: 'PAY-002', investor: 'Sofia Reyes', amount: 18000, method: 'USDT', date: '2024-04-02', status: 'Pending', ref: '0x8f3a...c9e2' },
  { id: 'PAY-003', investor: "James O'Brien", amount: 95000, method: 'Wire Transfer', date: '2024-03-28', status: 'Completed', ref: 'SWIFT/88420' },
  { id: 'PAY-004', investor: 'Aisha Kamara', amount: 12500, method: 'Bank Transfer', date: '2024-04-15', status: 'Pending', ref: 'NEFT/290012' },
  { id: 'PAY-005', investor: 'Chen Wei', amount: 110000, method: 'USDT', date: '2024-04-18', status: 'Pending', ref: '0x4d7b...f102' },
];

export const withdrawals = [
  { id: 'WD-001', investor: 'Arjun Mehta', amount: 5000, wallet: '0x8f3a...c9e2', requested: '2024-04-18', status: 'Pending' },
  { id: 'WD-002', investor: 'Marco Bianchi', amount: 12000, wallet: '0x1a2b...7df8', requested: '2024-04-17', status: 'Pending' },
  { id: 'WD-003', investor: 'Chen Wei', amount: 20000, wallet: '0x9c4e...2b31', requested: '2024-04-16', status: 'Approved' },
];

export const referrals = [
  { id: 1, investor: 'Arjun Mehta', tier: 'L1', referred: 4, totalInvest: 62000, commission: 3100, status: 'Active' },
  { id: 2, investor: "James O'Brien", tier: 'L1', referred: 7, totalInvest: 145000, commission: 7250, status: 'Active' },
  { id: 3, investor: 'Chen Wei', tier: 'L2', referred: 2, totalInvest: 28000, commission: 840, status: 'Active' },
  { id: 4, investor: 'Marco Bianchi', tier: 'L3', referred: 1, totalInvest: 9000, commission: 135, status: 'Active' },
];

export const adminRoles = [
  { id: 1, name: 'Alex Morgan', email: 'alex@nexusvault.io', role: 'Master Admin', permissions: ['all'], status: 'Active' },
  { id: 2, name: 'Sam Torres', email: 'sam@nexusvault.io', role: 'Admin', permissions: ['kyc', 'payments', 'investors'], status: 'Active' },
  { id: 3, name: 'Dana Lee', email: 'dana@nexusvault.io', role: 'KYC Manager', permissions: ['kyc'], status: 'Active' },
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
  { id: 'PO-003', affiliate: 'Chen Wei', amount: 840, method: 'USDT', wallet: '0x9c4e...2b31', requested: '2024-04-18', status: 'Approved' },
  { id: 'PO-004', affiliate: 'Marco Bianchi', amount: 135, method: 'Bank Transfer', wallet: 'IT60...', requested: '2024-04-15', status: 'Approved' },
];
