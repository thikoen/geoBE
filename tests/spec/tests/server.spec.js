var request = require("request");
var server = require("../../../server/server.js");

describe("The Server", function() {
    describe("GET /", function() {
        it("returns status code 404", function(done) {
            request.get("http://localhost:3000/", function(error, response, body) {
                expect(response.statusCode).toBe(404);
                done();
            });
        });
        /*it("returns Facilities", function(done) {
            request.get("http://localhost:3000/api/", function(error, response, body) {
                //expect(body).toBe(JSON.stringify(["Hello World", "Hello World", "Hello World"]));
                done();
            });
        });*/
    });
  });