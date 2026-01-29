import { useState, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { Box, Typography, Button, Card, CardContent, Chip, Stack, TextField, InputAdornment, Paper } from '@mui/material';
import { Navigation, Search, MyLocation, DirectionsCar } from '@mui/icons-material';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useAreas } from '../hooks/useAreas';
import { getOccupancyColor } from '../mocks/data/parkingLocations';
import type { Area } from '../types';
import { PageTransition } from '../components/PageTransition';

const BUDAPEST_CENTER: [number, number] = [47.4979, 19.0402];

const createMarkerIcon = (color: 'success' | 'warning' | 'error') => {
  const colorMap = {
    success: '#4caf50',
    warning: '#ff9800',
    error: '#f44336',
  };

  return L.divIcon({
    className: 'custom-marker',
    html: `
      <div style="
        background-color: ${colorMap[color]};
        width: 32px;
        height: 32px;
        border-radius: 50% 50% 50% 0;
        border: 3px solid white;
        transform: rotate(-45deg);
        box-shadow: 0 3px 6px rgba(0,0,0,0.3);
      ">
        <div style="
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%) rotate(45deg);
          color: white;
          font-size: 16px;
        ">📍</div>
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });
};

interface UserLocationMarkerProps {
  position: [number, number];
}

const UserLocationMarker = ({ position }: UserLocationMarkerProps) => {
  const map = useMap();

  const userIcon = L.divIcon({
    className: 'user-marker',
    html: `
      <div style="
        background-color: #2196f3;
        width: 20px;
        height: 20px;
        border-radius: 50%;
        border: 3px solid white;
        box-shadow: 0 2px 4px rgba(0,0,0,0.3);
      "></div>
    `,
    iconSize: [20, 20],
    iconAnchor: [10, 10],
  });

  const handleCenter = () => {
    map.flyTo(position, 14, { duration: 1 });
  };

  return (
    <>
      <Marker position={position} icon={userIcon}>
        <Popup>
          <Typography variant="body2" fontWeight="bold">Your Location</Typography>
          <Button size="small" onClick={handleCenter} startIcon={<MyLocation />}>
            Center Map
          </Button>
        </Popup>
      </Marker>
    </>
  );
};

const MapPage = () => {
  const { data: areas, isLoading, isError } = useAreas();
  const [searchQuery, setSearchQuery] = useState('');
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [selectedArea, setSelectedArea] = useState<Area | null>(null);

  const handleGetUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation([position.coords.latitude, position.coords.longitude]);
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
    }
  };

  const filteredAreas = useMemo(() => {
    if (!areas) return [];
    if (!searchQuery) return areas;

    const query = searchQuery.toLowerCase();
    return areas.filter(
      (area) =>
        area.name.toLowerCase().includes(query) ||
        area.description.toLowerCase().includes(query) ||
        area.location?.address.toLowerCase().includes(query)
    );
  }, [areas, searchQuery]);

  const handleNavigate = (area: Area) => {
    if (!area.location) return;
    const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${area.location.lat},${area.location.lng}`;
    window.open(googleMapsUrl, '_blank');
  };

  if (isLoading) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography role="status" aria-live="polite">Loading map...</Typography>
      </Box>
    );
  }

  if (isError) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography color="error" role="alert">Error loading areas</Typography>
      </Box>
    );
  }

  return (
    <PageTransition>
      <Box sx={{ height: 'calc(100vh - 64px)', display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ p: 2, bgcolor: 'background.paper', borderBottom: 1, borderColor: 'divider' }} role="search">
        <Stack direction="row" spacing={2} alignItems="center">
          <TextField
            fullWidth
            size="small"
            placeholder="Search parking locations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            aria-label="Search parking locations"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search aria-hidden="true" />
                </InputAdornment>
              ),
            }}
          />
          <Button
            variant="contained"
            startIcon={<MyLocation />}
            onClick={handleGetUserLocation}
            sx={{ whiteSpace: 'nowrap' }}
            aria-label="Show my location on map"
          >
            My Location
          </Button>
        </Stack>
      </Box>

      <Box sx={{ flex: 1, position: 'relative' }}>
        <MapContainer
          center={BUDAPEST_CENTER}
          zoom={12}
          style={{ height: '100%', width: '100%' }}
          scrollWheelZoom={true}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {userLocation && <UserLocationMarker position={userLocation} />}

          {filteredAreas.map((area) => {
            if (!area.location) return null;

            const occupancyRate = (area.occupied / area.capacity) * 100;
            const color = getOccupancyColor(occupancyRate);
            const icon = createMarkerIcon(color);

            return (
              <Marker
                key={area.id}
                position={[area.location.lat, area.location.lng]}
                icon={icon}
                eventHandlers={{
                  click: () => setSelectedArea(area),
                }}
              >
                <Popup>
                  <Card sx={{ minWidth: 200, boxShadow: 'none' }}>
                    <CardContent sx={{ p: 1.5, '&:last-child': { pb: 1.5 } }}>
                      <Typography variant="h6" gutterBottom>
                        {area.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        {area.description}
                      </Typography>
                      <Typography variant="caption" display="block" color="text.secondary" gutterBottom>
                        {area.location.address}
                      </Typography>

                      <Stack direction="row" spacing={1} sx={{ my: 1 }}>
                        <Chip
                          label={`${area.capacity - area.occupied} free`}
                          color={color}
                          size="small"
                        />
                        <Chip
                          label={`${Math.round(occupancyRate)}% full`}
                          variant="outlined"
                          size="small"
                        />
                      </Stack>

                      <Button
                        fullWidth
                        variant="contained"
                        size="small"
                        startIcon={<Navigation />}
                        onClick={() => handleNavigate(area)}
                        sx={{ mt: 1 }}
                      >
                        Navigate
                      </Button>
                    </CardContent>
                  </Card>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>

        {selectedArea && (
          <Paper
            sx={{
              position: 'absolute',
              bottom: 16,
              left: 16,
              right: 16,
              p: 2,
              maxWidth: 400,
              zIndex: 1000,
            }}
          >
            <Stack direction="row" alignItems="center" spacing={2}>
              <DirectionsCar sx={{ fontSize: 40, color: 'primary.main' }} />
              <Box sx={{ flex: 1 }}>
                <Typography variant="h6">{selectedArea.name}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {selectedArea.capacity - selectedArea.occupied} spaces available
                </Typography>
              </Box>
              <Button
                variant="contained"
                startIcon={<Navigation />}
                onClick={() => handleNavigate(selectedArea)}
              >
                Go
              </Button>
            </Stack>
          </Paper>
        )}
      </Box>
      </Box>
    </PageTransition>
  );
};

export default MapPage;
