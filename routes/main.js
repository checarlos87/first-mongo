const express = require('express')

module.exports = (db, TYPES, passport) => {
    var router = new express.Router()

    function isLoggedIn(req, res, next) {
        if (req.isAuthenticated())
            return next()
        res.redirect('login')
    }

    function sanitize_username(req, res, next) {
        if (req.body.username.match(/^[a-zA-Z0-9]+$/))
            return next()
        res.sendStatus(400)
    }

    // Index. Pokémon Registry form. 
    // Requires login.
    router.get('/', isLoggedIn, (req, res, next) => {
        res.render('index.html', {types: TYPES, username: req.user.local.username})
    })

    // Login form.
    router.get('/login', (req, res, next) => {
        res.render('login.html', {})
    })

    // Log in
    router.post('/login', 
        sanitize_username,
        passport.authenticate('local-login'),
        (req, res, next) => {
            res.json({status: 'OK', message: ''})
        }
    )

    // Log out.
    router.get('/logout', (req, res, next) => {
        req.logout()
        res.redirect('/login')
    })
    
    // Search Results.
    router.get('/search', (req, res, next) => {
    
        // Make the first letter of Pokémon name upper-case.
        if (req.query.pokemon === '')
            return res.redirect('/')
    
        var query = req.query.pokemon.toLowerCase()
        query = query[0].toUpperCase() + query.slice(1)
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
    
            if (req.isAuthenticated())
                res.render('search_results.html', {
                    result: results[0], 
                    isAuth: req.isAuthenticated(), 
                    username: req.user.local.username
                })
            else
                res.render('search_results.html', {
                    result: results[0], 
                    isAuth: req.isAuthenticated(), 
                })
        })
    })
    
    router.use((err, req, res, next) => {
        console.log(err.stack)
        res.status(500).send('Something went wrong!')
    })

    return router
}
