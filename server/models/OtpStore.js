import mongoose from 'mongoose';

const otpStoreSchema = new mongoose.Schema({
  phoneNumber: { 
    type: String, 
    required: true, 
    index: true 
  },
  otp: { 
    type: String, 
    required: true 
  },
  expiry: { 
    type: Date, 
    required: true,
    index: { expires: 0 } // TTL index: document expires when Date.now() > expiry
  },
  attempts: { 
    type: Number, 
    default: 0 
  }
}, { timestamps: true });

export const OtpStore = mongoose.model('OtpStore', otpStoreSchema);
