import TimeBox = require('../../TimeBox');


interface Expression {
  getRequired():string[];
  evaluate(values:string[]):boolean;
  getData():any;
  getComparisonType():string;
  hasLeftOperand(name:string):boolean;
  hasRightOperand(name:string):boolean;
  getID():string;
  setTimeBox(newTimeBox:TimeBox);
  getDataInJSON():any;
}

export = Expression;
