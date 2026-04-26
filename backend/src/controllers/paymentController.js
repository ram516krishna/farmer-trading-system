import Farmer from "../models/Farmer.js";
import Payment from "../models/Payment.js";


export const createPayment = async (req, res) => {
    try {
        const { farmerId, advancePayment, reason, paymentDate, remainingPayment } = req.body;

        // Validate farmer exists
        const farmer = await Farmer.findById(farmerId);

        if (!farmer) {
            return res.status(404).json({ message: 'Farmer not found', success: false });
        }

        // Create payment with updated remaining balance
        const payment = await Payment.create({
            farmer: farmerId,
            advancePayment,
            reason,
            paymentDate,
            remainingPayment: remainingPayment || 0
        });

        res.status(201).json({ data: payment, success: true });

    } catch (error) {
        res.status(500).json({ message: error.message, success: false });
    }
};

export const getFarmerPayments = async (req, res) => {
    try {
        const { farmerId } = req.params;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        // Validate farmer exists
        const farmer = await Farmer.findById(farmerId);
        if (!farmer) {
            return res.status(404).json({ message: 'Farmer not found', success: false });
        }

        const [payments, total] = await Promise.all([
            Payment.find({ farmer: farmerId })
                .skip(skip)
                .limit(limit)
                .populate('farmer', 'name fatherName mobile')
                .sort({ createdAt: -1 }),
            Payment.countDocuments({ farmer: farmerId })
        ]);

        res.status(200).json({
            data: payments,
            farmer,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
                hasNextPage: page < Math.ceil(total / limit),
                hasPrevPage: page > 1
            },
            success: true
        });
    } catch (error) {
        res.status(500).json({ message: error.message, success: false });
    }
};

export const getPaymentById = async (req, res) => {
    try {
        const payment = await Payment.findById(req.params.id).populate('farmer', 'name fatherName mobile');
        
        if (!payment) {
            return res.status(404).json({ message: 'Payment not found', success: false });
        }

        res.status(200).json({ data: payment, success: true });
    } catch (error) {
        res.status(500).json({ message: error.message, success: false });
    }
};

export const deletePayment = async (req, res) => {
    try {
        const payment = await Payment.findByIdAndDelete(req.params.id);
        
        if (!payment) {
            return res.status(404).json({ message: 'Payment not found', success: false });
        }

        res.status(200).json({ data: payment, success: true });
    } catch (error) {
        res.status(500).json({ message: error.message, success: false });
    }
};
