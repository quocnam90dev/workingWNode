const mongoose = require('mongoose')
const createServer = require('./server')
const port = process.env.PORT || 5000
const DB_URL = process.env.DATABASE_URL || "mongodb://localhost:27017/testDB"
mongoose
  .connect(DB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    const app = createServer()
    app.listen(port, () => {
      console.log('Server has started!')
    })
  })
