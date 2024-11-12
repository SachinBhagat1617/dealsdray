const app = require("./app");
const cors =require("cors")
const connectwithDB = require("../config/db");
require("dotenv").config();
const cloudinary = require("cloudinary").v2;


cloudinary.config({
    cloud_name: process.env.cloud_name,
    api_key: process.env.api_key,
    api_secret:process.env.api_secret,
})
const connect = (async () => {
    try {
        await connectwithDB();
        app.listen(process.env.PORT, () => {
            console.log(`app is listening in PORT ${process.env.PORT}`);
        });
    } catch (error) {
        console.log("Fail to connect")
    }
})();
