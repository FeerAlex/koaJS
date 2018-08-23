const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const path = require('path');

const adapter = new FileSync(path.join(__dirname, 'db.json'));
const db = low(adapter);

db.defaults({ items: [], skills: [], user: {} })
  .write();

db.set('user', {
  email: 'admin@mail.ru',
  pass: '111111'
}).write();

module.exports = db;