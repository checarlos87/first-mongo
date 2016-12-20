const async = require('async')
const bodyParser = require('body-parser')
const express = require('express')
const mongoClient = require('mongodb').MongoClient
const nunjucks = require('nunjucks')
const validator = require('validator')

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

// Middlewares
app.use(express.static('public'))
app.use(bodyParser.urlencoded({extended: true}))

var port = process.argv[2]

var db
mongoClient.connect('mongodb://localhost:27017/mogoapp', (err, database) => {
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
            db.collection('pokemon').createIndex({species: 'text', type1: 'text', type2: 'text'}, (err, index) => {

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
