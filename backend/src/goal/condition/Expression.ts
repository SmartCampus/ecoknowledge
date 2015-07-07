
interface Expression {
  getRequired():string[];
  evaluate(values:string[]):boolean;
  getData():any;
}

export = Expression;
