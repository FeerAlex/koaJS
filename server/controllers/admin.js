module.exports.getPage = function (req, res) {
    res.render('pages/admin', { title: 'Admin' });
  }