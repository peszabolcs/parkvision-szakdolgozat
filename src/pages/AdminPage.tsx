import { useState, useMemo } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Stack,
  Chip,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Tabs,
  Tab,
} from '@mui/material';
import { PageTransition } from '../components/PageTransition';
import {
  TrendingUp,
  TrendingDown,
  ShowChart,
  PieChart as PieChartIcon,
  BarChart as BarChartIcon,
  Refresh,
} from '@mui/icons-material';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  AreaChart,
} from 'recharts';
import { useAreas } from '../hooks/useAreas';
import { generateOccupancyHistory } from '../mocks/data/parkingLocations';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel = (props: TabPanelProps) => {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`admin-tabpanel-${index}`}
      aria-labelledby={`admin-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
};

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

const AdminPage = () => {
  const { data: areas, isLoading, refetch } = useAreas();
  const [tabValue, setTabValue] = useState(0);

  const stats = useMemo(() => {
    if (!areas) return null;

    const total = areas.reduce((sum, area) => sum + area.capacity, 0);
    const occupied = areas.reduce((sum, area) => sum + area.occupied, 0);
    const free = total - occupied;
    const occupancyRate = (occupied / total) * 100;

    const previousOccupied = occupied - Math.floor(Math.random() * 20 - 10);
    const change = occupied - previousOccupied;
    const changePercent = ((change / previousOccupied) * 100).toFixed(1);

    return {
      total,
      occupied,
      free,
      occupancyRate: occupancyRate.toFixed(1),
      change,
      changePercent,
      trend: change >= 0 ? 'up' : 'down',
    };
  }, [areas]);

  const pieData = useMemo(() => {
    if (!areas) return [];
    return areas.slice(0, 6).map((area) => ({
      name: area.name,
      value: area.occupied,
    }));
  }, [areas]);

  const barData = useMemo(() => {
    if (!areas) return [];
    return areas.slice(0, 8).map((area) => ({
      name: area.name.split('-')[0].trim(),
      capacity: area.capacity,
      occupied: area.occupied,
      free: area.capacity - area.occupied,
    }));
  }, [areas]);

  const timeSeriesData = useMemo(() => {
    if (!areas || areas.length === 0) return [];
    
    const history = generateOccupancyHistory(areas[0].id, areas[0].capacity);
    
    return history.slice(-24).map((entry) => ({
      time: new Date(entry.timestamp).toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: false 
      }),
      occupancyRate: entry.occupancyRate.toFixed(1),
      occupied: entry.occupied,
    }));
  }, [areas]);

  const revenueData = useMemo(() => {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    return days.map((day) => ({
      day,
      revenue: Math.floor(Math.random() * 5000) + 2000,
      bookings: Math.floor(Math.random() * 200) + 50,
    }));
  }, []);

  if (isLoading) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography role="status" aria-live="polite">Loading admin dashboard...</Typography>
      </Box>
    );
  }

  return (
    <PageTransition>
      <Box sx={{ p: 3 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
        <Box>
          <Typography variant="h4" fontWeight="bold" gutterBottom component="h1">
            Admin Dashboard
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Real-time analytics and system overview
          </Typography>
        </Box>
        <IconButton onClick={() => refetch()} color="primary" aria-label="Refresh dashboard data">
          <Refresh />
        </IconButton>
      </Stack>

      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Stack direction="row" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography color="text.secondary" variant="body2" gutterBottom>
                    Total Capacity
                  </Typography>
                  <Typography variant="h4" fontWeight="bold">
                    {stats?.total}
                  </Typography>
                </Box>
                <ShowChart sx={{ fontSize: 48, color: 'primary.main', opacity: 0.3 }} />
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Stack direction="row" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography color="text.secondary" variant="body2" gutterBottom>
                    Occupied
                  </Typography>
                  <Typography variant="h4" fontWeight="bold">
                    {stats?.occupied}
                  </Typography>
                  <Stack direction="row" alignItems="center" spacing={0.5} sx={{ mt: 0.5 }}>
                    {stats?.trend === 'up' ? (
                      <TrendingUp sx={{ fontSize: 16, color: 'success.main' }} />
                    ) : (
                      <TrendingDown sx={{ fontSize: 16, color: 'error.main' }} />
                    )}
                    <Typography variant="caption" color={stats?.trend === 'up' ? 'success.main' : 'error.main'}>
                      {stats?.changePercent}%
                    </Typography>
                  </Stack>
                </Box>
                <BarChartIcon sx={{ fontSize: 48, color: 'warning.main', opacity: 0.3 }} />
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Stack direction="row" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography color="text.secondary" variant="body2" gutterBottom>
                    Available
                  </Typography>
                  <Typography variant="h4" fontWeight="bold">
                    {stats?.free}
                  </Typography>
                </Box>
                <PieChartIcon sx={{ fontSize: 48, color: 'success.main', opacity: 0.3 }} />
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Stack direction="row" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography color="text.secondary" variant="body2" gutterBottom>
                    Occupancy Rate
                  </Typography>
                  <Typography variant="h4" fontWeight="bold">
                    {stats?.occupancyRate}%
                  </Typography>
                </Box>
                <ShowChart sx={{ fontSize: 48, color: 'info.main', opacity: 0.3 }} />
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Tabs 
                value={tabValue} 
                onChange={(_, newValue) => setTabValue(newValue)}
                aria-label="Chart selection tabs"
              >
                <Tab label="Occupancy Trends" id="admin-tab-0" aria-controls="admin-tabpanel-0" />
                <Tab label="Capacity Analysis" id="admin-tab-1" aria-controls="admin-tabpanel-1" />
                <Tab label="Distribution" id="admin-tab-2" aria-controls="admin-tabpanel-2" />
                <Tab label="Revenue" id="admin-tab-3" aria-controls="admin-tabpanel-3" />
              </Tabs>

              <TabPanel value={tabValue} index={0}>
                <Typography variant="h6" gutterBottom>
                  24-Hour Occupancy Trend
                </Typography>
                <ResponsiveContainer width="100%" height={400}>
                  <AreaChart data={timeSeriesData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Area
                      type="monotone"
                      dataKey="occupancyRate"
                      stroke="#8884d8"
                      fill="#8884d8"
                      fillOpacity={0.6}
                      name="Occupancy Rate (%)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </TabPanel>

              <TabPanel value={tabValue} index={1}>
                <Typography variant="h6" gutterBottom>
                  Capacity vs Occupancy by Area
                </Typography>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={barData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="capacity" fill="#8884d8" name="Total Capacity" />
                    <Bar dataKey="occupied" fill="#82ca9d" name="Occupied" />
                  </BarChart>
                </ResponsiveContainer>
              </TabPanel>

              <TabPanel value={tabValue} index={2}>
                <Typography variant="h6" gutterBottom>
                  Occupancy Distribution
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                  <ResponsiveContainer width="100%" height={400}>
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={(entry) => `${entry.name}: ${entry.value}`}
                        outerRadius={120}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {pieData.map((_, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </Box>
              </TabPanel>

              <TabPanel value={tabValue} index={3}>
                <Typography variant="h6" gutterBottom>
                  Weekly Revenue & Bookings
                </Typography>
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip />
                    <Legend />
                    <Line
                      yAxisId="left"
                      type="monotone"
                      dataKey="revenue"
                      stroke="#8884d8"
                      name="Revenue ($)"
                      strokeWidth={2}
                    />
                    <Line
                      yAxisId="right"
                      type="monotone"
                      dataKey="bookings"
                      stroke="#82ca9d"
                      name="Bookings"
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </TabPanel>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Parking Areas Overview
              </Typography>
              <TableContainer component={Paper} variant="outlined">
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Area Name</TableCell>
                      <TableCell>Capacity</TableCell>
                      <TableCell>Occupied</TableCell>
                      <TableCell>Available</TableCell>
                      <TableCell>Occupancy Rate</TableCell>
                      <TableCell>Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {areas?.slice(0, 10).map((area) => {
                      const occupancyRate = ((area.occupied / area.capacity) * 100).toFixed(1);
                      const available = area.capacity - area.occupied;
                      
                      return (
                        <TableRow key={area.id} hover>
                          <TableCell>
                            <Typography variant="body2" fontWeight="medium">
                              {area.name}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {area.description}
                            </Typography>
                          </TableCell>
                          <TableCell>{area.capacity}</TableCell>
                          <TableCell>{area.occupied}</TableCell>
                          <TableCell>
                            <Chip
                              label={available}
                              color={available > 50 ? 'success' : available > 20 ? 'warning' : 'error'}
                              size="small"
                            />
                          </TableCell>
                          <TableCell>
                            <Stack direction="row" alignItems="center" spacing={1}>
                              <Typography variant="body2">{occupancyRate}%</Typography>
                              <Box
                                sx={{
                                  width: 60,
                                  height: 6,
                                  bgcolor: 'grey.200',
                                  borderRadius: 3,
                                  overflow: 'hidden',
                                }}
                              >
                                <Box
                                  sx={{
                                    width: `${occupancyRate}%`,
                                    height: '100%',
                                    bgcolor: parseFloat(occupancyRate) > 85 ? 'error.main' : parseFloat(occupancyRate) > 50 ? 'warning.main' : 'success.main',
                                  }}
                                />
                              </Box>
                            </Stack>
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={area.status}
                              color={area.status === 'active' ? 'success' : 'default'}
                              size="small"
                              variant="outlined"
                            />
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
    </PageTransition>
  );
};

export default AdminPage;
