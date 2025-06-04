import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';
import { motion } from 'framer-motion';

interface SpinnerProps {
    size?: number;
    text?: string;
    fullPage?: boolean;
}

const Spinner: React.FC<SpinnerProps> = ({
                                             size = 40,
                                             text = 'Loading...',
                                             fullPage = false
                                         }) => {
    const content = (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
        >
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    p: 3
                }}
            >
                <CircularProgress
                    size={size}
                    color="primary"
                    thickness={4}
                />
                {text && (
                    <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mt: 2 }}
                    >
                        {text}
                    </Typography>
                )}
            </Box>
        </motion.div>
    );

    if (fullPage) {
        return (
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minHeight: '100vh',
                    width: '100%'
                }}
            >
                {content}
            </Box>
        );
    }

    return content;
};

export default Spinner;
