const mongoose = require('mongoose')
const supertest = require('supertest')
const createServer = require('../server')
const Post = require('../models/Post')
const ModelOject = require('../models/Object')
const app = createServer()

beforeEach((done) => {
  mongoose.connect(
    "mongodb://localhost:27017/testDB",
    { useNewUrlParser: true, useUnifiedTopology: true },
    () => done()
  )
})

afterEach((done) => {
  mongoose.connection.db.dropDatabase(() => {
    mongoose.connection.close(() => done())
  })
})

describe('POST /object', () => {
  test('POST /object, JSON: {mykey: value1}', async () => {
    const data = { mykey: 'value1' }
    await supertest(app)
      .post(`/api/object`)
      .send(data)
      .expect(200)
      .then(async (response) => {
        // check response
        expect(response.body.key).toBe('mykey')
        expect(response.body.value).toBe('value1')
        expect(response.body.timestamp).toBeTruthy()

        // check data in db
        const object = await ModelOject.findOne({ key: response.body.key })
        expect(object).toBeTruthy()
        expect(object.key).toBe('mykey')
        expect(object.value).toBe('value1')
        expect(object.timestamp).toBeTruthy()
      })
  });

  test('POST /object, JSON: {mykey: value2}', async () => {
    const data = { mykey: 'value2' }
    await supertest(app)
      .post(`/api/object`)
      .send(data)
      .expect(200)
      .then(async (response) => {
        // check response
        expect(response.body.key).toBe('mykey')
        expect(response.body.value).toBe('value2')
        expect(response.body.timestamp).toBeTruthy()

        // check data in db
        const object = await ModelOject.findOne({ key: response.body.key })
        expect(object).toBeTruthy()
        expect(object.key).toBe('mykey')
        expect(object.value).toBe('value2')
        expect(object.timestamp).toBeTruthy()
      })
  });
});

describe('GET /object/:key', () => {

  test('GET /object/mykey', async () => {
    const object = await ModelOject.create({
      key: 'mykey',
      value: 'Lorem'
    })
    await supertest(app)
      .get(`/api/object/${object.key}`)
      .expect(200)
      .then((response) => {
        // check the response data
        expect(response.body.value).toBe(object.value)
      })
  });

  test('GET /object/mykey - GET latest Record', async () => {
    const pastTime = new Date().getTime() - ((24 * 60 * 60 * 1000) * 1) // minus 1 day.
    await ModelOject.create([
      {
        key: 'mykey',
        value: 'value1',
        timestamp: pastTime
      },
      {
        key: 'mykey',
        value: 'value2',
        timestamp: new Date().getTime()
      }
    ])

    await supertest(app)
      .get(`/api/object/mykey`)
      .expect(200)
      .then((response) => {
        // check the response data
        expect(response.body.value).toBe('value2')
      })
  });

  test('GET /object/mykey?timestamp=millisection - Base timestamp', async () => {
    const pastTime = new Date().getTime() - ((24 * 60 * 60 * 1000) * 1) // minus 1 day.
    await ModelOject.create([
      {
        key: 'mykey',
        value: 'value1',
        timestamp: pastTime
      },
      {
        key: 'mykey',
        value: 'value2',
        timestamp: new Date().getTime()
      }
    ])
    const currentTime = new Date().getTime() - ((24 * 60 * 60 * 1000) * 0.5) // - .5day
    await supertest(app)
      .get(`/api/object/mykey?timestamp=${currentTime}`)
      .expect(200)
      .then((response) => {
        // check the response data
        expect(response.body.value).toBe('value1')
      })
  });
});
