const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const helmet = require("helmet");
const compress = require("compression");
const userRoutes = require("./routes/userRoutes");
const authRoutes = require("./routes/authRoutes");
const queryRoutes = require("./routes/queryRoutes");
const app = express();


app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true, parameterLimit: 50000, }));
app.use(compress());
app.use(helmet());
app.use(cors());

app.use("/", userRoutes);
app.use("/", authRoutes);
app.use("/", queryRoutes);


module.exports = app;
