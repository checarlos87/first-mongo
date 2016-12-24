const express = require('express')

module.exports = (db, TYPES, passport) => {
    var router = new express.Router()

    function isLoggedIn(req, res, next) {
        if (req.isAuthenticated())
            return next()
        res.redirect('login')
    }

    // Index. Pokémon Registry form. 
    // Requires login.
    router.get('/', isLoggedIn, (req, res, next) => {
        res.render('index.html', {types: TYPES})
    })

    // Login form.
    router.get('/login', (req, res, next) => {
        res.render('login.html', {})
    })

    // Log in
    router.post('/login', passport.authenticate('local-signup', {
        successRedirect: '/',
        failureRedirect: '/login'
    }))

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
    
            res.render('search_results.html', {result: results[0]})
        })
    })
    
    router.use((err, req, res, next) => {
        console.log(err.stack)
        res.status(500).send('Something went wrong!')
    })

    return router
}
