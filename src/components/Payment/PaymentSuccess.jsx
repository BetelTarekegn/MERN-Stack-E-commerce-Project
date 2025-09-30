import React from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import './PaymentSuccess.css';

function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const tx_ref = searchParams.get("tx_ref");

  return (
    <div className="payment-success-container">
      <h2>Payment Successful!</h2>
      <p>Your payment was completed successfully.</p>
      {tx_ref && (
        <p>
          <strong>Transaction Reference:</strong> {tx_ref}
        </p>
      )}

      <Link to={`/verify-payment/${tx_ref}`}>
        Verify Payment Status
      </Link>
    </div>
  );
}

export default PaymentSuccess;
