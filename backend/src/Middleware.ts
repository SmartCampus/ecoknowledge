/// <reference path="../typings/node-uuid/node-uuid.d.ts" />

import http = require("http");

class Middleware {
    getSensorsInfo(required:any, numberToLoad:number, dataJsonString:string, path:string, successFunc:Function, failFunc:Function) {
        http.get(path, function (result) {
            result.on("data", function (chunk) {
                dataJsonString += chunk.toString();
            });

            result.on('end', function () {
                numberToLoad--;
                console.log("remaining number to load");
                console.log(numberToLoad);
                var jsonObject = JSON.parse(dataJsonString);
                required[jsonObject.id] = jsonObject;

                if (numberToLoad == 0) {



                    successFunc();
                }
            });
        });
    }
}

export = Middleware;