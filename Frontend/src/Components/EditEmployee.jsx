import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const EditEmployee = ({ employeeId, closeEditModal, reloading }) => {
  const [showModal, setShowModal] = useState(true); // Modal visibility state
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    company: "",
    jobTitle: "",
    image: null,
  });
  const [currentImage, setCurrentImage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (employeeId) fetchEmployeeDetails();
  }, [employeeId]);

  const fetchEmployeeDetails = async () => {
    try {
      const response = await axios.get(
        `http://localhost:7777/api/v1/getSingleContact/${employeeId}`
      );
      const { employee } = response.data;
      setFormData({
        firstName: employee.firstName,
        lastName: employee.lastName,
        email: employee.email,
        phoneNumber: employee.phoneNumber,
        company: employee.company,
        jobTitle: employee.jobTitle,
        image: null, // User may update this
      });
      setCurrentImage(employee.image.secure_url);
      
    } catch (error) {
      console.error("Error fetching employee details:", error);
      toast.error("Failed to fetch employee details.");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      image: e.target.files[0],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const form = new FormData();
    form.append("firstName", formData.firstName);
    form.append("lastName", formData.lastName);
    form.append("email", formData.email);
    form.append("phoneNumber", formData.phoneNumber);
    form.append("company", formData.company);
    form.append("jobTiltle", formData.jobTitle);
    if (formData.image) form.append("image", formData.image);

    try {
      const response = await axios.patch(
        `http://localhost:7777/api/v1/contacts/${employeeId}`,
        form
      );

      if (response.data.success) {
        toast.success("Employee updated successfully!");
        closeEditModal(); // Call parent function to handle any additional logic
        window.location.reload(true);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Error updating employee:", error);
      toast.error("An error occurred while updating the employee.");
    } finally {
      setLoading(false);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false); // Close modal

    closeEditModal();

  };

  // Only render the modal if showModal is true
  if (!showModal) return null;

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-opacity-50 bg-slate-800 z-50">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full relative">
        <button
          className="absolute top-3 right-3 text-gray-600 hover:text-gray-800"
          onClick={handleCloseModal}
        >
          &times;
        </button>
        <h2 className="text-2xl font-semibold mb-4">Edit Contact</h2>
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
          <div className="flex items-center space-x-4">
            {currentImage && (
              <img
                src={currentImage}
                alt="current"
                className="w-16 h-16 rounded-full"
              />
            )}
            <input
              type="file"
              name="image"
              onChange={handleFileChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className={`w-full px-4 py-2 ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-600 text-white"
            } rounded-lg`}
          >
            {loading ? "Updating..." : "Update Employee"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditEmployee;
