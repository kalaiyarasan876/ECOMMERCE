import { Product } from "../models/Product.js";

//Add Product
export const createProduct = async (req, res) => {
  try {
    if (req.user.role != "admin") {
      return res.status(403).json({
        message: "Unauthorized Access"
      });
    }
    const { title, description, stock, price, category } = req.body;
    const image = req.file;
    if (!image) {
      return res.status(403).json({ message: "Please Select the Image" });
    }
    const product = await Product.create({
      title,
      description,
      stock,
      price,
      category,
      image: image?.path
    });
    res
      .status(201)
      .json({ message: "Product Successfully Created", product });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
