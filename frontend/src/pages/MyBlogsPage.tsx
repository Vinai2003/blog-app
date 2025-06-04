import React, { useState, useEffect } from 'react';
import {
    Container,
    Typography,
    Box,
    Grid,
    Paper,
    Button,
    useTheme,
    useMediaQuery
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { blogAPI } from '../utils/api';
import BlogCard from '../components/blog/BlogCard';
import Spinner from '../components/common/Spinner';
import { useAuth } from '../context/AuthContext';
import DeleteConfirmationDialog from '../components/common/DeleteConfirmationDialog';
import Alert from '../components/common/Alert';

const MyBlogsPage: React.FC = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();

    const [blogs, setBlogs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [blogToDelete, setBlogToDelete] = useState<number | null>(null);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [alertOpen, setAlertOpen] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertSeverity, setAlertSeverity] = useState<'success' | 'error'>('success');

    // Fetch user's blogs
    useEffect(() => {
        const fetchBlogs = async () => {
            if (!isAuthenticated) return;

            setLoading(true);
            setError(null);

            try {
                const response = await blogAPI.getUserBlogs();
                console.log('API Response:', response.data); // Add this to debug

                // Ensure blogs is an array before setting state
                if (Array.isArray(response.data)) {
                    setBlogs(response.data);
                } else if (response.data && typeof response.data === 'object') {
                    // If response is an object with results property (Django REST common pattern)
                    if (Array.isArray(response.data.results)) {
                        setBlogs(response.data.results);
                    } else {
                        // If it's some other object, convert to array or set empty array
                        console.error('Unexpected response structure:', response.data);
                        setBlogs([]);
                        setError('Received unexpected data structure from server');
                    }
                } else {
                    setBlogs([]);
                    setError('Received invalid data from server');
                }
            } catch (err: any) {
                console.error('Error fetching blogs:', err);
                setError(err.response?.data?.detail || 'Failed to load blogs. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        fetchBlogs();
    }, [isAuthenticated]);

    const handleEditBlog = (id: number) => {
        navigate(`/blogs/${id}/edit`);
    };

    const handleDeleteClick = (id: number) => {
        setBlogToDelete(id);
        setDeleteDialogOpen(true);
    };

    const handleDeleteConfirm = async () => {
        if (blogToDelete === null) return;

        setDeleteLoading(true);

        try {
            await blogAPI.deleteBlog(blogToDelete);

            // Remove blog from state
            setBlogs(blogs.filter(blog => blog.id !== blogToDelete));

            setAlertMessage('Blog deleted successfully');
            setAlertSeverity('success');
            setAlertOpen(true);
        } catch (err: any) {
            console.error('Error deleting blog:', err);

            setAlertMessage(err.response?.data?.detail || 'Failed to delete blog');
            setAlertSeverity('error');
            setAlertOpen(true);
        } finally {
            setDeleteLoading(false);
            setDeleteDialogOpen(false);
            setBlogToDelete(null);
        }
    };

    const handleCloseDeleteDialog = () => {
        setDeleteDialogOpen(false);
        setBlogToDelete(null);
    };

    const handleCloseAlert = () => {
        setAlertOpen(false);
    };

    if (!isAuthenticated) {
        return (
            <Container maxWidth="sm">
                <Box textAlign="center" py={8}>
                    <Typography variant="h5" color="error" gutterBottom>
                        Please log in to view your blogs
                    </Typography>
                    <Button
                        component={RouterLink}
                        to="/login"
                        variant="contained"
                        color="primary"
                        sx={{ mt: 2 }}
                    >
                        Login
                    </Button>
                </Box>
            </Container>
        );
    }

    return (
        <Container maxWidth="lg">
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    mb: 4
                }}
            >
                <Typography
                    variant={isMobile ? "h5" : "h4"}
                    component="h1"
                    fontWeight="bold"
                >
                    My Blogs
                </Typography>

                <Button
                    component={RouterLink}
                    to="/blogs/create"
                    variant="contained"
                    color="primary"
                    startIcon={<AddIcon />}
                    sx={{ mt: isMobile ? 2 : 0 }}
                >
                    Create New Blog
                </Button>
            </Box>

            {loading ? (
                <Spinner text="Loading your blogs..." />
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
            ) : (
                <>
                    {blogs.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            <Paper
                                sx={{
                                    p: 4,
                                    textAlign: 'center',
                                    borderRadius: 2
                                }}
                            >
                                <Typography variant="h6" gutterBottom>
                                    You haven't created any blogs yet
                                </Typography>
                                <Typography color="text.secondary" paragraph>
                                    Create your first blog post to share your thoughts with the world
                                </Typography>
                                <Button
                                    component={RouterLink}
                                    to="/blogs/create"
                                    variant="contained"
                                    color="primary"
                                    startIcon={<AddIcon />}
                                >
                                    Create Blog
                                </Button>
                            </Paper>
                        </motion.div>
                    ) : (
                        <Grid container spacing={3}>
                            {Array.isArray(blogs) && blogs.map((blog) => (
                                <Grid item xs={12} sm={6} md={4} key={blog.id}>
                                    <BlogCard
                                        blog={blog}
                                        onEdit={handleEditBlog}
                                        onDelete={handleDeleteClick}
                                    />
                                </Grid>
                            ))}
                        </Grid>
                    )}
                </>
            )}

            <DeleteConfirmationDialog
                open={deleteDialogOpen}
                onClose={handleCloseDeleteDialog}
                onConfirm={handleDeleteConfirm}
                title={blogs.find(blog => blog.id === blogToDelete)?.title || 'this blog'}
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

export default MyBlogsPage;
