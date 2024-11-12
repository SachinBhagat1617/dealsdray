const express = require("express");
const { createEmployee, getAllEmployee, getSingleEmployee, editEmployee, deleteEmployee } = require("../controllers/employeeController");
const router = express.Router();

router.route("/employee/createEmployee").post(createEmployee);
router.route("/employee/getAllEmployee").get(getAllEmployee);
router.route("/employee/getSingleEmployee/:id").get(getSingleEmployee);
router.route("/employee/editEmployee/:id").patch(editEmployee);
router.route("/employee/deleteEmployee/:id").delete(deleteEmployee);
module.exports = router;
