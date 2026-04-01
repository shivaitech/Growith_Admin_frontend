import { useEffect } from 'react';
import { RouterProvider } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import router from './routes';
import { fetchMe, logout } from './store/slices/authSlice';

export default function App() {
  const dispatch = useDispatch();
  const theme = useSelector((s) => s.ui.theme);
  const token = useSelector((s) => s.auth.token);

  useEffect(() => {
    document.documentElement.className = theme === 'dark' ? 'dark' : '';
  }, [theme]);

  // On app boot, if we have a token, fetch the fresh admin profile
  useEffect(() => {
    if (token) {
      dispatch(fetchMe());
    }
  }, [token, dispatch]);

  // Listen for session-expired events from apiService (fired on /me 401)
  useEffect(() => {
    const handleUnauthorized = () => dispatch(logout());
    window.addEventListener('auth:unauthorized', handleUnauthorized);
    return () => window.removeEventListener('auth:unauthorized', handleUnauthorized);
  }, [dispatch]);

  return <RouterProvider router={router} />;
}
