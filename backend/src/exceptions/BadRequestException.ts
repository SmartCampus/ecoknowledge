class BadRequestException implements Error {
    name:string;
    message:string;

    constructor(message: string) {
        this.name = "BadRequestException";
        this.message = message;
    }
}

export = BadRequestException;