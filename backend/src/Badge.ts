import Goal = require('Goal');

class Badge {

  private name:string;
  private description:string;
  private points:number;
  private objectives:Goal[];

  constructor(name:string, description:string, points:number, goal:Goal[]) {
    this.name = name;
    this.description = description;
    this.points = points;
    this.objectives = goal;
  }

  public getName():string {
    return this.name;
  }

  public evaluate(values:(number|boolean)[][]):boolean {
    var result = true;

    if(this.objectives.length != values.length) {
      throw new Error("Can not evaluate badge " + this.name + "! There are " + this.objectives + " objectives to evaluate" +
          "and only " + values.length + " values");
    }

    for(var i = 0 ; i < this.objectives.length ; i ++) {
      result = result && this.objectives[i].evaluate(values[i]);

      if(!result) {
        return false;
      }
    }
    return result;
  }

}

export = Badge;
