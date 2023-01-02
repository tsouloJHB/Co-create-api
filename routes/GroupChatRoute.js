const express = require('express');
const router = express.Router();
const GroupChatController = require('../controller/GroupChatController');


router.get('/all',GroupChatController.getAllGroupChat);
router.get('/:userId',GroupChatController.getUserGroupChats);


router.get('/find/:projectId',GroupChatController.getGroupChat);




module.exports = router;


  


 
