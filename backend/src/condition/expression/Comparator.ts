class Comparator {

    private typeOfComparison:string;

    constructor(typeOfComparison:string) {
        this.typeOfComparison = typeOfComparison;
    }

    getTypeOfComparison():string {
        return this.typeOfComparison;
    }

    setTypeOfComparison(newComparisonType:string) {
        this.typeOfComparison = newComparisonType;
    }

    evaluate(leftValue, rightValue) {

        switch (this.typeOfComparison) {
            case '<':
                return leftValue < rightValue;
            case '>':
                return leftValue > rightValue;
            case '==':
                return leftValue == rightValue;
            case '!=':
                return leftValue != rightValue;
        }
    }

}

export = Comparator;