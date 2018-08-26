const fs          = require('fs');
const util        = require('util');
const path        = require('path');
const db          = require('../models/db');
const validation  = require('../../libs/validation');
const rename      = util.promisify(fs.rename);
const unlink      = util.promisify(fs.unlink);

module.exports = {
  getPage: async (ctx, next) => {
    ctx.render('pages/admin', {
      title: 'Admin',
      msgskill: ctx.flash("msgskill"),
      msgfile: ctx.flash("msgfile"),
    });
  },

  postSkills: async (ctx, next) => {
    const { age, concerts, cities, years } = ctx.request.body;
    const err = validation.skills(age, concerts, cities, years);

    if (err) {
      ctx.flash("msgskill", { status: 'error', msg: err });
      return ctx.redirect("/admin");
    }
  
    let skills = [
      {
        "number": age,
        "text": "Возраст начала занятий на скрипке"
      },
      {
        "number": concerts,
        "text": "Концертов отыграл"
      },
      {
        "number": cities,
        "text": "Максимальное число городов в туре"
      },
      {
        "number": years,
        "text": "Лет на сцене в качестве скрипача"
      }
    ];
  
    db.set('skills', skills).write();
    ctx.flash('msgskill', {'status': 'success', 'msg': 'Скилы добавлены!'});
    ctx.redirect("/admin");
  },

  postItem: async (ctx, next) => {
    const { name: itemName, price: itemPrice } = ctx.request.body;
    const { name: fileName, size: fileSize, path: filePath } = ctx.request.files.photo;
    const err = validation.items(itemName, itemPrice, fileName, fileSize);

    if (err) {
      await unlink(filePath);
      ctx.flash('msgfile', { 'status': 'error', 'msg': err });
      
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
    
    ctx.flash('msgfile', { 'status': 'success', 'msg': 'Товар добавлен!'});
    ctx.redirect("/admin");
  }
}