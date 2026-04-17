const express = require("express");
const mongoose = require("mongoose");
const multer = require("multer");
const dotenv = require("dotenv")
dotenv.config()
const fs = require("fs");

const app = express();
app.use(express.json());
app.use(express.static(__dirname));

if (!fs.existsSync("uploads")) fs.mkdirSync("uploads");

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads"),
  filename: (req, file, cb) => cb(null, Date.now()+"_"+file.originalname)
});
const upload = multer({storage});

mongoose.connect(process.env.DB_URL).then(()=>{
  console.log("Database connected.")
}).catch((error)=>{
  console.log("Database connection error.")
});

const Farmer = mongoose.model("Farmer", {
  name:String,
  mobile:String,
  product:String,
  weight:Number,
  rate:Number,
  total:Number,
  packet:Number,
  status:String,
  date:String,
  weightFile:String,
  parchiFile:String
});

// LOGIN
app.post("/admin-login",(req,res)=>{
  res.json({success:req.body.password==="1234"});
});

// ADD
app.post("/add", upload.fields([
  {name:"weightFile"},
  {name:"parchiFile"}
]), async (req,res)=>{

  let {name,mobile,product,weight,rate,packet,status,date} = req.body;

  weight = Number(weight)||0;
  rate = Number(rate)||0;

  if(!name || !mobile || weight===0 || rate===0){
    return res.send("❌ Fill all required fields");
  }

  let total = weight*rate;

  let weightFile = req.files?.weightFile?.[0]?.filename || "";
  let parchiFile = req.files?.parchiFile?.[0]?.filename || "";

  await Farmer.create({
    name,mobile,product,weight,rate,total,packet,status,
    date:date || new Date().toISOString().split("T")[0],
    weightFile,parchiFile
  });

  res.send("✅ Saved");
});

// GET ALL (FIX)
app.get("/data/ALL", async (req,res)=>{
  let data = await Farmer.find().sort({_id:-1});

  // ✅ सही तरीका
  data = data.map(d => ({
    ...d._doc,
    total: Number(d.total) || 0
  }));

  res.json(data);
});

// GET FARMER
app.get("/data/:mobile", async (req,res)=>{
  let data = await Farmer.find({mobile:req.params.mobile});
  res.json(data);
});

// DELETE
app.delete("/delete/:id", async (req,res)=>{
  await Farmer.findByIdAndDelete(req.params.id);
  res.send("Deleted");
});

// UPDATE
app.put("/update/:id", async (req,res)=>{
  let {name,mobile} = req.body;
  await Farmer.findByIdAndUpdate(req.params.id,{name,mobile});
  res.send("Updated");
});

app.listen(5000, ()=>console.log("Server running http://localhost:5000"));