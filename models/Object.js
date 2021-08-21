const mongoose = require('mongoose')

const schema = mongoose.Schema({
  key: String,
  value: String,
  timestamp: { type: Date, default: Date.now }
})

module.exports = mongoose.model("Object", schema)