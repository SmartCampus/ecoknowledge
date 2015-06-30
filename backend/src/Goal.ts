import ExpressionHandler = require('./ExpressionHandler');

class Goal {
  private name:string;
  private expressions:ExpressionHandler = new ExpressionHandler();

  constructor(name:string) {
    if (!name) {
      throw new Error('Bad argument : name given is null');
    }

    this.name = name;
  }

  public getName():string {
    return this.name;
  }

  public addCondition(required:string, typeOfComparison:string, value:number|boolean) {
    if (!typeOfComparison) {
      throw new Error('Bad argument : typeOfComparison given is null');
    }

    this.expressions.addExpressionByDescription(required, typeOfComparison, value);
  }

  public evaluate(values:(number|boolean)[]):boolean {
    return this.expressions.evaluate(values);
  }
}

export = Goal;
