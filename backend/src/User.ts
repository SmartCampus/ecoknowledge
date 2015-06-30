import Goal = require('./Goal');
import Badge = require('./Badge');

class User {

  private name:string;
  private goals:Goal[] = [];
  private badges:Badge[] = [];

  constructor(name:string) {
    this.name = name;
  }

  public getName():string {
    return this.name;
  }

  public getGoals():Goal[] {
    return this.goals;
  }

  public getBadges():Badge[] {
    return this.badges;
  }

  public addGoal(newGoal:Goal):boolean {
    if (!newGoal) {
      throw new Error('Can not add a new goal to user ' + this.name + ' given goal is null');
    }

    this.goals.push(newGoal);
    console.log('A new goal has been added to ' + this.name + "! Goal name :  " + newGoal.getName());
    return true;
  }

  public addBadge(newBadge:Badge):boolean {
    if (!newBadge) {
      throw new Error('Can not add a new newBadge to user ' + this.name + ' given newBadge is null');
    }

    this.badges.push(newBadge);
    console.log('A new newBadge has been added to ' + this.name + "! newBadge name :  " + newBadge.getName());
    return true;
  }

  public evaluateGoal(goalName:string, goalValue:(number|boolean)[]):boolean {

    var goal = this.retrieveGoal(goalName);
    if(!goal) {
      console.warn("Can not find goal", goalName);
      return false;
    }

    var res =  goal.evaluate(goalValue);
    console.log("goal is", res);
    return res;
  }

  public retrieveGoal(goalName:string):Goal {
    for(var i in this.goals) {
      var currentGoal = this.goals[i];
      if(currentGoal.getName() === goalName) {
        return currentGoal;
      }
    }
    return null;
  }


  public evaluateBadge(badgeName:string, goalValue:number):boolean {

    var badge = this.retrieveBadge(badgeName);
    if(!badge) {
      console.log("Badge", badgeName, " non trouvé");
      return false;
    }

    var tmp = [];
    tmp.push(goalValue);

    var res =  badge.evaluate(tmp);
    console.log("goal is", res);
    return res;
  }

  public retrieveBadge(badgeName:string):Badge {
    for(var i in this.badges) {
      var currentBadge = this.badges[i];
      if(currentBadge.getName() === badgeName) {
        return currentBadge;
      }
    }
    return null;
  }

}

export = User;