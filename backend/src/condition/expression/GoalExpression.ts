import Operand = require('./Operand');
import TimeBox = require('../../TimeBox');
import Comparator = require('./Comparator');

import BadArgumentException = require('../../exceptions/BadArgumentException');

class GoalExpression {
    private leftOperand:Operand;
    private rightOperand:Operand;

    private comparator:Comparator;

    constructor(leftOperand:Operand, typeOfComparison:string, rightOperand:Operand) {

        this.leftOperand = leftOperand;
        this.rightOperand = rightOperand;

        this.comparator = new Comparator(typeOfComparison);
    }

    public getComparisonType():string {
        return this.comparator.getTypeOfComparison();
    }

    public setTypeOfComparison(newTypeOfComparison:string) {
        this.comparator.setTypeOfComparison(newTypeOfComparison);
    }

    public getLeftOperandDescription():string {
        return this.leftOperand.getStringDescription();
    }

    public isLeftOperandRequired():boolean {
        return this.leftOperand.hasToBeDefined();
    }

    public hasLeftOperand(name:string):boolean {
        return this.leftOperand.getStringDescription() == name;
    }

    public setLeftOperand(newLeftOperand:Operand) {
        this.leftOperand = newLeftOperand;
    }

    public getRightOperandDescription():string {
        return this.rightOperand.getStringDescription();
    }

    public isRightOperandRequired():boolean {
        return this.rightOperand.hasToBeDefined();
    }

    public hasRightOperand(name:string):boolean {
        return this.rightOperand.getStringDescription() == name;
    }

    public setRightOperand(newRightOperand:Operand) {
        this.rightOperand = newRightOperand;
    }

    public getRequired():string[] {
        var result:string[] = [];

        if (this.leftOperand.hasToBeDefined()) {
            result.push(this.leftOperand.getStringDescription());
        }
        if (this.rightOperand.hasToBeDefined()) {
            result.push(this.rightOperand.getStringDescription());
        }
        return result;
    }

    public evaluate(values:any):boolean {
        var leftValue = this.leftOperand.getStringDescription();
        var rightValue = this.rightOperand.getStringDescription();

        if (this.leftOperand.hasToBeDefined()) {
            if(!values.hasOwnProperty(this.leftOperand.getStringDescription())) {
                throw new BadArgumentException('Can not evaluate left operand of goal expression.' + this.leftOperand.getStringDescription()
                    + ' is needed but not provided in the parameter');
            }
            leftValue = values[this.leftOperand.getStringDescription()];
        }

        if (this.rightOperand.hasToBeDefined()) {
            if(!values.hasOwnProperty(this.rightOperand.getStringDescription())) {
                throw new BadArgumentException('Can not evaluate right operand of goal expression.' + this.rightOperand.getStringDescription()
                    + ' is needed but not provided in the parameter');
            }

            rightValue = values[this.rightOperand.getStringDescription()];
        }

        return this.comparator.evaluate(leftValue, rightValue);
    }

    public getStringRepresentation():string {
        return this.leftOperand.getStringDescription() + this.comparator.getTypeOfComparison() + this.rightOperand.getStringDescription();
    }

    public getData():any {
        return {
            "leftValue": {"name": this.leftOperand.getStringDescription(), "sensor": this.leftOperand.hasToBeDefined()},
            "rightValue": {
                "name": this.rightOperand.getStringDescription(),
                "sensor": this.rightOperand.hasToBeDefined()
            },
            "comparison": this.comparator.getTypeOfComparison()
        };
    }

    public getDataInJSON():any {
        return {
            valueLeft: {
                value: this.leftOperand.getStringDescription(),
                sensor: this.leftOperand.hasToBeDefined()
            },
            valueRight: {
                value: this.rightOperand.getStringDescription(),
                sensor: this.rightOperand.hasToBeDefined()
            },
            comparison: this.comparator.getTypeOfComparison()
        };
    }
}

export = GoalExpression;