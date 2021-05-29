const fs = require('fs')
const FormData = require('form-data')
var request = require('request')
const axios = require("axios")
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
	describe('TestSuite for images', function() {

		describe('Upload image to api/images/', function() {
	
			it('actual 200 test', function(done){

				var path = (__dirname + '\\..\\..\\..\\tests\\res\\pic.jpg').replace(/\\/g, "/");
				fs.readFile(path, (err, data) => {
					if(err){
						throw err
					};

					let form = new FormData(); 
					form.append('file', data, {
						filepath: path,
						contentType: 'image/png',
					});
					form.append('description', "random description, who cares")
					form.append('facilityId', "1")
					console.log(form.getHeaders())
					return axios.post('http://localhost:3000/api/images', form, {
						headers: form.getHeaders(),
					}).then(response => {
						expect(response.statusCode).toBe(200)
						done()
					}).catch(err => {
						console.log(err);
					});

				})
			}, 10000);		
		});
	}); 
})

