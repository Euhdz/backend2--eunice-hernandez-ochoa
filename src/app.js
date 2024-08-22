import express from "express";
import { engine } from "express-handlebars";
import { Server } from "socket.io";
import productsRouter from "./routes/products.router.js";
import cartsRouter from "./routes/carts.router.js";
import ProductManager from "./dao/fs/product-manager.js"; //CHECAR SI DEBO DEJAR ESTA LINEA O DEBO COMENTARLA
import "./database.js";

//import session from "express-session";
//import MongoStore from "connect-mongo";
import sessionRouter from "./routes/session.router.js";
import passport from "passport";
import initializePassport from "./config/passport.config.js";
import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken";

import viewsRouter from "./routes/views.router.js";

const app = express();
const PORT = 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("./src/public"));
app.use(cookieParser());

// app.use(session({
//   secret: "secretCoder",
//   resave: true,
//   saveUninitialized: true,
//   store: MongoStore.create({
//       mongoUrl: "mongodb+srv://euhdz8a:coderhouse@cluster0.bphuura.mongodb.net/ecommerce?retryWrites=true&w=majority&appName=Cluster0",
//   })
// }));

app.use(passport.initialize());
initializePassport();
// app.use(passport.session());

app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", "./src/views");

app.get("/", (req, res) => {
  res.send("BIENVENIDOS A TAMALES GALLO CON MONGOOSE.!!!");
}); //CHECAR SI DEJO ESTO

app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/", viewsRouter);
//app.use("/api/sessions", sessionRouter);

const httpServer = app.listen(PORT, () => {
  console.log(`Listening port: ${PORT}`);
});

const productManager = new ProductManager("./src/data/products.json");

const io = new Server(httpServer);

io.on("connection", async (socket) => {
  console.log("A client has connected");

  socket.emit("products", await productManager.getProducts());

  socket.on("deleteProduct", async (id) => {
    await productManager.deleteProduct(id);

    io.sockets.emit("products", await productManager.getProducts());
  });
  socket.on("addProduct", async (product) => {
    await productManager.addProduct(product);

    io.sockets.emit("products", await productManager.getProducts());
  });
});
