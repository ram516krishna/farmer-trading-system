import  Farmer from "../models/Farmer.js";

export const addFarmer = async (req, res) => {
    try {
        const {name, mobile, address, fatherName} = req.body;

        const existingFarmer = await Farmer.findOne({mobile});

        if(existingFarmer){
            return res.status(400).json({ message: 'Farmer with this mobile number already exists', success: false });
        }

        const farmer = await Farmer.create({name, mobile, address, fatherName});
        res.status(201).json({ data: farmer, success: true });
    } catch (error) {
        res.status(500).json({ message: error.message, success: false });
    }
};

export const getFarmers = async (req, res) => {
    try {
        const farmers = await Farmer.find();
        res.status(200).json({ data: farmers, success: true });
    } catch (error) {
        res.status(500).json({ message: error.message, success: false });
    }
};

export const login = async (req, res) => {
    try {
        const {mobile} = req.body;
        const farmer = await Farmer.findOne({mobile});
        if(!farmer){
            return res.status(400).json({ message: 'Farmer not found', success: false });
        }
        res.status(200).json({ data: farmer, success: true });
    } catch (error) {
        res.status(500).json({ message: error.message, success: false });
    }
};

