import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import paymentService from '../../services/paymentService';
import './PaymentHistory.css';

const PaymentHistory = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      const data = await paymentService.getUserPayments();
      setPayments(data);
    } catch (err) {
      setError('Failed to fetch payment history');
      toast.error('Failed to load payment history');
    } finally {
      setLoading(false);
    }
  };

  const handleRefund = async (paymentId) => {
    if (!window.confirm('Are you sure you want to request a refund for this payment?')) {
      return;
    }

    try {
      const result = await paymentService.processRefund(paymentId, 'User requested refund');
      if (result.success) {
        toast.success('Refund request submitted successfully');
        fetchPayments(); // Refresh the payment list
      } else {
        toast.error(result.message || 'Failed to process refund');
      }
    } catch (err) {
      toast.error('An error occurred while processing the refund');
    }
  };

  if (loading) {
    return <div className="loading">Loading payment history...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="payment-history-container">
      <h2>Payment History</h2>
      {payments.length === 0 ? (
        <p className="no-payments">No payment history found</p>
      ) : (
        <div className="payments-list">
          {payments.map((payment) => (
            <div key={payment.id} className="payment-card">
              <div className="payment-header">
                <h3>Payment #{payment.id}</h3>
                <span className={`status ${payment.status.toLowerCase()}`}>
                  {payment.status}
                </span>
              </div>
              <div className="payment-details">
                <p><strong>Event:</strong> {payment.eventName}</p>
                <p><strong>Ticket Type:</strong> {payment.ticketType}</p>
                <p><strong>Amount:</strong> ${payment.amount}</p>
                <p><strong>Date:</strong> {new Date(payment.createdAt).toLocaleDateString()}</p>
              </div>
              {payment.status === 'COMPLETED' && (
                <button
                  onClick={() => handleRefund(payment.id)}
                  className="refund-button"
                >
                  Request Refund
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PaymentHistory; 