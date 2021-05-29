module.exports = app => {
    const templates = require("../controllers/templates.controller.js");

    var router = require("express").Router();

    //get all templates by id
    router.get("/", restrict, templates.getTemplates);

    //delete templates by templatesId,
    router.delete("/:id", restrict, templates.deleteTemplate)

    //create templates by templatesId
    router.post("/", restrict, templates.createTemplate)

    app.use("/api/templates", router);

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
