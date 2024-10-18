import React, { useState } from 'react';
import {
    TextField,
    Button,
    Typography,
    Container,
    Snackbar,
} from '@mui/material';
import MuiAlert, { AlertProps } from '@mui/material/Alert';

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const Register = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState<{ open: boolean; text: string; severity: 'success' | 'error' }>({
        open: false,
        text: '',
        severity: 'success',
    });

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:8080/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, email, password }),
            });

            if (response.ok) {
                setMessage({ open: true, text: 'Registration successful!', severity: 'success' });
            } else {
                const error = await response.json();
                setMessage({ open: true, text: `Error: ${error.message}`, severity: 'error' });
            }
        } catch (error) {
            setMessage({ open: true, text: 'Registration failed. Please try again.', severity: 'error' });
        }
    };

    const handleClose = () => {
        setMessage({ ...message, open: false });
    };

    return (
        <Container maxWidth="xs">
            <form onSubmit={handleRegister}>
                <TextField
                    label="Username"
                    fullWidth
                    margin="normal"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />
                <TextField
                    label="Email"
                    type="email"
                    fullWidth
                    margin="normal"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
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
                    Register
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

export default Register;
