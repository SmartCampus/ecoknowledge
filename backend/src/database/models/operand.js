var connection = require('../connection.js');

exports.schema = connection.sequelize.define('Operand', {
    value: connection.Sequelize.STRING,
    _hasToBeDefined: connection.Sequelize.BOOLEAN
});