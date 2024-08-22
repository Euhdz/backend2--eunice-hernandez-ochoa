import CartModel from "../models/cart.model.js";

class CartManager {
  async createCart() {
    try {
      const newCart = new CartModel({ products: [] });
      await newCart.save();
      return newCart;
    } catch (error) {
      console.error("Error creating the cart", error);
      throw error;
    }
  }

  async getCarts() {
    try {
      const carts = await CartModel.find();
      return carts;
    } catch (error) {
      console.error("Error listing the carts");
    }
  }

  async getCartById(cartId) {
    try {
      const cart = await CartModel.findById(cartId).populate(
        "products.product"
      ); //OJO CHECAR SI VA ENTRE COMILLAS. TOMÉ DESDE POPULATE DE ROX

      if (!cart) {
        throw new Error(`No cart found with id ${cartId}`);
      }
      return cart;
    } catch (error) {
      console.error("Error getting cart by ID:", error);
      throw error;
    }
  }

  async addProductToCart(cartId, productId, quantity = 1) {
    try {
      const cart = await CartModel.findById(cartId); //SI NO JALA PROBAR CON ESTO const cart = await this.getCartById(cartId);
      const existingProduct = cart.products.find(
        (p) => p.product._id.toString() === productId
      ); //AQUI AGREGUE: _id
      if (existingProduct) {
        existingProduct.quantity += quantity;
      } else {
        cart.products.push({ product: productId, quantity });
      }
      cart.markModified("products");
      await cart.save();
      return cart;
    } catch (error) {
      console.error("Error adding product to the cart", error);
      throw error;
    }
  }

  async removeProductFromCart(cartId, productId) {
    try {
      const cart = await this.getCartById(cartId);
      cart.products = cart.products.filter(
        (p) => p.product._id.toString() !== productId
      ); //AQUI AGREGUE: _id
      cart.markModified("products");
      await cart.save();
      return cart;
    } catch (error) {
      console.error("Error removing product from the cart", error);
      throw error;
    }
  }

  async updateCart(cartId, updatedProducts) {
    try {
      const cart = await this.getCartById(cartId);
      cart.products = updatedProducts; //CHECAR SI DEBO PONER aqui y arriba "products" en vez de "updatedProducts"
      cart.markModified("products");
      await cart.save();
      return cart;
    } catch (error) {
      console.error("Error updating the cart", error);
      throw error;
    }
  }

  //CHECAR LO DE ACTUALIZAR
  async updateProductQuantity(cartId, productId, newQuantity) {
    try {
      const cart = await this.getCartById(cartId);
      const existingProduct = cart.products.find(
        (p) => p.product._id.toString() === productId
      );
      if (existingProduct) {
        existingProduct.quantity = newQuantity;
        cart.markModified("products");
        await cart.save();
        return cart;
      } else {
        throw new Error(
          `The product with id ${productId} was not found in cart`
        );
      }
    } catch (error) {
      console.error("Error updating product quantity in the cart", error);
      throw error;
    }
  }

  async clearCart(cartId) {
    try {
      const cart = await this.getCartById(cartId);
      cart.products = [];
      cart.markModified("products");
      await cart.save();
      return cart;
    } catch (error) {
      console.error("Error clearing the cart", error);
      throw error;
    }
  }
}

export default CartManager;
