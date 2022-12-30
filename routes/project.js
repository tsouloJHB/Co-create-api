const router = require("express").Router();
const Project = require('../models/project');
const protect = require('../middleware/authMiddleware.js');
const projectController = require('../controller/projectController');

router.get('/',protect.protect,projectController.get_user_projects);
router.get('/all',projectController.get_all_projects);
router.put('/:id',protect.protect,projectController.update_project);

module.exports = router;