/* 
    User schema based on Scotch.io tutorial:
        https://scotch.io/tutorials/easy-node-authentication-setup-and-local
*/

const mongoose = require('mongoose')
const bcrypt = require('bcrypt-nodejs')

var  userSchema = mongoose.Schema({
    local: {
        username: String,
        password: String
    }
})

userSchema.methods.generateHash = (password) => {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8))
}

userSchema.methods.validPassword = (password) => {
    return bcrypt.compareSync(password, this.local.password)
}

module.exports = mongoose.model('User', userSchema)
