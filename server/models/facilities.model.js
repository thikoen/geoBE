module.exports = (sequelize, Sequelize) => {
    const Facility = sequelize.define("facilities", {
        name: {
            type: Sequelize.STRING
        },
        lon: {
            type: Sequelize.DOUBLE
        },
        lat: {
            type: Sequelize.DOUBLE
        },
        description: {
            type: Sequelize.STRING
        },
        customFields: {
            type: Sequelize.JSONB,
            allowNull: false,
            validate: {
                notNull: {
                    msg: 'fields can\'t be null'
                }
            }
        }
    });

    return Facility;
};
