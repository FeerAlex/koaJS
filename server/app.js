const express = require('express');
const path = require('path');
const app = express();
const flash = require('connect-flash');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require('express-session');

app.set('views', path.join(__dirname, '../source/template'));
app.set('view engine', 'pug');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());

app.use(session({
  secret: 'loftschool',
  key: 'sessionkey',
  cookie: {
    path: '/',
    httpOnly: true,
    maxAge: null
  },
  saveUninitialized: false,
  resave: false
}));

app.use(flash());

app.use(function(req, res, next) {
  res.locals.msgskill = req.flash('msgskill');
  res.locals.msgfile = req.flash('msgfile');
  res.locals.msgsemail = req.flash('msgsemail');
  res.locals.msglogin = req.flash('msglogin');
  next();
});

app.use('/', express.static(path.join(__dirname, '../public')));
app.use('/upload', express.static(path.join(__dirname, '../upload')));

app.use(function(req,res,next){
  res.locals.isAdmin = req.session.isAdmin || false;
  next();
});

app.use('/', require('./routes/index'));

app.use((req, res, next) => {
  let err = new Error('Not Found');
  err.status = 404;
  next(err);
});

app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.render('error', {message: err.message, error: err});
});


const server = app.listen(process.env.PORT || 3000, () => {
  console.log('Сервер запущен на порте: ' + server.address().port);
});