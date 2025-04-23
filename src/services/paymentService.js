import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const paymentService = {
  // Create payment intent
  createPaymentIntent: async (eventId, ticketType) => {
    const response = await axios.post(
      `${API_URL}/payments/create-payment-intent`,
      { eventId, ticketType },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      }
    );
    return response.data;
  },

  // Process payment
  processPayment: async (eventId, ticketType, paymentMethodId) => {
    const response = await axios.post(
      `${API_URL}/payments/process`,
      { eventId, ticketType, paymentMethodId },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      }
    );
    return response.data;
  },

  // Get user's payments
  getUserPayments: async () => {
    const response = await axios.get(`${API_URL}/payments/user`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    return response.data;
  },

  // Get payment details
  getPaymentDetails: async (paymentId) => {
    const response = await axios.get(`${API_URL}/payments/${paymentId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    return response.data;
  },

  // Process refund
  processRefund: async (paymentId, reason) => {
    const response = await axios.post(
      `${API_URL}/payments/${paymentId}/refund`,
      { reason },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      }
    );
    return response.data;
  },
};

export default paymentService; 