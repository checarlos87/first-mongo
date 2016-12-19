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

app.use(express.static('public'))
app.use(bodyParser.urlencoded({extended: true}))


var port = process.argv[2]

var db
mongoClient.connect('mongodb://localhost:27017/mogoapp', (err, database) => {
    if (err) 
        return console.log(err.message)

    db = database

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
    })

})

app.get('/', (req, res, next) => {
    res.render('index.html', {})
})

// GET all Pokemon
app.get('/api/pokemon', (req, res, next) => {
    db.collection('pokemon').find().toArray((err, results) => {

        if (err)
            return next(err)

        res.send(results)
    })
})

// GET all info for a species of Pokemon
app.get('/api/pokemon/:species', (req, res, next) => {
    db.collection('pokemon').find(
        {
            $text: {
                $search: req.params.species, 
                $caseSensitive: false
            }
        },
        {
            _id: 0
        }
    ).toArray((err, results) => {

        if (err)
            return next(err)

        res.send(results[0])
    })
})

// GET a specific base stat for a given species
app.get('/api/pokemon/:species/:stat', (req, res, next) => {
    db.collection('pokemon').find(
        {
            $text: {
                $search: req.params.species, 
                $caseSensitive: false
            }
        },
        {
            species: 1,
            [req.params.stat]: 1,
            _id: 0
        }
    ).toArray((err, results) => {

        if (err)
            return next(err)

        res.send(results[0])
    })
})

// POST a new Pokemon
app.post('/api/pokemon', (req, res, next) => {

//    console.log(req.body) // debug

    db.collection('pokemon').insertOne(req.body, (err, result) => {

        if (err) {

            // duplicate key detected
            if (err.code === 11000)
                return res.json({status: 'duplicate'})

            return next(err) 
        }

        res.json({status: 'OK'})
    }) 
})

app.use((err, req, res, next) => {
    console.log(err.stack)
    res.status(500).send('Something went wrong!')
})
