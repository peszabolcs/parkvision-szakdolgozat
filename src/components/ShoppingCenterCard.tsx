import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  Stack,
  Chip,
  LinearProgress,
} from '@mui/material';
import {
  LocationOn,
  Schedule,
  LocalParking,
} from '@mui/icons-material';
import { ShoppingCenter } from '../types';
import { useTranslation } from 'react-i18next';

interface ShoppingCenterCardProps {
  center: ShoppingCenter;
  onClick?: () => void;
}

export const ShoppingCenterCard = ({ center, onClick }: ShoppingCenterCardProps) => {
  const { t } = useTranslation();
  const availableSpaces = center.capacity - center.occupied;
  const occupancyRate = (center.occupied / center.capacity) * 100;

  const getOccupancyColor = () => {
    if (occupancyRate >= 90) return 'error';
    if (occupancyRate >= 70) return 'warning';
    return 'success';
  };

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        cursor: onClick ? 'pointer' : 'default',
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': onClick ? {
          transform: 'translateY(-4px)',
          boxShadow: 6,
        } : {},
      }}
      onClick={onClick}
    >
      <CardMedia
        component="div"
        sx={{
          height: 180,
          bgcolor: 'grey.300',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundImage: `linear-gradient(45deg, #667eea 0%, #764ba2 100%)`,
        }}
      >
        <LocalParking sx={{ fontSize: 64, color: 'white', opacity: 0.8 }} />
      </CardMedia>
      <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <Typography variant="h6" component="h3" gutterBottom fontWeight="bold">
          {center.name}
        </Typography>

        <Stack spacing={1.5} sx={{ mt: 1 }}>
          <Stack direction="row" spacing={1} alignItems="flex-start">
            <LocationOn sx={{ fontSize: 20, color: 'text.secondary', mt: 0.2 }} />
            <Typography variant="body2" color="text.secondary" sx={{ flex: 1 }}>
              {center.address}
            </Typography>
          </Stack>

          <Stack direction="row" spacing={1} alignItems="center">
            <Schedule sx={{ fontSize: 20, color: 'text.secondary' }} />
            <Typography variant="body2" color="text.secondary">
              {center.openingHours}
            </Typography>
          </Stack>

          <Box sx={{ mt: 2 }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
              <Typography variant="body2" fontWeight="medium">
                {t('public.availableSpaces', 'Available Spaces')}
              </Typography>
              <Chip
                label={`${availableSpaces} / ${center.capacity}`}
                color={getOccupancyColor()}
                size="small"
              />
            </Stack>
            <LinearProgress
              variant="determinate"
              value={occupancyRate}
              color={getOccupancyColor()}
              sx={{ height: 8, borderRadius: 4 }}
            />
            <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
              {occupancyRate.toFixed(0)}% {t('public.occupied', 'occupied')}
            </Typography>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
};
