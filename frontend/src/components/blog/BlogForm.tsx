import React, { useState } from 'react';
import {
    Box,
    TextField,
    Button,
    Typography,
    CircularProgress,
    Paper,
    InputLabel,
    FormHelperText
} from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useAuth } from '../../context/AuthContext';
import { motion } from 'framer-motion';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

interface BlogFormProps {
    initialValues?: {
        title: string;
        content: string;
    };
    onSubmit: (values: { title: string; content: string }) => Promise<void>;
    isEdit?: boolean;
}

const blogSchema = Yup.object({
    title: Yup.string()
        .required('Title is required')
        .min(3, 'Title must be at least 3 characters')
        .max(200, 'Title must be less than 200 characters'),
    content: Yup.string()
        .required('Content is required')
        .min(10, 'Content must be at least 10 characters')
});

const BlogForm: React.FC<BlogFormProps> = ({
                                               initialValues = { title: '', content: '' },
                                               onSubmit,
                                               isEdit = false
                                           }) => {
    const { user } = useAuth();
    const [error, setError] = useState<string | null>(null);

    const quillModules = {
        toolbar: [
            [{ 'header': [1, 2, 3, false] }],
            ['bold', 'italic', 'underline', 'strike', 'blockquote'],
            [{'list': 'ordered'}, {'list': 'bullet'},
                {'indent': '-1'}, {'indent': '+1'}],
            ['link', 'image'],
            ['clean']
        ],
    };

    const quillFormats = [
        'header',
        'bold', 'italic', 'underline', 'strike', 'blockquote',
        'list', 'bullet', 'indent',
        'link', 'image'
    ];

    const formik = useFormik({
        initialValues,
        validationSchema: blogSchema,
        onSubmit: async (values, { setSubmitting }) => {
            setError(null);
            try {
                await onSubmit(values);
            } catch (err: any) {
                setError(err.message || 'Failed to save blog. Please try again.');
            } finally {
                setSubmitting(false);
            }
        }
    });

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
                <Typography
                    variant="h5"
                    component="h1"
                    gutterBottom
                    fontWeight="bold"
                    color="primary"
                >
                    {isEdit ? 'Edit Blog' : 'Create New Blog'}
                </Typography>

                <Box component="form" onSubmit={formik.handleSubmit} noValidate>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="title"
                        label="Blog Title"
                        name="title"
                        autoFocus
                        value={formik.values.title}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.title && Boolean(formik.errors.title)}
                        helperText={formik.touched.title && formik.errors.title}
                    />

                    <Box sx={{ mt: 2, mb: 1 }}>
                        <InputLabel
                            htmlFor="content"
                            required
                            error={formik.touched.content && Boolean(formik.errors.content)}
                            sx={{ mb: 1 }}
                        >
                            Content
                        </InputLabel>
                        <Box
                            sx={{
                                border: theme =>
                                    formik.touched.content && Boolean(formik.errors.content)
                                        ? `1px solid ${theme.palette.error.main}`
                                        : `1px solid ${theme.palette.divider}`,
                                borderRadius: 1,
                                '& .ql-container': {
                                    fontSize: '1rem',
                                },
                                '& .ql-editor': {
                                    minHeight: '300px',
                                }
                            }}
                        >
                            <ReactQuill
                                theme="snow"
                                modules={quillModules}
                                formats={quillFormats}
                                value={formik.values.content}
                                onChange={(value) => formik.setFieldValue('content', value)}
                                onBlur={() => formik.setFieldTouched('content', true)}
                            />
                        </Box>
                        {formik.touched.content && Boolean(formik.errors.content) && (
                            <FormHelperText error>
                                {formik.errors.content as string}
                            </FormHelperText>
                        )}
                    </Box>

                    {error && (
                        <Typography color="error" variant="body2" sx={{ mt: 2 }}>
                            {error}
                        </Typography>
                    )}

                    <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end' }}>
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            size="large"
                            disabled={formik.isSubmitting}
                        >
                            {formik.isSubmitting ? (
                                <CircularProgress size={24} color="inherit" />
                            ) : (
                                isEdit ? 'Update' : 'Publish'
                            )}
                        </Button>
                    </Box>
                </Box>
            </Paper>
        </motion.div>
    );
};

export default BlogForm;
