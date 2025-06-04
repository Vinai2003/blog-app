import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Box, Typography, Button, useTheme, useMediaQuery } from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import { blogAPI } from '../utils/api';
import BlogDetail from '../components/blog/BlogDetail';
import Spinner from '../components/common/Spinner';
import DeleteConfirmationDialog from '../components/common/DeleteConfirmationDialog';
import Alert from '../components/common/Alert';

const BlogDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const [blog, setBlog] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);
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
            } catch (err: any) {
                console.error('Error fetching blog:', err);
                setError(err.response?.data?.detail || 'Failed to load blog. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        fetchBlog();
    }, [id]);

    const handleDelete = async () => {
        if (!id) return;

        setDeleteLoading(true);

        try {
            await blogAPI.deleteBlog(parseInt(id));
            setDeleteDialogOpen(false);

            setAlertMessage('Blog deleted successfully');
            setAlertSeverity('success');
            setAlertOpen(true);

            // Navigate after a short delay to show the alert
            setTimeout(() => {
                navigate('/my-blogs');
            }, 1500);
        } catch (err: any) {
            console.error('Error deleting blog:', err);
            setDeleteDialogOpen(false);

            setAlertMessage(err.response?.data?.detail || 'Failed to delete blog');
            setAlertSeverity('error');
            setAlertOpen(true);
        } finally {
            setDeleteLoading(false);
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
                pt={isMobile ? 7 : 2} // Add more top padding on mobile to account for the navbar
            >
                <Button
                    startIcon={<ArrowBack />}
                    onClick={() => navigate(-1)}
                    sx={{ mb: 2 }}
                >
                    Back
                </Button>
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
                        onClick={() => window.location.reload()}
                        sx={{ mt: 2 }}
                    >
                        Retry
                    </Button>
                </Box>
            ) : blog ? (
                <BlogDetail
                    blog={blog}
                    onDelete={() => setDeleteDialogOpen(true)}
                />
            ) : null}

            <DeleteConfirmationDialog
                open={deleteDialogOpen}
                onClose={() => setDeleteDialogOpen(false)}
                onConfirm={handleDelete}
                title={blog?.title || 'this blog'}
                loading={deleteLoading}
            />

            <Alert
                open={alertOpen}
                message={alertMessage}
                severity={alertSeverity}
                onClose={handleCloseAlert}
            />
        </Container>
    );
};

export default BlogDetailPage;
