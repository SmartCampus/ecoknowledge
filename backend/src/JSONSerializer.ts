import Backend = require('./Backend');
import Goal = require('./goal/Goal');
var fs = require('fs');

class JSONSerializer {

    public static JSON_DB_FILE:string = 'db.json';

    public load():any {
        if (!fs.existsSync(JSONSerializer.JSON_DB_FILE)) {
            return {error: 'File ' + JSONSerializer.JSON_DB_FILE + ' not found'};
        }

        var data = fs.readFileSync(JSONSerializer.JSON_DB_FILE, "utf-8");


        if (Object.keys(JSON.parse(data)).length == 0) {
            return {error: '+++\tDatabase was empty !\t+++', data: data};
        }
        return {success: '+++\tDatabase loaded correctly !\t+++', data: data};
    }

    public save(data:any, successCallBack:Function, failCallBack:Function):void {

        fs.writeFile(JSONSerializer.JSON_DB_FILE, JSON.stringify(data, null, 2), function (err) {
            if (err) {
                failCallBack(err);
            }
            successCallBack({success: '+++\tDatabase dumped correctly\t+++'});
        });
    }
}

export = JSONSerializer;