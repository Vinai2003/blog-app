import React from 'react';
import { Box, Container, Typography, Grid, Link, Divider, IconButton, useTheme, useMediaQuery } from '@mui/material';
import { Facebook, Twitter, Instagram, LinkedIn, GitHub } from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';

const Footer: React.FC = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    return (
        <Box
            component="footer"
            sx={{
                py: 6,
                px: 2,
                mt: 'auto',
                backgroundColor: theme.palette.mode === 'light'
                    ? theme.palette.grey[100]
                    : theme.palette.grey[900]
            }}
        >
            <Container maxWidth="lg">
                <Grid container spacing={4} justifyContent="space-between">
                    <Grid item xs={12} sm={4}>
                        <Typography variant="h6" color="primary" gutterBottom>
                            BLOG APP
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Share your thoughts with the world through our blogging platform.
                            Create, read, and engage with content that matters to you.
                        </Typography>
                        <Box sx={{ mt: 2, mb: 2 }}>
                            <IconButton aria-label="facebook" color="primary" size="small">
                                <Facebook />
                            </IconButton>
                            <IconButton aria-label="twitter" color="primary" size="small">
                                <Twitter />
                            </IconButton>
                            <IconButton aria-label="instagram" color="primary" size="small">
                                <Instagram />
                            </IconButton>
                            <IconButton aria-label="linkedin" color="primary" size="small">
                                <LinkedIn />
                            </IconButton>
                            <IconButton aria-label="github" color="primary" size="small">
                                <GitHub />
                            </IconButton>
                        </Box>
                    </Grid>

                    {!isMobile && (
                        <Grid item xs={12} sm={3}>
                            <Typography variant="h6" color="text.primary" gutterBottom>
                                Quick Links
                            </Typography>
                            <Link
                                component={RouterLink}
                                to="/"
                                color="text.secondary"
                                display="block"
                                sx={{ mb: 1 }}
                            >
                                Home
                            </Link>
                            <Link
                                component={RouterLink}
                                to="/blogs"
                                color="text.secondary"
                                display="block"
                                sx={{ mb: 1 }}
                            >
                                All Blogs
                            </Link>
                            <Link
                                component="a"
                                href="#"
                                color="text.secondary"
                                display="block"
                                sx={{ mb: 1 }}
                            >
                                About Us
                            </Link>
                            <Link
                                component="a"
                                href="#"
                                color="text.secondary"
                                display="block"
                                sx={{ mb: 1 }}
                            >
                                Contact
                            </Link>
                        </Grid>
                    )}

                    <Grid item xs={12} sm={3}>
                        <Typography variant="h6" color="text.primary" gutterBottom>
                            Legal
                        </Typography>
                        <Link
                            component="a"
                            href="#"
                            color="text.secondary"
                            display="block"
                            sx={{ mb: 1 }}
                        >
                            Terms of Service
                        </Link>
                        <Link
                            component="a"
                            href="#"
                            color="text.secondary"
                            display="block"
                            sx={{ mb: 1 }}
                        >
                            Privacy Policy
                        </Link>
                        <Link
                            component="a"
                            href="#"
                            color="text.secondary"
                            display="block"
                            sx={{ mb: 1 }}
                        >
                            Cookie Policy
                        </Link>
                    </Grid>
                </Grid>

                <Divider sx={{ my: 3 }} />

                <Typography variant="body2" color="text.secondary" align="center">
                    © {new Date().getFullYear()} Blog App. All rights reserved.
                </Typography>
            </Container>
        </Box>
    );
};

export default Footer;
