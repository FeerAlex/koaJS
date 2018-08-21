const formidable = require('formidable');
const fs = require('fs');
const path = require('path');
const db = require('../models/db')();

module.exports.getPage = (req, res) => {
  res.render('pages/admin', { title: 'Admin' });
}

module.exports.postSkills = (req, res, next) => {};

module.exports.postItem = (req, res, next) => {
  let form = new formidable.IncomingForm();
  let upload = path.join('./', 'upload');
  let fileName;

  if (!fs.existsSync(upload)) {
    fs.mkdirSync(upload);
  }

  console.log(`dirname: ${__dirname}`);
  console.log(`cwd: ${process.cwd()}`);

  form.uploadDir = path.join(process.cwd(), upload);

  form.parse(req, function (err, fields, files) {
    if (err) {
      return next(err);
    }

    const valid = validation(fields, files)

    if (valid.err) {
      fs.unlinkSync(files.photo.path);
      return res.redirect(`/?msg=${valid.status}`);
    }

    fileName = path.join(upload, files.photo.name);

    fs.rename(files.photo.path, fileName, function (err) {
      if (err) {
        console.error(err);
        fs.unlinkSync(fileName);
        fs.rename(files.photo.path, fileName);
      }

      let dir = fileName.substr(fileName.indexOf('\\'));

      db.set(fields.name, dir);
      db.save();
      res.redirect('/?msg=Картинка успешно загружена');
    });
  });
};

const validation = (fields, files) => {
  if (files.photo.name === '' || files.photo.size === 0) {
    return {status: 'Не загружена картинка!', err: true};
  }
  if (!fields.name) {
    return {status: 'Не указано описание картинки!', err: true};
  }
  return {status: 'Ok', err: false}
}