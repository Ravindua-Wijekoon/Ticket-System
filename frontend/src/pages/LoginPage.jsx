import React, { useState } from "react";
import axios from "axios";
import { 
  Container, TextField, Button, Typography, Box, Paper, Grid, InputAdornment, IconButton 
} from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import { styled } from "@mui/material/styles";
import EmailIcon from "@mui/icons-material/Email";
import LockIcon from "@mui/icons-material/Lock";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { NavLink, useNavigate } from 'react-router-dom';
import config from '../config';

const BackgroundContainer = styled("div")({
  background: '#f2f6ff',
  minHeight: "100vh",
});

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleClickShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string().email("Invalid email address").required("Email is required"),
      password: Yup.string().required("Password is required"),
    }),
    onSubmit: async (values) => {
      try {
        const response = await axios.post(`${config.apiUrl}api/auth/login`, values);
        console.log("Login response:", response.data);
        const { token, user } = response.data;

        // Save the token to localStorage
        localStorage.setItem("authToken", token);

        // Navigate to the appropriate dashboard
        //test
        if (user.userType === "vendor") {
            navigate("/vendor-dashboard", { state: { user } });
        } else if (user.userType === "admin") {
            navigate("/admin-dashboard", { state: { user } });
        } else {
            navigate("/customer-dashboard", { state: { user } });
        }
      
      } catch (error) {
        console.error("Login Failed:", error.response ? error.response.data : error.message);
      }
    }
  });

  return (
    <BackgroundContainer>
      <Container>
        <Grid container spacing={0} alignItems="center" justifyContent="center" sx={{ minHeight: "100vh" }}>
          <Grid item xs={12} sm={7} md={4.5}>
            <Paper 
              elevation={8} 
              sx={{
                padding: 6,
                borderRadius: 3,
                position: "relative",
                zIndex: 2,
              }}
            >
              <Typography variant="h5" color="#31507d" align="center" mb={-1} gutterBottom sx={{ fontWeight: 500 }}>
                Welcome Back
              </Typography>
              <Typography color="#a3b1c5" align="center" mb={6} variant="body2" sx={{ mt: 2, fontWeight: 200 }}>
                Enter your credentials to access your account
              </Typography>
              <Box component="form" onSubmit={formik.handleSubmit} sx={{ mt: 2 }}>
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
                    sx: { fontSize: "0.8rem" }
                  }}
                />

                <Typography color="#4e6990" variant="body2" gutterBottom mt={2}>
                  Password
                </Typography>
                <TextField
                  type={showPassword ? "text" : "password"}
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
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={handleClickShowPassword} edge="end">
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                    sx: { fontSize: "0.8rem" }
                  }}
                />

                <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 3, mb: 2 }}>
                  Login
                </Button>
                <Typography align="center" variant="body2" sx={{ mt: 2, fontWeight: 200 }}>
                  Don't have an account?{" "}
                  <NavLink
                    to="/signup"
                    style={({ isActive }) => ({
                      textDecoration: "none",
                      color: "#6e8efb", 
                      fontWeight: isActive ? "bold" : "normal",
                    })}
                  >
                    Sign Up
                  </NavLink>
                </Typography>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </BackgroundContainer>
  );
};

export default LoginPage;
