const router = require("express").Router();
const protect = require('../middleware/authMiddleware.js');

const {post_comment,get_comments} = require('../controller/CommentsController');

router.get('/:postId',protect.protect,get_comments);
router.post('/',protect.protect,post_comment);

module.exports = router