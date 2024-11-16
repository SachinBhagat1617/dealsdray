const Employee = require("../models/employee");
const cloudinary = require("cloudinary").v2;
const jwt=require("jsonwebtoken")
exports.createEmployee = async (req, res, next) => {
  try {
    let result;
    if (req.files) {
      let file = req.files.image;
      result = await cloudinary.uploader.upload(file.tempFilePath, {
        folder: "DealsDray",
        width: 120,
        crop: "scale",
      });
    }
    
    //console.log(req.files);
    const { firstName, lastName, email,phoneNumber, company, jobTitle, token } =
      req.body;
    if (
      !firstName ||
      !lastName ||
      !email ||
      !phoneNumber ||
      !company ||
      !jobTitle ||
      !token
    ) {
      return next(Error("Please Fill up all the details"));
    }
  
    const decode = jwt.verify(token, process.env.JWT_SECRET);
    console.log(decode)
    const userId = decode.id;
    console.log(userId)
    const emp = await Employee.findOne({ email });
    if (emp) {
      return res.json({
        success: false,
        message: "User already exists",
      });
    }

    const employee = new Employee({
      firstName,
      lastName,
      email,
      phoneNumber,
      company,
      jobTitle,
      user: userId,
      image: {
        id: result.public_id,
        secure_url: result.secure_url,
      },
    });

    await employee.save();

    return res.json({
      success: true,
      message: "Employee Added",
      employee,
    });
  } catch (error) {
    console.error(error); 
    res.status(500).json({
      success: false,
      message: "An error occurred while adding the employee",
      error: error.message,
    });
  }
};


exports.getAllEmployee = async (req, res, next) => {
  try {
    const { token } = req.body;
    const decode = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decode.id;
    const employees = await Employee.find({ user: userId });
    return res.json({
      success: true,
      employees,
    });
  } catch (error) {
    return res.send(error);
  }
};

exports.getSingleEmployee = async (req, res, next) => {
  try {
    const { id } = req.params;
      const employee = await Employee.findOne({ _id:id });
    console.log(employee);
    if (!employee) {
      return next(Error("User doesnot Exist"));
    }
    res.json({
      employee,
    });
  } catch (error) {
    return res.send(error);
  }
};

exports.editEmployee = async (req, res, next) => {
  try {
    const { id } = req.params;
    let { firstName, lastName, email, phoneNumber, company,jobTiltle } = req.body;
    const employee = await Employee.findOne({ _id:id });
    if (!employee) {
      return next(Error("user doesnot exist"));
    }
    employee.firstName = firstName;
    employee.lastName = lastName;
    employee.email = email;
    employee.phoneNumber = phoneNumber;
    employee.company = company;
    employee.jobTiltle = jobTiltle;

    if (req.files) {
      const photoId = employee.image.id;
      const resp = await cloudinary.uploader.destroy(photoId);
      const imageUpload = await cloudinary.uploader.upload(
        req.files.image.tempFilePath,
        {
          folder: "DealsDray",
          width: 120,
          crop: "scale",
        }
      );
      employee.image = {
        id: imageUpload.public_id,
        secure_url: imageUpload.secure_url,
      };
    }
    await employee.save();
    return res.json({
      success: true,
      message: "Updated",
      employee,
    });
  } catch (error) {
    return res.send(error);
  }
};

exports.deleteEmployee = async (req, res, next) => {
  try {
    const { id } = req.params;
      const employee = await Employee.deleteOne({ _id :id});
    if (!employee) {
      return next(Error("User Doenot Exist"));
    }
    res.json({
      success: true,
      message: "User deleted Successfully",
    });
  } catch (error) {
    res.send(error);
  }
};
