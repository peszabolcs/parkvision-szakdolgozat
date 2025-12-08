import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  LinearProgress,
  Chip,
} from '@mui/material';
import { useAreas } from '../hooks/useAreas';
import EmptyState from '../components/EmptyState';
import ErrorBanner from '../components/ErrorBanner';

export default function AreasPage() {
  const { data: areas, isLoading, isError, error, refetch } = useAreas();

  if (isLoading) {
    return <Typography>Loading...</Typography>;
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

  if (!areas || areas.length === 0) {
    return (
      <Box>
        <Typography variant="h4" gutterBottom>
          Areas
        </Typography>
        <EmptyState
          title="Még nincs parkolási terület definiálva"
          message="Hozd létre az első területet a kezdéshez!"
          actionLabel="Terület létrehozása"
        />
      </Box>
    );
  }

  const getOccupancyColor = (rate: number) => {
    if (rate <= 50) return 'success';
    if (rate <= 80) return 'warning';
    return 'error';
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Areas (Parkolási Területek)
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        {areas.length} terület összesen
      </Typography>

      <Grid container spacing={3}>
        {areas.map((area) => {
          const occupancyRate = Math.round((area.occupied / area.capacity) * 100);
          return (
            <Grid item xs={12} md={6} lg={4} key={area.id}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="h6">{area.name}</Typography>
                    <Chip
                      label={area.status === 'active' ? 'Active' : 'Inactive'}
                      color={area.status === 'active' ? 'success' : 'default'}
                      size="small"
                    />
                  </Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {area.description}
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    Kapacitás: {area.capacity} hely
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    Foglaltság: {area.occupied} / {area.capacity} ({occupancyRate}%)
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={occupancyRate}
                    color={getOccupancyColor(occupancyRate)}
                    sx={{ height: 8, borderRadius: 1 }}
                  />
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
}
