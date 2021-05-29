module.exports = app => {
  const facilities = require("../controllers/facilities.controller.js");

  var router = require("express").Router();

  // Finds all facilities in an given radius 
  // rad in Meters, lon and lat define the center 
  // example: api/facilities/rad?lon=50.001&lat=8.123&rad=250
  router.get("/rad", restrict, facilities.findInRadius);

  // Create a new Facility
  router.post("/", restrict, facilities.create);

  // Retrieve all Facilities
  router.get("/", restrict, facilities.findAll);

  // Retrieve a single Facility with id
  router.get("/:id", restrict, facilities.findOne);

  // Update a Facility with id
  router.put("/:id", restrict, facilities.update);

  // Delete a Facility with id
  router.delete("/:id", restrict, facilities.delete);

  app.use("/api/facilities", router);

  function restrict(req, res, next) {
    if (req.session.email) {
      next();
    } else {
      res.status(400).send({
        message: "Access denied!"
      });

    }
  }
};
