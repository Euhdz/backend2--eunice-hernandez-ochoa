//PROFE: En el after no entendí por qué se trajo el cart.model.js y product.model.js que puso en la
//carpeta "data" bajo la carpeta "fs". Los dejé aquí pero para esta entrega yo uso los archivos de
//la carpeta "models"

import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  code: {
    type: String,
    required: true,
    unique: true,
  },
  price: {
    type: Number,
    required: true,
  },
  status: {
    type: Boolean,
    required: true,
  },
  stock: {
    type: Number,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  thumbnails: {
    type: [String],
  },
});

const ProductModel = mongoose.model("products", productSchema);

export default ProductModel;
