import React from 'react';
import {
    Card,
    CardContent,
    CardMedia,
    Typography,
    Box,
    Avatar,
    Chip,
    IconButton,
    Menu,
    MenuItem,
    ListItemIcon,
    CardActionArea,
    useTheme,
    alpha
} from '@mui/material';
import {
    MoreVert,
    Delete,
    Edit,
    AccessTime,
    Person
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';

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

interface BlogCardProps {
    blog: Blog;
    onDelete?: (id: number) => void;
    onEdit?: (id: number) => void;
}

const BlogCard: React.FC<BlogCardProps> = ({ blog, onDelete, onEdit }) => {
    const theme = useTheme();
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();

    // For the card menu
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        event.stopPropagation();
        setAnchorEl(event.currentTarget);
    };

    // Fix: Correct type signature for handleClose
    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleCloseWithEvent = (event?: React.MouseEvent<HTMLElement>) => {
        if (event) {
            event.stopPropagation();
        }
        handleClose();
    };

    const handleEdit = (event: React.MouseEvent<HTMLElement>) => {
        event.stopPropagation();
        handleClose();
        if (onEdit) {
            onEdit(blog.id);
        } else {
            navigate(`/blogs/${blog.id}/edit`);
        }
    };

    const handleDelete = (event: React.MouseEvent<HTMLElement>) => {
        event.stopPropagation();
        handleClose();
        if (onDelete) {
            onDelete(blog.id);
        }
    };

    const handleCardClick = () => {
        navigate(`/blogs/${blog.id}`);
    };

    // Function to generate a random placeholder image
    const getPlaceholderImage = (id: number) => {
        const colors = [
            '#3f51b5', '#f50057', '#00bcd4', '#4caf50', '#ff9800',
            '#9c27b0', '#2196f3', '#ff5722', '#009688', '#673ab7'
        ];
        const colorIndex = id % colors.length;
        return colors[colorIndex];
    };

    // Extract first 150 characters of content for preview
    const contentPreview = blog.content.substring(0, 150) + (blog.content.length > 150 ? '...' : '');

    // Format date
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        }).format(date);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            whileHover={{ y: -5 }}
        >
            <Card
                sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    position: 'relative',
                    overflow: 'hidden'
                }}
            >
                <CardActionArea onClick={handleCardClick}>
                    <Box
                        sx={{
                            position: 'relative',
                            overflow: 'hidden',
                            paddingTop: '56.25%', // 16:9 aspect ratio
                            backgroundColor: getPlaceholderImage(blog.id)
                        }}
                    >
                        <Typography
                            variant="h5"
                            component="div"
                            sx={{
                                position: 'absolute',
                                top: '50%',
                                left: '50%',
                                transform: 'translate(-50%, -50%)',
                                color: 'white',
                                fontWeight: 'bold',
                                textAlign: 'center',
                                textShadow: '1px 1px 3px rgba(0,0,0,0.6)',
                                px: 3
                            }}
                        >
                            {blog.title.charAt(0).toUpperCase()}
                        </Typography>
                    </Box>

                    <CardContent sx={{ flexGrow: 1, pb: 1 }}>
                        <Typography
                            gutterBottom
                            variant="h6"
                            component="div"
                            sx={{ fontWeight: 'bold', mb: 1 }}
                        >
                            {blog.title}
                        </Typography>

                        <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{
                                mb: 2,
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                display: '-webkit-box',
                                WebkitLineClamp: 3,
                                WebkitBoxOrient: 'vertical',
                            }}
                            dangerouslySetInnerHTML={{ __html: contentPreview }}
                        />

                        <Box
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1,
                                mb: 1
                            }}
                        >
                            <Avatar
                                sx={{
                                    width: 24,
                                    height: 24,
                                    bgcolor: theme.palette.primary.main,
                                    fontSize: '0.8rem'
                                }}
                            >
                                {blog.author.username.charAt(0).toUpperCase()}
                            </Avatar>
                            <Typography variant="caption" color="text.secondary">
                                {blog.author.username}
                            </Typography>
                        </Box>

                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                <AccessTime fontSize="small" color="action" sx={{ fontSize: 16 }} />
                                <Typography variant="caption" color="text.secondary">
                                    {formatDate(blog.created_at)}
                                </Typography>
                            </Box>
                        </Box>
                    </CardContent>
                </CardActionArea>

                {isAuthenticated && blog.is_author && (
                    <Box
                        sx={{
                            position: 'absolute',
                            top: 8,
                            right: 8,
                            zIndex: 1,
                            backgroundColor: alpha(theme.palette.background.paper, 0.8),
                            borderRadius: '50%'
                        }}
                    >
                        <IconButton
                            aria-label="more"
                            id={`blog-${blog.id}-menu-button`}
                            aria-controls={open ? `blog-${blog.id}-menu` : undefined}
                            aria-expanded={open ? 'true' : undefined}
                            aria-haspopup="true"
                            onClick={handleClick}
                            size="small"
                        >
                            <MoreVert fontSize="small" />
                        </IconButton>
                        <Menu
                            id={`blog-${blog.id}-menu`}
                            anchorEl={anchorEl}
                            open={open}
                            onClose={handleClose} // Fixed: use the simple handleClose function
                            MenuListProps={{
                                'aria-labelledby': `blog-${blog.id}-menu-button`,
                            }}
                        >
                            <MenuItem onClick={handleEdit}>
                                <ListItemIcon>
                                    <Edit fontSize="small" />
                                </ListItemIcon>
                                Edit
                            </MenuItem>
                            <MenuItem onClick={handleDelete}>
                                <ListItemIcon>
                                    <Delete fontSize="small" />
                                </ListItemIcon>
                                Delete
                            </MenuItem>
                        </Menu>
                    </Box>
                )}
            </Card>
        </motion.div>
    );
};

export default BlogCard;
