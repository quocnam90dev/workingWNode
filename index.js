const mongoose = require('mongoose')
const createServer = require('./server')
const port = process.env.PORT || 5000
mongoose
  .connect("mongodb://localhost:27017/testDB", { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    const app = createServer()
    app.listen(port, () => {
      console.log('Server has started!')
    })
  })
