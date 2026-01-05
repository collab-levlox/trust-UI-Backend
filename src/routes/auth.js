const express = require("express");
const router = express.Router();
const validate = require("../validation");
const { authValidator } = require("../validation/auth.validation");
const { loginController } = require("../controller/auth.controller");

router.post("/login", validate(authValidator.login), loginController);


module.exports = router;

