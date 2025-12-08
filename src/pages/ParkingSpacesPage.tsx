import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import { useState, useMemo } from 'react';
import { useParkingSpaces } from '../hooks/useParkingSpaces';
import EmptyState from '../components/EmptyState';
import ErrorBanner from '../components/ErrorBanner';
import { formatDistanceToNow } from '../utils/date';

export default function ParkingSpacesPage() {
  const { data: spaces, isLoading, isError, error, refetch } = useParkingSpaces();
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredSpaces = useMemo(() => {
    if (!spaces) return [];
    if (statusFilter === 'all') return spaces;
    return spaces.filter((s) => s.status === statusFilter);
  }, [spaces, statusFilter]);

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

  if (!spaces || spaces.length === 0) {
    return (
      <Box>
        <Typography variant="h4" gutterBottom>
          Parking Spaces
        </Typography>
        <EmptyState
          title="Nincs még parkolóhely a rendszerben"
          message="Hozd létre az első parkolóhelyet a kezdéshez!"
          actionLabel="Parkolóhely hozzáadása"
        />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Parking Spaces
      </Typography>

      <Box sx={{ mb: 3 }}>
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Szűrő</InputLabel>
          <Select
            value={statusFilter}
            label="Szűrő"
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <MenuItem value="all">Összes</MenuItem>
            <MenuItem value="occupied">Csak foglalt</MenuItem>
            <MenuItem value="free">Csak szabad</MenuItem>
          </Select>
        </FormControl>
        <Typography variant="body2" sx={{ mt: 1 }}>
          {filteredSpaces.length} találat
        </Typography>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Státusz</TableCell>
              <TableCell>Terület</TableCell>
              <TableCell>Frissítve</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredSpaces.slice(0, 20).map((space) => (
              <TableRow key={space.id}>
                <TableCell>{space.id}</TableCell>
                <TableCell>
                  <Chip
                    label={space.status === 'occupied' ? 'Occupied' : 'Free'}
                    color={space.status === 'occupied' ? 'error' : 'success'}
                    size="small"
                  />
                </TableCell>
                <TableCell>{space.areaName}</TableCell>
                <TableCell>{formatDistanceToNow(space.updatedAt)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
