import React, { useState, useEffect } from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  AppBar,
  Toolbar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Divider,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  InputAdornment,
} from '@mui/material';
import axios from 'axios';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import AddIcon from '@mui/icons-material/Add';
import LogoutIcon from '@mui/icons-material/Logout';
import Swal from 'sweetalert2';
import config from '../config';
import CardMedia from '@mui/material/CardMedia';
import eventImage from "../assets/images/event.jpg";
import { styled } from "@mui/material/styles";
import EmailIcon from "@mui/icons-material/Email";
import LockIcon from "@mui/icons-material/Lock";
import PersonIcon from '@mui/icons-material/Person';

const BackgroundContainer = styled("div")({
  background: '#f2f6ff',
  minHeight: "100vh",
});

const VendorDashboard = () => {
  const [events, setEvents] = useState([]);
  const [openEventModal, setOpenEventModal] = useState(false);
  const [openVendorsModal, setOpenVendorsModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [vendors, setVendors] = useState([]);
  const [openAddVendor, setOpenAddVendor] = useState(false);

  const authToken = localStorage.getItem('authToken'); 


  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get(`${config.apiUrl}api/events`, {
          headers: { Authorization: `Bearer ${authToken}` },
        });
        setEvents(response.data);
      } catch (error) {
        console.error('Failed to fetch events:', error.response || error);
      }
    };
    fetchEvents();
  }, [authToken]);


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
      password: Yup.string().required("Password is required")
        .min(6, "Password must be at least 6 characters")
        .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
        .matches(/[a-z]/, "Password must contain at least one lowercase letter")
        .matches(/[0-9]/, "Password must contain at least one number")
    }),
    onSubmit: async (values) => {
      try {
          const customerValues = { ...values, userType: 'vendor' };
  
          const response = await axios.post(`${config.apiUrl}api/auth/signup`, customerValues);
          console.log("Vendor Added Successfully", response.data);

          Swal.fire({
            title: 'Success',
            text: 'Vendor added successfully!',
            icon: 'success',
            customClass: {
                container: 'swal2-custom-z-index'
            }
          });

          handleCloseAddVendor();
          formik.resetForm();
          fetchVendors();
  
      } catch (error) {
          console.error("Vendor Added Failed:", error.response ? error.response.data : error.message);

          Swal.fire({
            title: 'Error',
            text: error.response ? error.response.data : 'Failed to add vendor.',
            icon: 'error',
            customClass: {
                container: 'swal2-custom-z-index'
            }
        });
      }
  },
  
  });


  const fetchEvents = async () => {
    try {
      const response = await axios.get(`${config.apiUrl}api/events`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      setEvents(response.data);
    } catch (error) {
      console.error('Failed to fetch events:', error.response || error);
    }
  };

  // Fetch vendors
  const fetchVendors = async () => {
    try {
      const response = await axios.get(`${config.apiUrl}api/vendors`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      setVendors(response.data);
    } catch (error) {
      console.error('Failed to fetch vendors:', error.response || error);
      Swal.fire({
        title: 'Error',
        text: 'Failed to fetch vendors.',
        icon: 'error',
        customClass: {
          container: 'swal2-custom-z-index',
        },
      });
    }
  };

  
  const handleCloseAddVendor = async () => {
    setOpenAddVendor(false);
  };

  const handleOpenAddVendor = async () => {
    setOpenAddVendor(true);
  };

  const handleOpenVendorsModal = async () => {
    fetchVendors();
    setOpenVendorsModal(true);
  };

  const handleCloseVendorsModal = () => setOpenVendorsModal(false);

  const handleOpenEventModal = (event) => {
    fetchEvents();
    setSelectedEvent(event);
    setOpenEventModal(true);
  };

  const handleCloseEventModal = () => {
    setOpenEventModal(false);
    setIsEditing(false);
    fetchEvents();
  };


  const handleDeleteEvent = async () => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
      customClass: {
        container: 'swal2-custom-z-index'
      }
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(`${config.apiUrl}api/events/${selectedEvent._id}`, {
          headers: { Authorization: `Bearer ${authToken}` },
        });
        setEvents(events.filter(event => event._id !== selectedEvent._id));
        handleCloseEventModal();

        Swal.fire('Deleted!', 'Your event has been deleted.', 'success');
      } catch (error) {
        console.error('Failed to delete event:', error.response || error);
        Swal.fire('Error!', 'Failed to delete the event.', 'error');
      }
    }
  };

  const handleLogout = async () => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "Do you really want to log out?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, log out'
    });
  
    if (result.isConfirmed) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      // await Swal.fire('Logged Out', 'You have successfully logged out.', 'success');
      window.location.href = '/';
    }
  };

  

  // Toggle event status function
  const toggleEventStatus = async () => {
    if (!selectedEvent) return;

    try {
      const updatedEvent = { ...selectedEvent, isActive: !selectedEvent.isActive };
      await axios.put(`${config.apiUrl}api/events/${selectedEvent._id}`, updatedEvent, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      
      setSelectedEvent(updatedEvent); // Update local selectedEvent state
      setEvents(events.map(event => event._id === selectedEvent._id ? updatedEvent : event)); // Update events list

      Swal.fire({
        title: 'Success',
        text: `Event status updated to ${updatedEvent.isActive ? 'Active' : 'Inactive'}.`,
        icon: 'success',
        customClass: {
          container: 'swal2-custom-z-index'
      }
      });
    } catch (error) {
      console.error('Failed to update event status:', error.response || error);
      Swal.fire({
        title: 'Error',
        text: 'Failed to update event status.',
        icon: 'error',
        customClass: {
          container: 'swal2-custom-z-index'
        }
      });
    }
  };

  // Formik for editing the existing event
  const editFormik = useFormik({
    enableReinitialize: true,
    initialValues: {
      ticketPrice: selectedEvent?.ticketPrice || '',
      ticketReleaseRate: selectedEvent?.ticketReleaseRate || '',
    },
    validationSchema: Yup.object({
      ticketPrice: Yup.number().required('Ticket price is required').positive('Must be positive'),
      ticketReleaseRate: Yup.number().required('Ticket release rate is required').positive('Must be positive'),
    }),
    onSubmit: async (values) => {
      try {
        const updatedEvent = {
          ...selectedEvent,
          ticketPrice: values.ticketPrice,
          ticketReleaseRate: values.ticketReleaseRate,
        };
        await axios.put(`${config.apiUrl}api/events/${selectedEvent._id}`, updatedEvent, {
          headers: { Authorization: `Bearer ${authToken}` },
        });
        setEvents(events.map(event => event._id === selectedEvent._id ? updatedEvent : event));
        setSelectedEvent(updatedEvent);
        Swal.fire({
          title: 'Success',
          text: 'Event details updated successfully!',
          icon: 'success',
          customClass: {
            container: 'swal2-custom-z-index'
          }
        });
        setIsEditing(false);
      } catch (error) {
        console.error('Failed to update event:', error.response || error);
        Swal.fire({
          title: 'Error',
          text: 'Failed to update event.',
          icon: 'error',
          customClass: {
            container: 'swal2-custom-z-index'
          }
        });
      }
    },
  });


  return (
    <BackgroundContainer>

      <AppBar position="static"  color="primary" sx={{ mb: 4 , mx:0 }}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Admin Dashboard
          </Typography>
          <Button color="inherit" onClick={handleLogout}>
            <LogoutIcon sx={{ mr: 1 }} />
            Logout
          </Button>
        </Toolbar>
      </AppBar>

      <Box mx={4} mb={3}>

      <Grid container alignItems="center" justifyContent="space-between">
        <Grid item>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Events
          </Typography>
        </Grid>
        <Grid item>
          <Button variant="contained" color="primary" onClick={handleOpenVendorsModal}>
            Vendors
          </Button>
        </Grid>
      </Grid>

      <Divider sx={{mt:1, mb:4}} />

        <Grid container spacing={4}>
          {events.map((event) => (
            <Grid item xs={12} sm={6} md={4} key={event._id}>

          <Card 
            sx={{
              display: 'flex',
              boxShadow: event.isActive ? '0px 4px 0px rgba(8, 228, 84, 0.8)' : '0px 4px 0px rgba(234, 18, 19, 0.8)',
            }}
            onClick={() => handleOpenEventModal(event)} 
          >
                <Box flex={1} sx={{ display: 'flex', flexDirection: 'column' }}>
                  <CardContent sx={{ flex: '1 0 auto' }}>
                    <Typography component="div" variant="h5" fontWeight={500}  >
                      {event.name}
                    </Typography>
                    <Typography
                      variant="subtitle2"
                      component="div"
                      sx={{ color: 'text.secondary' }}
                      gutterBottom
                      mt={-0.5}
                    >
                      ({event.createdBy})
                    </Typography>
                    <Typography
                      variant="subtitle2"
                      component="div"
                      sx={{ color: 'text.secondary' }}
                    >
                      Total Tickets: {event.totalTickets}
                    </Typography>
                    <Typography
                      variant="subtitle2"
                      component="div"
                      sx={{ color: 'text.secondary' }}
                    >
                      Tickets Sold: {event.ticketsSold}
                    </Typography>
                    <Typography
                      variant="subtitle2"
                      component="div"
                      sx={{ color: 'text.secondary' }}
                    >
                      Price (Rs.) : {event.ticketPrice}
                    </Typography>
                  </CardContent>
                </Box>
                <CardMedia
                  component="img"
                  sx={{ width: 160 }}
                  image={eventImage}
                  alt="event-img"
                />
              </Card>
            </Grid>
          ))}
        </Grid>

      </Box>

      {/* Event Details Popup */}
      <Dialog maxWidth="md" fullWidth open={openEventModal} onClose={handleCloseVendorsModal}>
      <DialogTitle fontWeight={600} >
        <Grid container justifyContent={'space-between'} >
          <Grid item>
            {selectedEvent?.name || 'Event Details'}
          </Grid>

        </Grid>
        
        
      </DialogTitle>
      <DialogContent dividers>
        {selectedEvent && (
          <form onSubmit={editFormik.handleSubmit}>
          <Grid container spacing={2} >
            <Grid item xs={6} >
              <Typography color="#4e6990" variant="body2" mt={2} gutterBottom> 
                Max Ticket Capacity
              </Typography>
              <TextField
                variant="outlined"
                size='small'
                fullWidth
                disabled
                value={selectedEvent.maxCapacity}
                //onChange=
                InputProps={{
                  sx: { fontSize: "0.8rem" },
                }}
              />
            </Grid>
            <Grid item xs={6} >
              <Typography color="#4e6990" variant="body2" mt={2} gutterBottom> 
                Tickets Sold
              </Typography>
              <TextField
                variant="outlined"
                size='small'
                fullWidth
                disabled
                value={selectedEvent.ticketsSold}
                //onChange=
                InputProps={{
                  sx: { fontSize: "0.8rem" },
                }}
              />
            </Grid>
            <Grid item xs={6} >
              <Typography color="#4e6990" variant="body2" mt={2} gutterBottom> 
                Ticket Price ( LKR )
              </Typography>
              <TextField
                    variant="outlined"
                    size="small"
                    fullWidth
                    name="ticketPrice"
                    value={editFormik.values.ticketPrice}
                    onChange={editFormik.handleChange}
                    onBlur={editFormik.handleBlur}
                    disabled={!isEditing}
                    error={editFormik.touched.ticketPrice && Boolean(editFormik.errors.ticketPrice)}
                    helperText={editFormik.touched.ticketPrice && editFormik.errors.ticketPrice}
                    InputProps={{
                      sx: { fontSize: "0.8rem" },
                    }}
              />
            </Grid>
            <Grid item xs={6} >
              <Typography color="#4e6990" variant="body2" mt={2} gutterBottom> 
                Total Tickets
              </Typography>
              <TextField
                variant="outlined"
                size='small'
                fullWidth
                disabled
                value={selectedEvent.totalTickets}
                //onChange=
                InputProps={{
                  sx: { fontSize: "0.8rem" },
                }}
              />
            </Grid>
            <Grid item xs={6} >
              <Typography color="#4e6990" variant="body2" mt={2} gutterBottom> 
                Ticket Release Rate ( per hour )
              </Typography>
              <TextField
                    variant="outlined"
                    size="small"
                    fullWidth
                    name="ticketReleaseRate"
                    value={editFormik.values.ticketReleaseRate}
                    onChange={editFormik.handleChange}
                    onBlur={editFormik.handleBlur}
                    disabled={!isEditing}
                    error={editFormik.touched.ticketReleaseRate && Boolean(editFormik.errors.ticketReleaseRate)}
                    helperText={editFormik.touched.ticketReleaseRate && editFormik.errors.ticketReleaseRate}
                    InputProps={{
                      sx: { fontSize: "0.8rem" },
                    }}
              />
            </Grid>

          </Grid>
          </form>
        )}
      </DialogContent>
      <DialogActions>
        <Grid container  justifyContent="space-between">
          <Grid item>
            <Switch
                checked={selectedEvent?.isActive || false}
                onChange={toggleEventStatus}
                color="primary"
                inputProps={{ 'aria-label': 'Event Status Toggle' }}
            />
          </Grid>
          <Grid item >
            <Button sx={{marginRight:2}} onClick={handleDeleteEvent} color="error" variant="contained">
              Delete Event
            </Button>
            <Button onClick={handleCloseEventModal} color="primary" variant="contained">
              Close
            </Button>      
          </Grid>
        </Grid>
   
      </DialogActions>
    </Dialog>

      {/* Vendors Popup */}
      <Dialog maxWidth="md" fullWidth open={openVendorsModal} onClose={handleCloseVendorsModal}>
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          Vendors
          <Button variant="contained" color="primary" onClick={handleOpenAddVendor}>
            <AddIcon sx={{ mr: 1 }} />
              Add Vendor
          </Button>
        </DialogTitle>
        <DialogContent dividers>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Joined Date</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {vendors.map((vendor) => (
                <TableRow key={vendor._id}>
                  <TableCell>
                    {vendor.firstName} {vendor.lastName}
                  </TableCell>
                  <TableCell>{vendor.email}</TableCell>
                  <TableCell>{new Date(vendor.createdAt).toLocaleDateString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseVendorsModal} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>


      {/* Create Vendor Popup */}
      <Dialog maxWidth="sm" fullWidth open={openAddVendor} onClose={handleCloseAddVendor}>
        <DialogTitle align='center' >Add New Vendor</DialogTitle>
        <DialogContent dividers>
          <form onSubmit={formik.handleSubmit}>
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
                
                </Grid>
            <DialogActions>
              <Button onClick={handleCloseAddVendor} color="primary">
                Cancel
              </Button>
              <Button type="submit" color="primary" variant="contained">
                Create Event
              </Button>
            </DialogActions>
          </form>
        </DialogContent>
      </Dialog>

    </BackgroundContainer>
  );
};

export default VendorDashboard;
