import { useEffect } from 'react';
import { RouterProvider } from 'react-router-dom';
import { useSelector } from 'react-redux';
import router from './routes';

export default function App() {
  const theme = useSelector((s) => s.ui.theme);

  useEffect(() => {
    document.documentElement.className = theme === 'dark' ? 'dark' : '';
  }, [theme]);

  return <RouterProvider router={router} />;
}
