const Koa           = require('koa');
const app           = new Koa();
const path          = require('path');
const fs            = require('fs');
const static        = require('koa-static');
const mount         = require('koa-mount');
const session       = require('koa-session');
const config        = require(path.join(__dirname, './config.json'));
const errorHandler  = require('../libs/error');
const flash         = require('koa-connect-flash');

const Pug = require('koa-pug');
const pug = new Pug({
  viewPath: path.join(__dirname, '../source/template'),
  pretty: false,
  basedir: path.join(__dirname, '../source/template'),
  noCache: true,
  app: app
});

app.use(static('./public'));
app.use(mount('/upload', static('./upload')));

app.use(errorHandler)
app.on('error', (err, ctx) => {
  ctx.render('error', {
    status: ctx.response.status,
    error: ctx.response.message
  });
});

const router = require('./routes');

app
  .use(session(config.session, app))
  .use(flash())
  .use(router.routes())
  .use(router.allowedMethods());

app.listen(3000, () => {
  if (!fs.existsSync(config.upload)) {
    fs.mkdirSync(config.upload);
  }
  console.log('Server start 3000');
});