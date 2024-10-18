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
    FormControl,
    InputLabel,
    Select,
    MenuItem,
} from '@mui/material';
import MuiAlert, { AlertProps, AlertColor } from '@mui/material/Alert';
import { useRouter } from 'next/navigation';

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const StudentsPage = () => {
    const [students, setStudents] = useState<any[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchField, setSearchField] = useState('std_id');
    const [message, setMessage] = useState<{ open: boolean; text: string; severity: AlertColor }>({
        open: false,
        text: '',
        severity: 'success',
    });
    const [confirmDelete, setConfirmDelete] = useState<{ open: boolean; std_id: string | null }>({
        open: false,
        std_id: null,
    });

    const router = useRouter();

    useEffect(() => {
        const fetchStudents = async () => {
            try {
                const token = localStorage.getItem('accessToken');
                const response = await fetch('http://localhost:8080/std/reads', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });
                if (response.ok) {
                    const data = await response.json();
                    setStudents(data);
                } else {
                    const error = await response.json();
                    setMessage({ open: true, text: `Error: ${error.message}`, severity: 'error' });
                }
            } catch (error) {
                setMessage({ open: true, text: 'Failed to fetch students. Please try again.', severity: 'error' });
                console.error('Error fetching students:', error);
            }
        };

        fetchStudents();
    }, []);

    const handleClose = () => {
        setMessage({ ...message, open: false });
    };

    const handleDetailsClick = (std_id: string) => {
        router.push(`/students/${std_id}`);
    };

    const handleEditClick = (std_id: string) => {
        router.push(`/students/edit/${std_id}`);
    };

    const handleDeleteClick = (std_id: string) => {
        setConfirmDelete({ open: true, std_id });
    };

    const handleConfirmDelete = async () => {
        if (confirmDelete.std_id) {
            try {
                const token = localStorage.getItem('accessToken');
                const response = await fetch(`http://localhost:8080/std/del/${confirmDelete.std_id}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });
                if (response.ok) {
                    setStudents(students.filter(student => student.student.std_id !== confirmDelete.std_id));
                    setMessage({ open: true, text: 'Student deleted successfully.', severity: 'success' });
                } else {
                    const error = await response.json();
                    setMessage({ open: true, text: `Error: ${error.message}`, severity: 'error' });
                }
            } catch (error) {
                setMessage({ open: true, text: 'Failed to delete student. Please try again.', severity: 'error' });
                console.error('Error deleting student:', error);
            } finally {
                setConfirmDelete({ open: false, std_id: null });
            }
        }
    };

    const handleCancelDelete = () => {
        setConfirmDelete({ open: false, std_id: null });
    };

    const uniqueStudents = Array.from(new Set(students.map(student => student.student.std_id)))
        .map(id => students.find(student => student.student.std_id === id));

    const filteredStudents = uniqueStudents.filter(student => {
        if (!searchTerm) return true; 

        const { std_id, std_Fname, std_Lname, std_nickname, std_tel, major } = student.student;
        const { sch_province } = student.studentSchool;

        const fields = {
            std_id,
            std_Fname,
            std_Lname,
            std_nickname,
            std_tel,
            sch_province,
            major,
        };

        if (searchField === 'all') {
            return Object.values(fields).some(field =>
                field.toString().toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        return fields[searchField].toString().toLowerCase().includes(searchTerm.toLowerCase());
    });

    return (
        <div style={{ padding: '20px', marginTop: '60px' }}>
            <Typography variant="h4">รายชื่อนิสิต</Typography>
            <TextField
                label="Search"
                variant="outlined"
                fullWidth
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ marginBottom: '20px' }}
            />
            <FormControl fullWidth variant="outlined" style={{ marginBottom: '20px' }}>
                <InputLabel id="search-field-label">Search Field</InputLabel>
                <Select
                    labelId="search-field-label"
                    value={searchField}
                    onChange={(e) => setSearchField(e.target.value)}
                    label="Search Field"
                >
                    <MenuItem value="all">ทั้งหมด</MenuItem>
                    <MenuItem value="std_id">รหัสนิสิต</MenuItem>
                    <MenuItem value="std_Fname">ชื่อ</MenuItem>
                    <MenuItem value="std_Lname">นามสกุล</MenuItem>
                    <MenuItem value="std_nickname">ชื่อเล่น</MenuItem>
                    <MenuItem value="std_tel">เบอร์โทรศัพท์</MenuItem>
                    <MenuItem value="sch_province">จังหวัด</MenuItem>
                    <MenuItem value="major">สาขา</MenuItem>
                </Select>
            </FormControl>
            <Typography variant="subtitle1">
                {filteredStudents.length} result{filteredStudents.length !== 1 ? 's' : ''} found.
            </Typography>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>รหัสนิสิต</TableCell>
                            <TableCell>ชื่อ</TableCell>
                            <TableCell>นามสกุล</TableCell>
                            <TableCell>ชื่อเล่น</TableCell>
                            <TableCell>เบอร์โทรศัพท์</TableCell>
                            <TableCell>จังหวัด</TableCell>
                            <TableCell>สาขา</TableCell>
                            <TableCell>รายละเอียด</TableCell>
                            <TableCell>แก้ไข</TableCell>
                            <TableCell>ลบ</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredStudents.map(student => (
                            <TableRow key={student.student.std_id}>
                                <TableCell>{student.student.std_id}</TableCell>
                                <TableCell>{student.student.std_Fname}</TableCell>
                                <TableCell>{student.student.std_Lname}</TableCell>
                                <TableCell>{student.student.std_nickname}</TableCell>
                                <TableCell>{student.student.std_tel}</TableCell>
                                <TableCell>{student.studentSchool.sch_province}</TableCell>
                                <TableCell>{student.student.major}</TableCell>
                                <TableCell>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={() => handleDetailsClick(student.student.std_id)}
                                    >
                                        รายละเอียด
                                    </Button>
                                </TableCell>
                                <TableCell>
                                    <Button
                                        variant="contained"
                                        color="info"
                                        onClick={() => handleEditClick(student.student.std_id)}
                                    >
                                        แก้ไข
                                    </Button>
                                </TableCell>
                                <TableCell>
                                    <Button
                                        variant="contained"
                                        color="error" // Change to "error" for red color
                                        onClick={() => handleDeleteClick(student.student.std_id)}
                                    >
                                        ลบ
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <Snackbar open={message.open} autoHideDuration={6000} onClose={handleClose}>
                <Alert onClose={handleClose} severity={message.severity} sx={{ width: '100%' }}>
                    {message.text}
                </Alert>
            </Snackbar>
            <Dialog open={confirmDelete.open} onClose={handleCancelDelete}>
                <DialogTitle>ยืนยันการลบ</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to delete student with ID: {confirmDelete.std_id}?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCancelDelete} color="primary">
                        ยกเลิก
                    </Button>
                    <Button onClick={handleConfirmDelete} color="error"> {/* Change to "error" for red color */}
                        ลบ
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default StudentsPage;
