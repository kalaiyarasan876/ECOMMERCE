import dotenv from "dotenv";
import express from "express";
import connectDB from "./database/db.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 8000;

// Middleware
app.use(express.json());
app.use("/uploads",express.static("uploads"))

//user routes:
import productRoutes from "./routes/product.js";
import userRoutes from "./routes/user.js";
// Routes
app.use("/api/", userRoutes);
app.use("/api/",productRoutes)


// GET method
app.get("/", (req, res) => {
  res.send("<h1>Hello</h1>");
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port} `);
  connectDB();
});
