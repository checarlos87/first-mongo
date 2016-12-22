const async = require('async')
const bodyParser = require('body-parser')
const express = require('express')
const flash = require('connect-flash')
const mongoClient = require('mongodb').MongoClient
const mongoose = require('mongoose')
const nunjucks = require('nunjucks')
const passport = require('passport')
const session = require('express-session')
const validator = require('validator')

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

// General Middlewares
app.use(express.static('public'))
app.use(bodyParser.urlencoded({extended: true}))

// Passport Middlewares.
app.use(session({ 
    secret: 'surfingpikachuwenttoalola',
    store: new MongoStore()
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(flash())

var mongoUrl = 'mongodb://localhost:27017/restfulpokemon'
var port = process.argv[2]

// MongoDB setup.
var db
mongoClient.connect(mongoUrl, (err, database) => {
    if (err) 
        return console.log(err.message)

    db = database

    /** 
        Load API routes
            Info: 
                http://stackoverflow.com/a/25125755
                https://expressjs.com/en/guide/routing.html
                http://javascript.tutorialhorizon.com/2014/09/20/organizing-your-expressjs-routes-in-separate-files/
    */
    app.use('/api', require('./routes/api')(db))

    // Set up db indexes.
    async.series({
        species: (callback) => { 
            db.collection('pokemon').createIndex('species', {unique: true}, (err, index) => {

                if (err)
                    return callback(err)

                callback(null, index)
            })
        },

        type: (callback) => {
            db.collection('pokemon').createIndex({type1: 'text', type2: 'text'}, (err, index) => {

                if (err)
                    return callback(err)

                callback(null, index)
            })
        },

    }, (err, results) => {

        if (err) {
            db.close()
            return console.log(err.message)
        }

        app.listen(port, () => {
            console.log("Listening on port " + port)
        })
    }) //async.series

})

// Mongoose setup.
mongoose.connect(mongoUrl)

// Index. Pokémon Registry form.
app.get('/', (req, res, next) => {
    res.render('index.html', {types: TYPES})
})

// Search Results.
app.get('/search', (req, res, next) => {

    // Make the first letter of Pokémon name upper-case.
    if (req.query.pokemon === '')
        return res.redirect('/')

    var query = req.query.pokemon[0].toUpperCase() + req.query.pokemon.slice(1)
    db.collection('pokemon').find(
        {
            species: query
        },
        {
            _id: 0
        }
    ).toArray((err, results) => {
        
        if (err)
            return next(err)

        res.render('search_results.html', {result: results[0]})
    })
})

app.use((err, req, res, next) => {
    console.log(err.stack)
    res.status(500).send('Something went wrong!')
})
