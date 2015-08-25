import User = require('./User');

class UserRepository {

    private users:User[] = []

    private currentUser:User;

    userExists(userID:string, successCallBack:Function, failCallBack:Function) {
        var user:User = this.getUser(userID);

        (user != null) ? successCallBack(user) : failCallBack('User not found');
    }

    public addUser(user:User) {
        this.users.push(user);
    }

    public getUser(aUUID:string):User {
        for (var i in this.users) {
            var currentUser = this.users[i];
            if (currentUser.hasUUID(aUUID)) {
                return currentUser;
            }
        }

        return null;
    }

    public getCurrentUser():User {
        return this.currentUser;
    }

    public setCurrentUser(user:User) {
        this.currentUser = user;
    }

    public getDataInJSON():any {
        var result:any[] = [];

        for (var currentUserIndex in this.users) {
            var currentUser = this.users[currentUserIndex];
            result.push(currentUser.getDataInJSON());
        }

        return result;
    }

    public displayShortState() {
        console.log("\n\n+++\t Etat du repository des utilisateurs\t+++");

        for (var currentUserIndex in this.users) {
            var currentUser = this.users[currentUserIndex];
            console.log("#", currentUser.getUUID(), "\t |\tUser : '", currentUser.getName(), "'")
        }
    }
}

export = UserRepository;