/// <reference path="../typings/node-uuid/node-uuid.d.ts" />


import ExpressionHandler = require('./ExpressionHandler');
import Expression = require('./Expression');
import uuid = require('node-uuid');

class Goal {
  private id;
  private name:string;
  private expressions:ExpressionHandler = new ExpressionHandler();

  constructor(name:string) {
    if (!name) {
      throw new Error('Bad argument : name given is null');
    }

    this.name = name;
    this.id = uuid.v4();
  }

  public getUUID() {
    return this.id;
  }

  public hasUUID(aUUID:string):boolean {
    return this.id === aUUID;
  }

  public getName():string {
    return this.name;
  }

  public addConditionByDescription(required:string, typeOfComparison:string, value:number|boolean) {
    if (!typeOfComparison) {
      throw new Error('Bad argument : typeOfComparison given is null');
    }

    this.expressions.addExpressionByDescription(required, typeOfComparison, value);
  }

  public addCondition(expression:Expression) {
    this.expressions.addExpression(expression);
  }
  
  public evaluate(values:(number|boolean)[]):boolean {
    return this.expressions.evaluate(values);
  }

  public getRequired():any {
    return this.expressions.getRequired();
  }

  public getData():any {
    return {
      "name":this.name,
      "conditions":this.expressions.getData()
    }
  }
}

export = Goal;
