import React, { useState, useEffect } from 'react';
import {
    Snackbar,
    Alert as MuiAlert,
    AlertColor,
    Slide,
    SlideProps
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';

interface AlertProps {
    open: boolean;
    message: string;
    severity: AlertColor;
    onClose: () => void;
    autoHideDuration?: number;
}

function SlideTransition(props: SlideProps) {
    return <Slide {...props} direction="left" />;
}

const Alert: React.FC<AlertProps> = ({
                                         open,
                                         message,
                                         severity,
                                         onClose,
                                         autoHideDuration = 6000
                                     }) => {
    const [isVisible, setIsVisible] = useState(open);

    useEffect(() => {
        setIsVisible(open);
    }, [open]);

    const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }

        setIsVisible(false);
        setTimeout(() => {
            onClose();
        }, 300); // Give time for animation to complete
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 50 }}
                    transition={{ duration: 0.3 }}
                >
                    <Snackbar
                        open={isVisible}
                        autoHideDuration={autoHideDuration}
                        onClose={handleClose}
                        TransitionComponent={SlideTransition}
                        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                    >
                        <MuiAlert
                            elevation={6}
                            variant="filled"
                            onClose={handleClose}
                            severity={severity}
                            sx={{ width: '100%' }}
                        >
                            {message}
                        </MuiAlert>
                    </Snackbar>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default Alert;
