import Product from "../models/Product.js";
import { uploadToCloudinary, deleteFromCloudinary } from "../utils/cloudinary.js";

export const addProduct = async (req, res) => {
    try {
        const { farmer, productName, weight, rate, bagQuantity, status, material } = req.body;

        if(!farmer || !productName || !weight || !rate || !bagQuantity || !status || !material) {
            return res.status(400).json({ message: "All fields are required", success: false });
        }
        
        if(req.file){
            const receipt = await uploadToCloudinary(req.file.path);
           
            if(!receipt){
                return res.status(500).json({ message: "Failed to upload receipt", success: false });
            }
            req.body.receipt = {
                url:receipt.url,
                public_id:receipt.public_id
            };
        }

        const product = await Product.create(req.body);

        res.json({ data: product, success: true });
    } catch (error) {
        res.status(500).json({ message: error.message, success: false });
    }
};

export const getAllProducts = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const [products, total] = await Promise.all([
            Product.find().skip(skip).limit(limit).populate('farmer').sort({ _id: -1 }),
            Product.countDocuments()
        ]);

        res.status(200).json({
            data: products,
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


export const getDashboardStats = async (req, res) => {
    try {
        const products = await Product.find().populate('farmer');
        
        // Calculate total deals
        const totalDeals = products.length;
        
        // Calculate total earnings (weight * rate * bagQuantity for paid deals)
        const totalEarnings = products
            .filter(product => product.status === 'paid' && product.weight && product.rate && product.bagQuantity)
            .reduce((total, product) => total + (product.weight * product.rate * product.bagQuantity), 0);
        
        // Calculate total bag quantity
        const totalBagQuantity = products
            .filter(product => product.bagQuantity)
            .reduce((total, product) => total + product.bagQuantity, 0);
        
        // Calculate total weight
        const totalWeight = products
            .reduce((total, product) => total + (product.weight || 0), 0);
        
        // Count by status
        const paidDeals = products.filter(product => product.status === 'paid').length;
        const pendingDeals = products.filter(product => product.status === 'pending').length;
        
        // Count by material
        const materialStats = products.reduce((acc, product) => {
            if (product.material) {
                acc[product.material] = (acc[product.material] || 0) + 1;
            }
            return acc;
        }, {});
        
        // Recent deals (last 5)
        const recentDeals = products
            .sort((a, b) => b.createdAt - a.createdAt)
            .slice(0, 5)
            .map(product => ({
                id: product._id,
                name: product.farmer?.name || 'Unknown Farmer',
                material: product.material,
                weight: product.weight,
                rate: product.rate,
                status: product.status,
                createdAt: product.createdAt
            }));
        
        const dashboardData = {
            totalDeals,
            totalEarnings,
            totalBagQuantity,
            totalWeight,
            paidDeals,
            pendingDeals,
            materialStats,
            recentDeals
        };
        
        res.status(200).json({ data: dashboardData, success: true });
    } catch (error) {
        res.status(500).json({ message: error.message, success: false });
    }
};

export const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (product?.receipt?.public_id) {
            await deleteFromCloudinary(product.receipt.public_id);
        }
        await Product.findByIdAndDelete(req.params.id);
        res.json({ message: "Product deleted successfully", success: true });
    } catch (error) {
        res.status(500).json({ message: error.message, success: false });
    }
};

export const updateProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndUpdate(req.params.id,req.body, { returnDocument: 'after' });
        res.json({ message: "Product updated successfully", data: product, success: true });
    } catch (error) {
        res.status(500).json({ message: error.message, success: false });
    }
};

export const getFarmerProducts = async (req, res) => {
    try {
        const products = await Product.find({ farmer: req.params.id }).populate('farmer');
        res.json({ data: products, success: true });
    } catch (error) {
        res.status(500).json({ message: error.message, success: false });
    }
};

