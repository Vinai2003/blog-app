import React, { useState, useEffect } from 'react';
import {
    Container,
    Typography,
    Box,
    Grid,
    Paper,
    Button,
    Pagination,
    TextField,
    InputAdornment,
    IconButton,
    useTheme,
    useMediaQuery
} from '@mui/material';
import {
    Search as SearchIcon,
    Clear as ClearIcon,
    Create as CreateIcon
} from '@mui/icons-material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { blogAPI } from '../utils/api';
import BlogCard from '../components/blog/BlogCard';
import Spinner from '../components/common/Spinner';
import { useAuth } from '../context/AuthContext';
import DeleteConfirmationDialog from '../components/common/DeleteConfirmationDialog';
import Alert from '../components/common/Alert';

const HomePage: React.FC = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();

    const [blogs, setBlogs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');

    // Add state for delete dialog
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [blogToDelete, setBlogToDelete] = useState<number | null>(null);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [alertOpen, setAlertOpen] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertSeverity, setAlertSeverity] = useState<'success' | 'error'>('success');

    // Handle search input change
    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
    };

    // Clear search
    const handleClearSearch = () => {
        setSearchTerm('');
        setDebouncedSearchTerm('');
    };

    // Debounce search term
    useEffect(() => {
        const timerId = setTimeout(() => {
            setDebouncedSearchTerm(searchTerm);
            setPage(1); // Reset to first page when search changes
        }, 500);

        return () => {
            clearTimeout(timerId);
        };
    }, [searchTerm]);

    // Fetch blogs
    useEffect(() => {
        const fetchBlogs = async () => {
            setLoading(true);
            setError(null);

            try {
                // This is a simplified approach - in a real application, you'd
                // implement proper search on the backend and pass the search term
                const response = await blogAPI.getBlogs(page);

                let filteredBlogs = Array.isArray(response.data.results)
                    ? response.data.results
                    : [];

                // Client-side filtering if search term exists
                if (debouncedSearchTerm) {
                    filteredBlogs = filteredBlogs.filter((blog: any) =>
                        blog.title.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
                        blog.content.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
                    );
                }

                setBlogs(filteredBlogs);
                setTotalPages(Math.ceil(response.data.count / 10)); // Assuming 10 items per page
            } catch (err) {
                console.error('Error fetching blogs:', err);
                setError('Failed to load blogs. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchBlogs();
    }, [page, debouncedSearchTerm]);

    const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
        setPage(value);
        window.scrollTo(0, 0);
    };

    // Handle blog edit
    const handleEditBlog = (id: number) => {
        navigate(`/blogs/${id}/edit`);
    };

    // Handle blog delete click
    const handleDeleteClick = (id: number) => {
        setBlogToDelete(id);
        setDeleteDialogOpen(true);
    };

    // Handle delete confirmation
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

    // Handle close delete dialog
    const handleCloseDeleteDialog = () => {
        setDeleteDialogOpen(false);
        setBlogToDelete(null);
    };

    // Handle close alert
    const handleCloseAlert = () => {
        setAlertOpen(false);
    };

    return (
        <Container maxWidth="lg">
            <Box mb={6}>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <Paper
                        sx={{
                            p: { xs: 3, md: 6 },
                            borderRadius: 3,
                            background: theme => `linear-gradient(45deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                            color: 'white',
                            position: 'relative',
                            overflow: 'hidden'
                        }}
                    >
                        <Box
                            sx={{
                                position: 'absolute',
                                top: 0,
                                right: 0,
                                width: '30%',
                                height: '100%',
                                background: 'rgba(255, 255, 255, 0.1)',
                                clipPath: 'polygon(100% 0, 0 0, 100% 100%)',
                                display: { xs: 'none', md: 'block' }
                            }}
                        />

                        <Typography
                            variant={isMobile ? "h4" : "h3"}
                            component="h1"
                            gutterBottom
                            fontWeight="bold"
                        >
                            Welcome to Blog App
                        </Typography>

                        <Typography variant="h6" sx={{ mb: 4, maxWidth: '80%' }}>
                            Discover stories, ideas, and expertise from writers on various topics
                        </Typography>

                        {isAuthenticated && (
                            <Button
                                component={RouterLink}
                                to="/blogs/create"
                                variant="contained"
                                color="secondary"
                                size="large"
                                startIcon={<CreateIcon />}
                            >
                                Create New Blog
                            </Button>
                        )}
                    </Paper>
                </motion.div>
            </Box>

            <Box mb={4}>
                <TextField
                    fullWidth
                    variant="outlined"
                    placeholder="Search blogs..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon color="action" />
                            </InputAdornment>
                        ),
                        endAdornment: searchTerm && (
                            <InputAdornment position="end">
                                <IconButton onClick={handleClearSearch} edge="end" size="small">
                                    <ClearIcon />
                                </IconButton>
                            </InputAdornment>
                        ),
                        sx: {
                            borderRadius: 2,
                            backgroundColor: theme.palette.background.paper
                        }
                    }}
                />
            </Box>

            {loading ? (
                <Spinner text="Loading blogs..." />
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
                        <Box
                            sx={{
                                textAlign: 'center',
                                py: 8,
                                px: 2,
                                backgroundColor: theme.palette.background.paper,
                                borderRadius: 2
                            }}
                        >
                            <Typography variant="h5" gutterBottom>
                                No blogs found
                            </Typography>
                            <Typography color="text.secondary" paragraph>
                                {debouncedSearchTerm
                                    ? `No results found for "${debouncedSearchTerm}". Try a different search term.`
                                    : 'There are no blogs available yet.'
                                }
                            </Typography>
                            {isAuthenticated && !debouncedSearchTerm && (
                                <Button
                                    component={RouterLink}
                                    to="/blogs/create"
                                    variant="contained"
                                    color="primary"
                                    startIcon={<CreateIcon />}
                                    sx={{ mt: 2 }}
                                >
                                    Create the first blog
                                </Button>
                            )}
                        </Box>
                    ) : (
                        <>
                            <Grid container spacing={3}>
                                {blogs.map((blog) => (
                                    <Grid item xs={12} sm={6} md={4} key={blog.id}>
                                        <BlogCard
                                            blog={blog}
                                            onEdit={handleEditBlog}
                                            onDelete={handleDeleteClick}
                                        />
                                    </Grid>
                                ))}
                            </Grid>

                            {totalPages > 1 && (
                                <Box
                                    display="flex"
                                    justifyContent="center"
                                    mt={6}
                                    mb={2}
                                >
                                    <Pagination
                                        count={totalPages}
                                        page={page}
                                        onChange={handlePageChange}
                                        variant="outlined"
                                        shape="rounded"
                                        color="primary"
                                        size={isMobile ? "small" : "medium"}
                                    />
                                </Box>
                            )}
                        </>
                    )}
                </>
            )}

            {/* Add DeleteConfirmationDialog */}
            <DeleteConfirmationDialog
                open={deleteDialogOpen}
                onClose={handleCloseDeleteDialog}
                onConfirm={handleDeleteConfirm}
                title={blogs.find(blog => blog.id === blogToDelete)?.title || 'this blog'}
                loading={deleteLoading}
            />

            {/* Add Alert component */}
            <Alert
                open={alertOpen}
                message={alertMessage}
                severity={alertSeverity}
                onClose={handleCloseAlert}
            />
        </Container>
    );
};

export default HomePage;
