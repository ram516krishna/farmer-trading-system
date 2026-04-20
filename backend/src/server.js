import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";
import productRouter from "./routes/productRoutes.js";
import env from "./config/env.js";
import cookieParser from "cookie-parser";
import adminRouter from "./routes/adminRoutes.js";
import farmerRouter from "./routes/farmerRoutes.js";

const app = express();
const PORT = env.PORT;

app.use(cors({
  origin:env.ORIGIN,
  credentials:true
}));
app.use(express.json());
app.use(cookieParser());

connectDB();

app.use("/products", productRouter)
app.use("/admin", adminRouter)
app.use("/farmers", farmerRouter)

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});