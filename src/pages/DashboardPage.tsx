import { Box, Typography, Grid, Alert } from '@mui/material';
import LocalParkingIcon from '@mui/icons-material/LocalParking';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import PercentIcon from '@mui/icons-material/Percent';
import StatCard from '../components/StatCard';
import EmptyState from '../components/EmptyState';
import ErrorBanner from '../components/ErrorBanner';
import { useParkingSpaces } from '../hooks/useParkingSpaces';
import { useMemo } from 'react';
import { PageTransition } from '../components/PageTransition';
import { useTranslation } from 'react-i18next';

export default function DashboardPage() {
  const { t } = useTranslation();
  const { data: spaces, isLoading, isError, error, refetch } = useParkingSpaces();

  const stats = useMemo(() => {
    if (!spaces || spaces.length === 0) {
      return { total: 0, occupied: 0, free: 0, occupancyRate: 0 };
    }

    const occupied = spaces.filter((s) => s.status === 'occupied').length;
    const free = spaces.length - occupied;
    const occupancyRate = Math.round((occupied / spaces.length) * 100);

    return { total: spaces.length, occupied, free, occupancyRate };
  }, [spaces]);

  if (isLoading) {
    return <Typography role="status" aria-live="polite">{t('common.loading')}</Typography>;
  }

  if (isError) {
    return (
      <ErrorBanner
        message={t('common.errorOccurred', { 
          message: error instanceof Error ? error.message : t('common.unknownError')
        })}
        onRetry={() => refetch()}
      />
    );
  }

  if (!spaces || spaces.length === 0) {
    return (
      <>
        <Alert severity="info" sx={{ mb: 3 }}>
          {t('dashboard.noSpacesYet')}
        </Alert>
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title={t('dashboard.totalSpaces')}
              value={0}
              icon={<LocalParkingIcon />}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title={t('dashboard.occupied')}
              value={0}
              icon={<CancelIcon />}
              color="#ef4444"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title={t('dashboard.available')}
              value={0}
              icon={<CheckCircleIcon />}
              color="#00897b"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title={t('dashboard.occupancyRate')}
              value="0%"
              icon={<PercentIcon />}
            />
          </Grid>
        </Grid>
        <EmptyState
          title={t('dashboard.noSpacesTitle')}
          message={t('dashboard.noSpacesMessage')}
          actionLabel={t('dashboard.addParkingSpace')}
        />
      </>
    );
  }

  return (
    <PageTransition>
      <Box>
        <Typography variant="h4" gutterBottom component="h1">
          {t('dashboard.title')}
        </Typography>
        <Grid container spacing={3} sx={{ mb: 4 }} role="region" aria-label={t('dashboard.parkingStatistics')}>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title={t('dashboard.totalSpaces')}
              value={stats.total}
              icon={<LocalParkingIcon />}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title={t('dashboard.occupied')}
              value={stats.occupied}
              icon={<CancelIcon />}
              color="#ef4444"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title={t('dashboard.available')}
              value={stats.free}
              icon={<CheckCircleIcon />}
              color="#00897b"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title={t('dashboard.occupancyRate')}
              value={`${stats.occupancyRate}%`}
              icon={<PercentIcon />}
            />
          </Grid>
        </Grid>
      </Box>
    </PageTransition>
  );
}
