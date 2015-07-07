
interface Expression {
  getRequired():string;
  evaluate(newValue:number|boolean):boolean;
  getData():any;
}

export = Expression;
