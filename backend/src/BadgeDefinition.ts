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

  public getSensorsTypeRequired():string[] {
    var result:string[]=[];
    for(var i = 0; i < this.objectives.length; i++){
      console.log(this.objectives[i].getRequired().getRequired());
      result.push(this.objectives[i].getRequired().getRequired());
    }
    return result;
  }

  public evaluate(values:any[], sensors:string[]):boolean {
    var result = true;

    if(this.objectives.length != values.length) {
      throw new Error("Can not evaluate badge " + this.name + "! There are " + this.objectives + " objectives to evaluate" +
          "and only " + values.length + " values");
    }

    var sortedSensorValues:(number|boolean)[] = [];
    console.log("VALUES : ", values);
    for(var j = 0 ; j < sensors.length ; j ++) {
      console.log("SENSORS/KEY", sensors[j]);
      console.log("BASE", values[0]);
      console.log(values[0][sensors[j]]);

      sortedSensorValues.push(values[0][sensors[j]]);
    }

    console.log("Sorted values", sortedSensorValues);
    console.log("OBJECTIFS : ", JSON.stringify(this.objectives,null,3));
    for(var i = 0 ; i < this.objectives.length ; i ++) {
      result = result && this.objectives[i].evaluate(sortedSensorValues);
      console.log("Goal : ", result);
      if(!result) {
        return false;
      }
    }
    return result;
  }
}

export = BadgeDefinition;
