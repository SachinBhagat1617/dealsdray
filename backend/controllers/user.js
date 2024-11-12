const User = require("../models/user");
const bcrypt = require("bcryptjs");
const cookieToken = require("../utils/cookieToken");
exports.signUp = async (req, res, next) => {
  try {
    let { name, password, email } = req.body;
    if (!name || !email || !password) {
      return res.json({
        success: false,
        message: "Please enter name, email and password",
      });
    }
    if (password.length < 8) {
      return res.json({
        success: false,
        message: "Please enter a string password",
      });
    }

    const exist = await User.findOne({ email });
    if (exist) {
      return res.json({
        success: false,
        message: "User already exist",
      });
    }
    const hashPassword = await bcrypt.hash(password, 10);
    const user = new User({
      name,
      email,
      password: hashPassword,
    });
      await user.save();
      console.log(user)
    cookieToken(user, res);
  } catch (error) {
    console.error("Error during sign-up:", error);
    res.json({
      success: false,
      message: "Error",
      error: error.message || error,
    });
  }
};
exports.logIn = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return next(Error("Please Provide email and password"));
    }
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.json({
        success: false,
        message: "User not exist",
      });
    }
    const compare = await bcrypt.compare(password, user.password);
    if (!compare) {
      return res.json({ success: false, message: "Invalid Credentials" });
    }
    const token = cookieToken(user, res);
  } catch (error) {
    res.json({
      success: false,
      message: "Error",
      error: error.message || error,
    });
  }
};

exports.logout = async (req, res, next) => {
  try {
    res.cookie("token", null, {
      expires: new Date(Date.now()),
      httpOnly: true,
    });
    res.status(200).json({
      success: "True",
      message: "Logout SucessFully",
    });
  } catch (error) {
    console.log(error);
    res.send(error);
  }
};
