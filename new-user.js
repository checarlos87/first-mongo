const mongoose = require('mongoose')
const prompt = require('prompt')

mongoose.connect(require('./config/mongodb').mongoUrl)
const User = require('./models/user')

// Configure prompt
const prompt_schema = {
  properties: {
    username: {
      pattern: /^[a-zA-Z\s\-]+$/,
      message: 'Name must be only letters, spaces, or dashes',
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
    newUser.local.password = result.password

    newUser.save((err) => {
        if (err)
            throw err
        return "User registered successfully."
    })
})
