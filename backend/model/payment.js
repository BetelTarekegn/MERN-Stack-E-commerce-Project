import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema({
  tx_ref: { type: String, required: true, unique: true },
  amount: {
    type: Number,
    required: true,
    min: [0, 'Amount must be positive']
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please fill a valid email address']
  },
  status: {
    type: String,
    enum: ['pending', 'success', 'failed'],
    default: 'pending'
  },
  first_name: String,
  last_name: String,
  payment_type: String
}, { timestamps: true });

export default mongoose.model('Payment', paymentSchema);