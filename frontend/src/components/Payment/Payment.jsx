import React, { useEffect, useState } from 'react';
import './PaymentForm.css';
import { useInitializePaymentMutation } from '../../redux/api/paymentApi';
import { useSelector } from 'react-redux';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';

function Payment() {
  const txRef = `order_${Date.now()}`;
  const [initializePayment, { isLoading, error }] = useInitializePaymentMutation();
  const { user } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    email: '',
    amount: '',
    first_name: '',
    last_name: '',
    phone_number: '',
    tx_ref: txRef,
    return_url: `http://localhost:5173/payment-success?tx_ref=${txRef}`,
    callback_url: 'http://localhost:4000/api/webhook',
    currency: 'ETB',
  });

  const [formError, setFormError] = useState('');

  useEffect(() => {
    const orderInfo = JSON.parse(sessionStorage.getItem('orderInfo'));
    if (orderInfo && user) {
      const nameParts = user.name ? user.name.split(' ') : ['Customer', ''];
      setFormData((prev) => ({
        ...prev,
        amount: orderInfo.totalPrice,
        email: user.email,
        first_name: nameParts[0],
        last_name: nameParts.slice(1).join(' '),
      }));
    }
  }, [user]);

  const handleSubmit = async () => {
    setFormError('');
    const { email, first_name, last_name, phone_number, amount } = formData;

    if (!email || !first_name || !last_name || !phone_number || !amount || Number(amount) < 1) {
      setFormError('Please fill in all required fields and enter a valid amount.');
      return;
    }
    const orderItems = JSON.parse(localStorage.getItem("cartItems")) || []; // or get from Redux
    const shippingInfo = JSON.parse(sessionStorage.getItem("shippingInfo")) || {};

    if (orderItems.length === 0 || !shippingInfo.address) {
      setFormError("Missing order details. Please go back and complete checkout.");
      return;
    }

    localStorage.setItem("orderItems", JSON.stringify(orderItems));
    localStorage.setItem("shippingInfo", JSON.stringify(shippingInfo));

    try {
      const response = await initializePayment(formData).unwrap();
      if (response.status === 'success' && response.data.checkout_url) {
        window.location.href = response.data.checkout_url;
      } else {
        setFormError('Payment initialization failed');
      }
    } catch (err) {
      setFormError(err.data?.message || err.error || 'Something went wrong');
    }
  };

  return (
    <div className="payment-page">
      <div className="overlay">
        <div className="payment-container">
          <h2>Make Payment</h2>

          {formError && <div className="error">{formError}</div>}

          <PhoneInput
            country={'et'}
            value={formData.phone_number}
            onChange={(phone) =>
              setFormData((prev) => ({ ...prev, phone_number: phone }))
            }
            inputProps={{
              name: 'phone_number',
              required: true,
              autoFocus: true,
              placeholder: 'Phone Number',
            }}
          />

          <input
            name="amount"
            type="number"
            placeholder="Amount (ETB)"
            value={formData.amount}
            disabled
          />

          <button onClick={handleSubmit} disabled={isLoading}>
            {isLoading
              ? 'Processing...'
              : `Pay Now${formData.amount ? ` (${formData.amount} ETB)` : ''}`}
          </button>

          {error && <div className="error">Error: {error.toString()}</div>}
        </div>
      </div>
    </div>
  );
}

export default Payment;
