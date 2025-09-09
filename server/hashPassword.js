const bcrypt = require('bcryptjs');

const plainPassword = "naman@123";

bcrypt.hash(plainPassword, 10, (err, hash) => {
    if(err) throw err;
    console.log("Hashed Password", hash);
})