import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Box, Typography, Button, useTheme, useMediaQuery } from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import { blogAPI } from '../utils/api';
import BlogForm from '../components/blog/BlogForm';
import Alert from '../components/common/Alert';

const CreateBlogPage: React.FC = () => {
    const navigate = useNavigate();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const [alertOpen, setAlertOpen] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertSeverity, setAlertSeverity] = useState<'success' | 'error'>('success');

    const handleSubmit = async (values: { title: string; content: string }) => {
        try {
            const response = await blogAPI.createBlog(values);
            console.log("Blog creation response:", response.data); // Debug log

            setAlertMessage('Blog created successfully');
            setAlertSeverity('success');
            setAlertOpen(true);

            // Verify the blog ID is valid before navigating
            if (response.data && response.data.id && !isNaN(response.data.id)) {
                // Navigate to the new blog after a short delay
                setTimeout(() => {
                    navigate(`/blogs/${response.data.id}`);
                }, 1500);
            } else {
                console.error("Invalid blog ID in response:", response.data);
                setTimeout(() => {
                    // Navigate to my-blogs page as fallback
                    navigate('/my-blogs');
                }, 1500);
            }
        } catch (err: any) {
            console.error('Error creating blog:', err);

            setAlertMessage(err.response?.data?.detail || 'Failed to create blog');
            setAlertSeverity('error');
            setAlertOpen(true);

            throw err;
        }
    };

    const handleCloseAlert = () => {
        setAlertOpen(false);
    };

    return (
        <Container maxWidth="md">
            {/* Updated Box with proper top padding for mobile */}
            <Box
                mb={4}
                pt={isMobile ? 7 : 2} // Add more top padding on mobile
            >
                <Button
                    startIcon={<ArrowBack />}
                    onClick={() => navigate(-1)}
                    sx={{ mb: 2 }}
                >
                    Back
                </Button>

                <Typography
                    variant="h4"
                    component="h1"
                    gutterBottom
                    fontWeight="bold"
                >
                    Create New Blog
                </Typography>
            </Box>

            <BlogForm onSubmit={handleSubmit} />

            <Alert
                open={alertOpen}
                message={alertMessage}
                severity={alertSeverity}
                onClose={handleCloseAlert}
            />
        </Container>
    );
};

export default CreateBlogPage;
