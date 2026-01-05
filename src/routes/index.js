const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth.middleware")
router.use("/auth", require("./auth"));
router.use("/media", require("./media"));



module.exports = router;
