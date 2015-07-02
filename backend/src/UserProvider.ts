import User = require('./User');

class UserProvider {

    private users:User[] = []

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

        return null;    }
}

export = UserProvider;