import React from 'react';
import { Outlet } from 'react-router-dom';
import { Box, Container, useTheme, useMediaQuery } from '@mui/material';
import Navbar from '../common/Navbar';
import Footer from '../common/Footer';
import { motion } from 'framer-motion';

const BlogLayout: React.FC = () => {
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
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                style={{
                    flexGrow: 1,
                }}
            >
                <Container
                    maxWidth="md"
                    sx={{
                        py: isMobile ? 4 : 8,
                        px: isMobile ? 2 : 4
                    }}
                >
                    <Outlet />
                </Container>
            </motion.main>

            <Footer />
        </Box>
    );
};

export default BlogLayout;
