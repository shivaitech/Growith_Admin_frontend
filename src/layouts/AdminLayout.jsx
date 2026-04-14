import { Outlet } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setSidebarOpen } from '../store/slices/uiSlice';
import Sidebar from '../components/common/Sidebar';
import Header from '../components/common/Header';
import { ToastProvider } from '../components/common/Toast';

export default function AdminLayout() {
  const dispatch = useDispatch();
  const { sidebarOpen } = useSelector((s) => s.ui);

  return (
    <ToastProvider>
      <div className="nv-app">
        <div
          className={`nv-overlay${sidebarOpen ? ' visible' : ''}`}
          onClick={() => dispatch(setSidebarOpen(false))}
        />
        <Sidebar />
        <div className="nv-main">
          <Header />
          <div className="nv-content">
            <Outlet />
          </div>
        </div>
      </div>
    </ToastProvider>
  );
}
