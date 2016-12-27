/* 
    User schema based on Scotch.io tutorial:
        https://scotch.io/tutorials/easy-node-authentication-setup-and-local
*/

const mongoose = require('mongoose')
const bcrypt = require('bcrypt-nodejs')

var userSchema = mongoose.Schema({
    local: {
        username: { type: String, unique: true },
        password: String
    }
})

userSchema.methods.generateHash = (password) => {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8))
}

// Cannot use arrow-function here because of lexical 'this'.
//    http://stackoverflow.com/a/37365075
userSchema.methods.validPassword = function (password)  {
    return bcrypt.compareSync(password, this.local.password)
}

module.exports = mongoose.model('User', userSchema)
