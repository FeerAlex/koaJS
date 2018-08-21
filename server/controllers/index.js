module.exports = {
  getPage: (req, res) => {
    res.render('pages/index', { title: 'Main' });
  },

  sendData: (req, res) => {
    res.json({ title: 'Main' });
  }
}