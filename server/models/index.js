const dbConfig = require("../config/db.config.js");

const Sequelize = require("sequelize");
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
    host: dbConfig.HOST,
    dialect: dbConfig.dialect,
    operatorsAliases: false,

    pool: {
        max: dbConfig.pool.max,
        min: dbConfig.pool.min,
        acquire: dbConfig.pool.acquire,
        idle: dbConfig.pool.idle
    }
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.facilities = require("./facilities.model.js")(sequelize, Sequelize);
db.users = require("./users.model.js")(sequelize, Sequelize);
db.images = require("./images.model.js")(sequelize, Sequelize);
db.templates = require("./templates.model.js")(sequelize, Sequelize);

//define assosiation between the tables
db.images.belongsTo(db.facilities, {
    foreignKey: 'facilityId', 
    onDelete: "CASCADE",
    foreignKeyConstraint: true
})

db.facilities.hasMany(db.images);

db.facilities.belongsTo(db.templates, {
    foreignKey: 'templateId', 
    onDelete: "CASCADE",
    foreignKeyConstraint: true
});

db.templates.hasMany(db.facilities);

module.exports = db;
