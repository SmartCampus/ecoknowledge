var connection = require('../connection.js');

exports.schema = connection.sequelize.define('OverallGoalCondition', {
    thresholdRate: connection.Sequelize.INTEGER,
    startDate: connection.Sequelize.STRING,
    endDate: connection.Sequelize.STRING
});