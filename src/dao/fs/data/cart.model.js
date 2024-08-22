import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
  products: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "products",
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
      },
    },
  ],
});

const CartModel = mongoose.model("carts", cartSchema);

export default CartModel;

//PROFE: En el after no entendí por qué se trajo el cart.model.js y product.model.js que puso en la
//carpeta "data" bajo la carpeta "fs". Los dejé aquí pero para esta entrega yo uso los archivos de
//la carpeta "models"
