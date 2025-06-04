import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Box, useMediaQuery, useTheme } from '@mui/material';
import Navbar from '../common/Navbar';
import Footer from '../common/Footer';
import { motion } from 'framer-motion';

const MainLayout: React.FC = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    return (
        <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            minHeight: '100vh',
            backgroundColor: theme.palette.background.default
        }}>
            <Navbar />

            <motion.main
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                style={{
                    flexGrow: 1,
                    padding: isMobile ? theme.spacing(2) : theme.spacing(4),
                    paddingTop: isMobile ? theme.spacing(8) : theme.spacing(12),
                    paddingBottom: theme.spacing(8)
                }}
            >
                <Outlet />
            </motion.main>

            <Footer />
        </Box>
    );
};

export default MainLayout;
