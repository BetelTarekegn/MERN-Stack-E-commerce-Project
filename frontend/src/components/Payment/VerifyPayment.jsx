import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useVerifyPaymentQuery } from '../../redux/api/paymentApi';
import './VerifyPayment.css';


function VerifyPayment() {
  const { tx_ref } = useParams();
  const navigate = useNavigate();

  const { data, error, isLoading } = useVerifyPaymentQuery(tx_ref);

  useEffect(() => {
    console.log('Payment verification data:', data);
    console.log('Payment verification error:', error);

    if (error) {
      alert('Failed to verify payment.');
      return;
    }

    if (data && data.status === 'success' && data.response) {
      const paymentData = {
        tx_ref: data.response.tx_ref || '',
        status: data.response.status || '',
        amount: data.response.amount || '',
        currency: data.response.currency || '',
        full_name: data.response.customer?.full_name || '',  // if exists, else empty
        email: data.response.customer?.email || '',          // same here
        payment_type: data.response.payment_type || '',
        created_at: data.response.created_at || '',
      };

      navigate('/payment-receipt', { state: { paymentData } });
    }
  }, [data, error, navigate]);

  if (isLoading) return <p>Verifying payment, please wait...</p>;

  return null;
}

export default VerifyPayment;
