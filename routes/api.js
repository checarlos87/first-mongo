const express = require('express')

module.exports = (db) => {
    var router = express.Router()

    function isLoggedIn(req, res, next) {
        if (req.isAuthenticated())
            return next()
        res.redirect('/')
    }

    /** /pokemon routes **/

    // GET all Pokemon
    router.get('/pokemon', (req, res, next) => {
        db.collection('pokemon').find(
            {}, 
            {
                _id: 0
            }
        ).toArray((err, results) => {
    
            if (err)
                return next(err)
    
            res.send(results)
        })
    })
    
    // GET all info for a species of Pokemon
    router.get('/pokemon/:species', (req, res, next) => {

        var query = req.params.species[0].toUpperCase() + req.params.species.slice(1)
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
    
            res.send(results[0])
        })
    })
    
    // GET types for a given species
    router.get('/pokemon/:species/type', (req, res, next) => {

        var query = req.params.species[0].toUpperCase() + req.params.species.slice(1)
        db.collection('pokemon').find(
            {
                species: query
            },
            {
                type1: 1,
                type2: 1,
                _id: 0
            } 
        ).toArray((err, results) => {
    
            if (err)
                return next(err)
    
            res.send(results[0])
        })
    })
    
    // GET a specific base stat for a given species
    router.get('/pokemon/:species/:stat', (req, res, next) => {

        var query = req.params.species[0].toUpperCase() + req.params.species.slice(1)
        db.collection('pokemon').find(
            {
                species: query
            },
            {
                [req.params.stat]: 1,
                _id: 0
            }
        ).toArray((err, results) => {
    
            if (err)
                return next(err)
    
            res.send(results[0])
        })
    })
    
    // POST a new Pokemon through an AJAX call
    router.post('/pokemon', isLoggedIn, (req, res, next) => {

        for (var key in req.body) {
            if (req.body.hasOwnProperty(key))
                if (req.body[key] === '')
                    return res.json({status: 'error', message: 'empty key'})
        }

        db.collection('pokemon').insertOne(req.body, (err, result) => {
    
            if (err) {
    
                // duplicate key detected
                if (err.code === 11000)
                    return res.json({status: 'error', message: 'duplicate'})
    
                return next(err) 
            }
    
            res.json({status: 'OK', message: ''})
        }) 
    })

    /** /type route **/

    router.get('/type/:type', (req, res, next) => {
        db.collection('pokemon').find(
            {
                $text: {
                    $search: req.params.type,
                    $caseSensitive: false
                }
            },
            {
                species: 1,
                type1: 1,
                type2: 1,
                _id: 0
            }
        ).toArray((err, results) => {

            if (err)
                return next(err)

            res.send(results)
        })
    })

    /** /delete route **/

    router.post('/delete/:species', isLoggedIn, (req, res, next) => {

        if (!req.xhr)
            return res.resdirect('/')

        var query = req.params.species[0].toUpperCase() + req.params.species.slice(1)
        db.collection('pokemon').remove(
            {
                species: query
            },
            {
                single: true
            }
        )

        res.json({status: 'OK', message: ''})
    })

    return router
}













