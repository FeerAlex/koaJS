const crypto = require('crypto');
const db = require('../server/models/db');

module.exports = {
    setPassword: password => {
        const salt = crypto.randomBytes(16).toString('hex');
        const hash = crypto.pbkdf2Sync(password, salt, 1000, 512, 'sha512').toString('hex');

        return { salt, hash };
    },

    validPassword: password => {
        const user = db.get('user').value();
        const hash = crypto.pbkdf2Sync(password, user.salt, 1000, 512, 'sha512').toString('hex');

        return hash === user.hash;
    }
}