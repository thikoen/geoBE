module.exports = (sequelize, Sequelize) => {
    const Users = sequelize.define("users", {
        firstName: {
            type: Sequelize.STRING
        },
        lastName: {
            type: Sequelize.STRING
        },
        email: {
            type: Sequelize.STRING,
            allowNull: false,
            validate: {
                notNull: {
                    msg: 'email can\'t be null'
                }
            }
        },
        password: {
            type: Sequelize.STRING,
            allowNull: false,
            validate: {
                notNull: {
                    msg: 'Password can\'t be null'
                }
            }
        }
        ,
         role: {
             type: Sequelize.ENUM,
             values: ['admin', 'editor', 'viewer', 'none'],
             allowNull: false,
             validate: {
                 notNull: {
                     msg: 'role can\'t be null'
                 }
             }
         }

    });

    return Users;
};