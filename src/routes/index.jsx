import { createBrowserRouter, Navigate } from 'react-router-dom';
import AdminLayout from '../layouts/AdminLayout';
import AuthLayout from '../layouts/AuthLayout';
import ProtectedRoute from '../components/common/ProtectedRoute';

// Pages
import Dashboard from '../pages/Dashboard';
import Investors from '../pages/Users';
import KYC from '../pages/KYC';
import Payments from '../pages/Payments';
import TokenManagement from '../pages/TokenManagement';
import ShivAI from '../pages/TokenManagement/ShivAI';
import Airdrop from '../pages/Airdrop';
import Withdrawals from '../pages/Withdrawals';
import AffiliateOverview from '../pages/Affiliate/Overview';
import AffiliatePrograms from '../pages/Affiliate/Programs';
import AffiliatesList from '../pages/Affiliate/AffiliatesList';
import AffiliateCommissions from '../pages/Affiliate/Commissions';
import AffiliatePayouts from '../pages/Affiliate/Payouts';
import AdminRoles from '../pages/AdminRoles';
import Settings from '../pages/Settings';
import Login from '../pages/Login';
import ForgotPassword from '../pages/ForgotPassword';
import VerifyCode from '../pages/VerifyCode';
import ResetPassword from '../pages/ResetPassword';
import NotFound from '../pages/NotFound';

const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <AdminLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Dashboard /> },
      { path: 'investors', element: <Investors /> },
      { path: 'kyc', element: <KYC /> },
      { path: 'payments', element: <Payments /> },
      { path: 'token', element: <TokenManagement /> },
      { path: 'token/shivai', element: <ShivAI /> },
      { path: 'airdrop', element: <Airdrop /> },
      { path: 'withdrawals', element: <Withdrawals /> },
      { path: 'affiliate', element: <AffiliateOverview /> },
      { path: 'affiliate/programs', element: <AffiliatePrograms /> },
      { path: 'affiliate/affiliates', element: <AffiliatesList /> },
      { path: 'affiliate/commissions', element: <AffiliateCommissions /> },
      { path: 'affiliate/payouts', element: <AffiliatePayouts /> },
      { path: 'referrals', element: <Navigate to="/affiliate" replace /> },
      { path: 'roles', element: <AdminRoles /> },
      { path: 'settings', element: <Settings /> },
    ],
  },
  {
    path: '/auth',
    element: <AuthLayout />,
    children: [
      { path: 'login', element: <Login /> },
      { path: 'forgot-password', element: <ForgotPassword /> },
      { path: 'verify-code', element: <VerifyCode /> },
      { path: 'reset-password', element: <ResetPassword /> },
    ],
  },
  { path: '*', element: <NotFound /> },
]);

export default router;
