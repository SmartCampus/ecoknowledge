import Condition = require('../Condition');
import GoalExpression = require('../expression/GoalExpression');
import Operand = require('../expression/Operand');

import TimeBox = require('../../TimeBox');


class ExpressionFactory {

    static REQUIRED_JSON_FIELD:string[] = ['comparison', 'valueLeft', 'valueRight', 'description'];

    public createExpression(expression:any):GoalExpression {
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

        /*FIXME
        var timeBox:any = expression.timeBox;
        var startDate:number = timeBox.startDate;
        var endDate:number = timeBox.endDate;

        var timeBoxObj:TimeBox = new TimeBox(startDate, endDate);
*/
        var newGoalCondition:GoalExpression = new GoalExpression(leftOperand, typeOfComparison, rightOperand, description);
        return newGoalCondition;
    }
}

export  = ExpressionFactory;