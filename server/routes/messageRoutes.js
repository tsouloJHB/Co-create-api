const express = require('express');
const router = express.Router();
const {addMessage,getGroupMessages,getPrivateMessages,getAllMessages, getGroupMessagesByProjectId} = require('../controller/messageController');
const {getPrivateChat} = require('../controller/PrivateChatController');

router.get('/all' ,getAllMessages);
router.post('/',addMessage);
router.get('/groupChat/:groupChatId' ,getGroupMessages);
router.get('/groupChat/projectId/:projectId' ,getGroupMessagesByProjectId);
router.get('/privateChat/:privateChatId' ,getPrivateMessages);


module.exports = router;