const express = require('express');
const router = express.Router();

const ctrlHome = require('../controllers/index');
const ctrlLogin = require('../controllers/login');
const ctrlAdmin = require('../controllers/admin');

router.get('/', ctrlHome.getPage);
router.post('/', ctrlHome.sendMessage);

router.get('/login', ctrlLogin.getPage);

router.get('/admin', ctrlAdmin.getPage);
router.post('/admin/upload', ctrlAdmin.postItem);
router.post('/admin/skills', ctrlAdmin.postSkills);

module.exports = router;