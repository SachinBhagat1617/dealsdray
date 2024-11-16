const express = require("express");
const { createEmployee, getAllEmployee, getSingleEmployee, editEmployee, deleteEmployee } = require("../controllers/employeeController");
const router = express.Router();

router.route("/contacts").post(createEmployee);
router.route("/getALLContacts").post(getAllEmployee);
router.route("/getSingleContact/:id").get(getSingleEmployee);
router.route("/contacts/:id").patch(editEmployee);
router.route("/contacts/:id").delete(deleteEmployee);
module.exports = router;
