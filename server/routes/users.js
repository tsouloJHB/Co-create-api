var express = require('express');
var router = express.Router();
const authController = require('../controller/authController');
const protect = require('../middleware/authMiddleware.js');
/* GET users listing. */
router.get('/users/:users',protect.protect,authController.get_users);
router.get('/', protect.protect,authController.get_user);

router.post('/login',protect.role,authController.login_post);
router.post('/signup',authController.sign_up);
router.get('/logout',protect.protect,authController.logout);
router.put('/',protect.protect,authController.update_user);
router.put('/changepassword',authController.change_password);
router.post('/refresh-token',authController.refreshToken);
router.get('/:userid',protect.protect,authController.get_user_by_id);
router.put('/upload',protect.protect,authController.updateProfilePicture);

module.exports = router;
