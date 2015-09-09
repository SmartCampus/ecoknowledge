class BadRequestException implements Error {
    name:string;
    message:string;

    constructor(message: string) {
        this.name = "BadRequestException";
        this.message = message;
    }

    getMessage():string {
        return this.message;
    }
}

export = BadRequestException;