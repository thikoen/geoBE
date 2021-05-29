const db = require("../models");
const Joi = require("joi");
const Templates = db.templates;
const Op = db.Sequelize.Op;
const sequelize = db.sequelize;
const roles = require('./roles.js');

exports.createTemplate = (req, res) => {
    const permissionCreate = roles.can(req.session.role).createAny('templates');
    if (permissionCreate.granted) {
        //TODO Json richtig validieren
        const schema = Joi.object({
            name: Joi.string().required(),
            fields: Joi.object()
        });

        const result = schema.validate(req.body);

        if (result.error) {
            res.status(400).send({
                message: result.error
            });
            return;
        }
        // Create a Template
        const template = {
            name: req.body.name,
            fields: req.body.fields
        };

        // Save Template in the database
        Templates.create(template)
            .then(data => {
                res.send(data);
            })
            .catch(err => {
                res.status(500).send({
                    message:
                        err.message || "Some error occurred while creating the Template."
                });
            });
    }
    else{
            // resource is forbidden for this user/role
            res.status(403).end();
    }
}

exports.deleteTemplate = (req, res) => {
    const permissionDelete = roles.can(req.session.role).deleteAny('templates');
    if (permissionDelete.granted) {
        Templates.destroy({
            where: {
                id: req.params.id
            }
        }).then(() => {
            res.status(200).send("OK")
        })
            .catch(err => {
                res.status(500).send({
                    message:
                        err.message || "Some error occurred while deleting Templates."
                });
            });
    }
    else{
        // resource is forbidden for this user/role
        res.status(403).end();
    }
}

exports.getTemplates = (req, res) => {
    const permissionRead = roles.can(req.session.role).readAny('templates');
    if (permissionRead.granted) {
        Templates.findAll()
            .then(data => {
                res.send(data);
            })
            .catch(err => {
                res.status(500).send({
                    message:
                        err.message || "Some error occurred while retrieving Templates."
                });
            });
        }
    else{
        // resource is forbidden for this user/role
        res.status(403).end();
    }
}