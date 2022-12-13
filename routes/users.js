var express = require('express');
var router = express.Router();
const authController = require('../controller/authController');
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('User info');
});

router.post('/login',authController.login_post);

module.exports = router;
