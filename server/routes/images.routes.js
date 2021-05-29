module.exports = app => {
    const images = require("../controllers/images.controller.js");
  
    var router = require("express").Router();

    //get a image by id
    router.get("/:id",restrict,images.getImageByImageId);

    //post a image
    router.post("/",restrict,images.postImage);

    //delete image by imageId
    router.delete("/:id",restrict,images.deleteImage)
  
    app.use("/api/images", router);
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
  