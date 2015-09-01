import Backend = require('./Backend');
import Goal = require('./goal/Goal');
var fs = require('fs');

class JSONSerializer {

    public load(pathToFileToLoad:string):any {
        if (!fs.existsSync(pathToFileToLoad)) {
           throw new Error('File ' + pathToFileToLoad + ' not found');
        }

        var data = fs.readFileSync(pathToFileToLoad, "utf-8");


        if (Object.keys(JSON.parse(data)).length == 0) {
            return {error: '+++\tDatabase was empty !\t+++', data: data};
        }
        return {success: '+++\tDatabase loaded correctly !\t+++', data: JSON.parse(data)};
    }

    public save(data:any, pathToFile:string, successCallBack:Function, failCallBack:Function):void {

        fs.writeFile(pathToFile, JSON.stringify(data, null, 2), function (err) {
            if (err) {
                failCallBack(err);
            }
            successCallBack({success: '+++\tDatabase dumped correctly\t+++'});
        });
    }
}

export = JSONSerializer;