import Condition = require('../Condition');
import GoalExpression = require('../expression/GoalExpression');
import Operand = require('../expression/Operand');

import TimeBox = require('../../TimeBox');

import BadArgumentException = require('../../exceptions/BadArgumentException');

class ExpressionFactory {

    public createExpression(data:any):GoalExpression {
        this.checksData(data);

        var leftOperandName = data.valueLeft.value;
        var leftOperandRequired = data.valueLeft.symbolicName;
        var leftOperand:Operand = new Operand(leftOperandName, leftOperandRequired);

        var rightOperandName = data.valueRight.value;
        var rightOperandRequired = data.valueRight.symbolicName;
        var rightOperand:Operand = new Operand(rightOperandName, rightOperandRequired);

        var typeOfComparison:string = data.comparison;

        var newExpression:GoalExpression = new GoalExpression(leftOperand, typeOfComparison, rightOperand);
        return newExpression;
    }

    private checksData(data:any) {
        if(data.valueLeft == null) {
            throw new BadArgumentException('Can not build expression, field "valueLeft" is null');
        }

        if(data.valueLeft.value == null) {
            throw new BadArgumentException('Can not build expression, field "valueLeft.value" is null');
        }

        if(data.valueLeft.symbolicName == null) {
            throw new BadArgumentException('Can not build expression, field "valueLeft.symbolicName" is null');
        }

        if(data.valueRight == null) {
            throw new BadArgumentException('Can not build expression, field "valueRight" is null');
        }

        if(data.valueRight.value == null) {
            throw new BadArgumentException('Can not build expression, field "valueRight.value" is null');
        }

        if(data.valueRight.symbolicName == null) {
            throw new BadArgumentException('Can not build expression, field "valueRight.symbolicName" is null');
        }

        if(data.comparison == null) {
            throw new BadArgumentException('Can not build expression, field "comparison" is null');
        }

    }
}

export  = ExpressionFactory;