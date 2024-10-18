'use client';
import React, { useEffect, useState } from 'react';
import { Bar, Line, Pie, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
  ArcElement,
} from 'chart.js';
import { Grid, Paper, Typography, Alert, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { AlertColor } from '@mui/material/Alert';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
  ArcElement
);

const DashboardPage = () => {
  const [students, setStudents] = useState<any[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<any[]>([]);
  const [selectedPrefix, setSelectedPrefix] = useState<string>('25'); // Default to '25'
  const [prefixes, setPrefixes] = useState<string[]>([]);
  const [message, setMessage] = useState<{ open: boolean; text: string; severity: AlertColor }>({
    open: false,
    text: '',
    severity: 'success',
  });

  interface Student {
    student: {
      std_id: string;
      major: string;
      sch_province: string; // Added province field
    };
  }

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await fetch('http://localhost:8080/std/reads');
        if (response.ok) {
          const data: Student[] = await response.json();
          // Prepend '25' to each std_id
          const updatedData = data.map(student => ({
            ...student,
            student: {
              ...student.student,
              std_id: `25${student.student.std_id}`,
            }
          }));
          setStudents(updatedData);
          setFilteredStudents(updatedData);
          const uniquePrefixes: string[] = Array.from(new Set(updatedData.map(student => student.student.std_id.slice(0, 4))));
          setPrefixes(uniquePrefixes);
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

  const filterStudentsByPrefix = (prefix: string) => {
    if (prefix) {
      const filtered = students.filter(student => student.student.std_id.startsWith(prefix));
      setFilteredStudents(filtered);
    } else {
      setFilteredStudents(students);
    }
  };

  const handlePrefixChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    const selectedPrefix = event.target.value as string;
    setSelectedPrefix(selectedPrefix);
    filterStudentsByPrefix(selectedPrefix);
  };

  const getMultiAxisData = () => {
    const prefixCounts: { [key: string]: number } = {};

    filteredStudents.forEach(student => {
      const prefix = student.student.std_id.slice(0, 4);
      prefixCounts[prefix] = (prefixCounts[prefix] || 0) + 1;
    });

    const labels = Object.keys(prefixCounts);
    const data = Object.values(prefixCounts);

    return {
      labels,
      datasets: [
        {
          label: 'จำนวนนิสิตแต่ละปี',
          data,
          borderColor: 'rgba(75, 192, 192, 1)',
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          yAxisID: 'y1',
        },
      ],
    };
  };

  const getTrafficData = () => {
    const provinceCounts: { [key: string]: number } = {};

    filteredStudents.forEach(student => {
      const province = student.studentSchool.sch_province; // Corrected from studentSchool to student
      if (province) {
        provinceCounts[province] = (provinceCounts[province] || 0) + 1;
      }
    });

    const labels = Object.keys(provinceCounts);
    const data = Object.values(provinceCounts);

    return {
      labels,
      datasets: [
        {
          label: 'จำนวนนิสิตที่มาจากแต่ละภูมิลำเนา',
          data,
          fill: false,
          borderColor: 'rgba(153, 102, 255, 1)',
          tension: 0.1,
        },
      ],
    };
  };

  const multiAxisData = getMultiAxisData();
  const trafficData = getTrafficData(); // Get traffic data based on province

  const multiAxisOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'ข้อมูลจำนวนนิสิตแต่ละปี',
      },
    },
    scales: {
      y1: {
        type: 'linear',
        position: 'left',
        min: 0,
        max: 50,
        ticks: {
          stepSize: 10,
        },
      },
    },
  };

  const trafficOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'ข้อมูลภูมิลำเนาโรงเรียน',
      },
    },
    scales: {
      y: {
        type: 'linear',
        position: 'left',
        min: 0,   // Set minimum to 0
        max: 50,  // Set maximum to 50
        ticks: {
          stepSize: 10,
        },
      },
    },
  };

  const getSalesByMajorData = () => {
    const majorCounts: { [key: string]: number } = {};
    filteredStudents.forEach(student => {
      const major = student.student.major;
      if (major) {
        majorCounts[major] = (majorCounts[major] || 0) + 1;
      }
    });

    const labels = Object.keys(majorCounts);
    const data = Object.values(majorCounts);

    return {
      labels,
      datasets: [
        {
          label: 'Sales by Major',
          data,
          backgroundColor: [
            'rgba(255, 159, 64, 0.6)',
            'rgba(75, 192, 192, 0.6)',
            'rgba(153, 102, 255, 0.6)',
            'rgba(255, 99, 132, 0.6)',
          ],
          borderWidth: 1,
        },
      ],
    };
  };

  const doughnutData = getSalesByMajorData();

  const commonOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: '',
      },
    },
  };

  return (
    <div style={{ padding: '20px' }}>
      <Typography variant="h4" align="center" gutterBottom>
        Dashboard Overview
      </Typography>

      {message.open && (
        <Alert severity={message.severity} onClose={() => setMessage({ ...message, open: false })}>
          {message.text}
        </Alert>
      )}

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper elevation={3} style={{ padding: '20px' }}>
            <Typography variant="h6" gutterBottom>
            ข้อมูลจำนวนนิสิตแต่ละปี
            </Typography>
            <Line data={multiAxisData} options={multiAxisOptions} />
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper elevation={3} style={{ padding: '20px', Width: '600px', maxHeight: '600px', position: 'relative' }}>
            <Typography variant="h6" gutterBottom>
              <FormControl variant="outlined" style={{ width: '120px' }} margin="normal">
                <InputLabel id="student-id-prefix-select-label">เลือกปี</InputLabel>
                <Select
                  labelId="student-id-prefix-select-label"
                  value={selectedPrefix}
                  onChange={handlePrefixChange}
                  label="Select ID Prefix"
                >
                  <MenuItem value=""><em>None</em></MenuItem>
                  {prefixes.map(prefix => (
                    <MenuItem key={prefix} value={prefix}>{prefix}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Typography>
            <div style={{ height: '327px', width: '100%', position: 'relative' }}>
              <Doughnut 
                data={doughnutData} 
                options={{ 
                  ...commonOptions, 
                  maintainAspectRatio: false, 
                  plugins: {
                    ...commonOptions.plugins, 
                    title: { ...commonOptions.plugins.title, text: 'ข้อมูลจำนวนนิสิตแต่ละสาขา' } 
                  } 
                }} 
                style={{ position: 'absolute', top: 0, left: 0, height: '100%', width: '100%' }} 
              />
            </div>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper elevation={3} style={{ padding: '20px' }}>
            <Typography variant="h6" gutterBottom>
            ข้อมูลภูมิลำเนาโรงเรียน
            </Typography>
            <Line data={trafficData} options={trafficOptions} />
          </Paper>
        </Grid>
      </Grid>
    </div>
  );
};

export default DashboardPage;
