const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const TOKEN_KEY = 'admin_token';

class ApiService {
  constructor() {
    // Bootstrap from localStorage so the token survives page reloads
    this.token = localStorage.getItem(TOKEN_KEY) || null;
  }

  setToken(token) {
    this.token = token;
    // Keep localStorage in sync so it's never lost
    if (token) {
      localStorage.setItem(TOKEN_KEY, token);
    }
  }

  clearToken() {
    this.token = null;
    localStorage.removeItem(TOKEN_KEY);
  }

  getAuthHeaders() {
    // Always try in-memory first, fall back to localStorage
    const token = this.token || localStorage.getItem(TOKEN_KEY);
    const headers = {
      'Content-Type': 'application/json',
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
  }

  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const config = {
      headers: this.getAuthHeaders(),
      ...options,
    };

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        let errMessage = `HTTP error! status: ${response.status}`;
        try {
          const errBody = await response.json();
          if (errBody && errBody.message) errMessage = errBody.message;
        } catch {
          // ignore parse errors
        }

        // 401 on /me means the token is truly expired → force logout
        // Other 401s (e.g. permission errors) just surface the error without wiping the session
        if (response.status === 401 && endpoint.includes('/auth/me')) {
          this.clearToken();
          window.dispatchEvent(new CustomEvent('auth:unauthorized'));
        }

        throw new Error(errMessage);
      }

      // Some endpoints return 204 No Content
      if (response.status === 204) return null;

      return await response.json();
    } catch (error) {
      throw error;
    }
  }

  async get(endpoint, params) {
    let url = endpoint;
    if (params && Object.keys(params).length) {
      const qs = new URLSearchParams(params).toString();
      url = `${endpoint}?${qs}`;
    }
    return this.request(url, { method: 'GET' });
  }

  async post(endpoint, data) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async put(endpoint, data) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async patch(endpoint, data) {
    return this.request(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async delete(endpoint) {
    return this.request(endpoint, { method: 'DELETE' });
  }

  /**
   * Upload a file using multipart/form-data.
   * Omits Content-Type so the browser sets the correct boundary.
   */
  async upload(endpoint, formData) {
    const url = `${API_BASE_URL}${endpoint}`;
    const headers = {};
    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }
    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: formData,
    });

    if (!response.ok) {
      let errMessage = `Upload failed! status: ${response.status}`;
      try {
        const errBody = await response.json();
        if (errBody && errBody.message) errMessage = errBody.message;
      } catch {
        // ignore
      }
      throw new Error(errMessage);
    }

    if (response.status === 204) return null;
    return await response.json();
  }
}

const apiService = new ApiService();
export default apiService;
