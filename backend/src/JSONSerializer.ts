import Backend = require('./Backend');
import GoalDefinition = require('./goal/definition/GoalDefinition');
var fs = require('fs');

class JSONSerializer {

    public save(backend:Backend):boolean {

        var startDate:Date = new Date(Date.now());
        var endDate:Date = new Date(startDate.getFullYear(), startDate.getMonth() + 1, startDate.getDate());

        var goalDefinition:GoalDefinition = new GoalDefinition("aGoalDefinition", startDate, endDate, 2);

        fs.writeFile('db.json', goalDefinition.getDataInJSON(), function (err) {
            if (err) {
                return console.log(err);
            }
            console.log("FILE SAVED");
        });
        return true;
    }
}

export = JSONSerializer;