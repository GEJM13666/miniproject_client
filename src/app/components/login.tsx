import React, { useEffect, useState } from 'react';
import {
    TextField,
    Button,
    Container,
    Snackbar,
} from '@mui/material';
import MuiAlert, { AlertProps } from '@mui/material/Alert';
import { useUser } from '../UserContext';

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState({ open: false, text: '', severity: 'success' });

    const { updateAuthData, refreshToken } = useUser();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:8080/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            });

            const data = await response.json();

            if (response.ok) {
                updateAuthData({
                    accessToken: data.accessToken,
                    refreshToken: data.refreshToken,
                    user: {
                        username: data.user.username,
                        email: data.user.email,
                        role: data.user.role,
                    },
                });

                setMessage({ open: true, text: 'Login successful!', severity: 'success' });
            } else {
                setMessage({ open: true, text: `Error: ${data.message}`, severity: 'error' });
            }
        } catch (error) {
            setMessage({ open: true, text: 'Login failed. Please try again.', severity: 'error' });
        }
    };

    const handleClose = () => {
        setMessage({ ...message, open: false });
    };

    // Token refresh logic
    useEffect(() => {
        const interval = setInterval(async () => {
            try {
                await refreshToken();
            } catch (error) {
                // Handle token refresh failure, e.g., notify user or logout
            }
        }, 15 * 60 * 1000); // Refresh every 15 minutes

        return () => clearInterval(interval);
    }, [refreshToken]);

    return (
        <Container maxWidth="xs" style={{ marginTop: '5' }}>
            <form onSubmit={handleLogin}>
                <TextField
                    label="Username"
                    fullWidth
                    margin="normal"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />
                <TextField
                    label="Password"
                    type="password"
                    fullWidth
                    margin="normal"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <Button style={{ marginTop: '20px' }} type="submit" variant="contained" color="primary" fullWidth>
                    Login
                </Button>
            </form>
            <Snackbar open={message.open} autoHideDuration={6000} onClose={handleClose}>
                <Alert onClose={handleClose} severity={message.severity}>
                    {message.text}
                </Alert>
            </Snackbar>
        </Container>
    );
};

export default Login;
