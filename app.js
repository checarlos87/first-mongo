const bodyParser = require('body-parser')
const express = require('express')
const mongoose = require('mongoose')
const nunjucks = require('nunjucks')
const passport = require('passport')
const session = require('express-session')

// MongoDB session store.
const MongoStore = require('connect-mongo')(session)

const app = express()
nunjucks.configure('views', {
    autoescape: true,
    express: app
})

const TYPES = [
    'Bug',
    'Dark',
    'Dragon',
    'Electric',
    'Fairy',
    'Fighting',
    'Fire',
    'Flying',
    'Ghost',
    'Grass',
    'Ground',
    'Ice',
    'Normal',
    'Poison',
    'Psychic',
    'Rock',
    'Steel',
    'Water'
]

var port = process.argv[2]

// Local MongoDB configuration.
const mongoConfig = require('./config/mongodb')

// Configure passport.
require('./config/passport')(passport)

// Mongoose setup.
mongoose.connect(mongoConfig.mongoUrl)

/* 
    Configure MongoDB connection.
    mongoConfig.db returns a promise that is fulfilled once the 
    database connection is available.
*/
var db
mongoConfig.db
    .then((database) => {
        db = database

        /** Load middlewares */

        // General middlewares
        app.use(express.static('public'))
        app.use(bodyParser.urlencoded({extended: true}))
        
        // Passport middlewares.
        app.use(session({ 
            secret: 'surfingpikachuwenttoalola',
            store: new MongoStore({ db: db }),
            resave: false,
            saveUninitialized: false
        }))
        app.use(passport.initialize())
        app.use(passport.session())

        /** Load rotes */

        app.use('/', require('./routes/main')(db, TYPES, passport))
        app.use('/api', require('./routes/api')(db))

        /** Start the app */

        app.listen(port, () => {
            console.log("Listening on port " + port)
        })
    })
