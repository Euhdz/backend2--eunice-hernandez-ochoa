import { promises as fs } from "fs";

class ProductManager {
  static ultId = 0;

  constructor(path) {
    this.products = [];
    this.path = path;
  }

  async addProduct({
    title,
    description,
    code,
    price,
    stock,
    category,
    thumbnails,
  }) {
    try {
      const existingProducts = await this.readFromFile();
      if (!title || !description || !code || !price || !stock || !category) {
        console.log("All fields are mandatory");
        return;
      }
      if (existingProducts.some((item) => item.code === code)) {
        console.log("The code must be unique");
        return;
      }
      const newProduct = {
        title,
        description,
        code,
        price,
        status: true,
        stock,
        category,
        thumbnails: "No images yet",
      };
      if (existingProducts.length > 0) {
        ProductManager.ultId = existingProducts.reduce(
          (maxId, product) => Math.max(maxId, product.id),
          0
        );
      }
      newProduct.id = ++ProductManager.ultId;
      existingProducts.push(newProduct);
      await this.saveToFile(existingProducts);
    } catch (error) {
      console.log("An error occurred, the product was not loaded", error);
      throw error;
    }
  }

  async getProducts() {
    try {
      return await this.readFromFile();
    } catch (error) {
      console.log("Error reading the file", error);
      throw error;
    }
  }

  async getProductById(id) {
    try {
      const existingProducts = await this.readFromFile();
      const found = existingProducts.find((item) => item.id === id);
      if (!found) {
        console.log("Product was not found");
        return null;
      } else {
        console.log("Product was found");
        return found;
      }
    } catch (error) {
      console.log("Error reading the file", error);
      throw error;
    }
  }

  async readFromFile() {
    try {
      const response = await fs.readFile(this.path, "utf-8");
      const existingProducts = JSON.parse(response);
      return existingProducts;
    } catch (error) {
      console.log("Error reading the file", error);
      throw error;
    }
  }

  async saveToFile(existingProducts) {
    try {
      await fs.writeFile(this.path, JSON.stringify(existingProducts, null, 2));
    } catch (error) {
      console.log("Error saving the file", error);
      throw error;
    }
  }

  async updateProduct(id, updatedProduct) {
    try {
      const arrayProducts = await this.readFromFile();
      const index = arrayProducts.findIndex((item) => item.id === id);
      if (index !== -1) {
        arrayProducts[index] = { ...arrayProducts[index], ...updatedProduct };
        await this.saveToFile(arrayProducts);
        console.log("Product was updated");
      } else {
        console.log("The product was not found");
      }
    } catch (error) {
      console.log("Error updating the product", error);
      throw error;
    }
  }

  async deleteProduct(id) {
    try {
      const arrayProducts = await this.readFromFile();
      const index = arrayProducts.findIndex((item) => item.id === id);
      if (index !== -1) {
        arrayProducts.splice(index, 1);
        await this.saveToFile(arrayProducts);
        console.log("Product was eliminated");
      } else {
        console.log("The product was not found");
      }
    } catch (error) {
      console.log("Error eliminating the product", error);
      throw error;
    }
  }
}

export default ProductManager;
