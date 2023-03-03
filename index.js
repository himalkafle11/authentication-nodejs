const express = require("express");
const app = express();
const route = require("./router");

app.set("view engine", "ejs");
const port = 3000;

app.use(route);
app.listen(port, () => {
  console.log("server live at 3000");
});
