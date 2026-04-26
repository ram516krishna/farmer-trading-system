import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema({
    farmer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Farmer',
        required: true
    },
    advancePayment: {
        type: Number,
        required: true
    },
    reason: {
        type: String,
        required: true
    },
    paymentDate: {
        type: Date,
        default: Date.now
    },
    remainingPayment: {
       type: Number
    }
}, { timestamps: true});

export default mongoose.model("Payment", paymentSchema);
