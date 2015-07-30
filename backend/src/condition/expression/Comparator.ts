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

        return eval(leftValue + this.typeOfComparison + rightValue);

        /*
        console.log("LEFT VALUE TYPE", typeof leftValue, " RIGHT VALUE TYPE", typeof rightValue);

        if (typeof leftValue != typeof  rightValue) {
            throw new Error('Can not compare given values. Different types : leftValue type : ' + typeof leftValue
                + 'rightValue type : ' + typeof rightValue);
        }

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
        */
    }

}

export = Comparator;