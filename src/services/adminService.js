import apiService from './apiService';

/**
 * Admin / Users Service
 * Covers users, KYC, payments, withdrawals, tokens, airdrops, affiliate, etc.
 */
class AdminService {
  // ════════════════════════════════════════════════
  // DASHBOARD
  // ════════════════════════════════════════════════
  getDashboardStats() {
    return apiService.get('/admin/dashboard/stats');
  }

  // ════════════════════════════════════════════════
  // USERS / INVESTORS
  // GET    /admin/users
  // GET    /admin/users/:id
  // POST   /admin/users/create
  // PATCH  /admin/users/:id/edit
  // DELETE /admin/users/:id
  // ════════════════════════════════════════════════
  getUsers(params) {
    return apiService.get('/admin/users', params);
  }

  getUser(userId) {
    return apiService.get(`/admin/users/${userId}`);
  }

  createUser(data) {
    return apiService.post('/admin/users/create', data);
  }

  updateUser(userId, data) {
    return apiService.patch(`/admin/users/${userId}/edit`, data);
  }

  deleteUser(userId) {
    return apiService.delete(`/admin/users/${userId}`);
  }

  // ════════════════════════════════════════════════
  // KYC
  // ════════════════════════════════════════════════
  getKycRequests(params) {
    return apiService.get('/admin/kyc', params);
  }

  getKycRequest(kycId) {
    return apiService.get(`/admin/kyc/${kycId}`);
  }

  approveKyc(kycId) {
    return apiService.post(`/admin/kyc/${kycId}/approve`);
  }

  rejectKyc(kycId, reason) {
    return apiService.post(`/admin/kyc/${kycId}/reject`, { reason });
  }

  /** POST /admin/kyc/send-link  — send KYC verification link to a user's email */
  sendKycLink(userId) {
    return apiService.post('/admin/kyc/send-link', { userId });
  }

  // ════════════════════════════════════════════════
  // PAYMENTS
  // ════════════════════════════════════════════════
  getPayments(params) {
    return apiService.get('/admin/payments', params);
  }

  getPayment(paymentId) {
    return apiService.get(`/admin/payments/${paymentId}`);
  }

  approvePayment(paymentId) {
    return apiService.post(`/admin/payments/${paymentId}/approve`);
  }

  rejectPayment(paymentId, reason) {
    return apiService.post(`/admin/payments/${paymentId}/reject`, { reason });
  }

  // ════════════════════════════════════════════════
  // WITHDRAWALS
  // ════════════════════════════════════════════════
  getWithdrawals(params) {
    return apiService.get('/admin/withdrawals', params);
  }

  getWithdrawal(id) {
    return apiService.get(`/admin/withdrawals/${id}`);
  }

  approveWithdrawal(id) {
    return apiService.post(`/admin/withdrawals/${id}/approve`);
  }

  rejectWithdrawal(id, reason) {
    return apiService.post(`/admin/withdrawals/${id}/reject`, { reason });
  }

  // ════════════════════════════════════════════════
  // TOKEN MANAGEMENT
  // ════════════════════════════════════════════════
  getTokens(params) {
    return apiService.get('/admin/tokens', params);
  }

  getToken(tokenId) {
    return apiService.get(`/admin/tokens/${tokenId}`);
  }

  createToken(data) {
    return apiService.post('/admin/tokens', data);
  }

  updateToken(tokenId, data) {
    return apiService.put(`/admin/tokens/${tokenId}`, data);
  }

  deleteToken(tokenId) {
    return apiService.delete(`/admin/tokens/${tokenId}`);
  }

  // Token Allocations
  getTokenAllocations(params) {
    return apiService.get('/admin/token-allocations', params);
  }

  createTokenAllocation(data) {
    return apiService.post('/admin/token-allocations', data);
  }

  updateTokenAllocation(id, data) {
    return apiService.put(`/admin/token-allocations/${id}`, data);
  }

  deleteTokenAllocation(id) {
    return apiService.delete(`/admin/token-allocations/${id}`);
  }

  // ════════════════════════════════════════════════
  // AIRDROPS
  // ════════════════════════════════════════════════
  getAirdrops(params) {
    return apiService.get('/admin/airdrops', params);
  }

  getAirdrop(id) {
    return apiService.get(`/admin/airdrops/${id}`);
  }

  createAirdrop(data) {
    return apiService.post('/admin/airdrops', data);
  }

  updateAirdrop(id, data) {
    return apiService.put(`/admin/airdrops/${id}`, data);
  }

  deleteAirdrop(id) {
    return apiService.delete(`/admin/airdrops/${id}`);
  }

  distributeAirdrop(id) {
    return apiService.post(`/admin/airdrops/${id}/distribute`);
  }

  // ════════════════════════════════════════════════
  // AFFILIATE
  // ════════════════════════════════════════════════
  getAffiliateOverview() {
    return apiService.get('/admin/affiliate/overview');
  }

  getAffiliatePrograms(params) {
    return apiService.get('/admin/affiliate/programs', params);
  }

  createAffiliateProgram(data) {
    return apiService.post('/admin/affiliate/programs', data);
  }

  updateAffiliateProgram(id, data) {
    return apiService.put(`/admin/affiliate/programs/${id}`, data);
  }

  deleteAffiliateProgram(id) {
    return apiService.delete(`/admin/affiliate/programs/${id}`);
  }

  getAffiliates(params) {
    return apiService.get('/admin/affiliate/affiliates', params);
  }

  getAffiliateCommissions(params) {
    return apiService.get('/admin/affiliate/commissions', params);
  }

  approveCommission(id) {
    return apiService.post(`/admin/affiliate/commissions/${id}/approve`);
  }

  getAffiliatePayouts(params) {
    return apiService.get('/admin/affiliate/payouts', params);
  }

  processAffiliatePayout(id) {
    return apiService.post(`/admin/affiliate/payouts/${id}/process`);
  }

  createAffiliateLink(data) {
    return apiService.post('/admin/affiliate/links', data);
  }

  getAffiliateLinks(params) {
    return apiService.get('/admin/affiliate/links', params);
  }

  deleteAffiliateLink(id) {
    return apiService.delete(`/admin/affiliate/links/${id}`);
  }

  // ════════════════════════════════════════════════
  // ADMIN ROLES
  // ════════════════════════════════════════════════
  getAdminRoles() {
    return apiService.get('/admin/roles');
  }

  createAdminRole(data) {
    return apiService.post('/admin/roles', data);
  }

  updateAdminRole(id, data) {
    return apiService.put(`/admin/roles/${id}`, data);
  }

  deleteAdminRole(id) {
    return apiService.delete(`/admin/roles/${id}`);
  }

  getAdminUsers(params) {
    return apiService.get('/admin/admins', params);
  }

  inviteAdminUser(data) {
    return apiService.post('/admin/admins/invite', data);
  }

  updateAdminUser(id, data) {
    return apiService.put(`/admin/admins/${id}`, data);
  }

  removeAdminUser(id) {
    return apiService.delete(`/admin/admins/${id}`);
  }

  // ════════════════════════════════════════════════
  // ANALYTICS
  // ════════════════════════════════════════════════
  getAnalytics(params) {
    return apiService.get('/admin/analytics', params);
  }

  // ════════════════════════════════════════════════
  // SETTINGS
  // ════════════════════════════════════════════════
  getSettings() {
    return apiService.get('/admin/settings');
  }

  updateSettings(data) {
    return apiService.put('/admin/settings', data);
  }
}

const adminService = new AdminService();
export default adminService;
