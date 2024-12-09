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
  IconButton
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
import EditIcon from '@mui/icons-material/Edit';
import FileDownloadDoneIcon from '@mui/icons-material/FileDownloadDone';

const BackgroundContainer = styled("div")({
  background: '#f2f6ff',
  minHeight: "100vh",
});

const VendorDashboard = () => {
  const [events, setEvents] = useState([]);
  const [openEventModal, setOpenEventModal] = useState(false);
  const [openCreateEventModal, setOpenCreateEventModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [ticketQuantity, setTicketQuantity] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

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

  const handleOpenEventModal = (event) => {
    fetchEvents();
    setSelectedEvent(event);
    setOpenEventModal(true);
  };

  const handleOpenCreateEventModal = () => setOpenCreateEventModal(true);
  const handleCloseEventModal = () => {
    setOpenEventModal(false);
    setIsEditing(false);
    fetchEvents();
  };
  const handleCloseCreateEventModal = () => {
    setOpenCreateEventModal(false);
    fetchEvents();
  };

  // Formik for handling the form submission
  const formik = useFormik({
    initialValues: {
        name: '',
        place: '', 
        date: '',  
        time: '', 
        maxCapacity: '',
        ticketReleaseRate: '',
        ticketPrice: '',
        totalTickets: '',
        ticketPurchaseRate: '', 
    },
    validationSchema: Yup.object({
        name: Yup.string().required('Event name is required'),
        place: Yup.string().required('Place is required'), 
        date: Yup.date()
            .required('Date is required')
            .min(new Date(), 'Date must be in the future'),
        time: Yup.string()
            .required('Time is required')
            .matches(/^([0-9]{2}):([0-9]{2})$/, 'Time must be in HH:mm format'),
        maxCapacity: Yup.number().required('Max capacity is required').positive('Must be positive'),
        ticketReleaseRate: Yup.number().required('Ticket release rate is required').positive('Must be positive'),
        ticketPrice: Yup.number().required('Ticket price is required').positive('Must be positive'),
        totalTickets: Yup.number().required('No. of Tickets Release Now is required').positive('Must be positive').test(
            'lessThanMaxCapacity',
            'No. of Tickets Release Now must be less than Max Capacity',
            function (value) {
                const { maxCapacity } = this.parent;
                return value <= maxCapacity;
            }
        ),
        ticketPurchaseRate: Yup.number()
            .required('Max tickets per customer is required')
            .positive('Must be positive'),
    }),
    onSubmit: async (values) => {
        try {
            const response = await axios.post(`${config.apiUrl}api/events`, values, {
                headers: { Authorization: `Bearer ${authToken}` },
            });
            setEvents([...events, response.data]);
            handleCloseCreateEventModal();
            formik.resetForm(); // Reset the form after submission
        } catch (error) {
            console.error('Failed to create event:', error.response || error);
        }
    },
});

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

  const handleAddTickets = async (quantity) => {
    if (!selectedEvent || quantity <= 0) return;

    try {
        if (quantity > selectedEvent.ticketReleaseRate) {
            return Swal.fire({
                title: 'Error',
                text: `Cannot add more than ${selectedEvent.ticketReleaseRate} tickets in one hour.`,
                icon: 'error',
                customClass: {
                    container: 'swal2-custom-z-index'
                }
            });
        }
        if (selectedEvent.totalTickets + selectedEvent.ticketsSold + Number(quantity) > selectedEvent.maxCapacity) {
            return Swal.fire({
                title: 'Error',
                text: `Adding tickets would exceed the maximum event capacity.`,
                icon: 'error',
                customClass: {
                    container: 'swal2-custom-z-index'
                }
            });
        }

        await axios.post(
            `${config.apiUrl}api/events/add-tickets`,
            { eventId: selectedEvent._id, ticketsToAdd: Number(quantity) },
            { headers: { Authorization: `Bearer ${authToken}` } }
        );

        fetchEvents();

        setTicketQuantity(null);
        Swal.fire({
            title: 'Success',
            text: `${quantity} tickets added successfully!`,
            icon: 'success',
            customClass: {
                container: 'swal2-custom-z-index'
            }
        });
        handleCloseEventModal()
    } catch (error) {
        const errorMessage = error.response?.data?.error || 'Failed to add tickets.';
        Swal.fire({
            title: 'Error',
            text: errorMessage,
            icon: 'error',
            customClass: {
                container: 'swal2-custom-z-index'
            }
        });
    }
};

  
  const handleAddTicket = () => {
    handleAddTickets(ticketQuantity);
    setTicketQuantity(null); // Reset the field after adding tickets
  };

  const handleTicketChange = (event) => {
    setTicketQuantity(event.target.value);
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

  const editFormik = useFormik({
    enableReinitialize: true,
    initialValues: {
      ticketPrice: selectedEvent?.ticketPrice || '',
      ticketReleaseRate: selectedEvent?.ticketReleaseRate || '',
      place: selectedEvent?.place || '',
      date: selectedEvent?.date ? new Date(selectedEvent.date).toISOString().split('T')[0] : '',
      time: selectedEvent?.time || '',
    },
    validationSchema: Yup.object({
      ticketPrice: Yup.number().required('Ticket price is required').positive('Must be positive'),
      ticketReleaseRate: Yup.number().required('Ticket release rate is required').positive('Must be positive'),
      place: Yup.string().required('Place is required'),
      date: Yup.date()
        .required('Date is required')
        .min(new Date(), 'Date must be in the future'),
      time: Yup.string()
        .required('Time is required')
        .matches(/^([0-9]{2}):([0-9]{2})$/, 'Time must be in HH:mm format'),
    }),
    onSubmit: async (values) => {
      try {
        const updatedEvent = {
          ...selectedEvent,
          ticketPrice: values.ticketPrice,
          ticketReleaseRate: values.ticketReleaseRate,
          place: values.place,
          date: values.date,
          time: values.time,
        };
        await axios.put(`${config.apiUrl}api/events/${selectedEvent._id}`, updatedEvent, {
          headers: { Authorization: `Bearer ${authToken}` },
        });
        setEvents(events.map((event) => (event._id === selectedEvent._id ? updatedEvent : event)));
        setSelectedEvent(updatedEvent);
        Swal.fire({
          title: 'Success',
          text: 'Event details updated successfully!',
          icon: 'success',
          customClass: {
            container: 'swal2-custom-z-index',
          },
        });
        setIsEditing(false);
      } catch (error) {
        console.error('Failed to update event:', error.response || error);
        Swal.fire({
          title: 'Error',
          text: 'Failed to update event.',
          icon: 'error',
          customClass: {
            container: 'swal2-custom-z-index',
          },
        });
      }
    },
  });
  

  return (
    <BackgroundContainer>

      <AppBar position="static"  color="primary" sx={{ mb: 4 , mx:0 }}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Vendor Dashboard
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
          <Button variant="contained" color="primary" onClick={handleOpenCreateEventModal}>
            <AddIcon sx={{ mr: 1 }} />
            Create Event
          </Button>
        </Grid>
      </Grid>

      <Divider sx={{mt:1, mb:4}} />

        <Grid container spacing={4}>
          {events.map((event) => {
            const eventDate = new Date(event.date);
            const options = { day: 'numeric', month: 'long', year: 'numeric' };
            const formattedDate = eventDate.toLocaleDateString('en-US', options);
            const formattedTime = event.time || '';

            return (
              <Grid item xs={12} sm={6} md={4} key={event._id}>
                <Card
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between', 
                    height: '100%',
                    boxShadow: event.isActive
                      ? '0px 4px 0px rgba(8, 228, 84, 0.8)'
                      : '0px 4px 0px rgba(234, 18, 19, 0.8)',
                  }}
                  onClick={() => handleOpenEventModal(event)}
                >
                  <Box flex={1} sx={{ display: 'flex', flexDirection: 'column' }}>
                    <CardContent sx={{ flex: '1 0 auto' }}>
                      <Typography component="div" variant="h5" fontWeight={500}>
                        {event.name}
                      </Typography>
                      <Typography
                        variant="subtitle2"
                        component="div"
                        sx={{ color: 'text.secondary', marginBottom: 1 }}
                      >
                        {formattedDate} <Typography component="span" sx={{ fontWeight: 'bold' }}>on</Typography> {event.place} <Typography component="span" sx={{ fontWeight: 'bold' }}>at</Typography> {formattedTime}
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
                        Price (Rs.): {event.ticketPrice}
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
            );
          })}
        </Grid>

      </Box>

      {/* Event Details Popup */}
      <Dialog maxWidth="md" fullWidth open={openEventModal} onClose={handleCloseEventModal}>
      <DialogTitle fontWeight={600} >
        <Grid container justifyContent={'space-between'} >
          <Grid item>
            {selectedEvent?.name || 'Event Details'}
          </Grid>
          <Grid item>
            <IconButton onClick={() => setIsEditing(!isEditing)} sx={{ ml: 1 }}>
                {isEditing ? 
                  <FileDownloadDoneIcon color='primary' onClick={editFormik.handleSubmit} /> 
                  : 
                  <EditIcon color='primary' />
                }
            </IconButton>
          </Grid>

        </Grid>
        
        
      </DialogTitle>
      <DialogContent dividers>
        {selectedEvent && (
          <form onSubmit={editFormik.handleSubmit}>
          <Grid container spacing={2} >
            <Grid item xs={6}>
              <Typography color="#4e6990" variant="body2" mt={2} gutterBottom>
                Place
              </Typography>
              <TextField
                variant="outlined"
                size="small"
                fullWidth
                name="place"
                value={editFormik.values.place || ''}
                onChange={editFormik.handleChange}
                onBlur={editFormik.handleBlur}
                disabled={!isEditing}
                error={editFormik.touched.place && Boolean(editFormik.errors.place)}
                helperText={editFormik.touched.place && editFormik.errors.place}
                InputProps={{
                  sx: { fontSize: '0.8rem' },
                }}
              />
            </Grid>

            {/* Date */}
            <Grid item xs={6}>
              <Typography color="#4e6990" variant="body2" mt={2} gutterBottom>
                Date
              </Typography>
              <TextField
                variant="outlined"
                size="small"
                fullWidth
                type="date"
                name="date"
                value={editFormik.values.date || ''}
                onChange={editFormik.handleChange}
                onBlur={editFormik.handleBlur}
                disabled={!isEditing}
                error={editFormik.touched.date && Boolean(editFormik.errors.date)}
                helperText={editFormik.touched.date && editFormik.errors.date}
                InputProps={{
                  sx: { fontSize: '0.8rem' },
                }}
              />
            </Grid>

            {/* Time */}
            <Grid item xs={6}>
              <Typography color="#4e6990" variant="body2" mt={2} gutterBottom>
                Time
              </Typography>
              <TextField
                variant="outlined"
                size="small"
                fullWidth
                type="time"
                name="time"
                value={editFormik.values.time || ''}
                onChange={editFormik.handleChange}
                onBlur={editFormik.handleBlur}
                disabled={!isEditing}
                error={editFormik.touched.time && Boolean(editFormik.errors.time)}
                helperText={editFormik.touched.time && editFormik.errors.time}
                InputProps={{
                  sx: { fontSize: '0.8rem' },
                }}
              />
            </Grid>

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

            {/* Input field to add ticket quantity */}
            <Typography color="#4e6990" variant="body2" mt={4} gutterBottom> 
                  Add Tickets
            </Typography>
            <Grid container spacing={2} alignItems="center" mb={2} >
             
              <Grid item xs={9}>
                <TextField
                  type="number"
                  variant="outlined"
                  size='small'
                  fullWidth
                  value={ticketQuantity}
                  onChange={handleTicketChange}
                  InputProps={{
                    sx: { fontSize: "0.8rem" },
                  }}
                />
              </Grid>
              <Grid item xs={3}>
                <Button
                  size='small'
                  variant="contained"
                  color="primary"
                  onClick={handleAddTicket}
                  fullWidth
                  disabled={!ticketQuantity}
                >
                  Add Ticket
                </Button>
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

      {/* Create Event Popup */}
      <Dialog maxWidth="sm" fullWidth open={openCreateEventModal} onClose={handleCloseCreateEventModal}>
        <DialogTitle align='center' >Create New Event</DialogTitle>
        <DialogContent dividers>
          <form onSubmit={formik.handleSubmit}>
            <Grid container spacing={1}>
              <Grid item xs={12}>
                <Typography color="#4e6990" variant="body2" gutterBottom> 
                  Event Name
                </Typography>
                <TextField
                  variant="outlined"
                  fullWidth
                  size="small"
                  placeholder="Enter event name"
                  value={formik.values.name}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  name="name"
                  error={formik.touched.name && Boolean(formik.errors.name)}
                  helperText={formik.touched.name && formik.errors.name}
                  InputProps={{
                    sx: { fontSize: "0.8rem" },
                  }}
                />
              </Grid>
              <Grid item xs={6}>
                <Typography color="#4e6990" variant="body2" gutterBottom mt={2}> 
                  Place
                </Typography>
                <TextField
                  fullWidth
                  placeholder="Enter Place"
                  size="small"
                  name="place"
                  value={formik.values.place}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.place && Boolean(formik.errors.place)}
                  helperText={formik.touched.place && formik.errors.place}
                  InputProps={{
                    sx: { fontSize: "0.8rem" },
                  }}
                />
              </Grid>
              <Grid item xs={6}>
                <Typography color="#4e6990" variant="body2" gutterBottom mt={2}> 
                  Date
                </Typography>
                <TextField
                  fullWidth
                  placeholder="Select Date"
                  size="small"
                  type="date"
                  name="date"
                  value={formik.values.date}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.date && Boolean(formik.errors.date)}
                  helperText={formik.touched.date && formik.errors.date}
                  InputProps={{
                    sx: { fontSize: "0.8rem" },
                  }}
                />
              </Grid>
              <Grid item xs={6}>
                <Typography color="#4e6990" variant="body2" gutterBottom mt={2}> 
                  Time
                </Typography>
                <TextField
                  fullWidth
                  placeholder="Enter Time (HH:mm)"
                  size="small"
                  type="time"
                  name="time"
                  value={formik.values.time}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.time && Boolean(formik.errors.time)}
                  helperText={formik.touched.time && formik.errors.time}
                  InputProps={{
                    sx: { fontSize: "0.8rem" },
                  }}
                />
              </Grid>

              <Grid item xs={6}>
                <Typography color="#4e6990" variant="body2" gutterBottom mt={2}> 
                  Ticket Price
                </Typography>
                <TextField
                  fullWidth
                  placeholder='Enter Ticket Price'
                  size='small'
                  type="number"
                  name='ticketPrice'
                  value={formik.values.ticketPrice}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.ticketPrice && Boolean(formik.errors.ticketPrice)}
                  helperText={formik.touched.ticketPrice && formik.errors.ticketPrice}
                  InputProps={{
                    sx: { fontSize: "0.8rem" },
                  }}
                />
              </Grid>
              <Grid item xs={6}>
                <Typography color="#4e6990" variant="body2" gutterBottom mt={2}> 
                  Max Capacity
                </Typography>
                <TextField
                  variant="outlined"
                  fullWidth
                  size="small"
                  placeholder="Enter max capacity"
                  value={formik.values.maxCapacity}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  name="maxCapacity"
                  error={formik.touched.maxCapacity && Boolean(formik.errors.maxCapacity)}
                  helperText={formik.touched.maxCapacity && formik.errors.maxCapacity}
                  InputProps={{
                    sx: { fontSize: "0.8rem" },
                  }}
                />
              </Grid>
              <Grid item xs={6}>
                <Typography color="#4e6990" variant="body2" gutterBottom mt={2}> 
                  Ticket Release Rate ( per hour )
                </Typography>
                <TextField
                  variant='outlined'
                  placeholder='Enter Ticket Release Rate'
                  name="ticketReleaseRate"
                  fullWidth
                  size='small'
                  type="number"
                  value={formik.values.ticketReleaseRate}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.ticketReleaseRate && Boolean(formik.errors.ticketReleaseRate)}
                  helperText={formik.touched.ticketReleaseRate && formik.errors.ticketReleaseRate}
                  InputProps={{
                    sx: { fontSize: "0.8rem" },
                  }}
                />
              </Grid>
              <Grid item xs={6}>
                <Typography color="#4e6990" variant="body2" gutterBottom mt={2}> 
                  No.of Tickets Release Now
                </Typography>
                <TextField
                  variant='outlined'
                  placeholder='Enter No.of Tickets'
                  name="totalTickets"
                  fullWidth
                  size='small'
                  value={formik.values.totalTickets}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.totalTickets && Boolean(formik.errors.totalTickets)}
                  helperText={formik.touched.totalTickets && formik.errors.totalTickets}
                  InputProps={{
                    sx: { fontSize: "0.8rem" },
                  }}
                />
              </Grid>
              <Grid item xs={6}>
                <Typography color="#4e6990" variant="body2" gutterBottom mt={2}>
                  Max Tickets Per Customer
                </Typography>
                <TextField
                  variant="outlined"
                  fullWidth
                  size="small"
                  placeholder="Enter max tickets a customer can buy at once"
                  name="ticketPurchaseRate"
                  value={formik.values.ticketPurchaseRate}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.ticketPurchaseRate && Boolean(formik.errors.ticketPurchaseRate)}
                  helperText={formik.touched.ticketPurchaseRate && formik.errors.ticketPurchaseRate}
                  InputProps={{
                    sx: { fontSize: "0.8rem" },
                  }}
                />
              </Grid>
            </Grid>
            <DialogActions>
              <Button onClick={handleCloseCreateEventModal} color="primary">
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
