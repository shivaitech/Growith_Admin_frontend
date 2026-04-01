import { useSelector, useDispatch } from 'react-redux';
import { loginAdmin, fetchMe, logout as logoutAction, clearError } from '../store/slices/authSlice';

/**
 * Primary auth hook for the admin app.
 * Provides: token, user, isAuthenticated, loading, error, login(), logout(), clearError()
 */
export function useAuth() {
  const dispatch = useDispatch();
  const { token, user, isAuthenticated, loading, error } = useSelector((s) => s.auth);

  const login = async (credentials) => {
    const result = await dispatch(loginAdmin(credentials));
    if (loginAdmin.rejected.match(result)) {
      throw new Error(result.payload || 'Login failed');
    }
    return result.payload;
  };

  const logout = () => {
    dispatch(logoutAction());
  };

  const refreshProfile = () => dispatch(fetchMe());

  return {
    token,
    user,
    isAuthenticated,
    loading,
    error,
    login,
    logout,
    clearError: () => dispatch(clearError()),
    refreshProfile,
  };
}
