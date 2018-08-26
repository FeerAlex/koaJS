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

const isAdmin = async (ctx, next) => {
    if(ctx.session.isAdmin) {
      return next();
    }
    
    ctx.redirect('/');
};

router.get('/', index);
router.post('/', koaBody(), sendEmail);

router.get('/login', login);
router.post('/login', koaBody(), auth);
router.get('/logout', logout);

router.get('/admin', isAdmin, admin);
router.post('/admin/upload', isAdmin, koaBody({
    multipart: true,
    formidable: {
        uploadDir: process.cwd() + '/upload'
    }
}), addItem);
router.post('/admin/skills', isAdmin, koaBody(), addSkills);

module.exports = router;