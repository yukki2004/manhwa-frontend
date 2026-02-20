import { Outlet } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext'; 
import MainHeader from './MainLayout/components/MainHeader';
import MainFooter from './MainLayout/components/MainFooter'; // Import Footer mới

const MainLayout = () => {
  const { theme } = useTheme();

  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-300 ${
      theme === 'dark' ? 'bg-[#0b0f1a] text-slate-200' : 'bg-gray-50 text-slate-900'
    }`}>
      <MainHeader />

      <main className="flex-1 container mx-auto px-4 py-8 md:px-6 lg:px-8 mt-2 overflow-x-hidden">
        <Outlet />
      </main>

      <MainFooter />
    </div>
  );
};

export default MainLayout;