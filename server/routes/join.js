const router = require("express").Router();
const protect = require('../middleware/authMiddleware.js');
const joinController = require('../controller/joinController');

router.get("/requests",protect.protect,joinController.get_all_join_requests);
router.get("/:id",protect.protect,joinController.get_join_requests);

router.post("/",protect.protect,joinController.join_project);
router.delete('/:postId',protect.protect,joinController.delete_join);
router.put('/',protect.protect,joinController.join_response);

module.exports = router;