import React, { useState } from 'react';
import {
    Box,
    TextField,
    Button,
    Typography,
    InputAdornment,
    IconButton,
    CircularProgress,
    Link,
    Grid,
    Stepper,
    Step,
    StepLabel
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useAuth } from '../../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

// Validation schemas for each step
const stepOneSchema = Yup.object({
    username: Yup.string()
        .min(3, 'Username must be at least 3 characters')
        .max(30, 'Username must be less than 30 characters')
        .required('Username is required'),
    email: Yup.string()
        .email('Invalid email address')
        .required('Email is required')
});

const stepTwoSchema = Yup.object({
    first_name: Yup.string()
        .required('First name is required'),
    last_name: Yup.string()
        .required('Last name is required')
});

const stepThreeSchema = Yup.object({
    password: Yup.string()
        .min(8, 'Password must be at least 8 characters')
        .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
        .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
        .matches(/[0-9]/, 'Password must contain at least one number')
        .matches(/[!@#$%^&*]/, 'Password must contain at least one special character')
        .required('Password is required'),
    password2: Yup.string()
        .oneOf([Yup.ref('password')], 'Passwords must match')
        .required('Password confirmation is required')
});

const steps = ['Account', 'Personal', 'Security'];

const RegisterForm: React.FC = () => {
    const [activeStep, setActiveStep] = useState(0);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const { register } = useAuth();
    const navigate = useNavigate();
    const [error, setError] = useState<string | null>(null);

    const formik = useFormik({
        initialValues: {
            username: '',
            email: '',
            first_name: '',
            last_name: '',
            password: '',
            password2: ''
        },
        validationSchema:
            activeStep === 0 ? stepOneSchema :
                activeStep === 1 ? stepTwoSchema :
                    stepThreeSchema,
        validateOnMount: true,
        // Update the onSubmit function in the formik config
        onSubmit: async (values, { setSubmitting }) => {
            if (activeStep < 2) {
                setActiveStep(activeStep + 1);
                setSubmitting(false);
                return;
            }

            setError(null);
            try {
                // Log the data being sent
                console.log('Registration data:', values);

                // Ensure data structure matches backend expectations
                const userData = {
                    username: values.username,
                    email: values.email,
                    first_name: values.first_name,
                    last_name: values.last_name,
                    password: values.password,
                    password2: values.password2
                };

                await register(userData);
                navigate('/');
            } catch (err: any) {
                console.error('Registration error:', err.response?.data || err.message);
                setError(err.message || 'Registration failed. Please try again.');
            } finally {
                setSubmitting(false);
            }
        }
    });

    const handleBack = () => {
        setActiveStep(activeStep - 1);
    };

    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const handleClickShowConfirmPassword = () => {
        setShowConfirmPassword(!showConfirmPassword);
    };

    const getStepContent = (step: number) => {
        switch (step) {
            case 0:
                return (
                    <motion.div
                        key="step1"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="username"
                            label="Username"
                            name="username"
                            autoComplete="username"
                            autoFocus
                            value={formik.values.username}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.username && Boolean(formik.errors.username)}
                            helperText={formik.touched.username && formik.errors.username}
                        />

                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label="Email Address"
                            name="email"
                            autoComplete="email"
                            value={formik.values.email}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.email && Boolean(formik.errors.email)}
                            helperText={formik.touched.email && formik.errors.email}
                        />
                    </motion.div>
                );
            case 1:
                return (
                    <motion.div
                        key="step2"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="first_name"
                            label="First Name"
                            name="first_name"
                            autoComplete="given-name"
                            autoFocus
                            value={formik.values.first_name}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.first_name && Boolean(formik.errors.first_name)}
                            helperText={formik.touched.first_name && formik.errors.first_name}
                        />

                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="last_name"
                            label="Last Name"
                            name="last_name"
                            autoComplete="family-name"
                            value={formik.values.last_name}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.last_name && Boolean(formik.errors.last_name)}
                            helperText={formik.touched.last_name && formik.errors.last_name}
                        />
                    </motion.div>
                );
            case 2:
                return (
                    <motion.div
                        key="step3"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Password"
                            type={showPassword ? 'text' : 'password'}
                            id="password"
                            autoComplete="new-password"
                            value={formik.values.password}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.password && Boolean(formik.errors.password)}
                            helperText={formik.touched.password && formik.errors.password}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label="toggle password visibility"
                                            onClick={handleClickShowPassword}
                                            edge="end"
                                        >
                                            {showPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                )
                            }}
                        />

                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="password2"
                            label="Confirm Password"
                            type={showConfirmPassword ? 'text' : 'password'}
                            id="password2"
                            autoComplete="new-password"
                            value={formik.values.password2}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.password2 && Boolean(formik.errors.password2)}
                            helperText={formik.touched.password2 && formik.errors.password2}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label="toggle password visibility"
                                            onClick={handleClickShowConfirmPassword}
                                            edge="end"
                                        >
                                            {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                )
                            }}
                        />
                    </motion.div>
                );
            default:
                return null;
        }
    };

    return (
        <Box>
            <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
                {steps.map((label) => (
                    <Step key={label}>
                        <StepLabel>{label}</StepLabel>
                    </Step>
                ))}
            </Stepper>

            <Box component="form" onSubmit={formik.handleSubmit} noValidate>
                <AnimatePresence mode="wait">
                    {getStepContent(activeStep)}
                </AnimatePresence>

                {error && (
                    <Typography color="error" variant="body2" sx={{ mt: 2 }}>
                        {error}
                    </Typography>
                )}

                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3, mb: 2 }}>
                    <Button
                        disabled={activeStep === 0}
                        onClick={handleBack}
                        variant="outlined"
                    >
                        Back
                    </Button>

                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        disabled={
                            formik.isSubmitting ||
                            (activeStep === 0 && (Boolean(formik.errors.username) || Boolean(formik.errors.email))) ||
                            (activeStep === 1 && (Boolean(formik.errors.first_name) || Boolean(formik.errors.last_name))) ||
                            (activeStep === 2 && (Boolean(formik.errors.password) || Boolean(formik.errors.password2)))
                        }
                    >
                        {formik.isSubmitting ? (
                            <CircularProgress size={24} color="inherit" />
                        ) : (
                            activeStep === steps.length - 1 ? 'Register' : 'Next'
                        )}
                    </Button>
                </Box>

                <Box textAlign="center" mt={2}>
                    <Typography variant="body2">
                        Already have an account?{' '}
                        <Link
                            component={RouterLink}
                            to="/login"
                            color="primary"
                            fontWeight="medium"
                        >
                            Sign In
                        </Link>
                    </Typography>
                </Box>
            </Box>
        </Box>
    );
};

export default RegisterForm;
