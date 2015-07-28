import Expression = require('./Expression');
import GoalCondition = require('./GoalCondition');
import Operand = require('./Operand');

class ExpressionFactory {

    static REQUIRED_JSON_FIELD:string[] = ['comparison', 'valueLeft','valueRight', 'description'];

    public createExpression(expression:any):GoalCondition {
        for (var currentRequiredFieldIndex in ExpressionFactory.REQUIRED_JSON_FIELD) {
            var currentRequiredField = ExpressionFactory.REQUIRED_JSON_FIELD[currentRequiredFieldIndex];

            if (!expression[currentRequiredField] || expression[currentRequiredField] === "undefined") {
                throw new Error('Can not build expression ! Field '
                    + currentRequiredField + ' is missing');
            }
        }

        var leftOperandName = expression.valueLeft.value;
        var leftOperandRequired = expression.valueLeft.sensor;
        var leftOperand:Operand = new Operand(leftOperandName, leftOperandRequired);

        var rightOperandName = expression.valueRight.value;
        var rightOperandRequired = expression.valueRight.sensor;
        var rightOperand:Operand = new Operand(rightOperandName, rightOperandRequired);

        var typeOfComparison:string = expression.comparison;
        var description:string = expression.description;

        var newGoalCondition:GoalCondition = new GoalCondition(leftOperand,typeOfComparison,rightOperand,description);
        return newGoalCondition;
    }
}

export  = ExpressionFactory;