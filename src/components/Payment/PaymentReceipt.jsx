import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import './PaymentReceipt.css';

function PaymentReceipt() {
  const { user } = useSelector((state) => state.auth);
  const location = useLocation();
  const { paymentData } = location.state || {};

  if (!paymentData) {
    return (
      <div className="receipt-container">
        <h2>No Payment Data Found</h2>
        <Link to="/payment">Go to Payment</Link>
      </div>
    );
  }

  const {
    tx_ref,
    status,
    amount,
    currency,
    payment_type,
    created_at,
  } = paymentData;

  // Fallback value logic
  const displayPaymentType = payment_type || 'Not Provided';
  const displayDate = created_at
    ? new Date(created_at).toLocaleString()
    : 'Unknown';

  return (
    <div className="receipt-container">
      <h2>Payment Receipt</h2>
      <p><strong>Transaction Reference:</strong> {tx_ref}</p>
      <p><strong>Status:</strong> {status}</p>
      <p><strong>Amount:</strong> {amount} {currency}</p>
      <p><strong>Full Name:</strong> {user?.name || 'Not Provided'}</p>
      <p><strong>Email:</strong> {user?.email || 'Not Provided'}</p>
      <p><strong>Payment Type:</strong> {displayPaymentType}</p>
      <p><strong>Date:</strong> {displayDate}</p>

      <Link to="/payment">Make Another Payment</Link>
    </div>
  );
}

export default PaymentReceipt;
