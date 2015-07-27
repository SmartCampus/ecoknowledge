var connection = require('../connection.js');

exports.schema = connection.sequelize.define('TimeBox', {

    startDate: connection.Sequelize.STRING,
    endDate: connection.Sequelize.STRING
});