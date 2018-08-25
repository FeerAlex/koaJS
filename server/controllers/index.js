const db = require('../models/db');
// const nodemailer = require('nodemailer');
const path = require('path');
const config = require(path.join(__dirname, '../config.json'));

module.exports = {
  getPage: async (ctx, next) => {
    const products = db.getState().items || [];
    const skills = db.getState().skills || [];

    ctx.render('pages/index', {
      title: 'Главная',
      products: products,
      skills: skills
    });
  },

//   sendMessage: (req, res, next) => {
//     if (!req.body.name || !req.body.email || !req.body.message) {
//       req.flash("msgsemail", { status: 'error', msg: 'Все поля нужно заполнить!' });
//       return res.redirect("/");
//     }

//     const transporter = nodemailer.createTransport(config.mail.smtp);
//     const mailOptions = {
//       from: `"${req.body.name}" <${req.body.email}>`,
//       to: config.mail.smtp.auth.user,
//       subject: config.mail.subject,
//       text: req.body.message.trim().slice(0, 500) + `\n Отправлено с: <${req.body.email}>`
//     };

//     transporter.sendMail(mailOptions, function(error, info) {
//       //если есть ошибки при отправке - сообщаем об этом
//       if (error) {
//         req.flash("msgsemail", { status: 'error', msg: `При отправке письма произошла ошибка!: ${error}` });
//         return res.redirect("/");
//       }
//       req.flash("msgsemail", { status: 'success', msg: `Письмо успешно отправлено!` });
//       return res.redirect("/");
//     });
//   }
}