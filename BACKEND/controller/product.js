import { rm } from "fs";
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
    res.status(201).json({ message: "Product Successfully Created", product });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

//Fetch all Product
export const fetchAllProduct = async (req, res) => {
  try {
    const product = await Product.find();
    return res.status(200).json({ message: "Fetched All Products", product });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

//Fetch Single Product
export const fetchSingleProduct = async (req, res) => {
  try {
    const id = req.params.id;
    const product = await Product.findById(id);
    return res.status(200).json({ message: "Products Details", product });
  } catch (error) {
    return res.status(500).json({
      message: error.message
    });
  }
};

//delete product
export const deleteProduct = async (req, res) => {
  try {
    if (req.user.role != "admin") {
      return res.status(403).json({
        message: "Unauthorized Access"
      });
    }

    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(403).json({
        message: "Invalid Product Details"
      });
    }
    rm(product.image, () => {
      console.log("Image Deleted");
    });

    await product.deleteOne();
    return res.json({
      message: "Product Details Successfully deleted"
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message
    });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (req.user.role != "admin") {
      return res.status(403).json({
        message: "Unauthorized Access"
      });
    }
    if (!product) {
      return res.status(403).json({
        message: "Invalid Product details"
      });
    }
    if (req.body.stock) {
      product.stock = req.body.stock;
      await product.save();
      return res.json({
        message: "Product Successfully Updated..."
      });
    }
    return res.status(200).json({
      message: "Please Enter Stock Value"
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message
    });
  }
};
