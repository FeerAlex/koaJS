module.exports.getPage = function (req, res) {
  res.render('pages/login', { title: 'Login' });
}