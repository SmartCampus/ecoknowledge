import Goal = require('Goal');

class BadgeDefinition {

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

  public getDescription():string {
    return this.description;
  }

  public getPoints():number {
    return this.points;
  }

  public getObjectives():Goal[] {
    return this.objectives;
  }

  public getSensorsRequired():string[] {
    var result:string[]=[];
    for(var i = 0; i < this.objectives.length; i++){
      console.log(this.objectives[i].getRequired().getRequired());
      result.push(this.objectives[i].getRequired().getRequired());
    }
    return result;
  }
}

export = BadgeDefinition;
