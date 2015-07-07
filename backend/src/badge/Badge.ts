import Goal = require('../goal/Goal');

class Badge {

  private name:string;
  private description:string;
  private points:number;
  private objectives:Goal[];

  private sensors:string[] = [];

  constructor(name:string, description:string, points:number, goal:Goal[], sensors:string[]) {
    this.name = name;
    this.description = description;
    this.points = points;
    this.objectives = goal;
    this.sensors = sensors;
  }

  public getName():string {
    return this.name;
  }

  public getRequired():string[] {
    return this.sensors;
  }

  public evaluate(values:any[]):boolean {
    var result = true;

    
    if(this.objectives.length != values.length) {
      throw new Error("Can not evaluate badge " + this.name + "! There are " + this.objectives + " objectives to evaluate" +
          "and only " + values.length + " values");
    }

    var sortedSensorValues:(number|boolean)[] = [];
    console.log("VALUES : ", values);
    for(var j = 0 ; j < this.sensors.length ; j ++) {
      console.log("SENSORS/KEY", this.sensors[j]);
      console.log("BASE", values[0]);
      console.log(values[0][this.sensors[j]]);

      sortedSensorValues.push(values[0][this.sensors[j]]);
    }

    console.log("Sorted values", sortedSensorValues);

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

export = Badge;
