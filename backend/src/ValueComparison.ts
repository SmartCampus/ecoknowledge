import Expression = require('./Expression');

class ValueComparison implements Expression {
  private allowedComparison = ['inf', 'sup', 'eq', 'dif'];

  protected required:string;
  protected typeOfComparison:string;
  protected thresholdValue:number;

  constructor(required:string, comparison:string, thresholdValue:number) {
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

  public evaluate(newValue:number):boolean {
    console.log("Evaluation de", newValue, this.typeOfComparison, this.thresholdValue);

    switch (this.typeOfComparison) {
      case 'inf':
        return newValue <= this.thresholdValue;
      case 'sup':
        return newValue >= this.thresholdValue;
      case 'eq':
        return newValue == this.thresholdValue;
      case 'dif':
        return newValue != this.thresholdValue;
    }
  }

  public getData():any {
    return  {
      "required":this.required,
      "comparison":this.typeOfComparison,
      "value":this.thresholdValue
    }
  }
}

export = ValueComparison;
