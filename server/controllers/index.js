const db          = require('../models/db');
const nodemailer  = require('nodemailer');
const path        = require('path');
const util        = require('util');
const validation  = require('../../libs/validation');
const config      = require(path.join(__dirname, '../config.json'));

module.exports = {
  getPage: async (ctx, next) => {
    const products = db.getState().items || [];
    const skills = db.getState().skills || [];

    ctx.render('pages/index', {
      title: 'Главная',
      products: products,
      skills: skills,
      msgsemail: ctx.flash("msgsemail")
    });
  },

  sendMessage: async (ctx, next) => {
    const { name, email, message } = ctx.request.body;
    const err = validation.message(name, email, message);

    if (err) {
      ctx.flash("msgsemail", { status: 'error', msg: 'Все поля нужно заполнить!' });
      return ctx.redirect("/");
    }

    const transporter = nodemailer.createTransport(config.mail.smtp);
    const mailOptions = {
      from: `"${name}" <${email}>`,
      to: config.mail.smtp.auth.user,
      subject: config.mail.subject,
      text: message.trim().slice(0, 500) + `\n Отправлено с: <${email}>`
    };

    try {
      await transporter.sendMail(mailOptions);
      ctx.flash("msgsemail", { status: 'success', msg: 'Письмо успешно отправлено!' });
      
      return ctx.redirect("/");
    } catch (error) {
      ctx.flash("msgsemail", { status: 'error', msg: `При отправке письма произошла ошибка!: ${error}` });
        
      return ctx.redirect("/");
    }
  }
}