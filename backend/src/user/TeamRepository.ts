import Team = require('./Team');

class TeamRepository {

    private teams:Team[] = []

    teamExists(teamID:string, successCallBack:Function, failCallBack:Function) {
        var team:Team = this.getTeam(teamID);

        (team != null) ? successCallBack(team) : failCallBack('User not found');
    }

    public addTeam(team:Team) {
        this.teams.push(team);
    }

    public getTeam(aUUID:string):Team {
        for (var i in this.teams) {
            var currentTeam = this.teams[i];
            if (currentTeam.hasUUID(aUUID)) {
                return currentTeam;
            }
        }

        return null;
    }

    getTeamsByMember(aUserID:string):Team[] {
        var teams:Team[] = [];

        for (var currentTeamIndex in this.teams) {
            var team = this.teams[currentTeamIndex];
            if (team.hasMember(aUserID)) {
                teams.push(team);
            }
        }

        return teams;
    }

    hasMember(aUserID:string):boolean {
        for (var currentTeamIndex in this.teams) {
            var team = this.teams[currentTeamIndex];
            if (team.hasMember(aUserID)) {
                return true;
            }
        }

        return false;
    }

    public getDataInJSON():any {
        var result:any[] = [];

        for (var currentTeamIndex in this.teams) {
            var currentTeam = this.teams[currentTeamIndex];
            result.push(currentTeam.getDataInJSON());
        }

        return result;
    }

    public displayShortState() {
        console.log("\n\n+++\t Etat du repository des Teams\t+++");

        for (var currentTeamIndex in this.teams) {
            var currentTeam = this.teams[currentTeamIndex];
            console.log("#", currentTeam.getUUID(), "\t\nLeader:", currentTeam.getLeader().getName(), "\t| \tName : '", currentTeam.getName(), "'\n", "\tMembers:\n", currentTeam.getStringDescriptionOfMembers());

        }
    }
}

export = TeamRepository;