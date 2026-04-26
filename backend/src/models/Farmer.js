import mongoose from "mongoose";

const farmerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  fatherName:{
    type: String,
    required: true,
  },
  address:String,
  mobile: {
    type: String,
    required: true,
    unique: true
  },
},{timestamps: true});

export default mongoose.model("Farmer", farmerSchema);
