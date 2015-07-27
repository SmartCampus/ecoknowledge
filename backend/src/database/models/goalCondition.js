var connection = require('../connection.js');

exports.schema = connection.sequelize.define('GoalCondition', {
    typeOfComparison: connection.Sequelize.STRING,
    description: connection.Sequelize.STRING
});