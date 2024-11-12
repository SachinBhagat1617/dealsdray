import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const EditEmployee = ({ employeeId, setShowEditModal, setEmployees }) => {
  const [employeeDetails, setEmployeeDetails] = useState({
    name: "",
    email: "",
    mobile: "",
    designation: "HR",
    gender: "",
    courses: [],
    selectedImage: null,
  });
  const [courses, setCourses] = useState([]); // Keep track of selected courses
  const token = useSelector((state) => state.app.token);

  useEffect(() => {
    if (employeeId) {
      fetchEmployeeDetails(employeeId);
    }
  }, [employeeId]);

  // Fetch employee details
  const fetchEmployeeDetails = async (id) => {
    try {
      const response = await axios.get(
        `http://localhost:7777/api/v1/employee/getSingleEmployee/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const employee = response.data.employee;
      setEmployeeDetails({
        name: employee.name,
        email: employee.email,
        mobile: employee.mobile,
        designation: employee.designation,
        gender: employee.gender,
        courses: employee.courses,
        selectedImage: employee.image,
      });
      setCourses(employee.courses); // Pre-set selected courses
    } catch (error) {
      console.error("Error fetching employee details:", error);
      toast.error("Error fetching employee details");
    }
  };

  const handleCheckboxChange = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      setCourses((prevCourses) => [...prevCourses, value]);
    } else {
      setCourses((prevCourses) =>
        prevCourses.filter((course) => course !== value)
      );
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setEmployeeDetails((prevState) => ({
        ...prevState,
        selectedImage: file,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", employeeDetails.name);
    formData.append("email", employeeDetails.email);
    formData.append("mobile", employeeDetails.mobile);
    formData.append("designation", employeeDetails.designation);
    formData.append("gender", employeeDetails.gender);
    formData.append("courses", courses);
    if (employeeDetails.selectedImage) {
      formData.append("image", employeeDetails.selectedImage); // Append image file
    }

    try {
      const response = await axios.patch(
        `http://localhost:7777/api/v1/employee/editEmployee/${employeeId}`,
        formData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (response.data.success) {
        toast.success("Employee updated successfully");
        setShowEditModal(false); // Close modal after successful update
        updateEmployeeInList(response.data.employee); // Update employee in the list
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Error editing employee:", error);
      toast.error("Error editing employee");
    }
  };

  // Function to update the employee in the list
  const updateEmployeeInList = (updatedEmployee) => {
    setEmployees((prevEmployees) =>
      prevEmployees.map((employee) =>
        employee._id === updatedEmployee._id ? updatedEmployee : employee
      )
    );
  };

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-opacity-50 bg-slate-800 z-50">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full relative">
        <button
          className="absolute top-3 right-3 text-gray-600 hover:text-gray-800"
          onClick={() => setShowEditModal(false)}
        >
          &times;
        </button>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700">Name</label>
            <input
              type="text"
              placeholder="Enter Name"
              value={employeeDetails.name}
              onChange={(e) =>
                setEmployeeDetails({ ...employeeDetails, name: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-gray-700">Email</label>
            <input
              type="email"
              placeholder="Enter Email"
              value={employeeDetails.email}
              onChange={(e) =>
                setEmployeeDetails({
                  ...employeeDetails,
                  email: e.target.value,
                })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-gray-700">Mobile No</label>
            <input
              type="text"
              placeholder="Enter Mobile No"
              value={employeeDetails.mobile}
              onChange={(e) =>
                setEmployeeDetails({
                  ...employeeDetails,
                  mobile: e.target.value,
                })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-gray-700">Designation</label>
            <select
              onChange={(e) =>
                setEmployeeDetails({
                  ...employeeDetails,
                  designation: e.target.value,
                })
              }
              value={employeeDetails.designation}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="HR">HR</option>
              <option value="Manager">Manager</option>
              <option value="Sales">Sales</option>
            </select>
          </div>
          <div>
            <label className="block text-gray-700">Gender</label>
            <div className="flex space-x-4">
              <label>
                <input
                  type="radio"
                  name="gender"
                  value="Male"
                  checked={employeeDetails.gender === "Male"}
                  onChange={() =>
                    setEmployeeDetails({ ...employeeDetails, gender: "Male" })
                  }
                  className="mr-2"
                />
                Male
              </label>
              <label>
                <input
                  type="radio"
                  name="gender"
                  value="Female"
                  checked={employeeDetails.gender === "Female"}
                  onChange={() =>
                    setEmployeeDetails({
                      ...employeeDetails,
                      gender: "Female",
                    })
                  }
                  className="mr-2"
                />
                Female
              </label>
            </div>
          </div>
          <div>
            <label className="block text-gray-700">Courses</label>
            <div className="space-y-2">
              {["MCA", "BCA", "BSc"].map((course) => (
                <label key={course} className="inline-flex items-center">
                  <input
                    type="checkbox"
                    value={course}
                    checked={courses.includes(course)} // Use 'courses' state here
                    onChange={handleCheckboxChange}
                    className="mr-2"
                  />
                  {course}
                </label>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-gray-700">Image</label>
            <input
              type="file"
              onChange={handleImageChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600"
          >
            Update Employee
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditEmployee;
