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

export default function DashboardPage() {
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
    return <Typography role="status" aria-live="polite">Loading...</Typography>;
  }

  if (isError) {
    return (
      <ErrorBanner
        message={`Hiba történt az adatok lekérésekor: ${
          error instanceof Error ? error.message : 'Ismeretlen hiba'
        }`}
        onRetry={() => refetch()}
      />
    );
  }

  if (!spaces || spaces.length === 0) {
    return (
      <>
        <Alert severity="info" sx={{ mb: 3 }}>
          Még nincs parkolóhely a rendszerben. Kezdj hozzá az első hely
          létrehozásával!
        </Alert>
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Összes hely"
              value={0}
              icon={<LocalParkingIcon />}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Foglalt"
              value={0}
              icon={<CancelIcon />}
              color="#f44336"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Szabad"
              value={0}
              icon={<CheckCircleIcon />}
              color="#4caf50"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Foglaltság"
              value="0%"
              icon={<PercentIcon />}
            />
          </Grid>
        </Grid>
        <EmptyState
          title="Nincs még parkolóhely"
          message="A rendszerben még nincsenek parkolóhelyek. Hozd létre az első parkolóhelyet a kezdéshez!"
          actionLabel="Parkolóhely hozzáadása"
        />
      </>
    );
  }

  return (
    <PageTransition>
      <Box>
        <Typography variant="h4" gutterBottom component="h1">
          Dashboard
        </Typography>
        <Grid container spacing={3} sx={{ mb: 4 }} role="region" aria-label="Parking statistics">
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Összes hely"
              value={stats.total}
              icon={<LocalParkingIcon />}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Foglalt"
              value={stats.occupied}
              icon={<CancelIcon />}
              color="#f44336"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Szabad"
              value={stats.free}
              icon={<CheckCircleIcon />}
              color="#4caf50"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Foglaltság"
              value={`${stats.occupancyRate}%`}
              icon={<PercentIcon />}
            />
          </Grid>
        </Grid>
      </Box>
    </PageTransition>
  );
}
