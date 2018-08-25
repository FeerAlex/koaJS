const Router    = require('koa-router');
const router    = new Router();
const koaBody   = require('koa-body');

const {
    getPage: index,
    sendMessage: sendEmail
} = require('../controllers/index');
const {
    getPage: login,
    auth,
    logout
} = require('../controllers/login');
const {
    getPage: admin,
    postItem: addItem,
    postSkills: addSkills
} = require('../controllers/admin');

// const isAdmin = (req, res, next) => {
//     if(req.session.isAdmin) {
//       return next();
//     }
    
//     res.redirect('/');
// };

router.get('/', index);
// router.post('/', sendEmail);

router.get('/login', login);
router.post('/login', koaBody(), auth);
// router.get('/logout', logout);

router.get('/admin', admin);
router.post('/admin/upload', koaBody({
    multipart: true,
    formidable: {
        uploadDir: process.cwd() + '/upload'
    }
}), addItem);
// router.post('/admin/skills', koaBody(), addSkills);

module.exports = router;