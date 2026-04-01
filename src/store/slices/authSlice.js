import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import authService from '../../services/authService';
import {
  getToken,
  getUser,
  setToken as saveToken,
  setUser as saveUser,
  setRefreshToken as saveRefreshToken,
  clearAuth,
} from '../../utils/secureStorage';

// ── Thunks ───────────────────────────────────────────────────────────────────

export const loginAdmin = createAsyncThunk(
  'auth/loginAdmin',
  async (credentials, { dispatch, rejectWithValue }) => {
    try {
      const response = await authService.login(credentials);

      // Response shape: { statusCode, message, data: { tokens: { accessToken, refreshToken }, user } }
      const data = response?.data || response;
      const tokens = data?.tokens || {};
      const token = tokens.accessToken || data?.accessToken || data?.token || response?.token;
      const refresh = tokens.refreshToken || data?.refreshToken || response?.refreshToken || '';
      const user = data?.user || response?.user;

      if (!token) throw new Error('No token received from server.');

      // Persist & sync
      authService.setToken(token);
      saveToken(token);
      saveRefreshToken(refresh);
      if (user) saveUser(user);

      // Fetch full admin profile from /me
      dispatch(fetchMe());

      return { token, user };
    } catch (err) {
      return rejectWithValue(err.message || 'Login failed');
    }
  }
);

export const fetchMe = createAsyncThunk(
  'auth/fetchMe',
  async (_, { rejectWithValue }) => {
    try {
      const response = await authService.getMe();
      const user = response?.data?.user || response?.data || response?.user;
      saveUser(user);
      return user;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// ── Slice ────────────────────────────────────────────────────────────────────

const storedToken = getToken();

const initialState = {
  user: getUser(),
  token: storedToken || null,
  isAuthenticated: !!storedToken,
  loading: false,
  error: null,
};

// Bootstrap: if there's a persisted token, sync it into apiService immediately
if (storedToken) {
  authService.setToken(storedToken);
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
      authService.clearToken();
      clearAuth();
    },
    setUser(state, action) {
      state.user = action.payload;
    },
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // loginAdmin
      .addCase(loginAdmin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginAdmin.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.token = action.payload.token;
        state.user = action.payload.user;
      })
      .addCase(loginAdmin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // fetchMe
      .addCase(fetchMe.fulfilled, (state, action) => {
        state.user = action.payload;
      });
  },
});

export const { logout, setUser, clearError } = authSlice.actions;
export default authSlice.reducer;
