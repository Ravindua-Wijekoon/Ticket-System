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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@mui/material';
import axios from 'axios';
import LogoutIcon from '@mui/icons-material/Logout';
import Swal from 'sweetalert2';
import config from '../config';
import CardMedia from '@mui/material/CardMedia';
import eventImage from "../assets/images/event.jpg";
import { styled } from "@mui/material/styles";
import Avatar from '@mui/material/Avatar';
import Logo from "../assets/images/favicon.png";
import { useFormik } from 'formik';
import * as Yup from 'yup';

const BackgroundContainer = styled("div")({
  background: '#f2f6ff',
  minHeight: "100vh",
});

const VendorDashboard = () => {
  const [events, setEvents] = useState([]);
  const [openEventModal, setOpenEventModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [openHistoryModal, setOpenHistoryModal] = useState(false);
  const [purchaseHistory, setPurchaseHistory] = useState([]);

  const authToken = localStorage.getItem('authToken');

  const fetchEvents = async () => {
    try {
      const response = await axios.get(`${config.apiUrl}api/events`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });

      const activeEvents = response.data.filter(event => event.isActive === true);
      setEvents(activeEvents);
    } catch (error) {
      console.error('Failed to fetch events:', error.response || error);
    }
  };

  const fetchPurchaseHistory = async () => {
    try {
        const response = await axios.get(`${config.apiUrl}api/purchases/my-tickets`, {
            headers: { Authorization: `Bearer ${authToken}` },
        });

        // Sort purchases by purchaseDate in descending order
        const sortedHistory = response.data.sort((a, b) => new Date(b.purchaseDate) - new Date(a.purchaseDate));

        setPurchaseHistory(sortedHistory);
        setOpenHistoryModal(true);
    } catch (error) {
        console.error('Failed to fetch purchase history:', error.response || error);
        Swal.fire({
            title: 'Error',
            text: 'Failed to fetch purchase history.',
            icon: 'error',
            customClass: {
                container: 'swal2-custom-z-index',
            },
        });
    }
};


  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get(`${config.apiUrl}api/events`, {
          headers: { Authorization: `Bearer ${authToken}` },
        });
  
        const activeEvents = response.data.filter(event => event.isActive === true);
        setEvents(activeEvents);
      } catch (error) {
        console.error('Failed to fetch events:', error.response || error);
      }
    };
    fetchEvents();
  }, [authToken]);

  const handleOpenEventModal = (event) => {
    setSelectedEvent(event);
    setOpenEventModal(true);
  };

  const handleCloseEventModal = () => {
    setOpenEventModal(false);
    fetchEvents();
  };

  const handleCloseHistoryModal = () => {
    setOpenHistoryModal(false);
  };

  const handleLogout = async () => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "Do you really want to log out?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, log out',
    });

    if (result.isConfirmed) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      window.location.href = '/';
    }
  };

  const formik = useFormik({
    initialValues: {
      quantity: 1,
    },
    validationSchema: Yup.object({
      quantity: Yup.number()
        .required('Quantity is required')
        .positive('Quantity must be positive')
        .integer('Quantity must be a whole number')
        .max(
          selectedEvent?.ticketPurchaseRate || Infinity,
          `Cannot exceed ${selectedEvent?.ticketPurchaseRate || 'N/A'} tickets per customer`
        ),
    }),
    onSubmit: async (values) => {
      const totalPrice = selectedEvent.ticketPrice * values.quantity;
  
      // Check if the event is still active
      try {
        const eventStatusResponse = await axios.get(
          `${config.apiUrl}api/events/${selectedEvent._id}`,
          { headers: { Authorization: `Bearer ${authToken}` } }
        );
  
        // Ensure the event is active
        if (!eventStatusResponse.data.isActive) {
          Swal.fire({
            title: 'Error',
            text: 'The event is no longer active. Please choose another event.',
            icon: 'error',
            customClass: {
              container: 'swal2-custom-z-index',
            },
          });
          return;
        }
      } catch (error) {
        Swal.fire({
          title: 'Error',
          text: 'Failed to verify event status. Please try again.',
          icon: 'error',
          customClass: {
            container: 'swal2-custom-z-index',
          },
        });
        return;
      }
  
      // Show confirmation dialog
      const result = await Swal.fire({
        title: 'Confirm Purchase',
        text: `Total Price: ${totalPrice} LKR. Do you want to proceed?`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Yes, Buy Now',
        cancelButtonText: 'Cancel',
        customClass: {
          container: 'swal2-custom-z-index',
        },
      });
  
      if (result.isConfirmed) {
        setIsProcessing(true);
        try {
          await axios.post(
            `${config.apiUrl}api/purchases/buy`,
            { eventId: selectedEvent._id, quantity: values.quantity },
            { headers: { Authorization: `Bearer ${authToken}` } }
          );
  
          Swal.fire({
            title: 'Success',
            text: `Successfully purchased ${values.quantity} ticket(s)!`,
            icon: 'success',
            customClass: {
              container: 'swal2-custom-z-index',
            },
          });
          formik.resetForm();
          handleCloseEventModal();
        } catch (error) {
          Swal.fire({
            title: 'Error',
            text: error.response?.data?.error || 'Failed to purchase tickets',
            icon: 'error',
            customClass: {
              container: 'swal2-custom-z-index',
            },
          });
        } finally {
          setIsProcessing(false);
        }
      }
    },
  });
  

  return (
    <BackgroundContainer>
      <AppBar position="static" color="primary" sx={{ mb: 4, mx: 0 }}>
        <Toolbar>
          <Box display="flex" alignItems="center" sx={{ flexGrow: 1 }}>
            <Avatar alt="Logo" src={Logo} sx={{ width: 40, height: 40, mr: 1 }} />
            <Typography variant="h6">The Ticket System</Typography>
          </Box>
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
            <Button variant="contained" color="primary" onClick={fetchPurchaseHistory}>
              Purchase History
            </Button>
          </Grid>
        </Grid>

        <Divider sx={{ mt: 1, mb: 4 }} />

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
      <Dialog maxWidth="xs" fullWidth open={openEventModal} onClose={handleCloseEventModal}>
        <DialogTitle fontWeight={600}>
          <Grid container justifyContent={'space-between'}>
            <Grid item>{selectedEvent?.name || 'Event Details'}</Grid>
          </Grid>
        </DialogTitle>
        <DialogContent dividers>
          <form onSubmit={formik.handleSubmit}>
            {selectedEvent && (
              <Grid container>
                <Grid
                  item
                  xs={12}
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Typography color="#4e6990" variant="h5" mt={2} gutterBottom>
                    Ticket Price ( LKR ) : {selectedEvent.ticketPrice}
                  </Typography>
                  <Typography color="#4e6990" variant="body2" mt={2} gutterBottom>
                    Tickets Sold : {selectedEvent.ticketsSold}
                  </Typography>
                  <Typography color="#4e6990" variant="body2" gutterBottom>
                    Tickets Available : {selectedEvent.totalTickets}
                  </Typography>
                </Grid>
                <Grid container spacing={1}>
                  <Grid item xs={12}>
                    <Typography color="#4e6990" variant="body2" mt={2} gutterBottom>
                      Buy Tickets
                    </Typography>
                  </Grid>

                  <Grid item xs={9}>
                    <TextField
                      variant="outlined"
                      size="small"
                      fullWidth
                      type="number"
                      name="quantity"
                      value={formik.values.quantity}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      error={formik.touched.quantity && Boolean(formik.errors.quantity)}
                      helperText={formik.touched.quantity && formik.errors.quantity}
                      InputProps={{
                        sx: { fontSize: '0.8rem' },
                      }}
                    />
                  </Grid>
                  <Grid item xs={3}>
                    <Button type="submit" variant="contained" color="primary" fullWidth disabled={isProcessing}>
                      Buy
                    </Button>
                  </Grid>
                </Grid>
              </Grid>
            )}
          </form>
        </DialogContent>
        {/* <DialogActions>
          <Grid container justifyContent="end">
            <Grid item>
              <Button onClick={handleCloseEventModal} color="primary" variant="contained">
                Close
              </Button>
            </Grid>
          </Grid>
        </DialogActions> */}
      </Dialog>

      {/* Purchase History Popup */}
      <Dialog maxWidth="md" fullWidth open={openHistoryModal} onClose={handleCloseHistoryModal}>
        <DialogTitle>Purchase History</DialogTitle>
        <DialogContent dividers>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Date</TableCell>
                <TableCell>Event Name</TableCell>
                <TableCell align="right">Quantity</TableCell>
                <TableCell align="right">Price (LKR)</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
            {purchaseHistory.map((purchase, index) => (
              <TableRow key={purchase._id || index}>
                <TableCell>
                  {new Date(purchase.purchaseDate).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </TableCell>
                <TableCell>{purchase.eventId?.name || 'Old Event'}</TableCell>
                <TableCell align="right">{purchase.quantity}</TableCell>
                <TableCell align="right">{purchase.price}</TableCell>
              </TableRow>
            ))}
            </TableBody>

          </Table>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseHistoryModal} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </BackgroundContainer>
  );
};

export default VendorDashboard;
