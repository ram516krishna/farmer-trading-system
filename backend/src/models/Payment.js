import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema({
    farmer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Farmer',
        required: true
    },
    totalAmount: {
        type: Number,
        required: true
    },
    paidAmount: {
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
    remainingBalance: {
        type: Number,
        required: true
    }
}, { timestamps: true, versionKey: false });

export default mongoose.model("Payment", paymentSchema);
