import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  farmer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Farmer',
    required: true
  },
  weight:Number, // 50
  rate:Number, // 15 rupya
  bagQuantity:Number, //2 bora
  status:{
    type: String,
    enum: ['pending', 'paid'],
    default: 'pending'
  },
  material:{
    type: String,
    enum: ['makka', 'gehu', 'dhan', 'haldi'],
    required: true,
  },
  receipt:{
     url: String,
     public_id: String
  },
  reason:{
    type:String
  },
  duePayment:{
    type:Number
  },
  totalPayment:{
    type:Number
  },
  

},{timestamps: true, versionKey: false});

export default mongoose.model("Product", productSchema);