import Goal = require('Goal');

class Badge {

  private name:string;
  private description:string;
  private points:number;
  private objective:Goal;

  constructor(name:string, description:string, points:number, goal:Goal) {
    this.name = name;
    this.description = description;
    this.points = points;
    this.objective = goal;
  }

  public getName():string {
    return this.name;
  }

  public evaluate(values:(number|boolean)[]):boolean {
    return this.objective.evaluate(values);
  }

}

export = Badge;
