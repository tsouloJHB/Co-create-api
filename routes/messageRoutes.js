const express = require('express');
const router = express.Router();
const {addMessage,getGroupMessages,getPrivateMessages,getAllMessages} = require('../controller/messageController');
const {getPrivateChat} = require('../controller/PrivateChatController');;

router.get('/all' ,getAllMessages);
router.post('/',addMessage);
router.get('/groupChat/:groupChatId' ,getGroupMessages);
router.get('/privateChat/:privateChatId' ,getPrivateChat);


module.exports = router;