class Goal {
  private name:string;
  private typeOfComparaison:string;
  private value:number;

  constructor(name:string, typeOfComparaison:string, value:number) {
    this.name = name;
    this.typeOfComparaison = typeOfComparaison;
    this.value = value;
  }

  public getName():string {
    return this.name;
  }

  public evaluate(newValue:number):boolean {
    switch (this.typeOfComparaison) {
      case 'inf':
        return newValue <= this.value;
      case 'sup':
        return newValue >= this.value;
      case 'eq':
        return newValue == this.value;
      case 'dif':
        return newValue != this.value;
      default:
        throw new Error('Can not evaluate goal ' + this.name + ' with comparator ' + this.typeOfComparaison);
    }
  }
}

export = Goal;
