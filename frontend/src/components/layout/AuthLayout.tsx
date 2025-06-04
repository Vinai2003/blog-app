import React from 'react';
import { Outlet } from 'react-router-dom';
import {
    Box,
    Container,
    Paper,
    Typography,
    useTheme,
    useMediaQuery
} from '@mui/material';
import { motion } from 'framer-motion';

const AuthLayout: React.FC = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    return (
        <Box
            sx={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: theme.palette.primary.main,
                backgroundImage: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                padding: theme.spacing(2)
            }}
        >
            <Container maxWidth="sm">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <Paper
                        elevation={isMobile ? 2 : 10}
                        sx={{
                            padding: isMobile ? theme.spacing(3) : theme.spacing(5),
                            borderRadius: theme.shape.borderRadius * 2,
                            boxShadow: theme.shadows[10]
                        }}
                    >
                        <Box mb={4} textAlign="center">
                            <Typography
                                variant="h4"
                                component="h1"
                                fontWeight="bold"
                                color="primary"
                                sx={{ mb: 1 }}
                            >
                                Blog App
                            </Typography>
                            <Typography variant="body1" color="text.secondary">
                                Share your thoughts with the world
                            </Typography>
                        </Box>

                        <Outlet />
                    </Paper>
                </motion.div>
            </Container>
        </Box>
    );
};

export default AuthLayout;
