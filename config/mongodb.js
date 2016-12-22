const mongoClient = require('mongodb').MongoClient

var mongoUrl = 'mongodb://localhost:27017/restfulpokemon'
exports.db = () => {

    var database = mongoClient.connect(mongoUrl).then((db) => {
        // Set up db indexes.
        db.collection('pokemon').createIndex('species', {unique: true}, (err, index) => {
    
            if (err)
                return console.log(err)
    
        })
    
        db.collection('pokemon').createIndex({type1: 'text', type2: 'text'}, (err, index) => {
    
            if (err)
                return console.log(err)
    
        })
        
        return db    
    })
    
    return database

}
