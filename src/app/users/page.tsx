'use client';

import React, { useEffect, useState } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
    Paper,
    Snackbar,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    TextField,
    Select,
    MenuItem,
    FormControl,
} from '@mui/material';
import MuiAlert, { AlertProps, AlertColor } from '@mui/material/Alert';
import { useUser } from '../UserContext'; // Assuming you have UserContext set up for auth

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

interface User {
    _id: string;
    username: string;
    email: string;
    role: string;
}

interface Message {
    open: boolean;
    text: string;
    severity: AlertColor;
}

const roleMap: { [key: string]: string } = {
    '0': 'Wait',
    '1': 'Admin',
    '2': 'User',
};

const roleOptions = [
    { value: '0', label: 'Wait' },
    { value: '1', label: 'Admin' },
    { value: '2', label: 'User' },
];

const UsersPage = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [message, setMessage] = useState<Message>({ open: false, text: '', severity: 'success' });
    const [confirmDelete, setConfirmDelete] = useState<{ open: boolean; user_id: string | null }>({ open: false, user_id: null });
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const { refreshToken } = useUser(); // Get refreshToken from context

    useEffect(() => {
        const fetchUsers = async () => {
            setLoading(true);
            try {
                await getUsers(); // Fetch users
            } catch (error) {
                setMessage({ open: true, text: 'Failed to fetch users. Please try again.', severity: 'error' });
                console.error('Error fetching users:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    const getUsers = async () => {
        const token = localStorage.getItem('accessToken');
        const response = await fetch('http://localhost:8080/user/users', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (response.ok) {
            const data = await response.json();
            setUsers(data);
        } else if (response.status === 403) {
            const refreshed = await handleRefresh();
            if (refreshed) {
                await getUsers(); // Retry fetching users after refreshing
            } else {
                const error = await response.json();
                setMessage({ open: true, text: `Error: ${error.message}`, severity: 'error' });
            }
        } else {
            const error = await response.json();
            setMessage({ open: true, text: `Error: ${error.message}`, severity: 'error' });
        }
    };

    const handleRefresh = async () => {
        const refreshTokenValue = localStorage.getItem('refreshToken');
        if (!refreshTokenValue) {
            setMessage({ open: true, text: 'No refresh token available.', severity: 'error' });
            return false;
        }

        try {
            const response = await fetch('http://localhost:8080/auth/refresh', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ refreshToken: refreshTokenValue }),
            });

            if (response.ok) {
                const data = await response.json();
                localStorage.setItem('accessToken', data.accessToken); // Store new access token
                return true;
            } else {
                const error = await response.json();
                setMessage({ open: true, text: `Refresh error: ${error.message}`, severity: 'error' });
                return false;
            }
        } catch (error) {
            console.error('Token refresh error:', error);
            return false;
        }
    };

    const handleClose = () => {
        setMessage({ ...message, open: false });
    };

    const handleDeleteClick = (user_id: string) => {
        setConfirmDelete({ open: true, user_id });
    };

    const handleConfirmDelete = async () => {
        if (confirmDelete.user_id) {
            try {
                const token = localStorage.getItem('accessToken');
                const response = await fetch(`http://localhost:8080/user/users/${confirmDelete.user_id}`, {
                    method: 'DELETE',
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (response.ok) {
                    setUsers(users.filter(user => user._id !== confirmDelete.user_id));
                    setMessage({ open: true, text: 'User deleted successfully.', severity: 'success' });
                } else if (response.status === 403) {
                    const refreshed = await handleRefresh();
                    if (refreshed) {
                        await handleConfirmDelete(); // Retry deletion after refreshing
                    } else {
                        const error = await response.json();
                        setMessage({ open: true, text: `Error: ${error.message}`, severity: 'error' });
                    }
                } else {
                    const error = await response.json();
                    setMessage({ open: true, text: `Error: ${error.message}`, severity: 'error' });
                }
            } catch (error) {
                setMessage({ open: true, text: 'Failed to delete user. Please try again.', severity: 'error' });
                console.error('Error deleting user:', error);
            } finally {
                setConfirmDelete({ open: false, user_id: null });
            }
        }
    };

    const handleCancelDelete = () => {
        setConfirmDelete({ open: false, user_id: null });
    };

    const handleEditClick = (user: User) => {
        setEditingUser({ _id: user._id, username: user.username, email: user.email, role: user.role });
    };

    const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
        if (editingUser && e.target.name) {
            setEditingUser({ ...editingUser, [e.target.name]: e.target.value });
        }
    };

    const handleEditRoleChange = (e: React.ChangeEvent<{ value: unknown }>) => {
        if (editingUser) {
            setEditingUser({ ...editingUser, role: e.target.value as string });
        }
    };

    const handleEditSubmit = async () => {
        if (editingUser) {
            try {
                const token = localStorage.getItem('accessToken');
                const response = await fetch(`http://localhost:8080/user/users/${editingUser._id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify(editingUser),
                });

                if (response.ok) {
                    const updatedUser = await response.json();
                    setUsers(users.map(user => (user._id === updatedUser._id ? updatedUser : user)));
                    setMessage({ open: true, text: 'User updated successfully.', severity: 'success' });
                } else if (response.status === 403) {
                    const refreshed = await handleRefresh();
                    if (refreshed) {
                        await handleEditSubmit(); // Retry editing after refreshing
                    } else {
                        const error = await response.json();
                        setMessage({ open: true, text: `Error: ${error.message}`, severity: 'error' });
                    }
                } else {
                    const error = await response.json();
                    setMessage({ open: true, text: `Error: ${error.message}`, severity: 'error' });
                }
            } catch (error) {
                setMessage({ open: true, text: 'Failed to update user. Please try again.', severity: 'error' });
                console.error('Error updating user:', error);
            } finally {
                setEditingUser(null);
            }
        }
    };

    if (loading) {
        return <Typography variant="h6">Loading...</Typography>;
    }

    return (
        <div style={{ padding: '20px', marginTop: "60px" }}>
            <Typography variant="h4">Users List</Typography>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Username</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Role</TableCell>
                            <TableCell>Edit</TableCell>
                            <TableCell>Delete</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {users.map(user => (
                            <TableRow key={user._id}>
                                {editingUser && editingUser._id === user._id ? (
                                    <>
                                        <TableCell>
                                            <TextField
                                                name="username"
                                                value={editingUser.username}
                                                onChange={handleEditChange}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <TextField
                                                name="email"
                                                value={editingUser.email}
                                                onChange={handleEditChange}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <FormControl fullWidth>
                                                <Select
                                                    name="role"
                                                    value={editingUser.role}
                                                    onChange={handleEditRoleChange}
                                                >
                                                    {roleOptions.map(option => (
                                                        <MenuItem key={option.value} value={option.value}>
                                                            {option.label}
                                                        </MenuItem>
                                                    ))}
                                                </Select>
                                            </FormControl>
                                        </TableCell>
                                        <TableCell>
                                            <Button variant="contained" color="primary" onClick={handleEditSubmit}>
                                                Save
                                            </Button>
                                        </TableCell>
                                        <TableCell>
                                            <Button variant="contained" color="secondary" onClick={() => setEditingUser(null)}>
                                                Cancel
                                            </Button>
                                        </TableCell>
                                    </>
                                ) : (
                                    <>
                                        <TableCell>{user.username}</TableCell>
                                        <TableCell>{user.email}</TableCell>
                                        <TableCell>{roleMap[user.role] || 'Unknown'}</TableCell>
                                        <TableCell>
                                            <Button
                                                variant="contained"
                                                color="info"
                                                onClick={() => handleEditClick(user)}
                                            >
                                                Edit
                                            </Button>
                                        </TableCell>
                                        <TableCell>
                                            <Button
                                                variant="contained"
                                                color="secondary"
                                                onClick={() => handleDeleteClick(user._id)}
                                            >
                                                Delete
                                            </Button>
                                        </TableCell>
                                    </>
                                )}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog open={confirmDelete.open} onClose={handleCancelDelete}>
                <DialogTitle>Confirm Delete</DialogTitle>
                <DialogContent>
                    <DialogContentText>Are you sure you want to delete this user?</DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCancelDelete} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleConfirmDelete} color="secondary">
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>

            <Snackbar open={message.open} autoHideDuration={6000} onClose={handleClose}>
                <Alert onClose={handleClose} severity={message.severity}>
                    {message.text}
                </Alert>
            </Snackbar>
        </div>
    );
};

export default UsersPage;
