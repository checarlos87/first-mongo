/*
    Passport config, based on Scotch.io tutorial:
        https://scotch.io/tutorials/easy-node-authentication-setup-and-local
*/
const LocalStrategy = require('passport-local').Strategy
const User = require('../models/user')

module.exports = (passport) => {
    passport.serializeUser((user, done) => {
        done(null, user.id)
    })

    passport.deserializeUser((id, done) => {
        User.findById(id, (err, user) => {
            done(err, user)
        })
    })

    passport.use('local-login', new LocalStrategy(
        (username, password, done) => {
            User.findOne({username: username}, (err, user) => {
                if (err)
                    return done(err)
                if (!user || !user.validPassword(password))
                    return done(null, false)
                return done(null, user)
            })
        }
    ))
}
