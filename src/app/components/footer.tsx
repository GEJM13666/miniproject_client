import React from 'react';
import { Box, Typography, Link, Grid } from '@mui/material';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';
import YouTubeIcon from '@mui/icons-material/YouTube'; // Import YouTube icon

const Footer = () => {
    return (
        <Box 
            sx={{ 
                backgroundColor: '#FFD700', // Sunflower yellow
                color: '#002147', // Dark blue for text
                padding: '40px 20px',
                marginTop: '20px',
                borderTop: '5px solid #f5f5f5',
            }}
        >
            <Grid container spacing={4} justifyContent="center">
                <Grid item xs={12} sm={4} textAlign="center">
                    <Typography variant="h6" sx={{ fontWeight: 'bold', marginBottom: '20px' }}>
                        เกี่ยวกับเรา
                    </Typography>
                    <Typography variant="body2" sx={{ marginBottom: '10px' }}>
                        คณะวิทยาศาสตร์และนวัตกรรมดิจิทัล มหาวิทยาลัยทักษิณ
                        <br />
                        222 หมู่ 2 ต.บ้านพร้าว อ.ป่าพะยอม จ.พัทลุง 93210
                    </Typography>
                    <Link href="https://scidi.tsu.ac.th/" color="inherit" sx={{ display: 'block', marginTop: '10px' }}>
                        Learn More
                    </Link>
                </Grid>
                <Grid item xs={12} sm={4} textAlign="center">
                    <Typography variant="h6" sx={{ fontWeight: 'bold', marginBottom: '20px' }}>
                        เพิ่มเติม
                    </Typography>
                    <Link href="https://scidi.tsu.ac.th/history" color="inherit" sx={{ display: 'block', marginBottom: '10px' }}>
                        ประวัติคณะ
                    </Link>
                    <Link href="/research" color="inherit" sx={{ display: 'block', marginBottom: '10px' }}>
                        Research Opportunities
                    </Link>
                    <Link href="https://scidi.tsu.ac.th/science_maps" color="inherit" sx={{ display: 'block', marginBottom: '10px' }}>
                        แผนที่
                    </Link>
                </Grid>
                <Grid item xs={12} sm={4} textAlign="center">
                    <Typography variant="h6" sx={{ fontWeight: 'bold', marginBottom: '20px' }}>
                        Social Media
                    </Typography>
                    <Grid container spacing={2} justifyContent="center">
                        <Grid item>
                            <Link 
                                href="https://www.facebook.com/@scidi.tsu" 
                                color="inherit"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <FacebookIcon fontSize="large" />
                            </Link>
                        </Grid>
                        <Grid item>
                            <Link 
                                href="https://x.com/sci_tsu" 
                                color="inherit"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <TwitterIcon fontSize="large" />
                            </Link>
                        </Grid>
                        <Grid item>
                            <Link 
                                href="https://www.instagram.com/scidi_tsu" 
                                color="inherit"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <InstagramIcon fontSize="large" />
                            </Link>
                        </Grid>
                        <Grid item>
                            <Link 
                                href="https://www.youtube.com/@SciDITSU" // Update with your YouTube channel link
                                color="inherit"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <YouTubeIcon fontSize="large" />
                            </Link>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
            <Box sx={{ textAlign: 'center', marginTop: '20px' }}>
                <Typography variant="body2">
                    © {new Date().getFullYear()} Faculty of Science and Digital Innovation. All rights reserved.
                </Typography>
                <Typography variant="caption" sx={{ display: 'block', marginTop: '10px' }}>
                
                </Typography>
            </Box>
        </Box>
    );
};

export default Footer;
