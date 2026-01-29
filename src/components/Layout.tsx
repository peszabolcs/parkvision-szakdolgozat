import {
  Box,
  CssBaseline,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  Stack,
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import LocalParkingIcon from '@mui/icons-material/LocalParking';
import MapIcon from '@mui/icons-material/Map';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import LanguageIcon from '@mui/icons-material/Language';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useThemeMode } from '../contexts/ThemeContext';
import { useState } from 'react';

const drawerWidth = 240;

const menuItems = [
  { path: '/dashboard', label: 'Dashboard', icon: <DashboardIcon /> },
  {
    path: '/parking-spaces',
    label: 'Parking Spaces',
    icon: <LocalParkingIcon />,
  },
  { path: '/areas', label: 'Areas', icon: <MapIcon /> },
  { path: '/map', label: 'Map View', icon: <MapIcon /> },
  { path: '/admin', label: 'Admin', icon: <AdminPanelSettingsIcon /> },
];

export default function Layout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { i18n } = useTranslation();
  const { actualTheme, setMode } = useThemeMode();
  const [langAnchorEl, setLangAnchorEl] = useState<null | HTMLElement>(null);

  const handleLanguageClick = (event: React.MouseEvent<HTMLElement>) => {
    setLangAnchorEl(event.currentTarget);
  };

  const handleLanguageClose = () => {
    setLangAnchorEl(null);
  };

  const handleLanguageChange = (lang: string) => {
    i18n.changeLanguage(lang);
    handleLanguageClose();
  };

  const handleThemeToggle = () => {
    setMode(actualTheme === 'dark' ? 'light' : 'dark');
  };



  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
      >
        <Toolbar>
          <LocalParkingIcon sx={{ mr: 2 }} />
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            ParkVision MVP
          </Typography>
          
          <Stack direction="row" spacing={1}>
            <IconButton 
              color="inherit" 
              onClick={handleLanguageClick}
              aria-label="Change language"
              aria-haspopup="true"
              aria-expanded={Boolean(langAnchorEl)}
            >
              <LanguageIcon />
            </IconButton>
            <IconButton 
              color="inherit" 
              onClick={handleThemeToggle}
              aria-label={`Switch to ${actualTheme === 'dark' ? 'light' : 'dark'} mode`}
            >
              {actualTheme === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
            </IconButton>
          </Stack>

          <Menu
            anchorEl={langAnchorEl}
            open={Boolean(langAnchorEl)}
            onClose={handleLanguageClose}
            aria-label="Language selection menu"
          >
            <MenuItem 
              onClick={() => handleLanguageChange('en')}
              selected={i18n.language === 'en'}
              aria-label="Switch to English"
            >
              English
            </MenuItem>
            <MenuItem 
              onClick={() => handleLanguageChange('hu')}
              selected={i18n.language === 'hu'}
              aria-label="Switch to Hungarian"
            >
              Magyar
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: 'auto' }}>
          <List role="navigation" aria-label="Main navigation">
            {menuItems.map((item) => (
              <ListItem key={item.path} disablePadding>
                <ListItemButton
                  selected={location.pathname === item.path}
                  onClick={() => navigate(item.path)}
                  aria-label={`Navigate to ${item.label}`}
                  aria-current={location.pathname === item.path ? 'page' : undefined}
                >
                  <ListItemIcon aria-hidden="true">{item.icon}</ListItemIcon>
                  <ListItemText primary={item.label} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }} role="main">
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
}
