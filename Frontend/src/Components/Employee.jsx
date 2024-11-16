import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import EditEmployee from "./EditEmployee";

const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);
  const token = useSelector((state) => state.app.token);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [employeeId, setEmployeeId] = useState(null);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    company: "",
    jobTitle: "",
    image: null,
  });

  useEffect(() => {
    if (token) fetchEmployees();
  }, [token]);

  const fetchEmployees = async () => {
    try {
      const response = await axios.post(
        "http://localhost:7777/api/v1/getALLContacts",
        { token }
      );
      setEmployees(response.data.employees);
      console.log(response.data);
    } catch (error) {
      console.error("Error fetching employees:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:7777/api/v1/contacts/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEmployees(employees.filter((employee) => employee.id !== id));
      fetchEmployees();
    } catch (error) {
      console.error("Error deleting employee:", error);
    }
  };

  const handleSort = (field) => {
    // Sorting logic can be implemented if necessary
  };

  // handle input changes in the form
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // handle file input change for image upload
  const handleFileChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      image: e.target.files[0],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = new FormData();
    form.append("firstName", formData.firstName);
    form.append("lastName", formData.lastName);
    form.append("email", formData.email);
    form.append("phoneNumber", formData.phoneNumber);
    form.append("company", formData.company);
    form.append("jobTitle", formData.jobTitle);
    form.append("token", token);
    if (formData.image) form.append("image", formData.image);

    try {
      const response = await axios.post(
        "http://localhost:7777/api/v1/contacts",
        form
      );
      if (response.data.success) {
        toast.success("Employee created successfully!");
        setEmployees((prev) => [...prev, response.data.employee]);
        setShowCreateModal(false);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Error creating employee:", error);
      toast.error("An error occurred while creating the employee.");
    }
  };

  return (
    <div>
      <div className="p-8">
        <h1 className="text-2xl font-semibold mb-4">Employee List</h1>
        <div className="flex justify-between items-center mb-4">
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
          >
            Create Employee
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
            <thead className="bg-gray-100 border-b border-gray-200">
              <tr>
                <th className="text-left px-6 py-3 text-gray-600 font-medium">
                  Image
                </th>
                <th
                  onClick={() => handleSort("firstName")}
                  className="text-left px-6 py-3 text-gray-600 font-medium cursor-pointer"
                >
                  First Name
                </th>
                <th
                  onClick={() => handleSort("lastName")}
                  className="text-left px-6 py-3 text-gray-600 font-medium cursor-pointer"
                >
                  Last Name
                </th>
                <th
                  onClick={() => handleSort("email")}
                  className="text-left px-6 py-3 text-gray-600 font-medium cursor-pointer"
                >
                  Email
                </th>
                <th
                  onClick={() => handleSort("phone")}
                  className="text-left px-6 py-3 text-gray-600 font-medium cursor-pointer"
                >
                  Phone Number
                </th>
                <th
                  onClick={() => handleSort("company")}
                  className="text-left px-6 py-3 text-gray-600 font-medium cursor-pointer"
                >
                  Company
                </th>
                <th
                  onClick={() => handleSort("jobTitle")}
                  className="text-left px-6 py-3 text-gray-600 font-medium cursor-pointer"
                >
                  Job Title
                </th>
                <th className="text-left px-6 py-3 text-gray-600 font-medium">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {employees.map((employee) => (
                <tr key={employee._id} className="border-b">
                  <td className="px-6 py-4">
                    <img
                      src={employee.image.secure_url}
                      alt="employee"
                      className="w-8 rounded-full"
                    />
                  </td>
                  <td className="px-6 py-4">{employee.firstName}</td>
                  <td className="px-6 py-4">{employee.lastName}</td>
                  <td className="px-6 py-4">{employee.email}</td>
                  <td className="px-6 py-4">{employee.phoneNumber}</td>
                  <td className="px-6 py-4">{employee.company}</td>
                  <td className="px-6 py-4">{employee.jobTitle}</td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() =>
                        setEmployeeId(employee._id) || setShowEditModal(true)
                      }
                      className="text-blue-600 hover:underline mr-2"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(employee._id)}
                      className="text-red-600 hover:underline"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showCreateModal && (
        <div className="fixed inset-0 flex justify-center items-center bg-opacity-50 bg-slate-800 z-50">
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full relative">
            <button
              className="absolute top-3 right-3 text-gray-600 hover:text-gray-800"
              onClick={() => setShowCreateModal(false)}
            >
              &times;
            </button>
            <h2 className="text-2xl font-semibold mb-4">Add Contact</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                name="firstName"
                placeholder="First Name"
                value={formData.firstName}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                required
              />
              <input
                type="text"
                name="lastName"
                placeholder="Last Name"
                value={formData.lastName}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                required
              />
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                required
              />
              <input
                type="text"
                name="phoneNumber"
                placeholder="Phone Number"
                value={formData.phoneNumber}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                required
              />
              <input
                type="text"
                name="company"
                placeholder="Company"
                value={formData.company}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                required
              />
              <input
                type="text"
                name="jobTitle"
                placeholder="Job Title"
                value={formData.jobTitle}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                required
              />
              <input
                type="file"
                name="image"
                onChange={handleFileChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
              <button
                type="submit"
                className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                Submit
              </button>
            </form>
          </div>
        </div>
      )}

      {showEditModal && (
        <EditEmployee
          employeeId={employeeId}
          closeEditModal={setShowEditModal}
          reloading={fetchEmployees}
        />
      )}
      <ToastContainer />
    </div>
  );
};

export default EmployeeList;
