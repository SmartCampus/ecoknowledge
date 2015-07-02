
import Expression = require('./Expression');
import ValueComparison = require('./ValueComparison');
import BooleanComparison = require('./BooleanComparison');

class ExpressionHandler {

  private expressions:Expression[] = [];

  public getExpressions():Expression[] {
    return this.expressions;
  }

  public addExpression(expression:Expression):void {
    this.expressions.push(expression);
  }

  // TODO : DELETE THIS TOKEN
  public addExpressionByDescription(required:string, typeOfComparison:string, value:number|boolean) {

    if(typeof(value) === "number") {
      this.addExpression(new ValueComparison(required, typeOfComparison, <number>value));
    }
    else {
      this.addExpression(new BooleanComparison(required, typeOfComparison, <boolean>value));
    }
  }

  public getRequired():string[] {
    var result = [];

    for(var i in this.expressions) {
      if(result.indexOf(this.expressions[i].getRequired()) == -1) {
        result.push(this.expressions[i].getRequired());
      }
    }

    return result;
  }

  public evaluate(values:(number|boolean)[]):boolean {

    if(this.expressions.length != values.length) {
      throw new Error('Can not evaluate expressions ! There are ' + this.expressions.length + ' expressions and ' + values.length + ' values to bind.');
    }

    console.log("Evaluation de", this.getRequired(), "avec", values);

    var result:boolean = true;

    for(var i = 0 ; i < this.expressions.length ; i++) {
      result = result && this.expressions[i].evaluate(values[i]);

      //  AND optimization
      if(!result) {
        return false;
      }
    }

    return result;
  }

  public getData():any{
    var result:any[] = [];

    for(var i = 0 ; i < this.expressions.length ; i ++) {
      result.push(this.expressions[i].getData());
    }

    return result;
  }
}

export = ExpressionHandler;
