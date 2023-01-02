const express = require('express');
const router = express.Router();


router.get('/:userId',userChats);
router.get('/projectId',findGroupChat);

module.exports = router;


  


 
