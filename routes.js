const express = require('express')
const ModelObject = require('./models/Object')
const router = express.Router()

// Get all objects
router.get(`/object`, async (_, res) => {
  const objects = await ModelObject.find()
  res.send(objects)
})

// GET single object
router.get(`/object/:key`, async (req, res) => {
  try {
    let timestamp = req.query.timestamp ? { timestamp: { $lte: req.query.timestamp } } : {}

    const query = {
      key: req.params.key,
      ...timestamp
    }

    const object = await ModelObject.find(query).sort({ '_id': -1 }).limit(1)
    res.send({ value: object[0].value })
  } catch {
    res.status(404)
    res.send({ error: 'Object doesnt exist!' })
  }
})

// POST object
router.post(`/object`, async (req, res) => {
  try {
    const [key, value] = Object.entries(req.body)[0]
    let object = new ModelObject({ key, value })

    await object.save()
    res.send({
      key: object.key,
      value: object.value,
      timestamp: object.timestamp,
    })
  } catch (error) {
    console.error(error)
    res.status(422)
    res.send({ message: 'Something went wrong.' })
  }

})

module.exports = router