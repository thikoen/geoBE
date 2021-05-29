module.exports = app => {
    const reports = require("../controllers/reports.controller.js");
  
    var router = require("express").Router();
  
    router.get("/", restrict, reports.generate);
  
    app.use("/api/reports", router);
  
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
  