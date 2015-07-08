import Goal = require('../goal/Goal');

class BadgeDefinition {

  private name:string;
  private description:string;
  private points:number;
  private goals:Goal[];

  constructor(name:string, description:string, points:number, goal:Goal[]) {
    this.name = name;
    this.description = description;
    this.points = points;
    this.goals = goal;
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
    return this.goals;
  }

  private retrieveGoal(goalUUID:string):Goal {
    for(var i in this.goals) {
      var currentGoal = this.goals[i];
      if(currentGoal.hasUUID(goalUUID)) {
        return currentGoal;
      }
    }

    return null;
  }

  public getSensorsTypeRequired():string[] {
    /*
    var result:string[]=[];
    for(var i = 0; i < this.objectives.length; i++){
      console.log(this.objectives[i].getRequired().getRequired());
      result.push(this.objectives[i].getRequired().getRequired());
    }
    return result;
    */
    return null;
  }


  /**
   *
   * @param values
   *
   * {
   *      '<goalID>' :
   *
   *          - array describing all goal conditions of goal goalID
   *          [
   *
   *              - each condition can have multiple required field
   *              [
   *
   *                      -describing a required of a condition
   *                      {
   *                          'name' : <string>           - symbolic name of the required field, eg : 'Temp_cli',
   *                          'sensor' : 'sensor_id ',    - sensor id bound to achieve current goal condition, eg : 'AC_443',
   *                          'value' : <number>          - current value of specified sensor
   *                       }
   *              ]
   *
   *          ]
   * }
   *
   * @returns {boolean}
   */
  public evaluate(values:any):boolean {

    var numberOfGoals = Object.keys(values).length;
    var result = true;

     if(this.goals.length != numberOfGoals) {
      throw new Error("Can not evaluate badge " + this.name + "! There are " + this.goals
          + " objectives to evaluate and only " + numberOfGoals + " values");
    }

    for(var currentGoalUUID in values) {
      var currentGoal:Goal = this.retrieveGoal(currentGoalUUID);
      var currentConditionsDesc:any = values[currentGoalUUID];
      result = result && currentGoal.evaluate(currentConditionsDesc);
    }

    return result;
  }


}

export = BadgeDefinition;
