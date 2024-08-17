const user = require("../controllers/userController");
const router = require("express").Router();

router.get("/", user.getUsers);

module.exports = router;