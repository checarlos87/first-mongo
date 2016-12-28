const mongoose = require('mongoose')
const prompt = require('prompt')

mongoose.Promise  = global.Promise
mongoose.connect(require('./config/mongodb').mongoUrl)
const User = require('./models/user')

// Configure prompt
const prompt_schema = {
  properties: {
    username: {
      pattern: /^[a-zA-Z0-9]+$/,
      message: 'Username must contain only letters or and numbers',
      required: true
    },
    password: {
      hidden: true
    }
  }
};

prompt.start()
prompt.get(prompt_schema, (err, result) => {
    if (err)
        return console.log(err.message)

    var newUser = new User()
    newUser.local.username = result.username
    newUser.local.password = newUser.generateHash(result.password)

    newUser.save((err) => {
        if (err)
            throw err

        mongoose.disconnect()
        console.log("User registered successfully.")
        return console.log("Press Ctrl+C to exit.")
    })

})

