const fs = require('fs');
const util = require('util');
const path = require('path');
const db = require('../models/db');
const validation = require('../../libs/validation');
const rename = util.promisify(fs.rename);
const unlink = util.promisify(fs.unlink);

module.exports = {
  getPage: async (ctx, next) => {
    ctx.render('pages/admin', { title: 'Admin' });
  },

  postSkills: (req, res, next) => {
    if (!req.body.age || !req.body.concerts || !req.body.cities || !req.body.years) {
      req.flash("msgskill", { status: 'error', msg: 'Все поля нужно заполнить!' });
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
  },

  postItem: async (ctx, next) => {
    const { name: itemName, price: itemPrice } = ctx.request.body;
    const { name: fileName, size: fileSize, path: filePath } = ctx.request.files.photo;
    const err = validation.items(itemName, itemPrice, fileName, fileSize);

    if (err) {
      await unlink(filePath);
      ctx.flash('msgfile', { 'status': 'error', 'msg': `${err.mes}` });
      
      return ctx.redirect("/admin");
    }

    let fullPath = path.join(process.cwd(), 'upload', fileName);
    const errUpload = await rename(filePath, fullPath);

    if (errUpload) {
      ctx.flash('msgfile', { 'status': 'error', 'msg': 'Произошла ошибка при загрузке картинки!' });
      
      return ctx.redirect("/admin");
    }

    db.get('items').push({
      name: itemName,
      price: itemPrice,
      src: path.join('upload', fileName)
    }).write();
    
    // ctx.flash('msgfile', { 'status': 'success', 'msg': 'Товар добавлен!'});
    ctx.redirect("/admin");
  }
}