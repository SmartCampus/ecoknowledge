import Expression = require('./Expression');
import ValueComparison = require('./ValueComparison');
import BooleanComparison = require('./BooleanComparison');

class ExpressionFactory {

    static REQUIRED_JSON_FIELD:string[] = ['name', 'comparison', 'value', 'description'];

    public createExpression(expression:any):Expression {
        for (var currentRequiredFieldIndex in ExpressionFactory.REQUIRED_JSON_FIELD) {
            var currentRequiredField = ExpressionFactory.REQUIRED_JSON_FIELD[currentRequiredFieldIndex];

            if (!expression[currentRequiredField] || expression[currentRequiredField] === "undefined") {
                throw new Error('Can not build expression ! Field '
                    + currentRequiredField + ' is missing');
            }
        }

        var required:string = expression.name;
        var typeOfComparison:string = expression.comparison;
        var value:boolean|number = expression.value;
        var description:string = expression.description;

        if (typeof(value) === "number") {
            return new ValueComparison(required, typeOfComparison, <number>value, description);
        }
        else {
            return new BooleanComparison(required, typeOfComparison, <boolean>value, description);
        }
    }
}

export  = ExpressionFactory;