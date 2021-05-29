const db = require("../models");
const Joi = require("joi");
const Facilities = db.facilities;
const sequelize = db.sequelize;
const Images = db.images;
const roles = require('./roles.js');

exports.findInRadius = (req, res) => {
    const permissionRead = roles.can(req.session.role).readAny('facilities');
    if (permissionRead.granted) {
            const schema = Joi.object({
            rad: Joi.number().required(),
            lon: Joi.number().required(),
            lat: Joi.number().required()
        });

        const result = schema.validate(req.query);

        if (result.error) {
            res.status(400).send({
                message: result.error
            });
            return;
        }
        var query = "SELECT id, lon, lat  FROM facilities WHERE ST_DWithin(geom, ST_MakePoint(" + req.query.lon + "," +  req.query.lat + ")::geography," +  req.query.rad + ")"
        sequelize.query(query).then(data => {
            res.status(200).send(data[1].rows);
        });
    } 
    else{
        // resource is forbidden for this user/role
        res.status(403).end();
    }
}

// Create and Save a new Facility
exports.create = (req, res) => {
    const permissionCreate = roles.can(req.session.role).createAny('facilities');
    if (permissionCreate.granted) {
    // Validate request
    const schema = Joi.object({
        name: Joi.string().required(),
        lon: Joi.number().required(),
        lat: Joi.number().required(),
        description: Joi.string().required(),
        customFields: Joi.object().required(),
        templateId: Joi.number().required()
    });

    const result = schema.validate(req.body);

    if (result.error) {
        res.status(400).send({
            message: result.error
        });
        return;
    }

    // Create a Facility
    const facility = {
        name: req.body.name,
        lon: req.body.lon,
        lat: req.body.lat,
        description: req.body.description,
        customFields: req.body.customFields,
        templateId: req.body.templateId
    };

    // Save Facility in the database
    Facilities.create(facility)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while creating the Facility."
            });
        });
    }
    else{
        // resource is forbidden for this user/role
        res.status(403).end();
    }
};

// Retrieve all Facilities from the database.
exports.findAll = (req, res) => {
    const permissionRead = roles.can(req.session.role).readAny('facilities');
    if (permissionRead.granted) {
        Facilities.findAll(
            {
                include: [
                    {
                        model : Images,
                        attributes: ["id"]
                    }
                ]
            })
            .then(data => {
                res.send(data);
            })
            .catch(err => {
                res.status(500).send({
                    message:
                        err.message || "Some error occurred while retrieving Facilities."
                });
            });
    }
    else{
        // resource is forbidden for this user/role
        res.status(403).end();
    }
};

// Find a single Facility with an id
exports.findOne = (req, res) => {
    const permissionRead = roles.can(req.session.role).readAny('facilities');
    if (permissionRead.granted) {
        Facilities.findByPk(req.params.id,         {
            include: [
                {
                    model : Images,
                    attributes: ["id"]
                }
            ]
        })
            .then(data => {
                res.send(data);
            })
            .catch(err => {
                res.status(500).send({
                    message:
                        err.message || "Some error occurred while retrieving Facilities."
                });
            });
    }
    else{
        // resource is forbidden for this user/role
        res.status(403).end();
    }
};

// Update a Facility by the id in the request
exports.update = (req, res) => {
    const permissionUpdate = roles.can(req.session.role).updateAny('facilities');
    if (permissionUpdate.granted) {
     
        const schema = Joi.object({
            name: Joi.string(),
            lon: Joi.number(),
            lat: Joi.number(),
            description: Joi.string(),
            customFields: Joi.object(),
            templateId: Joi.number()
        });
    
        const result = schema.validate(req.body);
    
        if (result.error) {
            res.status(400).send({
                message: result.error
            });
            return;
        }

        Facilities.update(
            req.body,
            { where: { id: req.params.id } }
        )
            .then(result =>
                res.status(200).send("OK")
            )
            .catch(err => {
                res.status(500).send({
                    message:
                        err.message || "Some error occurred while updating Facilities."
                });
            });
    }
    else{
        // resource is forbidden for this user/role
        res.status(403).end();
    }
};

// Delete a Facility with the specified id in the request
exports.delete = (req, res) => {
    const permissionDelete = roles.can(req.session.role).deleteAny('facilities');
    if (permissionDelete.granted) {
        Facilities.destroy({
            where: {
                id: req.params.id
            }
        }).then(result => {
            res.status(200).send("OK")
        })
            .catch(err => {
                res.status(500).send({
                    message:
                        err.message || "Some error occurred while deleting Facilities."
                });
            });
    }
    else{
        // resource is forbidden for this user/role
        res.status(403).end();
    }
};

