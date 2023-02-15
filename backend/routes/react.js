const express = require("express");
const router = express.Router();
const { reactPost, getReacts } = require("../controllers/react");
const { authUser } = require("../middleware/auth");

router.put("/reactPost", authUser, reactPost);
router.get("/getReacts/:id", authUser, getReacts);

module.exports = router;
