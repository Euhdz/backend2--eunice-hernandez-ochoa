import { Router } from "express";
const router = Router();
import ProductManager from "../dao/db/product-manager-db.js";
import CartManager from "../dao/db/cart-manager-db.js";

const productManager = new ProductManager();
const cartManager = new CartManager();

router.get("/login", (req, res) => {
  res.render("login");
});

router.get("/register", (req, res) => {
  res.render("register");
});

router.get("/realtimeproducts", async (req, res) => {
  res.render("realtimeproducts");
});

router.get("/products", async (req, res) => {
  try {
    const { page = 1, limit = 3 } = req.query;
    const products = await productManager.getProducts({
      page: parseInt(page),
      limit: parseInt(limit),
    });

    const newArray = products.docs.map((product) => {
      const { _id, ...rest } = product.toObject();
      return rest;
    });

    res.render("products", {
      products: newArray,
      hasPrevPage: products.hasPrevPage,
      hasNextPage: products.hasNextPage,
      prevPage: products.prevPage,
      nextPage: products.nextPage,
      currentPage: products.page,
      totalPages: products.totalPages,
    });
  } catch (error) {
    console.error("Error obtaining the products", error);
    res.status(500).json({
      status: "error",
      error: "Server error",
    });
  }
});

router.get("/carts/:cid", async (req, res) => {
  const cartId = req.params.cid;

  try {
    const cart = await CartModel.findById(cartId).populate("products");

    if (!cart) {
      console.error("We could not find a cart with the submitted id", error);
      return res.status(404).json({
        error: "Cart was not found",
      });
    }

    const productsInCart = cart.products.map((item) => ({
      product: item.product.toObject(),
      quantity: item.quantity,
    }));

    res.render("carts", { products: productsInCart });
  } catch (error) {
    console.error("Error getting the cart", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
