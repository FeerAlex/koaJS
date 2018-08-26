const db  = require('../models/db');
const psw = require('../../libs/password');

module.exports = {
  getPage: async (ctx, next) => {
    ctx.render('pages/login', {
      title: 'Login',
      msglogin: ctx.flash("msglogin"),
      isAdmin: ctx.session.isAdmin || false
    });
  },

  auth: async (ctx, next) => {
    const { email: login, password } = ctx.request.body;
    const user = db.getState().user;

    if (!login || !password) {
      ctx.flash("msglogin", { status: 'error', msg: 'Заполните все поля!' });
      
      return ctx.redirect("/login");
    }

    if (user.login !== login || !psw.validPassword(password)) {
      ctx.flash("msglogin", { status: 'error', msg: 'Указаны неверные данные!' });
      
      return ctx.redirect("/login");
    }

    ctx.flash("msglogin", { status: 'success', msg: 'Авторизация прошла успешно!' });
    ctx.session.isAdmin = true;
    
    return ctx.redirect("/login");
  },

  logout: async (ctx, next) => {
    ctx.session = null;
    ctx.redirect("/");
  }
}