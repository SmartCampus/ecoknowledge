class BadArgumentException implements Error {
    name:string;
    message:string;

    constructor(message: string) {
        this.name = "BadArgumentException";
        this.message = message;
    }
}

export = BadArgumentException;