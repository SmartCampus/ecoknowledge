import Operand = require('./Operand');
import TimeBox = require('../TimeBox');
import Expression = require('./Expression');

class GoalCondition implements Expression{
    private leftOperand:Operand;
    private rightOperand:Operand;

    private typeOfComparison:string;
    private description:string;

    private timeBox:TimeBox;

    constructor(leftOperand:Operand, typeOfComparison:string, rightOperand:Operand, description:string, timeBox:TimeBox=null) {
        this.leftOperand = leftOperand;
        this.rightOperand = rightOperand;
        this.typeOfComparison = typeOfComparison;
        this.description = description;
        this.timeBox = timeBox;
    }

    public getComparisonType():string {
        return this.typeOfComparison;
    }

    public hasLeftOperand(name:string):boolean {
        return this.leftOperand.getStringDescription() == name;
    }

    public hasRightOperand(name:string):boolean {
        return this.rightOperand.getStringDescription() == name;
    }

    public setLeftOperand(newLeftOperand:Operand) {
        this.leftOperand = newLeftOperand;
    }

    public setRightOperand(newRightOperand:Operand) {
        this.rightOperand = newRightOperand;
    }

    public setTypeOfComparison(newTypeOfComparison:string) {
        this.typeOfComparison = newTypeOfComparison;
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

    public checkTimeBox(currentDateInMillis:any):boolean {
        if(!this.timeBox) {
            return true;
        }

        return this.timeBox.isInTimeBox(currentDateInMillis);
    }

    public evaluate(values:string[]):boolean {
        if(!this.checkTimeBox(Date.now())) {
            console.log("Condition ", this.getDescription(), ": timeBox not reach");
            return false;
        }

        var numberOfVarRequired = this.getRequired().length;

        if (values.length != numberOfVarRequired) {
            throw new Error('Can not evaluate condition ' + this.description
                + '. Only ' + values.length + ' values passed and '
                + numberOfVarRequired + ' needed');
        }
        var evalString:string = '';

        if (this.leftOperand.hasToBeDefined() && this.rightOperand.hasToBeDefined()) {
            evalString += values[0] + this.typeOfComparison + values[1];
        }

        else if (this.leftOperand.hasToBeDefined() && !this.rightOperand.hasToBeDefined()) {
            evalString += values[0] + this.typeOfComparison + this.rightOperand.getStringDescription();
        }

        else if (this.rightOperand.hasToBeDefined() && !this.leftOperand.hasToBeDefined()) {
            evalString += this.leftOperand.getStringDescription() + this.typeOfComparison + values[0];
        }

        else {
            evalString += this.leftOperand.getStringDescription() + this.typeOfComparison + this.rightOperand.getStringDescription();
        }

        console.log("Evaluating", evalString, "...");

        return eval(evalString);
    }

    public getDescription():string {
        return this.leftOperand.getStringDescription() + this.typeOfComparison + this.rightOperand.getStringDescription();
    }

    public getData():any {
        return this.leftOperand.getStringDescription() + this.typeOfComparison + this.rightOperand.getStringDescription();
    }
}

export = GoalCondition;