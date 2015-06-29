import Goal = require('./Goal');

class User {

  private name:string;
  private goals:Goal[] = [];

  constructor(name:string) {
    this.name = name;
  }

  public getName():string {
    return this.name;
  }

  public getGoals():Goal[] {
    return this.goals;
  }

  public addGoal(newGoal:Goal):boolean {
    if (!newGoal) {
      throw new Error('Can not add a new goal to user ' + this.name + ' given goal is null');
    }

    this.goals.push(newGoal);
    console.log('A new goal has been added to ' + this.name + "! Goal name :  " + newGoal.getName());
    return true;
  }

  public evaluateGoal(goalName:string, goalValue:number):boolean {

    var goal = this.retrieveGoal(goalName);
    if(!goal) {
      return false;
    }

    var res =  goal.evaluate(goalValue);
    console.log("goal is", res);
    return res;
  }

  private retrieveGoal(goalName:string):Goal {
    for(var i in this.goals) {
      var currentGoal = this.goals[i];
      if(currentGoal.getName() === goalName) {
        return currentGoal;
      }
    }
    return null;
  }

}

export = User;
