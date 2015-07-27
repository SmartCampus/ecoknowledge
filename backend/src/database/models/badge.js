var connection = require('../connection.js');

exports.schema = connection.sequelize.define('Badge', {
    name: connection.Sequelize.STRING,
    points: connection.Sequelize.INTEGER
});