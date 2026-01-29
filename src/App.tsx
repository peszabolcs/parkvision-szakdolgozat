import { CssBaseline } from '@mui/material';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { I18nextProvider } from 'react-i18next';
import i18n from './i18n/config';
import { ThemeProvider } from './contexts/ThemeContext';
import Layout from './components/Layout';
import AreasPage from './pages/AreasPage';
import DashboardPage from './pages/DashboardPage';
import ParkingSpacesPage from './pages/ParkingSpacesPage';
import MapPage from './pages/MapPage';
import AdminPage from './pages/AdminPage';
import { PWAInstallPrompt } from './components/PWAInstallPrompt';
import { OfflineIndicator } from './components/OfflineIndicator';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <I18nextProvider i18n={i18n}>
      <ThemeProvider>
        <CssBaseline />
        <QueryClientProvider client={queryClient}>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Layout />}>
                <Route index element={<Navigate to="/dashboard" replace />} />
                <Route path="dashboard" element={<DashboardPage />} />
                <Route path="parking-spaces" element={<ParkingSpacesPage />} />
                <Route path="areas" element={<AreasPage />} />
                <Route path="map" element={<MapPage />} />
                <Route path="admin" element={<AdminPage />} />
              </Route>
            </Routes>
          </BrowserRouter>
          <PWAInstallPrompt />
          <OfflineIndicator />
        </QueryClientProvider>
      </ThemeProvider>
    </I18nextProvider>
  );
}

export default App;
