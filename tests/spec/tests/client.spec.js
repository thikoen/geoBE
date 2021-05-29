var request = require('request')

describe('User Tests', function () {
  describe('Login', function () {
    it('returns status code 200', function (done) {
      request.post(
        'http://localhost:3000/api/login',
        {
          json: {
            email: 'admin@test.com',
            password: '12345678',
          },
        },
        function (error, response, body) {
          expect(response.statusCode).toBe(200)
          done()
        }
      )
    })
  })

  describe('False Password Login', function () {
    it('returns status code 400', function (done) {
      request.post(
        'http://localhost:3000/api/login',
        {
          json: {
            email: 'admin@test.com',
            password: '87654321',
          },
        },
        function (error, response, body) {
          expect(response.statusCode).toBe(400)
          done()
        }
      )
    })
  })

  describe('False Email Login', function () {
    it('returns status code 400', function (done) {
      request.post(
        'http://localhost:3000/api/login',
        {
          json: {
            email: 'fsdfsdfs',
            password: '87654321',
          },
        },
        function (error, response, body) {
          expect(response.statusCode).toBe(400)
          done()
        }
      )
    })
  })

  describe('False Email Register', function () {
    it('returns status code 400', function (done) {
      request.post(
        'http://localhost:3000/api/register',
        {
          json: {
            firstName: 'egal',
            lastName: 'egalo',
            email: 'fsdfsdfs',
            password: '87654321',
          },
        },
        function (error, response, body) {
          expect(response.statusCode).toBe(400)
          done()
        }
      )
    })
  })

  describe('Short Password Register', function () {
    it('returns status code 400', function (done) {
      request.post(
        'http://localhost:3000/api/register',
        {
          json: {
            firstName: 'egal',
            lastName: 'egalo',
            email: 'email@mail.com',
            password: '1',
          },
        },
        function (error, response, body) {
          expect(response.statusCode).toBe(400)
          done()
        }
      )
    })
  })

  describe('Already  Registered', function () {
    it('returns status code 400', function (done) {
      request.post(
        'http://localhost:3000/api/register',
        {
          json: {
            firstName: 'egal',
            lastName: 'egalo',
            email: 'admin@test.com',
            password: '12345678',
          },
        },
        function (error, response, body) {
          expect(response.statusCode).toBe(409)
          done()
        }
      )
    })
  })

  describe('Registered', function () {
    it('returns status code 200', function (done) {
      let name = String(Math.random() * (10000 - 1000) + 1000)
      let domain = String(Math.random() * (10000 - 1000) + 1000)
      request.post(
        'http://localhost:3000/api/register',
        {
          json: {
            firstName: 'egal',
            lastName: 'egalo',
            email: `${name}@${domain}.com`,
            password: '12345678',
          },
        },
        function (error, response, body) {
          expect(response.statusCode).toBe(201)
          request.post(
            'http://localhost:3000/api/login',
            {
              json: {
                email: `${name}@${domain}.com`,
                password: '12345678',
              },
            },
            function (error, response, body) {
              expect(response.statusCode).toBe(200)
            }
          )
          done()
        }
      )
    })
  })
})
