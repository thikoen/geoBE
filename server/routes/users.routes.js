module.exports = app => {
    const users = require("../controllers/users.controller.js");
  
    var router = require("express").Router();

    router.post("/register", users.register);

    router.post("/login", users.login);

    router.post("/logout", users.logout);

    router.post("/uploadFromCSV", users.uploadFromCSV);
    
    router.get("/getusers", restrict, users.getUsers);
    
    router.put("/users/:id", restrict, users.updateRole);
    
    router.delete("/users/:id", restrict, users.delete);
    
    router.get("/getuserrole", users.getUserRole);

    app.use("/api", router);

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
  
