import Expression = require('./Expression');

class BooleanComparison implements Expression {
  private allowedComparison = ['eq', 'dif'];

  protected required:string;
  protected typeOfComparison:string;
  protected thresholdValue:boolean;

  constructor(required:string, comparison:string, thresholdValue:boolean) {
    if (this.allowedComparison.indexOf(comparison) == -1) {
      throw new Error("Can not apply comparison " + comparison + " on a boolean expression. Only " + this.allowedComparison.toString() + " allowed.");
    }

    this.required = required;
    this.typeOfComparison = comparison;
    this.thresholdValue = thresholdValue;
  }

  public getRequired():string {
    return this.required;
  }

  public evaluate(newValue:boolean):boolean {
    return (this.typeOfComparison == 'eq') ? newValue == this.thresholdValue : newValue != this.thresholdValue;
  }
}

export = BooleanComparison;
