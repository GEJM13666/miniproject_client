'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
    Typography,
    Card,
    CardContent,
    Snackbar,
    CircularProgress,
    Grid,
    Divider,
    Button,
    Box,
} from '@mui/material';
import MuiAlert, { AlertProps, AlertColor } from '@mui/material/Alert';

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const StudentDetailsPage = ({ params }: { params: { std_id: string } }) => {
    const router = useRouter();
    const [studentData, setStudentData] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [message, setMessage] = useState<{ open: boolean; text: string; severity: AlertColor }>({
        open: false,
        text: '',
        severity: 'success',
    });

    useEffect(() => {
        const fetchStudentDetails = async () => {
            try {
                const response = await fetch(`http://localhost:8080/std/read/${params.std_id}`);
                if (response.ok) {
                    const data = await response.json();
                    setStudentData(data);
                } else {
                    const error = await response.json();
                    setMessage({ open: true, text: `ข้อผิดพลาด: ${error.message}`, severity: 'error' });
                }
            } catch (error) {
                setMessage({ open: true, text: 'ไม่สามารถดึงข้อมูลนักเรียนได้ กรุณาลองใหม่อีกครั้ง', severity: 'error' });
                console.error('เกิดข้อผิดพลาดในการดึงข้อมูลนักเรียน:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchStudentDetails();
    }, [params.std_id]);

    const handleClose = () => {
        setMessage({ ...message, open: false });
    };

    const handleEditClick = (std_id: string) => {
        router.push(`/students/edit/${std_id}`);
    };

    if (loading) return <CircularProgress />;

    if (!studentData) return <Typography variant="h6">ไม่พบรายละเอียดนักเรียน</Typography>;

    const { student, studentDetails, studentSchool } = studentData;

    return (
        <div style={{ padding: '20px', backgroundColor: '#f4f6f8', marginTop: '60px' }}>
            <Typography variant="h3" align="center" gutterBottom color="#1976d2">
                รายละเอียดของนิสิต
            </Typography>
            <Divider sx={{ marginBottom: '20px' }} />
            <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                    <Card sx={{ boxShadow: 3 }}>
                        <CardContent>
                            <Typography variant="h5" fontWeight="bold">ข้อมูลส่วนบุคคล</Typography>
                            <Divider sx={{ margin: '10px 0' }} />
                            <Typography variant="body1"><strong>รหัสนักเรียน:</strong> {student.std_id}</Typography>
                            <Typography variant="body1"><strong>ชื่อ:</strong> {student.prefix} {student.std_Fname} {student.std_Lname}</Typography>
                            <Typography variant="body1"><strong>ชื่อเล่น:</strong> {student.std_nickname}</Typography>
                            <Typography variant="body1"><strong>ศาสนา:</strong> {student.std_religion}</Typography>
                            <Typography variant="body1"><strong>สาขาวิชา:</strong> {student.major}</Typography>
                            <Typography variant="body1"><strong>หมายเลขโทรศัพท์:</strong> {student.std_tel}</Typography>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} md={6}>
                    <Card sx={{ boxShadow: 3 }}>
                        <CardContent>
                            <Typography variant="h5" fontWeight="bold">ข้อมูลผู้ปกครอง</Typography>
                            <Divider sx={{ margin: '10px 0' }} />
                            <Typography variant="body1"><strong>ชื่อบิดา:</strong> {studentDetails.std_father_name}</Typography>
                            <Typography variant="body1"><strong>หมายเลขโทรศัพท์บิดา:</strong> {studentDetails.std_father_tel}</Typography>
                            <Typography variant="body1"><strong>ชื่อมารดา:</strong> {studentDetails.std_mother_name}</Typography>
                            <Typography variant="body1"><strong>หมายเลขโทรศัพท์มารดา:</strong> {studentDetails.std_mother_tel}</Typography>
                            <Typography variant="body1"><strong>ชื่อผู้ปกครอง:</strong> {studentDetails.std_parent_name}</Typography>
                            <Typography variant="body1"><strong>หมายเลขโทรศัพท์ผู้ปกครอง:</strong> {studentDetails.std_parent_tel}</Typography>
                            <Typography variant="body1"><strong>ความสัมพันธ์กับนักเรียน:</strong> {studentDetails.std_parent_rela}</Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            <Grid container spacing={3} sx={{ marginTop: '20px' }}>
                <Grid item xs={12} md={6}>
                    <Card sx={{ boxShadow: 3 }}>
                        <CardContent>
                            <Typography variant="h5" fontWeight="bold">ข้อมูลสุขภาพ</Typography>
                            <Divider sx={{ margin: '10px 0' }} />
                            <Typography variant="body1"><strong>สิ่งที่แพ้:</strong> {studentDetails.allergic_things}</Typography>
                            <Typography variant="body1"><strong>ยาที่แพ้:</strong> {studentDetails.allergic_drugs}</Typography>
                            <Typography variant="body1"><strong>อาการแพ้:</strong> {studentDetails.allergic_condition}</Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Card sx={{ boxShadow: 3 }}>
                        <CardContent>
                            <Typography variant="h5" fontWeight="bold">ข้อมูลโรงเรียน</Typography>
                            <Divider sx={{ margin: '10px 0' }} />
                            <Typography variant="body1"><strong>ชื่อโรงเรียน:</strong> {studentSchool.sch_name}</Typography>
                            <Typography variant="body1"><strong>จังหวัดของโรงเรียน:</strong> {studentSchool.sch_province}</Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            <Box mt={3} textAlign="center">
                <Button variant="contained" color="primary" onClick={() => handleEditClick(student.std_id)}>
                    แก้ไขรายละเอียด
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

export default StudentDetailsPage;
