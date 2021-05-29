module.exports = (sequelize, Sequelize) => {
    const Template = sequelize.define("templates", {
        name: {
            type: Sequelize.STRING,
            allowNull: false,
            validate: {
                notNull: {
                    msg: 'name can\'t be null'
                }
            }
        },
        fields: {
            type: Sequelize.JSONB,
            allowNull: false,
            validate: {
                notNull: {
                    msg: 'fields can\'t be null'
                }
            }
        }
    });

    return Template;
};