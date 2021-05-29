const db = require("../models");
const bcrypt = require("bcrypt");
var session = require('express-session');
const Joi = require("joi");
const Users = db.users;
const Op = db.Sequelize.Op;
const sequelize = db.sequelize;
const roles = require('./roles.js');
const nodemailer = require('nodemailer')


function validateBody(body, res){

    // Validate request
    const schema = Joi.object({
        firstName : Joi.string(),
        lastName : Joi.string(),
        email: Joi.string().email().required(),
        password: Joi.string().min(8).required(),
        role: Joi.string()
    });

    const result = schema.validate(body);

    if (result.error) {
        res.status(400).send({
            message: result.error
        });
        return false;
    }
    
    return true;
}

//check for same emails in csv
function checkUniqueEmails(emails){ 
    let returnEmail = undefined;
    let emailsSet = new Set();

    emails.forEach(email => { 
        if(emailsSet.has(email)){
            returnEmail = email
        }
        emailsSet.add(email)
    })

    return returnEmail;
}

// Create and Save a new User
exports.register = (req, res) => {

    if(! validateBody(req.body, res)) return;

    Users.findAll({
        where:
        {
            email: req.body.email
        }
    }).then((existingUser) => {

        if (existingUser.length != 0) {
            res.status(409).send({
                message: "Email already exists"
            });
            return;
        }
        // Checks create permissions 
        rolePermission = false;
        if(req.session.email){
            const permissionCreate = roles.can(req.session.role).createAny('users');
            rolePermission = permissionCreate.granted;
        }
        
        // Create a User
        const passwordHash = bcrypt.hashSync(req.body.password, 10);
        const user = {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            password: passwordHash,
            role: req.body.role != null && rolePermission ? req.body.role : 'none'
        };

         //set mail options
         let transport = nodemailer.createTransport({
            host: 'smtp.ethereal.email',
            port: 587,
            secure: false,
            auth: {
                user: 'clovis91@ethereal.email', //randomly created user name
                pass: '2XFnggfuYDMg7P2ajJ' //randomly created password
            }
        });
        let message = {
            from: 'Wahlprojekt Heger <no-reply@wahlprojekt.de>', //is not important
            to:  req.body.email,  //is not important
            subject: 'Ihre Registrierung',
            text: 'Hallo ' + req.body.firstName + ' ' + req.body.lastName + 'Das ist dein Passwort: ' + req.body.password,
            html: '<b> Hallo ' + req.body.firstName + ' ' + req.body.lastName + '!<br> Das ist dein Passwort: '+ req.body.password + ' </b>'
        };
        //send mail with password
        transport.sendMail(message, (err, info) => {
            if (err) {
                console.log('Error occurred while sending mail: ' + err.message);
            }
            console.log('Message sent: %s', info.message.id);
            // Preview only available when sending through an Ethereal account
            console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
        });

        // Save User in the database
        Users.create(user)
            .then(data => {
                res.status(201).send({
                    id: data.dataValues.id,
                    message: "New user registered",
                    firstName: req.body.firstName,
                    lastName: req.body.lastName,
                    email: req.body.email,
                    role: user.role
                });
            })
            .catch(err => {
                res.status(500).send({
                    message:
                        err.message || "Some error occurred while creating the User."
                });
            });
        
       
    });

};

exports.logout = (req,res) => {
    req.session.destroy()
    res.status(200).send({
        message: "User logged out"
    });
}

exports.login = (req, res) => {
    // Validate request
    const schema = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().min(8).required()
    });

    const result = schema.validate(req.body);

    if (result.error) {
        res.status(400).send({
            message: result.error
        });
        return;
    }

    Users.findAll({
        where: {
            email: req.body.email
        }
    }).then((existingUser) => {
        if (existingUser.length != 0) {
            let user = existingUser[0];
            let passwordHash = user.password;
            if (bcrypt.compareSync(req.body.password, passwordHash)) {
                req.session.email = user.email;
                req.session.role = user.role;
                res.status(200).send({
                    message: "User logged in"
                });
                return;
            }
        }

        res.status(400).send({
            message: "Error on login"
        });
    });
};

// Retrieve all Users from the database
exports.getUsers = (req, res) => {
    const permissionRead = roles.can(req.session.role).readAny('users');
    if (permissionRead.granted) {
        Users.findAll({
            attributes: { exclude: ['password'] }
        })
            .then(data => {
                res.send(data);
            })
            .catch(err => {
                res.status(500).send({
                    message:
                        err.message || "Some error occurred while retrieving Users."
                });
            });
        }
    else{
        // resource is forbidden for this user/role
        res.status(403).end();
    }
}

// Delete a User with the specified id in the request
exports.delete = (req, res) => {
    const permissionDelete = roles.can(req.session.role).deleteAny('users');
    if (permissionDelete.granted) {
        Users.destroy({
            where: {
                id: req.params.id
            }
        }).then(result => {
            res.status(200).send("OK")
        })
            .catch(err => {
                res.status(500).send({
                    message:
                        err.message || "Some error occurred while deleting User."
                });
            });
    }
    else{
        // resource is forbidden for this user/role
        res.status(403).end();
    }
};

// Update a User Role by the id in the request
exports.updateRole = (req, res) => {
    const permissionUpdate = roles.can(req.session.role).updateAny('users');
    if (permissionUpdate.granted) {
        const schema = Joi.object({
            role: Joi.string().required()
        });
    
        const result = schema.validate(req.body);
    
        if (result.error) {
            res.status(400).send({
                message: result.error
            });
            return;
        }

        Users.update(
            req.body,
            { where: { id: req.params.id } }
        )
            .then(result =>
                res.status(200).send(result)
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

// Retrieve a User Role from the database by the id in the request
exports.getUserRole = (req, res) => {
    if (req?.session?.role) {
                res.status(200).send({
                    role: req.session.role
                });
        }
    else{
        res.status(404).send({
                message:"User not logged in."
            }
        );
    } 
}

exports.uploadFromCSV = (req, res) => {

    if(!req.files["csv"]){
        res.status(400).send({
            message: "csv is missing!"
        })
    }
    //convert byteArray to String
    var csvString = req.files["csv"].data.toString();

    //get all Rows
    var csvRows = csvString.replace(/[\r]/g, "").split('\n');

    //this array will contain all array data per column
    var csvRowsAsArray = [];
    csvRows.forEach( x => csvRowsAsArray.push(x.split(",")))

    //shift once for header row
    csvRowsAsArray.shift();

    //bodies array for bulkCreate
    var bodies = [];
    //emails array to check for unique pw
    var emails = [];

    csvRowsAsArray.forEach(row => {
        let newBody = {
            firstName : row[0],
            lastName : row[1],
            email: row[2],
            password: row[3],
            role: row[4]
        };
        if(!validateBody(newBody, res)) return;

        //replace old pw mit hashed one
        newBody.password =  bcrypt.hashSync(newBody.password, 10);

        bodies.push(newBody);
        emails.push(row[2]);
    });
    
    let resultCheckUniqueEmails = checkUniqueEmails(emails);  
    
    if(resultCheckUniqueEmails != undefined){
        res.status(409).send({
            message: `Email ${resultCheckUniqueEmails} used multiple times!`
        });
        return
    }

    Users.findAll({
        where:
            {
                email: emails

            }
        }).then((existingUser) => {
        
            if (existingUser.length != 0) {
                res.status(409).send({
                    message: "Email already exists"
                });
                return;
            }
        
            // Save Users in the database
            Users.bulkCreate(bodies)
                .then(data => {
                    res.status(201).send({
                        message: "Mutiple records inserted!",
                    })
                })
                .catch(err => {
                    res.status(500).send({
                        message:
                            err.message || "Some error occurred while creating the User."
                    });
                });
        });
};
