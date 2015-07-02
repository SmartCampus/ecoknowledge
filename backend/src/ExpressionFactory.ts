import Expression = require('./Expression');
import ValueComparison = require('./ValueComparison');
import BooleanComparison = require('./BooleanComparison');

class ExpressionFactory {
    public createExpression(expression:any):Expression {

       var required:string = expression.required;
        var typeOfComparison:string = expression.comparison;
        var value:boolean|number = expression.value;

        if(typeof(value) === "number") {
            return new ValueComparison(required, typeOfComparison, <number>value);
        }
        else {
            return new BooleanComparison(required, typeOfComparison, <boolean>value);
        }
    }
}

export  = ExpressionFactory;