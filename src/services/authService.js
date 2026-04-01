import apiService from './apiService';

/**
 * Admin Authentication Service
 * Matches backend routes mounted at /api/v1/admin/auth
 */
class AuthService {
  /** POST /admin/auth/login */
  async login(credentials) {
    return apiService.post('/admin/auth/login', credentials);
  }

  /** POST /admin/auth/forgot-password */
  async forgotPassword(email) {
    return apiService.post('/admin/auth/forgot-password', { email });
  }

  /** POST /admin/auth/reset-password */
  async resetPassword(data) {
    return apiService.post('/admin/auth/reset-password', data);
  }

  /** GET /admin/auth/me */
  async getMe() {
    return apiService.get('/admin/auth/me');
  }

  // ── token helpers ─────────────────────────────────────────────────────────

  setToken(token) {
    apiService.setToken(token);
  }

  clearToken() {
    apiService.clearToken();
  }
}

const authService = new AuthService();
export default authService;
