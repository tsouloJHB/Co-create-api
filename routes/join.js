const router = require("express").Router();
const protect = require('../middleware/authMiddleware.js');
const joinController = require('../controller/joinController');


router.get("/:id",protect.protect,joinController.get_join_requests);
router.post("/:id",protect.protect,joinController.join_project);
router.delete('/:id',protect.protect,joinController.delete_join);
router.put('/',protect.protect,joinController.join_response);

module.exports = router;