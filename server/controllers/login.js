const db = require('../models/db');

module.exports = {
  getPage: (req, res) =>{
    res.render('pages/login', { title: 'Login' });
  },

  auth: (req, res) => {
    const user = db.getState().user;

    if (!req.body.email || !req.body.password) {
      req.flash("msglogin", { status: 'error', msg: 'Заполните все поля!' });
      return res.redirect("/login");
    }

    if (req.body.email !== user.email || req.body.password !== user.pass) {
      req.flash("msglogin", { status: 'error', msg: 'Указаны неверные данные!' });
      return res.redirect("/login");
    }

    req.flash("msglogin", { status: 'success', msg: 'Авторизация прошла успешна!' });
    req.session.isAdmin = true;
    return res.redirect("/login");
  },

  logout: (req, res) => {
    req.session.destroy();
    res.redirect('/');
  }
}