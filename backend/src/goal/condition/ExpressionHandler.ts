
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

  public getRequired():string[][] {
    var result:string[][] = [];

    for(var i in this.expressions) {
        result.push(this.expressions[i].getRequired());
    }

    return result;
  }

  /**
   *
   * @param values
   *
   *          - array describing all goal conditions of goal goalID
   *          [
   *
   *              - each condition can have multiple required field
   *              [
   *
   *                      -describing a required of a condition
   *                      {
   *                          'name' : <string>           - symbolic name of the required field, eg : 'Temp_cli',
   *                          'sensor' : 'sensor_id ',    - sensor id bound to achieve current goal condition, eg : 'AC_443',
   *                          'value' : <number>          - current value of specified sensor
   *                       }
   *              ]
   *
   *          ]
   * @returns {boolean}
   */

  public evaluate(values:any):boolean {

    var numberOfConditions = Object.keys(values).length;

      /*
      FIXME : test doesn't work => if there is Temp>1 AND Temp<10 it will fail
      */
      /*
    if(this.expressions.length != numberOfConditions) {
      throw new Error('Can not evaluate expressions ! There are ' + this.expressions.length
          + ' expressions and ' + numberOfConditions + ' values to bind.');
    }
*/
    console.log("Evaluation de", this.getRequired(), "avec", values);

    var result:boolean = true;

    for(var i = 0 ; i < this.expressions.length ; i++) {
      result = result && this.expressions[i].evaluate(values);
        console.log("CURRENT RESULT", result);
    }
    console.log("RESULT EH : ", result);
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
