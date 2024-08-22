import mongoose from "mongoose";

mongoose
  .connect(
    "mongodb+srv://euhdz8a:coderhouse@cluster0.bphuura.mongodb.net/ecommerce?retryWrites=true&w=majority&appName=Cluster0"
  )
  .then(() => console.log("Successful connection to MongoDB"))
  .catch((error) => console.log("Failed to connect to MongoDB", error));
