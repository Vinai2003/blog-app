import React from 'react';
import {
    Box,
    Typography,
    Divider,
    Avatar,
    Chip,
    Paper,
    Button,
    useTheme,
    useMediaQuery
} from '@mui/material';
import {
    AccessTime,
    Edit,
    Delete
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

// Define the Blog type
interface Blog {
    id: number;
    title: string;
    content: string;
    author: {
        id: number;
        username: string;
        email: string;
    };
    created_at: string;
    updated_at: string;
    is_author: boolean;
}

interface BlogDetailProps {
    blog: Blog;
    onDelete?: (id: number) => void;
}

const BlogDetail: React.FC<BlogDetailProps> = ({ blog, onDelete }) => {
    const theme = useTheme();
    const navigate = useNavigate();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    // Format date
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        }).format(date);
    };

    const handleEdit = () => {
        navigate(`/blogs/${blog.id}/edit`);
    };

    const handleDelete = () => {
        if (onDelete) {
            onDelete(blog.id);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            <Paper
                elevation={2}
                sx={{
                    p: { xs: 2, sm: 4 },
                    borderRadius: 2,
                    overflow: 'hidden'
                }}
            >
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                >
                    <Typography
                        variant={isMobile ? "h4" : "h3"}
                        component="h1"
                        gutterBottom
                        fontWeight="bold"
                    >
                        {blog.title}
                    </Typography>
                </motion.div>

                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        flexWrap: 'wrap',
                        gap: 2,
                        mb: 3
                    }}
                >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Avatar
                            sx={{
                                bgcolor: theme.palette.primary.main,
                            }}
                        >
                            {blog.author.username.charAt(0).toUpperCase()}
                        </Avatar>
                        <Typography variant="body2">
                            {blog.author.username}
                        </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <AccessTime fontSize="small" color="action" />
                        <Typography variant="body2" color="text.secondary">
                            {formatDate(blog.created_at)}
                        </Typography>
                    </Box>

                    {blog.is_author && (
                        <Box sx={{ display: 'flex', gap: 1, ml: 'auto' }}>
                            <Button
                                startIcon={<Edit />}
                                variant="outlined"
                                size="small"
                                onClick={handleEdit}
                            >
                                Edit
                            </Button>
                            <Button
                                startIcon={<Delete />}
                                variant="outlined"
                                color="error"
                                size="small"
                                onClick={handleDelete}
                            >
                                Delete
                            </Button>
                        </Box>
                    )}
                </Box>

                <Divider sx={{ mb: 4 }} />

                <Box
                    sx={{
                        typography: 'body1',
                        lineHeight: 1.8,
                        '& img': {
                            maxWidth: '100%',
                            height: 'auto',
                            borderRadius: 1
                        },
                        '& h1, & h2, & h3, & h4, & h5, & h6': {
                            my: 2,
                            fontWeight: 'bold'
                        },
                        '& blockquote': {
                            borderLeft: `4px solid ${theme.palette.primary.main}`,
                            pl: 2,
                            py: 0.5,
                            my: 2,
                            color: 'text.secondary',
                            fontStyle: 'italic'
                        },
                        '& ul, & ol': {
                            pl: 3
                        },
                        '& li': {
                            mb: 1
                        },
                        '& a': {
                            color: 'primary.main',
                            textDecoration: 'none',
                            '&:hover': {
                                textDecoration: 'underline'
                            }
                        }
                    }}
                    dangerouslySetInnerHTML={{ __html: blog.content }}
                />
            </Paper>
        </motion.div>
    );
};

export default BlogDetail;
