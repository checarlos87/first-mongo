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

var port = process.argv[2]

var db
const mongoConf = require('./config/mongodb')
mongoConf.db()
    .then((database) => {
        db = database
        app.listen(port, () => {
            console.log("Listening on port " + port)
        })
    })

// Mongoose setup.
//mongoose.connect(mongoUrl)

// General Middlewares
app.use(express.static('public'))
app.use(bodyParser.urlencoded({extended: true}))
app.use('/api', require('./routes/api')(db))

/*
// Passport Middlewares.
app.use(session({ 
    secret: 'surfingpikachuwenttoalola',
    store: new MongoStore({ db: db })
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(flash())
*/

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

