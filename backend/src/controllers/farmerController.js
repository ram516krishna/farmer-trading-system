import Farmer from "../models/Farmer.js";
import Product from "../models/Product.js";

export const addFarmer = async (req, res) => {
    try {
        const { name, mobile, address, fatherName } = req.body;

        const existingFarmer = await Farmer.findOne({ mobile });

        if (existingFarmer) {
            return res.status(400).json({ message: 'Farmer with this mobile number already exists', success: false });
        }

        const farmer = await Farmer.create({ name, mobile, address, fatherName });
        res.status(201).json({ data: farmer, success: true });
    } catch (error) {
        res.status(500).json({ message: error.message, success: false });
    }
};

export const getFarmers = async (req, res) => {
    try {

        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const [farmers, total] = await Promise.all([
            Farmer.find().skip(skip).limit(limit),
            Farmer.countDocuments()
        ]);


        res.status(200).json({
            data: farmers,
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

export const login = async (req, res) => {
    try {
        const { mobile } = req.body;
        const farmer = await Farmer.findOne({ mobile });
        if (!farmer) {
            return res.status(400).json({ message: 'Farmer not found', success: false });
        }
        res.status(200).json({ data: farmer, success: true });
    } catch (error) {
        res.status(500).json({ message: error.message, success: false });
    }
};

export const getFarmerProducts = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1
        const limit = parseInt(req.query.limit) || 10
        const skip = (page - 1) * limit;

        const [products, total] = await Promise.all([
            Product.find({ farmer: req.params.id }).limit(limit).skip(skip).populate('farmer').sort({ _id: -1 }),
            Product.countDocuments({farmer:req.params.id})
        ])

        res.status(200).json({
            data: products, success: true, pagination: {
                total,
                page,
                limit,
                skip,
                totalPages: Math.ceil(total / limit),
                hasNextPage: page < Math.ceil(total / limit),
                hasPrevPage: page > 1
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message, success: false });
    }
};

export const getFarmerEarnings = async (req, res) => {
    try {
        const products = await Product.find({ farmer: req.params.id });
        const totalEarnings = products.reduce((total, product) => total + product.rate * product.weight * product.bagQuantity, 0);
        res.status(200).json({ data: totalEarnings, success: true });
    } catch (error) {
        res.status(500).json({ message: error.message, success: false });
    }
};

export const deleteFarmer = async (req, res) => {
    try {
        // Check if farmer exists
        const farmer = await Farmer.findById(req.params.id);
        if (!farmer) {
            return res.status(404).json({ message: 'Farmer not found', success: false });
        }

        // Check if farmer has any associated products (deals)
        const associatedProducts = await Product.find({ farmer: req.params.id });
        if (associatedProducts.length > 0) {
            return res.status(400).json({ 
                message: `Cannot delete farmer. ${associatedProducts.length} deal(s) are associated with this farmer. Please delete all deals first.`,
                success: false 
            });
        }

        // Delete the farmer if no associated deals
        const deletedFarmer = await Farmer.findByIdAndDelete(req.params.id);
        res.status(200).json({ data: deletedFarmer, success: true });
    } catch (error) {
        res.status(500).json({ message: error.message, success: false });
    }
};
