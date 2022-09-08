const {Schema, model} = require('mongoose')

const User = new Schema(
  {
    username: {type: String, unique: true, required: true},
    password: {type: String, required: true},
    quote: [{ type: String }] // массив
  },
  { collection: 'user-data1'}
)

module.exports = model('User', User);