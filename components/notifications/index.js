const express = require('express');
const router = express.Router();

const notiController = require('./NotifyController');

router.get('/',notiController.getNotification);
router.post('/edit/:id',notiController.postNotificaton);
module.exports = router;