import express from "express";
import { createProduct } from "../controller/product.js";
import { isAuth } from "../middleware/isAuth.js";
import { uploadFiles } from "../middleware/multer.js";

const router = express.Router();

router.post("/product/new", isAuth, uploadFiles, createProduct);

export default router;
