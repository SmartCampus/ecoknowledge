
interface Expression {
  getRequired():string;
  evaluate(newValue:number|boolean):boolean;
}

export = Expression;
