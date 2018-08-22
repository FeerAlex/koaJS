const db = require('../models/db');

module.exports = {
  getPage: (req, res) => {
    const products = db.getState().items || [];
    const skills = db.getState().skills || [];

    res.render('pages/index', {
      title: 'Главная',
      products: products,
      skills: skills
    });
  },

  sendData: (req, res) => {
    res.json({ title: 'Main' });
  }
}