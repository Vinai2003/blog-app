import React, { useState } from 'react';
import {
    AppBar,
    Box,
    Toolbar,
    IconButton,
    Typography,
    Menu,
    MenuItem,
    Container,
    Avatar,
    Button,
    Tooltip,
    useTheme,
    useMediaQuery,
    Drawer,
    List,
    ListItem,
    ListItemText,
    ListItemIcon,
    Divider
} from '@mui/material';
import {
    Menu as MenuIcon,
    AccountCircle,
    Logout,
    Article,
    Create,
    Home,
    DarkMode,
    LightMode
} from '@mui/icons-material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { motion } from 'framer-motion';

const Navbar: React.FC = () => {
    const { user, isAuthenticated, logout } = useAuth();
    const navigate = useNavigate();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
    const [drawerOpen, setDrawerOpen] = useState(false);

    const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    const handleLogout = () => {
        logout();
        handleCloseUserMenu();
        navigate('/login');
    };

    const handleDrawerToggle = () => {
        setDrawerOpen(!drawerOpen);
    };

    return (
        <AppBar position="fixed" elevation={1} color="default">
            <Container maxWidth="lg">
                <Toolbar disableGutters>
                    {/* Logo and title */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <Typography
                            variant="h6"
                            noWrap
                            component={RouterLink}
                            to="/"
                            sx={{
                                mr: 2,
                                display: { xs: 'none', md: 'flex' },
                                fontWeight: 700,
                                color: 'primary.main',
                                textDecoration: 'none',
                            }}
                        >
                            BLOG APP
                        </Typography>
                    </motion.div>

                    {/* Mobile menu button */}
                    {isMobile && (
                        <Box sx={{ flexGrow: 0, display: { xs: 'flex', md: 'none' } }}>
                            <IconButton
                                size="large"
                                aria-label="account of current user"
                                aria-controls="menu-appbar"
                                aria-haspopup="true"
                                onClick={handleDrawerToggle}
                                color="inherit"
                            >
                                <MenuIcon />
                            </IconButton>
                        </Box>
                    )}

                    {/* Mobile site title */}
                    <Typography
                        variant="h5"
                        noWrap
                        component={RouterLink}
                        to="/"
                        sx={{
                            mr: 2,
                            display: { xs: 'flex', md: 'none' },
                            flexGrow: 1,
                            fontWeight: 700,
                            color: 'primary.main',
                            textDecoration: 'none',
                        }}
                    >
                        BLOG
                    </Typography>

                    {/* Desktop navigation links */}
                    <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
                        <Button
                            component={RouterLink}
                            to="/"
                            sx={{ my: 2, color: 'text.primary', display: 'block' }}
                        >
                            Home
                        </Button>

                        {isAuthenticated && (
                            <>
                                <Button
                                    component={RouterLink}
                                    to="/blogs/create"
                                    sx={{ my: 2, color: 'text.primary', display: 'block' }}
                                >
                                    Create Blog
                                </Button>
                                <Button
                                    component={RouterLink}
                                    to="/my-blogs"
                                    sx={{ my: 2, color: 'text.primary', display: 'block' }}
                                >
                                    My Blogs
                                </Button>
                            </>
                        )}
                    </Box>

                    {/* User menu */}
                    <Box sx={{ flexGrow: 0 }}>
                        {isAuthenticated ? (
                            <>
                                <Tooltip title="Open settings">
                                    <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                                        <Avatar alt={user?.username || 'User'} src="/static/images/avatar/2.jpg" />
                                    </IconButton>
                                </Tooltip>
                                <Menu
                                    sx={{ mt: '45px' }}
                                    id="menu-appbar"
                                    anchorEl={anchorElUser}
                                    anchorOrigin={{
                                        vertical: 'top',
                                        horizontal: 'right',
                                    }}
                                    keepMounted
                                    transformOrigin={{
                                        vertical: 'top',
                                        horizontal: 'right',
                                    }}
                                    open={Boolean(anchorElUser)}
                                    onClose={handleCloseUserMenu}
                                >
                                    <MenuItem onClick={() => {
                                        handleCloseUserMenu();
                                        navigate('/profile');
                                    }}>
                                        <ListItemIcon>
                                            <AccountCircle fontSize="small" />
                                        </ListItemIcon>
                                        <ListItemText>Profile</ListItemText>
                                    </MenuItem>
                                    <MenuItem onClick={() => {
                                        handleCloseUserMenu();
                                        navigate('/my-blogs');
                                    }}>
                                        <ListItemIcon>
                                            <Article fontSize="small" />
                                        </ListItemIcon>
                                        <ListItemText>My Blogs</ListItemText>
                                    </MenuItem>
                                    <Divider />
                                    <MenuItem onClick={handleLogout}>
                                        <ListItemIcon>
                                            <Logout fontSize="small" />
                                        </ListItemIcon>
                                        <ListItemText>Logout</ListItemText>
                                    </MenuItem>
                                </Menu>
                            </>
                        ) : (
                            <Button
                                component={RouterLink}
                                to="/login"
                                variant="contained"
                                color="primary"
                            >
                                Sign In
                            </Button>
                        )}
                    </Box>
                </Toolbar>
            </Container>

            {/* Mobile drawer */}
            <Drawer
                anchor="left"
                open={drawerOpen}
                onClose={handleDrawerToggle}
                PaperProps={{
                    sx: { width: 240 }
                }}
            >
                <Box sx={{ p: 2 }}>
                    <Typography variant="h6" color="primary" fontWeight="bold">
                        BLOG APP
                    </Typography>
                </Box>
                <Divider />
                <List>
                    <ListItem button component={RouterLink} to="/" onClick={handleDrawerToggle}>
                        <ListItemIcon>
                            <Home />
                        </ListItemIcon>
                        <ListItemText primary="Home" />
                    </ListItem>

                    {isAuthenticated ? (
                        <>
                            <ListItem button component={RouterLink} to="/blogs/create" onClick={handleDrawerToggle}>
                                <ListItemIcon>
                                    <Create />
                                </ListItemIcon>
                                <ListItemText primary="Create Blog" />
                            </ListItem>
                            <ListItem button component={RouterLink} to="/my-blogs" onClick={handleDrawerToggle}>
                                <ListItemIcon>
                                    <Article />
                                </ListItemIcon>
                                <ListItemText primary="My Blogs" />
                            </ListItem>
                            <ListItem button component={RouterLink} to="/profile" onClick={handleDrawerToggle}>
                                <ListItemIcon>
                                    <AccountCircle />
                                </ListItemIcon>
                                <ListItemText primary="Profile" />
                            </ListItem>
                            <Divider />
                            <ListItem button onClick={() => {
                                handleDrawerToggle();
                                handleLogout();
                            }}>
                                <ListItemIcon>
                                    <Logout />
                                </ListItemIcon>
                                <ListItemText primary="Logout" />
                            </ListItem>
                        </>
                    ) : (
                        <ListItem button component={RouterLink} to="/login" onClick={handleDrawerToggle}>
                            <ListItemIcon>
                                <AccountCircle />
                            </ListItemIcon>
                            <ListItemText primary="Sign In" />
                        </ListItem>
                    )}
                </List>
            </Drawer>
        </AppBar>
    );
};

export default Navbar;
