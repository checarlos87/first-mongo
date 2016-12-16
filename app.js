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
    app.listen(port, () => {
        console.log("Listening on port " + port)
    })
})

app.get('/', (req, res, next) => {
    res.render('index.html', {})
})

// GET all Pokemon
app.get('/pokemon', (req, res, next) => {
    db.collection('pokemon').find().toArray((err, results) => {
        res.send(results)
    })
})

// GET all registered Pikachu
app.get('/pikachu', (req, res, next) => {
    db.collection('pokemon').find(
        { 
            species: 'Pikachu'
        }
    ).toArray((err, results) => {
        res.send(results)
    })
})

// POST a new Pokemon
app.post('/pokemon', (req, res, next) => {

    console.log(req.body)

    db.collection('pokemon').save(req.body, (err, result) => {

        if (err)
            next()

        res.json({status: 'OK'})
    }) 
})

app.use((err, req, res, next) => {
    console.log(err.stack)
    res.status(500).send('Something went wrong!')
})
