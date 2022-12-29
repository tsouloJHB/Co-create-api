const router = require("express").Router();
const Post = require("../models/Post");
const User = require("../models/user");
const postController = require('../controller/postController');
const protect = require('../middleware/authMiddleware.js');


router.get("/all", postController.get_all_posts);
router.post("/",protect.protect,postController.create_post);
router.get("/:id", protect.protect,postController.get_post);
router.get("/", protect.protect,postController.get_user_posts);
router.put("/:id",protect.protect,postController.update_post);
router.delete("/:id",protect.protect,postController.delete_post);

module.exports = router;

