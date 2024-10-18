'use client';
import React, { useEffect, useState } from 'react';
import {
    Typography,
    Card,
    CardContent,
    Snackbar,
    CircularProgress,
    Grid,
    Divider,
    Button,
    TextField,
    Box,
} from '@mui/material';
import MuiAlert, { AlertProps, AlertColor } from '@mui/material/Alert';
import { useUser } from '../../../UserContext'; // Adjust the path according to your structure

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

// Define a type for formData
type FormData = {
    std_id: string;
    std_Fname: string;
    std_Lname: string;
    std_nickname: string;
    std_religion: string;
    major: string;
    std_tel: string;
    std_father_name?: string;
    std_father_tel?: string;
    std_mother_name?: string;
    std_mother_tel?: string;
    std_parent_name?: string;
    std_parent_tel?: string;
    std_parent_rela?: string;
    allergic_things?: string;
    allergic_drugs?: string;
    allergic_condition?: string;
    sch_name?: string;
    sch_province?: string;
};

const EditStudentDetailsPage = ({ params }: { params: { std_id: string } }) => {
    const { authData } = useUser(); // Get authData from context
    const [studentData, setStudentData] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [formData, setFormData] = useState<FormData | null>(null); // Apply the FormData type
    const [message, setMessage] = useState<{ open: boolean; text: string; severity: AlertColor }>({
        open: false,
        text: '',
        severity: 'success',
    });

    useEffect(() => {
        const fetchStudentDetails = async () => {
            try {
                const response = await fetch(`http://localhost:8080/std/read/${params.std_id}`, {
                    headers: {
                        Authorization: `Bearer ${authData?.accessToken}`, // Include accessToken in the headers
                    },
                });
                if (response.ok) { 
                    const data = await response.json();
                    setStudentData(data);
                    setFormData({
                        ...data.student,
                        ...data.studentDetails,
                        ...data.studentSchool,
                    });
                } else {
                    const error = await response.json();
                    setMessage({ open: true, text: `Error: ${error.message}`, severity: 'error' });
                }
            } catch (error) {
                setMessage({ open: true, text: 'Failed to fetch student details. Please try again.', severity: 'error' });
                console.error('Error fetching student details:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchStudentDetails();
    }, [params.std_id, authData]); // Add authData as a dependency

    const handleClose = () => {
        setMessage({ ...message, open: false });
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev!,
            [name]: value,
        }));
    };

    const handleSave = async () => {
        try {
            const response = await fetch(`http://localhost:8080/std/edit/${params.std_id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${authData?.accessToken}`, // Include accessToken in the headers
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                setMessage({ open: true, text: 'Student details updated successfully!', severity: 'success' });
            } else {
                const error = await response.json();
                setMessage({ open: true, text: `Error: ${error.message}`, severity: 'error' });
            }
        } catch (error) {
            setMessage({ open: true, text: 'Failed to update student details. Please try again.', severity: 'error' });
            console.error('Error updating student details:', error);
        }
    };

    if (loading) return <CircularProgress />;

    if (!studentData) return <Typography variant="h6">No student details found.</Typography>;

    return (
        <div style={{ padding: '20px', backgroundColor: '#f9f9f9' , marginTop:'60px'}}>
            <Typography variant="h3" align="center" gutterBottom color="#1976d2">
                Edit Student Details
            </Typography>
            <Divider sx={{ marginBottom: '20px' }} />

            <Grid container spacing={3}>
                {/* Personal Information */}
                <Grid item xs={12} md={6}>
                    <Card>
                        <CardContent>
                            <Typography variant="h5">Personal Information</Typography>
                            <Divider sx={{ margin: '10px 0' }} />

                            <TextField
                                label="Student ID"
                                variant="outlined"
                                fullWidth
                                margin="normal"
                                value={formData?.std_id || ''}
                                disabled
                            />
                            <TextField
                                label="Name"
                                variant="outlined"
                                fullWidth
                                margin="normal"
                                name="std_Fname"
                                value={formData?.std_Fname || ''}
                                onChange={handleInputChange}
                            />
                            <TextField
                                label="Last Name"
                                variant="outlined"
                                fullWidth
                                margin="normal"
                                name="std_Lname"
                                value={formData?.std_Lname || ''}
                                onChange={handleInputChange}
                            />
                            <TextField
                                label="Nickname"
                                variant="outlined"
                                fullWidth
                                margin="normal"
                                name="std_nickname"
                                value={formData?.std_nickname || ''}
                                onChange={handleInputChange}
                            />
                            <TextField
                                label="Religion"
                                variant="outlined"
                                fullWidth
                                margin="normal"
                                name="std_religion"
                                value={formData?.std_religion || ''}
                                onChange={handleInputChange}
                            />
                            <TextField
                                label="Major"
                                variant="outlined"
                                fullWidth
                                margin="normal"
                                name="major"
                                value={formData?.major || ''}
                                onChange={handleInputChange}
                            />
                            <TextField
                                label="Phone Number"
                                variant="outlined"
                                fullWidth
                                margin="normal"
                                name="std_tel"
                                value={formData?.std_tel || ''}
                                onChange={handleInputChange}
                            />
                        </CardContent>
                    </Card>
                </Grid>

                {/* Parent Information */}
                <Grid item xs={12} md={6}>
                    <Card>
                        <CardContent>
                            <Typography variant="h5">Parent Information</Typography>
                            <Divider sx={{ margin: '10px 0' }} />

                            <TextField
                                label="Father's Name"
                                variant="outlined"
                                fullWidth
                                margin="normal"
                                name="std_father_name"
                                value={formData?.std_father_name || ''}
                                onChange={handleInputChange}
                            />
                            <TextField
                                label="Father's Phone"
                                variant="outlined"
                                fullWidth
                                margin="normal"
                                name="std_father_tel"
                                value={formData?.std_father_tel || ''}
                                onChange={handleInputChange}
                            />
                            <TextField
                                label="Mother's Name"
                                variant="outlined"
                                fullWidth
                                margin="normal"
                                name="std_mother_name"
                                value={formData?.std_mother_name || ''}
                                onChange={handleInputChange}
                            />
                            <TextField
                                label="Mother's Phone"
                                variant="outlined"
                                fullWidth
                                margin="normal"
                                name="std_mother_tel"
                                value={formData?.std_mother_tel || ''}
                                onChange={handleInputChange}
                            />
                            <TextField
                                label="Parent's Name"
                                variant="outlined"
                                fullWidth
                                margin="normal"
                                name="std_parent_name"
                                value={formData?.std_parent_name || ''}
                                onChange={handleInputChange}
                            />
                            <TextField
                                label="Parent's Phone"
                                variant="outlined"
                                fullWidth
                                margin="normal"
                                name="std_parent_tel"
                                value={formData?.std_parent_tel || ''}
                                onChange={handleInputChange}
                            />
                            <TextField
                                label="Relationship to Student"
                                variant="outlined"
                                fullWidth
                                margin="normal"
                                name="std_parent_rela"
                                value={formData?.std_parent_rela || ''}
                                onChange={handleInputChange}
                            />
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            <Grid container spacing={3} sx={{ marginTop: '20px' }}>
                {/* Allergies Information */}
                <Grid item xs={12} md={6}>
                    <Card>
                        <CardContent>
                            <Typography variant="h5">Allergies Information</Typography>
                            <Divider sx={{ margin: '10px 0' }} />

                            <TextField
                                label="Allergic Things"
                                variant="outlined"
                                fullWidth
                                margin="normal"
                                name="allergic_things"
                                value={formData?.allergic_things || ''}
                                onChange={handleInputChange}
                            />
                            <TextField
                                label="Allergic Drugs"
                                variant="outlined"
                                fullWidth
                                margin="normal"
                                name="allergic_drugs"
                                value={formData?.allergic_drugs || ''}
                                onChange={handleInputChange}
                            />
                            <TextField
                                label="Allergic Condition"
                                variant="outlined"
                                fullWidth
                                margin="normal"
                                name="allergic_condition"
                                value={formData?.allergic_condition || ''}
                                onChange={handleInputChange}
                            />
                        </CardContent>
                    </Card>
                </Grid>

                {/* School Information */}
                <Grid item xs={12} md={6}>
                    <Card>
                        <CardContent>
                            <Typography variant="h5">School Information</Typography>
                            <Divider sx={{ margin: '10px 0' }} />

                            <TextField
                                label="School Name"
                                variant="outlined"
                                fullWidth
                                margin="normal"
                                name="sch_name"
                                value={formData?.sch_name || ''}
                                onChange={handleInputChange}
                            />
                            <TextField
                                label="School Province"
                                variant="outlined"
                                fullWidth
                                margin="normal"
                                name="sch_province"
                                value={formData?.sch_province || ''}
                                onChange={handleInputChange}
                            />
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            <Box textAlign="center" mt={4}>
                <Button variant="contained" color="primary" onClick={handleSave}>
                    Save Changes
                </Button>
            </Box>

            <Snackbar open={message.open} autoHideDuration={6000} onClose={handleClose}>
                <Alert onClose={handleClose} severity={message.severity} sx={{ width: '100%' }}>
                    {message.text}
                </Alert>
            </Snackbar>
        </div>
    );
};

export default EditStudentDetailsPage;
