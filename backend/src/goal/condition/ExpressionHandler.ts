
import Expression = require('./Expression');
import GoalCondition = require('./GoalCondition');

class ExpressionHandler {

  private expressions:Expression[] = [];

  public getExpressions():Expression[] {
    return this.expressions;
  }

  public addExpression(expression:Expression):void {
    this.expressions.push(expression);
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

  // TODO
  public evaluate(values:(number|boolean)[]):boolean {

    if(this.expressions.length != values.length) {
      throw new Error('Can not evaluate expressions ! There are ' + this.expressions.length + ' expressions and ' + values.length + ' values to bind.');
    }

    console.log("Evaluation de", this.getRequired(), "avec", values);

    var result:boolean = true;

    for(var i = 0 ; i < this.expressions.length ; i++) {
      // FIXME result = result && this.expressions[i].evaluate(values[i]);

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
