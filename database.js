const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

mongoose
  .connect(process.env.DB)
  .then(() => {
    console.log("connection successfull");
  })
  .catch((e) => {
    console.log(e);
  });

const schema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phone: {
    type: Number,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  confpassword: {
    type: String,
    required: true,
  },
  tokens: [
    {
      token: {
        type: String,
        required: true,
      },
    },
  ],
});

schema.methods.generateToken = async function () {
  try {
    const tokenUser = jwt.sign({ _id: this._id.toString() }, process.env.KEY);
    this.tokens = this.tokens.concat({ token: tokenUser });
    await this.save();
    return tokenUser;
  } catch (error) {}
};

schema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

const userModel = mongoose.model("userDetails", schema);

module.exports = userModel;
