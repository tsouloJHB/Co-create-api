var express = require('express');
var router = express.Router();
const authController = require('../controller/authController');
const protect = require('../middleware/authMiddleware.js');
/* GET users listing. */
router.get('/', protect.protect,authController.get_user);

router.post('/login',protect.role,authController.login_post);
router.post('/signup',authController.sign_up);
router.get('/logout',protect.protect,authController.logout);
router.put('/update/:id',protect.protect,authController.update_user);
router.put('/changepassword',authController.change_password);
router.post('/refresh-token',authController.refreshToken);
router.get('/:id',protect.protect,authController.get_user);
module.exports = router;
