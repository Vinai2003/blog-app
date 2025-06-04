import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Box, Typography, Button, useTheme, useMediaQuery } from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import { blogAPI } from '../utils/api';
import BlogForm from '../components/blog/BlogForm';
import Spinner from '../components/common/Spinner';
import Alert from '../components/common/Alert';

const EditBlogPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const [blog, setBlog] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [alertOpen, setAlertOpen] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertSeverity, setAlertSeverity] = useState<'success' | 'error'>('success');

    useEffect(() => {
        const fetchBlog = async () => {
            if (!id) return;

            setLoading(true);
            setError(null);

            try {
                const response = await blogAPI.getBlog(parseInt(id));
                setBlog(response.data);

                // Check if user is author
                if (!response.data.is_author) {
                    setError('You do not have permission to edit this blog');
                    navigate(`/blogs/${id}`);
                }
            } catch (err: any) {
                console.error('Error fetching blog:', err);
                setError(err.response?.data?.detail || 'Failed to load blog. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        fetchBlog();
    }, [id, navigate]);

    const handleSubmit = async (values: { title: string; content: string }) => {
        if (!id) return;

        try {
            await blogAPI.updateBlog(parseInt(id), values);

            setAlertMessage('Blog updated successfully');
            setAlertSeverity('success');
            setAlertOpen(true);

            // Navigate after a short delay
            setTimeout(() => {
                navigate(`/blogs/${id}`);
            }, 1500);
        } catch (err: any) {
            console.error('Error updating blog:', err);

            setAlertMessage(err.response?.data?.detail || 'Failed to update blog');
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
                    Edit Blog
                </Typography>
            </Box>

            {loading ? (
                <Spinner text="Loading blog..." />
            ) : error ? (
                <Box textAlign="center" py={4}>
                    <Typography color="error" variant="h6" gutterBottom>
                        {error}
                    </Typography>
                    <Button
                        variant="contained"
                        onClick={() => navigate('/my-blogs')}
                        sx={{ mt: 2 }}
                    >
                        Go to My Blogs
                    </Button>
                </Box>
            ) : blog ? (
                <BlogForm
                    initialValues={{
                        title: blog.title,
                        content: blog.content
                    }}
                    onSubmit={handleSubmit}
                    isEdit
                />
            ) : null}

            <Alert
                open={alertOpen}
                message={alertMessage}
                severity={alertSeverity}
                onClose={handleCloseAlert}
            />
        </Container>
    );
};

export default EditBlogPage;
