
interface Expression {
  getRequired():string;
  evaluate(newValue:string|boolean):boolean;
}

export = Expression;
