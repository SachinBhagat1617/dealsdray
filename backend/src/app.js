const express = require("express");
require("dotenv").config();
const app = express();
const cors = require("cors")
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload");
const path = require("path");
app.use(
  cors({
    origin: "http://localhost:5173", // Allow frontend to make requests from this origin
    methods: "GET,POST,PUT,PATCH,DELETE", // Allowed methods
    credentials: true, // Allow cookies to be sent
  })
);

//regular middleware
app.use(express.json()); // to convert json to js obj while receiving on req.body
app.use(express.urlencoded({ extended: true })); 
app.use(fileUpload({ useTempFiles: true }));
app.use(morgan("tiny")); //middleware for logging HTTP requests like GET /login 200 9.123 ms

//Routes
const userRouter = require('../routes/user');
const employeeRouter=require("../routes/employee")
app.use("/api/v1", userRouter);
app.use("/api/v1", employeeRouter);

app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: path.join("/tmp"),
  })
);

app.get("/api/v1/", (req, res) => {
  res.send("API is working");
});

module.exports = app;
