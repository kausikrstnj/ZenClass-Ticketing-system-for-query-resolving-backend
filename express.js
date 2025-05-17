const express = require("express");
const cors = require('cors');
const bodyParser = require("body-parser");
const userRoutes = require("./routes/userRoutes");
const authRoutes = require("./routes/authRoutes");
const paperRoutes = require("./routes/paperRoutes");
const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());


//app.use("/", userRoutes);
app.use("/", authRoutes);
app.use("/", paperRoutes);


module.exports = app;
