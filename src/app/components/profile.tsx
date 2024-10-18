import React from 'react';
import { Dialog, DialogTitle, DialogContent, Typography, Box, Avatar } from '@mui/material';
import { useUser } from '../UserContext'; // Adjust the path as necessary

const Profile: React.FC<{ open: boolean; onClose: () => void }> = ({ open, onClose }) => {
    const { authData } = useUser(); // Access user data from context

    if (!authData) return null; // If no user data, return null

    // Determine role name based on the role string
    const roleName = authData.user.role === "1" ? "Admin" : authData.user.role === "2" ? "User" : "Unknown"; // Default to "Unknown" if role is not "1" or "2"

    return (
        <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
            <DialogTitle sx={{ fontSize: '1.5rem', textAlign: 'center' }}>Profile</DialogTitle>
            <DialogContent sx={{ padding: '16px' }}>
                <Box display="flex" alignItems="center" mb={2}>
                    <Avatar alt={authData.user.username} sx={{ width: 64, height: 64, mr: 2 }} />
                    <Typography variant="h6">{authData.user.username}</Typography>
                </Box>
                <Typography variant="body1">Email: {authData.user.email}</Typography>
                <Typography variant="body1">Role: {roleName}</Typography> {/* Display the determined role name */}
            </DialogContent>
        </Dialog>
    );
};

export default Profile;
