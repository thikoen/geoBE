const db = require("../models");
const Images = db.images;
const Joi = require("joi");
const Op = db.Sequelize.Op;
const roles = require('./roles.js');

// Create and Save a new Image
exports.postImage = (req, res) => {
    const permissionCreate = roles.can(req.session.role).createAny('images');
    if (permissionCreate.granted) {
        //Validate request
        const schema = Joi.object({
            description: Joi.string().allow('').required(),
            facilityId: Joi.number().required()
        });

        const result = schema.validate(req.body);

        if (result.error) {
            res.status(400).send({
                message: result.error
            });
            return;
        }

        if(!req.files.image){
            res.status(400).send({
                message: "Image is missing!"
            })
        }
        
        const image = {

            name: req.files.image.name,
            data: req.files.image.data,
            size: req.files.image.size,
            mimetype: req.files.image.mimetype,
            description: req.body.description,
            facilityId: req.body.facilityId

        };


        // Save Facility in the database
        Images.create(image)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while creating the Image."
            });
        });
    }
    else{
        // resource is forbidden for this user/role
        res.status(403).end();
    }
}

// Get Image by ImageId
exports.getImageByImageId = (req, res) => {
    const permissionRead = roles.can(req.session.role).readAny('images');
    if (permissionRead.granted) {
        // Validate request
        const schemaQuery = Joi.object({
            id: Joi.string().required(),
        });

        const result = schemaQuery.validate(req.params);

        if (result.error) {
            res.status(400).send({
                message: result.error
            });
            return;
        }

        Images.findByPk(req.params.id)
        .then(data => {

            if(data == null){

                res.status(404).send({
                    message: "No Image found with that Id"
                });

                return

            }

            res.writeHead(200, {
                'Content-Type': data.mimetype,
                'Content-disposition': 'attachment;filename=' + data.name,
                'Content-Length': data.size,
                "faciltiyId" : data.facilityId
            })

            res.write(Buffer.from(data.data, 'binary'))
            res.end()
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving Images."
            });
        });
    }
    else{
        // resource is forbidden for this user/role
        res.status(403).end();
    }
};

// Delete a Facility with the specified id in the request
exports.deleteImage = (req, res) => {
    const permissionDelete = roles.can(req.session.role).deleteAny('images');
    if (permissionDelete.granted) {
        Images.destroy({
            where: {
                id: req.params.id
            }
        }).then(result => {
            res.status(200).send("OK")
        })
            .catch(err => {
                res.status(500).send({
                    message:
                        err.message || "Some error occurred while deleting Images."
                });
            });
    }
    else{
        // resource is forbidden for this user/role
        res.status(403).end();
    }
};
