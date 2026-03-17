import { Outlet, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

export default function AuthLayout() {
  const { isAuthenticated } = useSelector((state) => state.auth);

  if (isAuthenticated) return <Navigate to="/" replace />;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-purple-50">
      <div className="w-full max-w-md">
        <Outlet />
      </div>
    </div>
  );
}
