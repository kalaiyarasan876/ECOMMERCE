import dotenv from "dotenv";
import express from "express";
import connectDB from "./database/db.js";
import userRoutes from "./routes/user.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 8000;

// Middleware
app.use(express.json());

// Routes
app.use("/api/", userRoutes);

// GET method
app.get("/", (req, res) => {
  res.send("<h1>Hello</h1>");
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port} `);
  connectDB();
});
