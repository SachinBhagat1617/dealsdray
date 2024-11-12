import React, { useEffect, useState } from "react";
import logo from "../assets/logo.png";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toggleLogIn, setToken } from "../utils/appSlice";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Navbar = () => {
  const isLoggedIn = useSelector((state) => state.app.isLoggedIn);
  const [auth, setAuth] = useState("login");
  const dispatch = useDispatch();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showModal, setShowModal] = useState(false);
  const token = useSelector((state) => state.app.token);

  const handleAuthToggle = () => {
    setAuth((prevAuth) => (prevAuth === "login" ? "signup" : "login"));
  };

  const toggleModal = () => {
    setShowModal(!showModal);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let response;
    try {
      if (auth === "signup") {
        response = await axios.post(
          "http://localhost:7777/api/v1/user/signUp",
          {
            name: name,
            password: password,
            email: email,
          }
        );
        if (response.data.success) {
          dispatch(setToken(response.data.token));
          localStorage.setItem("token", response.data.token);
          dispatch(toggleLogIn());
          toggleModal();
          toast.success("Sign up successful! You are now logged in.");
        } else {
          toast.error(response.data.message);
        }
      } else if (auth === "login") {
        response = await axios.post("http://localhost:7777/api/v1/user/logIn", {
          password: password,
          email: email,
        });
        if (response.data.success) {
          dispatch(setToken(response.data.token));
          localStorage.setItem("token", response.data.token);
          dispatch(toggleLogIn());
          toggleModal();
          toast.success("Login successful!");
        } else {
          toast.error(response.data.message);
        }
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.");
    }
  };

  const navigate = useNavigate();
  const handleLogout = () => {
    dispatch(toggleLogIn());
    localStorage.removeItem("token");
    dispatch(setToken(""));
    navigate("/");
    window.location.reload(true);
    toast.success("Logged out successfully.");
  };

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      dispatch(setToken(storedToken));
    }
  }, [dispatch]);

  return (
    <div className="">
      <ToastContainer position="top-center" autoClose={3000} />
      <div className="shadow-xl">
        <div className="flex justify-between">
          <div className="flex space-x-4">
            <img className="w-16" src={logo} alt="logo" />
            <div className="text-xl flex justify-center items-center cursor-pointer">
              Home
            </div>
            {token && (
              <Link
                to="/employeeList"
                className="cursor-pointer text-xl flex justify-center items-center"
              >
                Employee List
              </Link>
            )}
          </div>
          <button
            className="bg-blue-600 text-white m-4 p-2 w-16 rounded-xl hover:bg-blue-500"
            onClick={token ? handleLogout : toggleModal}
          >
            {token ? "Logout" : "Login"}
          </button>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full relative">
            <button
              className="absolute top-3 right-3 text-gray-600 hover:text-gray-800"
              onClick={toggleModal}
            >
              &times;
            </button>
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                {auth === "signup" && (
                  <div>
                    <label className="block text-gray-600">Name :</label>
                    <input
                      type="text"
                      placeholder="Enter your name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-3 py-2 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                )}
                <div>
                  <label className="block text-gray-600">Email :</label>
                  <input
                    type="text"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-600">Password :</label>
                  <input
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <button
                  type="submit"
                  className="bg-blue-600 text-white py-2 w-full rounded-lg hover:bg-blue-700 transition"
                >
                  {auth === "signup" ? "Sign Up" : "Login"}
                </button>
                <div className="text-center text-gray-600 mt-4">
                  {auth === "signup" ? (
                    <>
                      Already have an account?{" "}
                      <span
                        className="text-blue-600 underline cursor-pointer"
                        onClick={handleAuthToggle}
                      >
                        Log In
                      </span>
                    </>
                  ) : (
                    <>
                      Don't have an account?{" "}
                      <span
                        className="text-blue-600 underline cursor-pointer"
                        onClick={handleAuthToggle}
                      >
                        Sign Up
                      </span>
                    </>
                  )}
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;
