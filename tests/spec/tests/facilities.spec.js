//var request = require("request");
var request = require("axios").default;
var facility = require("../../../server/controllers/facilities.controller.js");



describe("The Facility API", function() {
    /*beforeAll(async function(done){
        try{
            //Create new User
            const response = await request.post('http://localhost:3000/api/register', {
                firstName : 'Martina',
                lastName : 'Mustermann2',
                email : 'martina.mustermann@musterfirma.de',
                password : '12345678'
            })
            console.log(response);
            //expect(response.statusCode).toBe(200);
        } catch (error) {
            console.error(error);
        }
        
        try{
            //Login User
            request.post('http://localhost:3000/api/login', {
              json: {
                email: 'admin@test.com',
                password: '12345678',
                    },
                },
            function (error, response, body) {
              expect(response.statusCode).toBe(200);
            }
        )
        } catch (error) {
            console.error(error);
        }
        done();
    });*/

    describe("GET /api/facilities", function() {
        it("returns status code 200", function(done) {
            request.get('http://localhost:3000/api/facilities')
            .then(function (response) {
                console.log(response);
                expect(response.statusCode).toBe(200);             
            })
            done();
        });

        it("retrieves all facilities", function(done) {
            request.get('http://localhost:3000/api/facilities')
            .then(function (response) {
                console.log(response);
                //expect(response.data).toEqual(jasmine.anything());
                expect(response.data).toEqual(jasmine.objectContaining({
                    id:11,
                    name:"Gebäude",
                    lon:8.22324768,
                    lat:50.09241621,
                    description:"",
                    customFields:"{}"
                }));
            })
            done(); 
        })
    });

    describe("POST /api/facilities", function() {
        it("returns status code 200", function(done) {
            request.post('http://localhost:3000/api/facilities', {
                json: {
                    name:"TestGebäude",
                    lon:8.22324769,
                    lat:50.09241622,
                    description:"Angelegt durch API Test",
                    customFields:"{}",
                    templateId:1
                },
            })
            .then(function (response) {
                console.log(response);
                expect(response.statusCode).toBe(200); 
            })
            done();
        });

        it("creates a new facility", function(done) {
            request.post('http://localhost:3000/api/facilities', {
                json: {
                    name:"TestGebäude2",
                    lon:8.22324770,
                    lat:50.09241630,
                    description:"Angelegt durch API Test",
                    customFields:"{}",
                    templateId:1
                },
            })
            request.get('http://localhost:3000/api/facilities')
            .then(function (response) {
                console.log(response);
                expect(response.data).toEqual(jasmine.objectContaining({
                    name:"TestGebäude2",
                    lon:8.22324770,
                    lat:50.09241630,
                    description:"Angelegt durch API Test",
                    customFields:"{}"
                }));
            })
            done();
        });
    });
/*
    describe("GET /api/${id}", function() {
        it("returns status code 200", function(done) {
            done();
        });

        it("retrieves a single facility with id", function(done) {
            done();
        });
    });

    describe("PUT /api/${id}", function() {
        it("returns status code 200", function(done) {
            done();
        });

        it("updates a single facility with id", function(done) {
            done();
        });
    });

    describe("DELETE /api/${id}", function() {
        it("returns status code 200", function(done) {
            done();
        });

        it("deletes a single facility with id", function(done) {
            done();
        });
    });*/
});