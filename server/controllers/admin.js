const formidable = require('formidable');
const fs = require('fs');
const path = require('path');
const db = require('../models/db');

module.exports.getPage = (req, res) => {
  res.render('pages/admin', { title: 'Admin' });
}

module.exports.postSkills = (req, res, next) => {
  const valid = validationSkills(req.body);

  if (valid.err) {
    req.flash("msgskill", { status: 'error', msg: `${valid.status}` });
    return res.redirect("/admin");
  }

  let skills = [
    {
      "number": req.body.age,
      "text": "Возраст начала занятий на скрипке"
    },
    {
      "number": req.body.concerts,
      "text": "Концертов отыграл"
    },
    {
      "number": req.body.cities,
      "text": "Максимальное число городов в туре"
    },
    {
      "number": req.body.years,
      "text": "Лет на сцене в качестве скрипача"
    }
  ];

  db.set('skills', skills).write();
  req.flash('msgskill', {'status': 'success', 'msg': 'Скилы добавлены!'});
  res.redirect("/admin");
};

module.exports.postItem = (req, res, next) => {
  let form = new formidable.IncomingForm();
  let upload = path.join('./', 'upload');
  let fileName;

  if (!fs.existsSync(upload)) {
    fs.mkdirSync(upload);
  }

  form.uploadDir = path.join(process.cwd(), upload);

  form.parse(req, function (err, fields, files) {
    if (err) {
      return next(err);
    }

    const valid = validationUpload(fields, files);

    if (valid.err) {
      fs.unlinkSync(files.photo.path);
      req.flash('msgfile', { 'status': 'error', 'msg': `${valid.status}` });
      return res.redirect("/admin");
    }

    fileName = path.join(upload, files.photo.name);

    fs.rename(files.photo.path, fileName, function (err) {
      if (err) {
        console.error(err);
        fs.unlinkSync(fileName);
        fs.rename(files.photo.path, fileName);
      }

      db.get('items').push({ name: fields.name, price: fields.price, src: fileName }).write();
      req.flash('msgfile', { 'status': 'success', 'msg': 'Товар добавлен!'});
      res.redirect("/admin");
    });
  });
};

const validationUpload = (fields, files) => {
  if (files.photo.name === '' || files.photo.size === 0) {
    return {status: 'Не загружена картинка!', err: true};
  }
  if (!fields.name) {
    return {status: 'Не указано название товара!', err: true};
  }
  if (!fields.price) {
    return {status: 'Не указана цена товара!', err: true};
  }
  return {status: 'Ok', err: false};
}

const validationSkills = (fields) => {
  if (!fields.age) {
    return {status: 'Не указан возраст!', err: true};
  }
  if (!fields.concerts) {
    return {status: 'Не указано кол-во концертов!', err: true};
  }
  if (!fields.cities) {
    return {status: 'Не указано кол-во городов!', err: true};
  }
  if (!fields.years) {
    return {status: 'Не указано кол-во лет на сцене!', err: true};
  }
  return {status: 'Ok', err: false};
}