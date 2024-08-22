import { Router } from "express";
const router = Router();
import UserModel from "../dao/models/users.model.js";
import CartModel from "../dao/models/cart.model.js";
import { createHash, isValidPassword } from "../utils/util.js";
import passport from "passport";
import jwt from "jsonwebtoken";

//Register

router.post("/register", async (req, res) => {
  const { first_name, last_name, age, email, password } = req.body;

  try {
    const existingUser = await UserModel.findOne({ email });

    if (existingUser) {
      return res.status(400).send("This email is already registered");
    }

    const cart = new Cart();
    await cart.save();

    const newUser = new UserModel({
      first_name,
      last_name,
      age,
      email,
      password: createHash(password),
      cart: cart._id,
    });

    await newUser.save();

    const token = jwt.sign(
      { email: newUser.email, role: newUser.role },
      "coderhouse",
      { expiresIn: "3h" }
    );

    res.cookie("coderCookieToken", token, {
      maxAge: 10800000,
      httpOnly: true,
    });

    res.redirect("/api/sessions/current");
  } catch (error) {
    res.status(500).send("Internal server error, register");
  }
});

// Login

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const existingUser = await UserModel.findOne({ email });

    if (!existingUser) {
      return res.status(401).send("User not found");
    }

    if (!isValidPassword(password, existingUser)) {
      return res.status(401).send("Invalid password");
    }

    const token = jwt.sign(
      { user: existingUser.email, role: existingUser.role },
      "coderhouse",
      { expiresIn: "3h" }
    );

    res.cookie("coderCookieToken", token, {
      maxAge: 10800000,
      httpOnly: true,
    });

    res.redirect("/api/sessions/current");
  } catch (error) {
    res.status(500).send("Internal server error, login");
  }
});

//Current

router.get(
  "/current",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    if (req.user) {
      res.render("home", { user: req.user.email });
    } else {
      res.status(401).send("Not authorized");
    }
  }
);

//Logout

router.post("/logout", (req, res) => {
  res.clearCookie("coderCookieToken");

  res.redirect("/login");
});

//Ruta exclusiva para admins:

router.get(
  "/admin",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    if (req.user.role !== "admin") {
      return res.status(403).send("You do no have admin privileges");
    }
    res.render("admin");
  }
);

export default router;
