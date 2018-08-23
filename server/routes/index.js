const express = require('express');
const router = express.Router();

const ctrlHome = require('../controllers/index');
const ctrlLogin = require('../controllers/login');
const ctrlAdmin = require('../controllers/admin');

const isAdmin = (req, res, next) => {
    if(req.session.isAdmin) {
      return next();
    }
    
    res.redirect('/');
};

router.get('/', ctrlHome.getPage);
router.post('/', ctrlHome.sendMessage);

router.get('/login', ctrlLogin.getPage);
router.post('/login', ctrlLogin.auth);
router.get('/logout', ctrlLogin.logout);

router.get('/admin', isAdmin, ctrlAdmin.getPage);
router.post('/admin/upload', isAdmin, ctrlAdmin.postItem);
router.post('/admin/skills', isAdmin, ctrlAdmin.postSkills);

module.exports = router;