const express = require("express");
const router = express.Router();
const multer = require("multer");
const { uploadMedia, getMedia, getMediaList, deleteMedia, updateMedia } = require("../controller/media.controller");
const auth = require("../middleware/auth.middleware")

const storage = multer.memoryStorage();

const upload = multer({ storage });


router.post("/upload", auth, upload.single("file"), uploadMedia);
router.get("/list", getMediaList);
router.get("/:id", getMedia);
router.delete("/delete/:id", auth, deleteMedia);
router.patch("/:id", auth, updateMedia);


module.exports = router;