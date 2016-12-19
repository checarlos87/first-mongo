const express = require('express')

module.exports = (db) => {
    var router = express.Router()

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
    
    // GET types for a given species
    router.get('/pokemon/:species/type', (req, res, next) => {
        db.collection('pokemon').find(
            {
                $text: {
                    $search: req.params.species,
                    $caseSensitive: false
                }
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
        db.collection('pokemon').find(
            {
                $text: {
                    $search: req.params.species, 
                    $caseSensitive: false
                }
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
    router.post('/pokemon', (req, res, next) => {
    
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

    return router
}

