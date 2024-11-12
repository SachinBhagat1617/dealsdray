const Employee = require("../models/employee");
const cloudinary = require("cloudinary").v2;
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
    console.log(req.files);
    const { name, email, mobile, designation, gender, courses } = req.body;
    console.log(req.body);
    if (!name || !email || !mobile || !designation || !gender || !courses) {
      return next(Error("Please Fill up all the details"));
    }

    const emp = await Employee.findOne({ email });
    if (emp) {
      return res.json({
        success: false,
        message: "User already exists",
      });
    }

    const employee = new Employee({
      name,
      email,
      mobile,
      designation,
      gender,
      courses,
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
    const employees = await Employee.find();

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
      const employee = await Employee.findOne({ id });
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
    let { name, email, mobile, designation, gender, courses } = req.body;
      const employee = await Employee.findOne({ id });
    if (!employee) {
      return next(Error("user doesnot exist"));
    }
    employee.name = name;
    employee.email = email;
    employee.mobile = mobile;
    employee.designation = designation;
    employee.gender = gender;
    employee.courses = courses;
    let result;
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
      const employee = await Employee.deleteOne({ id });
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
