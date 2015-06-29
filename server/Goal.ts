class Goal {
  private name:string;
  private typeOfComparison:string;
  private value:number;

  constructor(name:string, typeOfComparison:string, value:number) {
    if(!name) {
      throw new Error('Bad argument : name given is null');
    }

    if(!typeOfComparison) {
      throw new Error('Bad argument : typeOfComparison given is null');
    }

    this.name = name;
    this.typeOfComparison = typeOfComparison;
    this.value = value;
  }

  public getName():string {
    return this.name;
  }

  public getTypeOfComparison():string {
    return this.typeOfComparison;
  }

  public getValue():number {
    return this.value;
  }

  public evaluate(newValue:number):boolean {
    switch (this.typeOfComparison) {
      case 'inf':
        return newValue <= this.value;
      case 'sup':
        return newValue >= this.value;
      case 'eq':
        return newValue == this.value;
      case 'dif':
        return newValue != this.value;
      default:
        throw new Error('Can not evaluate goal ' + this.name + ' with comparator ' + this.typeOfComparison);
    }
  }
}

export = Goal;
