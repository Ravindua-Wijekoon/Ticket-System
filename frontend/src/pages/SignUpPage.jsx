import React from 'react';
import axios from 'axios';  // Import Axios
import { Container, TextField, Button, Typography, Box, Paper, Grid, InputAdornment } from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import { styled } from "@mui/material/styles";
import EmailIcon from "@mui/icons-material/Email";
import LockIcon from "@mui/icons-material/Lock";
import PersonIcon from '@mui/icons-material/Person';
import images from "../constants/images";
import { NavLink } from 'react-router-dom';
import config from '../config';
import { useNavigate } from 'react-router-dom';


const BackgroundContainer = styled("div")({
  background: '#f2f6ff',
  minHeight: "100vh",
});

function SignUpPage() {
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      firstName: Yup.string().required("First Name is required"),
      lastName: Yup.string().required("Last Name is required"),
      email: Yup.string().email("Invalid email address").required("Email is required"),
      password: Yup.string()
        .min(6, "Password must be at least 6 characters")
        .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
        .matches(/[a-z]/, "Password must contain at least one lowercase letter")
        .matches(/[0-9]/, "Password must contain at least one number")
    }),
    onSubmit: async (values) => {
      try {
          const customerValues = { ...values, userType: 'customer' };
  
          const response = await axios.post(`${config.apiUrl}api/auth/signup`, customerValues);
          console.log("Signup Successful:", response.data);
  
          navigate('/');
      } catch (error) {
          console.error("Signup Failed:", error.response ? error.response.data : error.message);
      }
  },
  
  });

  return (
    <BackgroundContainer>
      <Container>
        <Grid container spacing={0} alignItems="center" justifyContent="center" sx={{ minHeight: "100vh" }}>
          <Grid item xs={12} sm={10} md={8}>
            <Box
              component="img"
              src={images.logo}
              alt="Logo"
              sx={{
                width: 150,
                height: "auto",
                position: "absolute",
                top: 20,
                left: "50%",
                transform: "translateX(-50%)",
                zIndex: 1,
                opacity: 1,
              }}
            />
            <Paper
              elevation={8}
              sx={{
                padding: 3,
                borderRadius: 3,
                position: "relative",
                zIndex: 2,
              }}
            >
              <Typography variant="h5" color="#31507d" align="center" mb={-1} gutterBottom sx={{ fontWeight: 500 }}>
                Create Account
              </Typography>
              <Typography color="#a3b1c5" align="center" mb={6} variant="body2" sx={{ mt: 2, fontWeight: 200 }}>
                Please fill in the details below to create your account.
              </Typography>
              <Box component="form" onSubmit={formik.handleSubmit} sx={{ mt: 2 }}>

                <Grid container spacing={2}>
                    <Grid item xs={6}>
                        <Typography color="#4e6990" variant="body2" gutterBottom>
                        First Name
                        </Typography>
                        <TextField
                        variant="outlined"
                        fullWidth
                        name="firstName"
                        size="small"
                        placeholder="Enter your first name"
                        value={formik.values.firstName}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.firstName && Boolean(formik.errors.firstName)}
                        helperText={formik.touched.firstName && formik.errors.firstName}
                        InputProps={{
                            startAdornment: (
                            <InputAdornment position="start">
                                <PersonIcon sx={{ ml: -0.5, fontSize: "1rem", color: "gray" }} />
                            </InputAdornment>
                            ),
                            sx: { fontSize: "0.8rem" },
                        }}
                        FormHelperTextProps={{
                            sx: { marginLeft: 0 },
                          }}
                        />
                    </Grid>

                    <Grid item xs={6}>
                        <Typography color="#4e6990" variant="body2" gutterBottom >
                        Last Name
                        </Typography>
                        <TextField
                        variant="outlined"
                        fullWidth
                        name="lastName"
                        size="small"
                        placeholder="Enter your last name"
                        value={formik.values.lastName}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.lastName && Boolean(formik.errors.lastName)}
                        helperText={formik.touched.lastName && formik.errors.lastName}
                        InputProps={{
                            startAdornment: (
                            <InputAdornment position="start">
                                <PersonIcon sx={{ ml: -0.5, fontSize: "1rem", color: "gray" }} />
                            </InputAdornment>
                            ),
                            sx: { fontSize: "0.8rem" },
                        }}
                        FormHelperTextProps={{
                            sx: { marginLeft: 0 },
                          }}
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <Typography color="#4e6990" variant="body2" gutterBottom>
                        Email
                        </Typography>
                        <TextField
                        variant="outlined"
                        fullWidth
                        name="email"
                        size="small"
                        placeholder="Enter your email"
                        value={formik.values.email}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.email && Boolean(formik.errors.email)}
                        helperText={formik.touched.email && formik.errors.email}
                        InputProps={{
                            startAdornment: (
                            <InputAdornment position="start">
                                <EmailIcon sx={{ ml: -0.5, fontSize: "1rem", color: "gray" }} />
                            </InputAdornment>
                            ),
                            sx: { fontSize: "0.8rem" },
                        }}
                        FormHelperTextProps={{
                            sx: { marginLeft: 0 },
                          }}
                        />
                    </Grid>
                    
                    <Grid item xs={12}>
                        <Typography color="#4e6990" variant="body2" gutterBottom>
                        Password
                        </Typography>
                        <TextField
                        type="password"
                        variant="outlined"
                        fullWidth
                        size="small"
                        name="password"
                        placeholder="Enter your password"
                        value={formik.values.password}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.password && Boolean(formik.errors.password)}
                        helperText={formik.touched.password && formik.errors.password}
                        InputProps={{
                            startAdornment: (
                            <InputAdornment position="start">
                                <LockIcon sx={{ ml: -0.5, fontSize: "1rem", color: "gray" }} />
                            </InputAdornment>
                            ),
                            sx: { fontSize: "0.8rem" },
                        }}
                        FormHelperTextProps={{
                            sx: { marginLeft: 0 },
                          }}
                        />
                    </Grid>
                    
                    {/* <Grid item xs={6}>
                        <Typography color="#4e6990" variant="body2" gutterBottom>
                        User Type
                        </Typography>
                        <Select
                            name="userType"
                            fullWidth
                            value={formik.values.userType}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.userType && Boolean(formik.errors.userType)}
                            size="small"
                            MenuProps={{
                                PaperProps: {
                                sx: {
                                    fontSize: "0.8rem",
                                },
                                },
                            }}
                            sx={{ fontSize: "0.8rem" }}
                        >
                            <MenuItem value="" sx={{ fontSize: "0.8rem" }}>
                            <em>Select User Type</em>
                            </MenuItem>
                            <MenuItem value="customer" sx={{ fontSize: "0.8rem" }}>
                            Customer
                            </MenuItem>
                            <MenuItem value="vendor" sx={{ fontSize: "0.8rem" }}>
                            Vendor
                            </MenuItem>
                        </Select>
                        {formik.touched.userType && formik.errors.userType && (
                            <Typography color="error" variant="body2" sx={{ fontSize: "0.75rem" }}>
                            {formik.errors.userType}
                            </Typography>
                        )}
                    </Grid> */}
                
                </Grid>
                <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 3, mb: 2 }}>
                  Sign Up
                </Button>
                <Typography align="center" variant="body2" sx={{ mt: 2, fontWeight: 200 }}>
                  Already have an account?{" "}
                  <NavLink
                    to="/"
                    style={({ isActive }) => ({
                      textDecoration: "none",
                      color: "#6e8efb",
                      fontWeight: isActive ? "bold" : "normal",
                    })}
                  >
                    Log In
                  </NavLink>
                </Typography>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </BackgroundContainer>
  );
}

export default SignUpPage;
