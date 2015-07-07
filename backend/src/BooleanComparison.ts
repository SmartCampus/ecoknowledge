import Expression = require('./Expression');

class BooleanComparison implements Expression {
  private allowedComparison = ['eq', 'dif'];

  protected required:string;
  protected typeOfComparison:string;
  protected thresholdValue:boolean;
  protected description:string;

  constructor(required:string, comparison:string, thresholdValue:boolean, description:string) {
    if (this.allowedComparison.indexOf(comparison) == -1) {
      throw new Error("Can not apply comparison " + comparison + " on a boolean expression. Only " + this.allowedComparison.toString() + " allowed.");
    }

    this.required = required;
    this.typeOfComparison = comparison;
    this.thresholdValue = thresholdValue;
    this.description = description;
  }

  public getRequired():string {
    return this.required;
  }

  public evaluate(newValue:boolean):boolean {
    console.log("Evaluation de", newValue, this.typeOfComparison, this.thresholdValue);

    return (this.typeOfComparison == 'eq') ? newValue == this.thresholdValue : newValue != this.thresholdValue;
  }

  public getData():any {
    return  {
      "required":this.required,
      "comparison":this.typeOfComparison,
      "value":this.thresholdValue,
      "description":this.description
    }
  }
}

export = BooleanComparison;
