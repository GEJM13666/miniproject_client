// theme.ts
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    palette: {
        primary: {
            main: '#1976d2', // Your primary color
        },
        secondary: {
            main: '#dc004e', // Your secondary color
        },
        background: {
            default: '#f4f6f8', // Default background color
            paper: '#ffffff', // Paper background color
        },
    },
    typography: {
        fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
        h4: {
            fontWeight: 600,
        },
    },
});

export default theme;
