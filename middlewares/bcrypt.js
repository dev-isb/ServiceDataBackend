const bcrypt = require('bcrypt');
const saltRounds = 10;

function generatePasswordHash(password) {
    return new Promise((resolve, reject) => {
        bcrypt.hash(password, saltRounds, function (err, hash) {
            if (err) {
                return reject(err.message);
            } else {
                return resolve(hash);
            }
        });
    })
}

function validatePassword(inputPassword, hash) {
    return new Promise((resolve, reject) => {
        bcrypt.compare(inputPassword, hash, function (err, result) {
            if (err) {
                return reject(err.message);
            } else {
                return resolve(result); // true | false
            }
        });
    })
}

module.exports = {
    generatePasswordHash,
    validatePassword
}

