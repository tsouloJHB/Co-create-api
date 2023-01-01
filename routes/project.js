const router = require("express").Router();

const protect = require('../middleware/authMiddleware.js');
const projectController = require('../controller/projectController');

router.get('/',protect.protect,projectController.get_user_projects);
router.get('/all',projectController.get_all_projects);
router.put('/:id',protect.protect,projectController.update_project);
router.delete('/:id',projectController.delete_project);
router.put('/startproject/:id',protect.protect,projectController.start_group);
router.delete('/exitproject/:id',protect.protect,projectController.leave_project);
router.delete('/removeuser/:id',protect.protect,projectController.remove_user_from_project);
module.exports = router;