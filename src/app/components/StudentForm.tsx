'use client';
import React, { useState } from 'react';
import {
    Box,
    TextField,
    Button,
    Typography,
    Snackbar,
    Grid,
    Autocomplete,
    Chip,
    Stack
} from '@mui/material';
import MuiAlert, { AlertProps, AlertColor } from '@mui/material/Alert';
import { useTheme } from '@mui/material/styles';

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

// Define a type for the form data
interface FormData {
    [key: string]: string;
}

const initialFormData: FormData = {
    std_id: '',
    std_father_name: '',
    std_father_tel: '',
    std_mother_name: '',
    std_mother_tel: '',
    std_parent_name: '',
    std_parent_tel: '',
    std_parent_rela: '',
    allergic_things: '',
    allergic_drugs: '',
    allergic_condition: '',
    sch_name: '',
    sch_province: '',
    prefix: '',
    std_Fname: '',
    std_Lname: '',
    std_nickname: '',
    std_religion: '',
    major: '',
    std_tel: ''  // Added student's phone number
};

const StudentForm = () => {
    const theme = useTheme();
    const [formData, setFormData] = useState<FormData>(initialFormData);
    const [message, setMessage] = useState<{ open: boolean; text: string; severity: AlertColor }>({ open: false, text: '', severity: 'success' });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prevData => ({ ...prevData, [name]: value }));
    };

    const handleChipClick = (prefix: string) => {
        setFormData(prevData => ({ ...prevData, prefix }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage({ open: false, text: '', severity: 'success' });

        // Validate phone numbers
        const phoneFields = ['std_father_tel', 'std_mother_tel', 'std_parent_tel', 'std_tel'];
        for (const field of phoneFields) {
            if (formData[field].length !== 10) {
                setMessage({ open: true, text: `${field.replace('_', ' ').replace('std ', '').replace('tel', ' phone number')} must be exactly 10 digits.`, severity: 'error' });
                return;
            }
        }

        try {
            const response = await fetch('http://localhost:8080/std/submit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const result = await response.json();
            if (response.ok) {
                setMessage({ open: true, text: result.message, severity: 'success' });
                setFormData(initialFormData);
            } else {
                setMessage({ open: true, text: `Error: ${result.message}`, severity: 'error' });
            }
        } catch (error) {
            setMessage({ open: true, text: 'Error submitting form. Please try again.', severity: 'error' });
            console.error('Error submitting form:', error);
        }
    };

    const handleClose = () => {
        setMessage(prev => ({ ...prev, open: false }));
    };
    const labelMapping = {
        std_Fname: 'ชื่อ',
        std_Lname: 'นามสกุล',
        std_nickname: 'ชื่อเล่น',
    };
    const prefixes = ['นาย', 'นาง'];
    const MajorOptions = ['วท.บ.เคมี', 'วท.บ.วิทยาศาสตร์สิ่งแวดล้อม', 'วท.บ.คณิตศาสตร์และการจัดการข้อมูล', 'วท.บ.วิทยาการคอมพิวเตอร์และสารสนเทศ', 'วท.บ.ชีววิทยาศาสตร์', 'หลักสูตรควบระดับปริญญาตรี 2 ปริญญา วท.บ.คณิตศาสตร์และการจัดการข้อมูล ร่วมกับ วท.บ.วิทยาการคอมพิวเตอร์และสารสนเทศ (เรียนพัทลุง)', 'หลักสูตรควบระดับปริญญาตรี 2 ปริญญา ศ.บ.เศรษฐศาสตร์ ร่วมกับ วท.บ.วิทยาการคอมพิวเตอร์และสารสนเทศ (เรียนสงขลา)'];
    const ReligionOptions = ['อิสลาม', 'พุทธ', 'คริสต์'];
    const ProvinceOptions = ['กาฬสินธุ์', 'กรุงเทพมหานคร', 'กำแพงเพชร', 'ขอนแก่น', 'ชัยภูมิ', 'ชลบุรี', 'เชียงราย', 'เชียงใหม่', 'ตรัง', 'ตราด', 'นครพนม', 'นครราชสีมา', 'นครศรีธรรมราช', 'นนทบุรี', 'นราธิวาส', 'น่าน', 'บุรีรัมย์', 'บึงกาฬ', 'ประจวบคีรีขันธ์', 'ปทุมธานี', 'ปัตตานี', 'พะเยา', 'พัทลุง', 'ภูเก็ต', 'มหาสารคาม', 'มุกดาหาร', 'แม่ฮ่องสอน', 'ลำปาง', 'ลำพูน', 'เลย', 'สกลนคร', 'สงขลา', 'สตูล', 'สมุทรปราการ', 'สมุทรสาคร', 'สุราษฎร์ธานี', 'สุรินทร์', 'อำนาจเจริญ', 'อุดรธานี', 'อุบลราชธานี', 'อ่างทอง', 'ชุมพร', 'ยโสธร', 'นครปฐม', 'ราชบุรี', 'เพชรบุรี', 'สระแก้ว', 'สระบุรี', 'ลพบุรี', 'สิงห์บุรี', 'ชัยนาท', 'หนองคาย', 'หนองบัวลำภู', 'กระบี่', 'ตาก', 'ระนอง', 'ระยอง', 'นครสวรรค์', 'พิจิตร', 'พิษณุโลก', 'ปราจีนบุรี', 'สมุทรสงคราม', 'แพร่', 'ร้อยเอ็ด'];

    return (
        <Box component="form" onSubmit={handleSubmit} sx={{ padding: 3 ,marginTop:'60px' }}>
            <Typography variant="h4" gutterBottom>ฟอร์มกรอกข้อมูลสำหรับนิสิตใหม่ชั้นปีที่ 1 คณะวิทยาศาสตร์และนวัตกรรมดิจิทัล</Typography>

            {/* Personal Information */}
            <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                    <TextField label="รหัสนิสิต" name="std_id" value={formData.std_id} onChange={handleChange} required fullWidth />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle1" gutterBottom>คำนำหน้า</Typography>
                    <Stack direction="row" spacing={1}>
                        {prefixes.map(prefix => (
                            <Chip
                                key={prefix}
                                label={prefix}
                                clickable
                                color={formData.prefix === prefix ? 'primary' : 'default'}
                                onClick={() => handleChipClick(prefix)}
                            />
                        ))}
                    </Stack>
                </Grid>
                {['std_Fname', 'std_Lname', 'std_nickname'].map((field) => (
                    <Grid item xs={12} sm={6} key={field}>
                    <TextField 
                        label={labelMapping[field]} // Use the mapping for the label
                        name={field} 
                        value={formData[field]} 
                        onChange={handleChange} 
                        required 
                        fullWidth 
                    />
                </Grid>
                ))}
                <Grid item xs={12} sm={6}>
                    <TextField label="เบอร์โทรศัพท์ของนิสิต" name="std_tel" value={formData.std_tel} onChange={handleChange} required fullWidth />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <Autocomplete
                        options={ReligionOptions}
                        value={formData.std_religion}
                        onChange={(event, newValue) => setFormData(prev => ({ ...prev, std_religion: newValue || '' }))}                        
                        freeSolo
                        renderInput={(params) => <TextField {...params} label="ศาสนา" required fullWidth />}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <Autocomplete
                        options={MajorOptions}
                        value={formData.major}
                        onChange={(event, newValue) => setFormData(prev => ({ ...prev, major: newValue || '' }))}
                        renderInput={(params) => <TextField {...params} label="สาขา" required fullWidth />}
                    />
                </Grid>
            </Grid>

            {/* Parent Information */}
            <Typography variant="h5" gutterBottom sx={{ marginTop: 3 }}>ข้อมูลผู้ปกครอง</Typography>
            <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                    <TextField label="ชื่อ-สกุลของบิดา" name="std_father_name" value={formData.std_father_name} onChange={handleChange} required fullWidth />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField label="เบอร์โทรศัพท์ของบิดา" name="std_father_tel" value={formData.std_father_tel} onChange={handleChange} required fullWidth />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField label="ชื่อ-สกุลของมารดา" name="std_mother_name" value={formData.std_mother_name} onChange={handleChange} required fullWidth />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField label="เบอร์โทรศัพท์ของมารดา" name="std_mother_tel" value={formData.std_mother_tel} onChange={handleChange} required fullWidth />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField label="ชื่อ-สกุลของผู้ปกครอง" name="std_parent_name" value={formData.std_parent_name} onChange={handleChange} required fullWidth />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField label="เบอร์โทรศัพท์ของผู้ปกครอง" name="std_parent_tel" value={formData.std_parent_tel} onChange={handleChange} required fullWidth />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField label="มีความเกี่ยวข้องเป็น" name="std_parent_rela" value={formData.std_parent_rela} onChange={handleChange} required fullWidth />
                </Grid>
            </Grid>

            {/* Allergies */}
            <Typography variant="h5" gutterBottom sx={{ marginTop: 3 }}>ประวัติทางการแพทย์</Typography>
            <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                    <TextField label="สิ่งที่แพ้" name="allergic_things" value={formData.allergic_things} onChange={handleChange} required fullWidth />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField label="ยาที่แพ้" name="allergic_drugs" value={formData.allergic_drugs} onChange={handleChange} required fullWidth />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField label="โรคประจำตัว" name="allergic_condition" value={formData.allergic_condition} onChange={handleChange} required fullWidth />
                </Grid>
            </Grid>

            {/* School Information */}
            <Typography variant="h5" gutterBottom sx={{ marginTop: 3 }}>ข้อมูลโรงเรียน</Typography>
            <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                    <TextField label="ชื่อโรงเรียน" name="sch_name" value={formData.sch_name} onChange={handleChange} required fullWidth />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <Autocomplete
                        options={ProvinceOptions}
                        value={formData.sch_province}
                        onChange={(event, newValue) => setFormData(prev => ({ ...prev, sch_province: newValue || '' }))}
                        renderInput={(params) => <TextField {...params} label="จังหวัดที่ตั้งของโรงเรียน" required fullWidth />}
                    />
                </Grid>
            </Grid>

            {/* Submit Button */}
            <Box sx={{ marginTop: 2 }}>
                <Button type="submit" variant="contained" color="primary">Submit</Button>
            </Box>

            {/* Snackbar for messages */}
            <Snackbar open={message.open} autoHideDuration={6000} onClose={handleClose}>
                <Alert onClose={handleClose} severity={message.severity} sx={{ width: '100%' }}>
                    {message.text}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default StudentForm;
