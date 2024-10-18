'use client';
import React, { useState, useEffect } from 'react';
import {
  AppBar,
  Toolbar,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
  Avatar,
  Divider,
  Slide,
  Typography,
  Container,
  Snackbar,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import HomeIcon from '@mui/icons-material/Home';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PersonIcon from '@mui/icons-material/Person';
import LoginIcon from '@mui/icons-material/LockOpen';
import RegisterIcon from '@mui/icons-material/HowToReg';
import { useUser } from '../UserContext';
import Login from './login';
import Register from './register';
import Profile from './profile';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import logo from '../public/image/science_en.png';

const Navbar: React.FC = () => {
  const { authData, logout, logoutMessage } = useUser();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [openLogin, setOpenLogin] = useState(false);
  const [openRegister, setOpenRegister] = useState(false);
  const [openProfile, setOpenProfile] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const router = useRouter();

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleLoginOpen = () => {
    setOpenLogin(true);
  };

  const handleLoginClose = () => {
    setOpenLogin(false);
  };

  const handleRegisterOpen = () => {
    setOpenRegister(true);
  };

  const handleRegisterClose = () => {
    setOpenRegister(false);
  };

  const handleLogout = () => {
    logout();
    setSnackbarOpen(true); // Show snackbar on logout
    router.push('/');
  };

  const handleProfileOpen = () => {
    setOpenProfile(true);
    handleCloseMenu();
  };

  const handleProfileClose = () => {
    setOpenProfile(false);
  };

  // Handle Snackbar close
  const handleSnackbarClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };

  useEffect(() => {
    if (logoutMessage) {
      setSnackbarOpen(true); // Show snackbar if logout message is present
    }
  }, [logoutMessage]);

  return (
    <>
      <AppBar position="fixed" sx={{ backgroundColor: '#FFD700', boxShadow: '0 2px 10px rgba(0, 0, 0, 0.2)', height: '70px' }}>
        <Container maxWidth="lg">
          <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <IconButton
                edge="start"
                color="inherit"
                aria-label="menu"
                onClick={handleMenuClick}
                sx={{ mr: 2 }}
              >
                <MenuIcon />
              </IconButton>
              <Link href="/" passHref>
                <Image src={logo} alt="University Logo" width={145} height={50} />
              </Link>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Link href="/" passHref>
                <Button color="inherit" startIcon={<HomeIcon />} sx={{ color: 'white', '&:hover': { bgcolor: 'rgba(0, 0, 0, 0.2)', transition: '0.3s' } }}>
                  Home
                </Button>
              </Link>
              <Link href="/dashboard" passHref>
                <Button color="inherit" startIcon={<DashboardIcon />} sx={{ color: 'white', '&:hover': { bgcolor: 'rgba(0, 0, 0, 0.2)', transition: '0.3s' } }}>
                  Dashboard
                </Button>
              </Link>
              {authData && authData.user.role === "1" && (
                <Link href="/users" passHref>
                  <Button color="inherit" sx={{ color: 'white', '&:hover': { bgcolor: 'rgba(0, 0, 0, 0.2)', transition: '0.3s' } }}>
                    User Management
                  </Button>
                </Link>
              )}
              {(authData && (authData.user.role === "1" || authData.user.role === "2")) && (
                <Link href="/students" passHref>
                  <Button color="inherit" sx={{ color: 'white', '&:hover': { bgcolor: 'rgba(0, 0, 0, 0.2)', transition: '0.3s' } }}>
                    Students Management
                  </Button>
                </Link>
              )}
              {authData ? (
                <>
                  <Typography variant="body1" sx={{ color: 'white', mr: 2 }}>ยินดีต้อนรับ, {authData.user.username}!</Typography>
                  <IconButton color="inherit" onClick={handleMenuClick}>
                    <Avatar alt={authData.user.username} />
                  </IconButton>
                  <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleCloseMenu}>
                    <MenuItem onClick={handleProfileOpen}>
                      <PersonIcon sx={{ mr: 1 }} />
                      Profile
                    </MenuItem>
                    <Divider />
                    <MenuItem onClick={handleLogout}>Logout</MenuItem>
                  </Menu>
                </>
              ) : (
                <>
                  <Button color="inherit" onClick={handleLoginOpen} startIcon={<LoginIcon />} sx={{ color: 'white', '&:hover': { bgcolor: 'rgba(0, 0, 0, 0.2)', transition: '0.3s' } }}>
                    Login
                  </Button>
                  <Button color="inherit" onClick={handleRegisterOpen} startIcon={<RegisterIcon />} sx={{ color: 'white', '&:hover': { bgcolor: 'rgba(0, 0, 0, 0.2)', transition: '0.3s' } }}>
                    Register
                  </Button>
                </>
              )}
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Login Dialog */}
      <Dialog open={openLogin} onClose={handleLoginClose} maxWidth="sm" fullWidth TransitionComponent={Slide}>
        <DialogTitle>Login</DialogTitle>
        <DialogContent>
          <Login onClose={handleLoginClose} />
        </DialogContent>
      </Dialog>

      {/* Register Dialog */}
      <Dialog open={openRegister} onClose={handleRegisterClose} maxWidth="sm" fullWidth TransitionComponent={Slide}>
        <DialogTitle>Register</DialogTitle>
        <DialogContent>
          <Register onClose={handleRegisterClose} />
        </DialogContent>
      </Dialog>

      {/* Profile Dialog */}
      <Profile open={openProfile} onClose={handleProfileClose} />

      {/* Snackbar for logout message */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        message="คุณออกจากระบบสำเร็จแล้ว."
      />
    </>
  );
};

export default Navbar;
