const express = require('express');
const router = express.Router();
const {createPrivateChat,getUserPrivateChats,findPrivateChat,getAllPrivateChat} = require('../controller/PrivateChatController');

router.post('/',createPrivateChat);
router.get('/all',getAllPrivateChat);
router.get('/:userId',getUserPrivateChats);
router.get('/find/:firstId/:secondId',findPrivateChat);


module.exports = router;