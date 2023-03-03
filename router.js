const express = require("express");
const Router = express.Router();
const user = require("./database");
const bcrypt = require("bcryptjs");
const cokkieParser = require("cookie-parser");
const auth = require("./authorize");

Router.get("/", (req, res) => {
  res.render("index");
});

Router.get("/loginn", (req, res) => {
  res.render("login");
});

Router.get("/auth", auth, (req, res) => {
  res.render("auth");
});

Router.post("/register", async (req, res) => {
  try {
    const data = new user(req.body);
    if (data.password === data.confpassword) {
      const emailValidation = await user.findOne({ email: data.email });
      if (emailValidation) {
        res.send("Email already exists!");
      }
      const token = await data.generateToken();

      res.cookie("jwt", token);

      const saveData = await data.save();
      res.render("login");
    } else {
      res.status(400).send("Fill correct details");
    }
  } catch (error) {
    res.status(400).send(`Error! ${error}`);
  }
});

Router.post("/login", async (req, res) => {
  try {
    const userPassword = req.body.password;
    const checkEmail = req.body.email;
    const databaseData = await user.findOne({ email: checkEmail });
    const isMatch = await bcrypt.compare(userPassword, databaseData.password);
    if (isMatch) {
      const token = await databaseData.generateToken();
      res.cookie("jwt", token);
      res.render("homepage");
    } else {
      res.status(400).send("Inputs invalid");
    }
  } catch (error) {
    res.status(400).send(error);
  }
});

Router.get("/logout", auth, async (req, res) => {
  try {
    req.user.tokens = [];
    res.clearCookie("jwt");
    const userdata = await req.user.save();
    res.render("login");
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = Router;
