const {SHA256} = require('crypto-js');
const bcrypt = require('bcryptjs');

// var message = 'I am user number 3';

// var hash = SHA256(message).toString();

// console.log(message);
// console.log(hash);

// var data = {
//     id: 4
// };

// var token = {
//     data,
//     hash: SHA256(JSON.stringify(data) + 'toto').toString()
// }

// var resultHash = SHA256(JSON.stringify(token.data) + 'toto').token();

// if (resultHash === token.hash) {
//     console.log('ok');
// } else {
//     console.log('no trust');
// }

// var data = {
//     id: 4
// };

// const jwt = require('jsonwebtoken');

// var token = jwt.sign(data, 'saltsec');

// var decoded = jwt.verify(token, 'saltsec');
// console.log('decoded', decoded);

// -------------------------------------------------
var password = '123abc!';
// bcrypt.genSalt(10, (err, salt) => {
//     bcrypt.hash(password, salt, (err, hash) => {
//         console.log(hash);
//     })
// })

var hashedPassword = '$2a$10$tCiruwdLUhUkJMnWuGfKTuoFEWpa8mWmZeUTRmul//qH3K8Y0aqmG';

bcrypt.compare(password, hashedPassword, (err, res) => {
    console.log(res);
})

bcrypt.hash(password, '$2a$10$tCiruwdLUhUkJMnWuGfKTuo', (err, res) => {
    console.log("hashed ", res);
})