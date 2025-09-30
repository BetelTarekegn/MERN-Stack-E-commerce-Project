import https from 'https';
import Payment from '../model/Payment.js';
import Order from '../model/order.js';

const CHAPA_HOST = process.env.CHAPA_HOST;
const CHAPA_SECRET_KEY = process.env.CHAPA_SECRET_KEY;

// ======================
// Helper: Make HTTPS Request to Chapa
// ======================
function makeRequest(path, method, body = null) {
  return new Promise((resolve, reject) => {
    const headers = {
      Authorization: `Bearer ${CHAPA_SECRET_KEY}`,
      'Content-Type': 'application/json'
    };

    let postData;
    if (body) {
      postData = JSON.stringify(body);
      headers['Content-Length'] = Buffer.byteLength(postData);
    }

    const options = {
      hostname: CHAPA_HOST,
      path,
      method,
      headers
    };

    const req = https.request(options, res => {
      let data = '';
      res.on('data', chunk => { data += chunk; });
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch {
          reject(new Error('Invalid JSON response'));
        }
      });
    });

    req.on('error', reject);
    if (postData) req.write(postData);
    req.end();
  });
}

// ======================
// 1. Initialize Payment
// ======================
export const initializePayment = async (req, res) => {
  const {
    amount, currency = 'ETB', email,
    first_name, last_name, phone_number,
    tx_ref, return_url, callback_url
  } = req.body;

  const payload = {
    amount,
    currency,
    email,
    first_name,
    last_name,
    phone_number,
    tx_ref,
    return_url,
    callback_url,
    customization: {
      title: 'Order Payment',
      description: 'Chapa Payment'
    }
  };

  try {
    const response = await makeRequest('/v1/transaction/initialize', 'POST', payload);

    if (response.status === 'success') {
      await Payment.create({
        tx_ref,
        amount,
        email,
        status: 'pending',
        first_name,
        last_name
      });
      return res.status(200).json(response);
    }

    return res.status(500).json({ message: 'Payment initialization failed', response });
  } catch (err) {
    console.error('Init Error:', err);
    return res.status(500).json({ message: 'Internal Server Error', error: err.message });
  }
};

// ======================
// 2. Verify Payment Only
// ======================
export const verifyPayment = async (req, res) => {
  const { tx_ref } = req.params;

  try {
    const response = await makeRequest(`/v1/transaction/verify/${tx_ref}`, 'GET');

    if (response.status === 'success') {
      const paymentStatus = response.data.status;

      const paymentRecord = await Payment.findOneAndUpdate(
        { tx_ref },
        { status: paymentStatus },
        { new: true }
      );

      if (!paymentRecord) {
        return res.status(404).json({
          status: 'error',
          message: 'Transaction not found in database',
          response: null
        });
      }

      return res.status(200).json({
        status: 'success',
        response: {
          status: paymentStatus,
          amount: response.data.amount,
          currency: response.data.currency,
          tx_ref: response.data.tx_ref,
          payment_type: paymentRecord.payment_type || 'Not Provided',
          created_at: paymentRecord.createdAt,
          customer: {
            full_name: `${paymentRecord.first_name || ''} ${paymentRecord.last_name || ''}`.trim(),
            email: paymentRecord.email
          }
        }
      });
    }

    return res.status(400).json({
      status: 'error',
      message: 'Verification failed',
      response: null
    });

  } catch (err) {
    console.error('Verify Error:', err);
    return res.status(500).json({
      status: 'error',
      message: 'Internal Server Error',
      error: err.message,
      response: null
    });
  }
};

// ======================
// 3. Chapa Webhook Handler (Optional)
// ======================
export const webhookHandler = async (req, res) => {
  const event = req.body;

  if (event.event === 'charge.success') {
    const tx_ref = event.data.tx_ref;
    const payment_type = event.data.payment_type;

    await Payment.findOneAndUpdate(
      { tx_ref },
      {
        status: 'success',
        payment_type
      }
    );
  }

  res.sendStatus(200);
};

// ======================
// 4. Verify and Create Order
// ======================
// After verifying payment with chapa

