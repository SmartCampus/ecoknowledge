import User = require('./User');

class UserRepository {

    private users:User[] = []

    private currentUser:User;

    constructor() {
        this.currentUser = new User('Jackie!');
    }

    public addUser(user:User) {
        this.users.push(user);
    }

    public getUser(aUUID:string):User {
        for(var i in this.users) {
            var currentUser = this.users[i];
            if(currentUser.hasUUID(aUUID)) {
                return currentUser;
            }
        }

        return null;
    }

    public getCurrentUser():User {
        return this.currentUser;
    }
}

export = UserRepository;