import express from "express";
import { createProduct, deleteProduct, fetchAllProduct, fetchSingleProduct, updateProduct } from "../controller/product.js";
import { isAuth } from "../middleware/isAuth.js";
import { uploadFiles } from "../middleware/multer.js";

const router = express.Router();

router.post("/product/new", isAuth, uploadFiles, createProduct);
router.get("/product/all-product", fetchAllProduct);
router.get("/product/single/:id", fetchSingleProduct);
router.delete("/product/:id",isAuth, deleteProduct);
router.put("/product/:id",isAuth, updateProduct);

export default router;
