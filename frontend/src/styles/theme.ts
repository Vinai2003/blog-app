import { createTheme, responsiveFontSizes } from '@mui/material/styles';

// Define color palette
const colors = {
    primary: {
        main: '#3f51b5',
        light: '#757de8',
        dark: '#002984',
        contrastText: '#ffffff',
    },
    secondary: {
        main: '#f50057',
        light: '#ff4081',
        dark: '#c51162',
        contrastText: '#ffffff',
    },
    background: {
        default: '#f5f5f5',
        paper: '#ffffff',
        dark: '#121212',
        darkPaper: '#1e1e1e',
    },
    text: {
        primary: '#212121',
        secondary: '#757575',
        disabled: '#9e9e9e',
        hint: '#bdbdbd',
        primaryDark: '#e0e0e0',
        secondaryDark: '#a0a0a0',
    },
    success: {
        main: '#4caf50',
        light: '#81c784',
        dark: '#388e3c',
    },
    error: {
        main: '#f44336',
        light: '#e57373',
        dark: '#d32f2f',
    },
    warning: {
        main: '#ff9800',
        light: '#ffb74d',
        dark: '#f57c00',
    },
    info: {
        main: '#2196f3',
        light: '#64b5f6',
        dark: '#1976d2',
    },
};

// Create base theme
let theme = createTheme({
    palette: {
        mode: 'light',
        primary: colors.primary,
        secondary: colors.secondary,
        background: {
            default: colors.background.default,
            paper: colors.background.paper,
        },
        text: {
            primary: colors.text.primary,
            secondary: colors.text.secondary,
        },
        success: {
            main: colors.success.main,
            light: colors.success.light,
            dark: colors.success.dark,
        },
        error: {
            main: colors.error.main,
            light: colors.error.light,
            dark: colors.error.dark,
        },
        warning: {
            main: colors.warning.main,
            light: colors.warning.light,
            dark: colors.warning.dark,
        },
        info: {
            main: colors.info.main,
            light: colors.info.light,
            dark: colors.info.dark,
        },
    },
    typography: {
        fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
        h1: {
            fontWeight: 700,
            fontSize: '2.5rem',
        },
        h2: {
            fontWeight: 600,
            fontSize: '2rem',
        },
        h3: {
            fontWeight: 600,
            fontSize: '1.75rem',
        },
        h4: {
            fontWeight: 600,
            fontSize: '1.5rem',
        },
        h5: {
            fontWeight: 500,
            fontSize: '1.25rem',
        },
        h6: {
            fontWeight: 500,
            fontSize: '1rem',
        },
        body1: {
            fontSize: '1rem',
            lineHeight: 1.5,
        },
        body2: {
            fontSize: '0.875rem',
            lineHeight: 1.43,
        },
        button: {
            fontWeight: 500,
            fontSize: '0.875rem',
            textTransform: 'none',
        },
    },
    shape: {
        borderRadius: 8,
    },
    spacing: 8,
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    textTransform: 'none',
                    borderRadius: 8,
                    padding: '8px 16px',
                    boxShadow: 'none',
                    '&:hover': {
                        boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.15)',
                    },
                },
                containedPrimary: {
                    '&:hover': {
                        backgroundColor: colors.primary.dark,
                    },
                },
                containedSecondary: {
                    '&:hover': {
                        backgroundColor: colors.secondary.dark,
                    },
                },
                outlined: {
                    borderWidth: '1.5px',
                    '&:hover': {
                        borderWidth: '1.5px',
                    },
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    borderRadius: 12,
                    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.05)',
                    transition: 'all 0.3s ease-in-out',
                    '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: '0px 12px 24px rgba(0, 0, 0, 0.1)',
                    },
                },
            },
        },
        MuiTextField: {
            styleOverrides: {
                root: {
                    '& .MuiOutlinedInput-root': {
                        borderRadius: 8,
                    },
                },
            },
        },
    },
});

// Create dark theme
export const darkTheme = createTheme({
    ...theme,
    palette: {
        ...theme.palette,
        mode: 'dark',
        primary: colors.primary,
        secondary: colors.secondary,
        background: {
            default: colors.background.dark,
            paper: colors.background.darkPaper,
        },
        text: {
            primary: colors.text.primaryDark,
            secondary: colors.text.secondaryDark,
        },
    },
});

// Apply responsive font sizes to theme
theme = responsiveFontSizes(theme);
export const lightTheme = theme;

export default theme;
