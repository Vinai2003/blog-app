import React from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
    Box,
    Paper
} from '@mui/material';
import { Error as ErrorIcon } from '@mui/icons-material';
import { motion } from 'framer-motion';

interface DeleteConfirmationDialogProps {
    open: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    confirmButtonText?: string;
    loading?: boolean;
}

const DeleteConfirmationDialog: React.FC<DeleteConfirmationDialogProps> = ({
                                                                               open,
                                                                               onClose,
                                                                               onConfirm,
                                                                               title,
                                                                               confirmButtonText = 'Delete',
                                                                               loading = false
                                                                           }) => {
    // Create a custom animated wrapper for the paper component
    const AnimatedPaper = React.forwardRef<HTMLDivElement>((props, ref) => (
        <Paper {...props} ref={ref} elevation={6} sx={{ borderRadius: 2, p: 1 }} />
    ));

    return (
        <Dialog
            open={open}
            onClose={onClose}
            PaperComponent={AnimatedPaper}
            maxWidth="xs"
            fullWidth
        >
            <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.3 }}
            >
                <DialogTitle sx={{ pb: 1 }}>Confirm Deletion</DialogTitle>
                <DialogContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <ErrorIcon color="error" sx={{ mr: 1, fontSize: 32 }} />
                        <Typography variant="body1">
                            Are you sure you want to delete: <strong>{title}</strong>?
                        </Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                        This action cannot be undone. The item will be permanently deleted.
                    </Typography>
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2 }}>
                    <Button onClick={onClose} disabled={loading}>
                        Cancel
                    </Button>
                    <Button
                        onClick={onConfirm}
                        variant="contained"
                        color="error"
                        disabled={loading}
                    >
                        {loading ? 'Deleting...' : confirmButtonText}
                    </Button>
                </DialogActions>
            </motion.div>
        </Dialog>
    );
};

export default DeleteConfirmationDialog;
