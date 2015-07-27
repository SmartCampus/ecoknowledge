var OverallGoalCondition = require('./models/overallGoalCondition.js'),
    GoalCondition = require('./models/goalCondition.js'),
    Operand = require('./models/operand.js'),
    TimeBox = require('./models/timebox.js');

exports.init = function () {
    GoalCondition.schema.belongsTo(TimeBox.schema);
    GoalCondition.schema.belongsTo(Operand.schema, {as:'leftOperand'});
    GoalCondition.schema.belongsTo(Operand.schema, {as:'rightOperand'});

    OverallGoalCondition.schema.belongsTo(GoalCondition.schema, {as:'condition'});
};