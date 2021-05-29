module.exports = (sequelize, Sequelize) => {
    const Images = sequelize.define("images", {
        name: {
            type: Sequelize.STRING
        },
        data: {
            type: Sequelize.BLOB
        },
        size: {
            type :Sequelize.INTEGER                     
        },
        mimetype:{
            type: Sequelize.STRING
        },
        description: {
            type: Sequelize.STRING
        }
    });
      
    return Images;

};
