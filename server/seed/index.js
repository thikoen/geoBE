const db = require("../models");
const Facilities = db.facilities;
const Users = db.users;
const Templates = db.templates;
const sequelize = db.sequelize;

const Promise = require('bluebird')
const seedFacilities = require('./facilities.seed.json');
const seedUsers = require('./users.seed.json');
const seedTemplates = require('./template.seed.json')
const { users } = require("../models");

sequelize.sync({ force: true })
    .then(async function () {
         await Promise.all(
            
            seedTemplates.map(template =>{
                Templates.create(template)
            }),
             seedFacilities.map(facility => {
                 Facilities.create(facility)
             }),
             seedUsers.map(user => {
                Users.create(user)
            })
         )
         
        sequelize.query("ALTER TABLE facilities ADD COLUMN geom geometry GENERATED ALWAYS AS (ST_SetSRID(ST_MakePoint(lon, lat), 4326)) STORED")
        .catch(e => console.log(e));
    })