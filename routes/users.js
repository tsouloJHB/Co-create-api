var express = require('express');
var router = express.Router();
const authController = require('../controller/authController');
const protect = require('../middleware/authMiddleware.js');
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('User info');
});

router.post('/login',protect.role,authController.login_post);
router.post('/signup',authController.sign_up);
router.put('/update/:id',protect.protect,authController.update_user);
module.exports = router;
