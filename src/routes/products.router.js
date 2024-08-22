import express from "express";
import ProductManager from "../dao/db/product-manager-db.js";

const router = express.Router();

const productManager = new ProductManager();

router.get("/", async (req, res) => {
  try {
    const { limit = 4, page = 1, sort, query } = req.query;

    const products = await productManager.getProducts({
      limit: parseInt(limit),
      page: parseInt(page),
      sort,
      query,
    });

    res.json({
      status: "success",
      payload: products,
    });
  } catch (error) {
    console.error("Error obtaining the products", error);
    res.status(500).json({
      status: "error",
      error: "Server error",
    });
  }
});

router.get("/:pid", async (req, res) => {
  const id = req.params.pid;

  try {
    const product = await productManager.getProductById(id);
    if (!product) {
      return res.json({
        error: "Product was not found",
      });
    }

    res.json(product);
  } catch (error) {
    console.error("Error obtaining the products", error);
    res.status(500).json({
      error: "Server error",
    });
  }
});

router.post("/", async (req, res) => {
  const newProduct = req.body;

  try {
    await productManager.addProduct(newProduct);
    res.status(201).json({
      message: "Product was successfully added ",
    });
  } catch (error) {
    console.error("Error adding product", error);
    res.status(500).json({
      error: "Server error",
    });
  }
});

router.put("/:pid", async (req, res) => {
  const id = req.params.pid;
  const updatedProduct = req.body;

  try {
    await productManager.updateProduct(id, updatedProduct);
    res.json({
      message: "Product was successfully updated",
    });
  } catch (error) {
    console.error("Error updating product", error);
    res.status(500).json({
      error: "Server error",
    });
  }
});

router.delete("/:pid", async (req, res) => {
  const id = req.params.pid;

  try {
    await productManager.deleteProduct(id);
    res.json({
      message: "Product was successfully eliminated",
    });
  } catch (error) {
    console.error("Error eliminating the product", error);
    res.status(500).json({
      error: "Server error",
    });
  }
});

export default router;
