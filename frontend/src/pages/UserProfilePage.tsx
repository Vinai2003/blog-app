import React, { useState } from 'react';
import {
    Container,
    Box,
    Typography,
    Paper,
    Avatar,
    Grid,
    TextField,
    Button,
    Divider,
    CircularProgress,
    useTheme
} from '@mui/material';
import { AccountCircle, Save } from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../utils/api';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Alert from '../components/common/Alert';
import { motion } from 'framer-motion';

const profileSchema = Yup.object({
    first_name: Yup.string().required('First name is required'),
    last_name: Yup.string().required('Last name is required'),
    email: Yup.string().email('Invalid email').required('Email is required'),
});

const UserProfilePage: React.FC = () => {
    const { user, isAuthenticated } = useAuth();
    const theme = useTheme();

    const [alertOpen, setAlertOpen] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertSeverity, setAlertSeverity] = useState<'success' | 'error'>('success');

    const formik = useFormik({
        initialValues: {
            first_name: user?.first_name || '',
            last_name: user?.last_name || '',
            email: user?.email || '',
        },
        validationSchema: profileSchema,
        enableReinitialize: true,
        onSubmit: async (values, { setSubmitting }) => {
            try {
                await authAPI.updateProfile(values);

                setAlertMessage('Profile updated successfully');
                setAlertSeverity('success');
                setAlertOpen(true);
            } catch (err: any) {
                console.error('Error updating profile:', err);

                setAlertMessage(err.response?.data?.detail || 'Failed to update profile');
                setAlertSeverity('error');
                setAlertOpen(true);
            } finally {
                setSubmitting(false);
            }
        },
    });

    const handleCloseAlert = () => {
        setAlertOpen(false);
    };

    if (!isAuthenticated) {
        return (
            <Container maxWidth="sm">
                <Box textAlign="center" py={8}>
                    <Typography variant="h5" color="error" gutterBottom>
                        Please log in to view your profile
                    </Typography>
                </Box>
            </Container>
        );
    }

    return (
        <Container maxWidth="md">
            <Box mb={6}>
                <Typography
                    variant="h4"
                    component="h1"
                    gutterBottom
                    fontWeight="bold"
                >
                    My Profile
                </Typography>
            </Box>

            <Grid container spacing={4}>
                <Grid item xs={12} md={4}>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <Paper
                            elevation={2}
                            sx={{
                                p: 3,
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                borderRadius: 2
                            }}
                        >
                            <Avatar
                                sx={{
                                    width: 100,
                                    height: 100,
                                    bgcolor: theme.palette.primary.main,
                                    fontSize: '2.5rem',
                                    mb: 2
                                }}
                            >
                                {user?.username?.charAt(0).toUpperCase() || <AccountCircle fontSize="large" />}
                            </Avatar>

                            <Typography variant="h5" gutterBottom>
                                {user?.username}
                            </Typography>

                            <Typography variant="body2" color="text.secondary" gutterBottom>
                                Member since {new Date('2025-04-02').toLocaleDateString()}
                            </Typography>
                        </Paper>
                    </motion.div>
                </Grid>

                <Grid item xs={12} md={8}>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        <Paper
                            elevation={2}
                            sx={{
                                p: 3,
                                borderRadius: 2
                            }}
                        >
                            <Typography variant="h6" gutterBottom fontWeight="medium">
                                Personal Information
                            </Typography>
                            <Divider sx={{ mb: 3 }} />

                            <Box component="form" onSubmit={formik.handleSubmit}>
                                <Grid container spacing={2}>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            fullWidth
                                            id="first_name"
                                            name="first_name"
                                            label="First Name"
                                            value={formik.values.first_name}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            error={formik.touched.first_name && Boolean(formik.errors.first_name)}
                                            helperText={formik.touched.first_name && formik.errors.first_name}
                                        />
                                    </Grid>

                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            fullWidth
                                            id="last_name"
                                            name="last_name"
                                            label="Last Name"
                                            value={formik.values.last_name}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            error={formik.touched.last_name && Boolean(formik.errors.last_name)}
                                            helperText={formik.touched.last_name && formik.errors.last_name}
                                        />
                                    </Grid>

                                    <Grid item xs={12}>
                                        <TextField
                                            fullWidth
                                            id="email"
                                            name="email"
                                            label="Email"
                                            value={formik.values.email}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            error={formik.touched.email && Boolean(formik.errors.email)}
                                            helperText={formik.touched.email && formik.errors.email}
                                        />
                                    </Grid>

                                    <Grid item xs={12}>
                                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                                            <Button
                                                type="submit"
                                                variant="contained"
                                                color="primary"
                                                startIcon={formik.isSubmitting ? <CircularProgress size={20} color="inherit" /> : <Save />}
                                                disabled={formik.isSubmitting}
                                            >
                                                Save Changes
                                            </Button>
                                        </Box>
                                    </Grid>
                                </Grid>
                            </Box>
                        </Paper>
                    </motion.div>
                </Grid>
            </Grid>

            <Alert
                open={alertOpen}
                message={alertMessage}
                severity={alertSeverity}
                onClose={handleCloseAlert}
            />
        </Container>
    );
};

export default UserProfilePage;
