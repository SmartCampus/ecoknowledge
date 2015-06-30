
import Expression = require('Expression');

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
      result.push(this.expressions[i].getRequired());
    }

    return result;
  }

  public evaluate(values:(number|boolean)[]):boolean {

    if(this.expressions.length != values.length) {
      throw new Error('Can not evaluate expressions ! There are ' + this.expressions.length + ' expressions and ' + values.length + ' values to bind.');
    }

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
}

export = ExpressionHandler;
