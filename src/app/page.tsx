'use client';
import React from 'react';
import { UserProvider } from './UserContext'; // Adjust the path as necessary
import { Box, Typography, Button, Grid, Card } from '@mui/material';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules'; // Correct import for Autoplay
import 'swiper/swiper-bundle.css';
import Image from 'next/image';
import Footer from './components/footer';
import campusImage1 from './public/image/image1.jpg'; // Adjust path as necessary
import campusImage2 from './public/image/image2.jpg'; // Adjust path as necessary
import campusImage3 from './public/image/image3.jpg'; // Adjust path as necessary

export default function Page() {
    return (
        <UserProvider>
            <Box 
                sx={{ 
                    padding: '20px', 
                    textAlign: 'center', 
                    backgroundColor: '#f5f5f5', 
                    minHeight: '100vh', 
                    marginTop: '60px' 
                }}
            >
                <Swiper
                    modules={[Autoplay]}
                    spaceBetween={30}
                    pagination={{ clickable: true }}
                    loop={true}
                    autoplay={{
                        delay: 5000,
                        disableOnInteraction: false,
                    }}
                >
                    <SwiperSlide>
                        <Image 
                            src={campusImage1} 
                            alt="Campus Image 1" 
                            width={1200} 
                            height={400} 
                            layout="responsive"
                            style={{ borderRadius: '8px' }} 
                        />
                    </SwiperSlide>
                    <SwiperSlide>
                        <Image 
                            src={campusImage2} 
                            alt="Campus Image 2" 
                            width={1200} 
                            height={400} 
                            layout="responsive"
                            style={{ borderRadius: '8px' }} 
                        />
                    </SwiperSlide>
                    <SwiperSlide>
                        <Image 
                            src={campusImage3} 
                            alt="Campus Image 3" 
                            width={1200} 
                            height={400} 
                            layout="responsive"
                            style={{ borderRadius: '8px' }} 
                        />
                    </SwiperSlide>
                </Swiper>
                
                <Typography variant="h2" sx={{ marginTop: '20px', marginBottom: '20px', fontWeight: 'bold' }}>
                ยินดีต้อนรับสู่คณะวิทยาศาสตร์และนวัตกรรมดิจิทัล
                </Typography>
                <Typography variant="h5" sx={{ marginBottom: '40px' }}>
                สำรวจอนาคตของเทคโนโลยีและการค้นพบทางวิทยาศาสตร์
                </Typography>
                <Grid container spacing={4} justifyContent="center">
                    <Grid item xs={12} sm={6} md={4}>
                        <Card sx={{ padding: '20px' }}>
                            <Typography variant="h5">Academic Programs</Typography>
                            <Typography variant="body2" sx={{ marginBottom: '15px' }}>
                                Discover a range of innovative courses in science and digital technology.
                            </Typography>
                            <Button variant="contained" color="primary" href="/programs">
                                Learn More
                            </Button>
                        </Card>
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                        <Card sx={{ padding: '20px' }}>
                            <Typography variant="h5">Research Opportunities</Typography>
                            <Typography variant="body2" sx={{ marginBottom: '15px' }}>
                                Engage in cutting-edge research and contribute to scientific advancements.
                            </Typography>
                            <Button variant="contained" color="primary" href="/research">
                                Explore Research
                            </Button>
                        </Card>
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                        <Card sx={{ padding: '20px' }}>
                            <Typography variant="h5">Student Life</Typography>
                            <Typography variant="body2" sx={{ marginBottom: '15px' }}>
                                Join a vibrant community and participate in exciting extracurricular activities.
                            </Typography>
                            <Button variant="contained" color="primary" href="/student-life">
                                Get Involved
                            </Button>
                        </Card>
                    </Grid>
                </Grid>
                
            </Box>
            
        </UserProvider>
    );
}

