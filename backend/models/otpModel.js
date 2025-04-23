import {model, Schema} from 'mongoose';


const otpSchema = new Schema({
    email: {
        type: String,
        required: true,
    },
    otp: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 600, // OTP expires in 5 minutes
    },
});


const Otp = model('Otp', otpSchema);
export default Otp;