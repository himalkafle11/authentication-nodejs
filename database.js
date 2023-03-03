const mongoose = require("mongoose");
mongoose
  .connect("mongodb://127.0.0.1:27017/authentication")
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
});

const userModel = mongoose.model("userDetails", schema);

module.exports = userModel;
