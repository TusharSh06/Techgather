import React, { useState, useEffect } from 'react';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import paymentService from '../../services/paymentService';
import './PaymentForm.css';

const PaymentForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const location = useLocation();
  const { eventId, ticketType, price } = location.state || {};

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!eventId || !ticketType || !price) {
      navigate('/events');
    }
  }, [eventId, ticketType, price, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!stripe || !elements) {
      setError('Stripe has not loaded yet. Please try again.');
      setLoading(false);
      return;
    }

    try {
      // Create payment intent
      const { clientSecret } = await paymentService.createPaymentIntent(eventId, ticketType);

      // Confirm the payment
      const { error: stripeError, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: elements.getElement(CardElement),
      });

      if (stripeError) {
        setError(stripeError.message);
        setLoading(false);
        return;
      }

      // Process the payment
      const result = await paymentService.processPayment(eventId, ticketType, paymentMethod.id);

      if (result.success) {
        toast.success('Payment successful! Your tickets have been purchased.');
        navigate('/my-tickets');
      } else {
        setError(result.message || 'Payment failed. Please try again.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred during payment processing.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="payment-form-container">
      <h2>Complete Your Purchase</h2>
      <div className="payment-details">
        <p>Event: {eventId}</p>
        <p>Ticket Type: {ticketType}</p>
        <p>Amount: ${price}</p>
      </div>

      <form onSubmit={handleSubmit} className="payment-form">
        <div className="card-element-container">
          <CardElement
            options={{
              style: {
                base: {
                  fontSize: '16px',
                  color: '#424770',
                  '::placeholder': {
                    color: '#aab7c4',
                  },
                },
                invalid: {
                  color: '#9e2146',
                },
              },
            }}
          />
        </div>

        {error && <div className="error-message">{error}</div>}

        <button
          type="submit"
          disabled={!stripe || loading}
          className="pay-button"
        >
          {loading ? 'Processing...' : `Pay $${price}`}
        </button>
      </form>
    </div>
  );
};

export default PaymentForm; 