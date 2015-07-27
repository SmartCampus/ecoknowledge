/**
 * @author Christian Brel <ch.brel@gmail.com>
 */

/// <reference path="../typings/node/node.d.ts" />

var http:any = require("http");
var express:any = require("express");
var bodyParser:any = require("body-parser");
var relations = require('./database/relations.js');

import Badge = require('./badge/Badge');
import Operand = require('./goal/condition/Operand');
import GoalCondition = require('./goal/condition/GoalCondition');
import TimeBox = require('./TimeBox');
var connection = require('./database/connection.js');


/**
 * Represents a Server managing Namespaces.
 *
 * @class Server
 */
class Server {

    /**
     * Server's listening port.
     *
     * @property listeningPort
     * @type number
     */
    listeningPort:number;

    /**
     * Server's app.
     *
     * @property app
     * @type any
     */
    app:any;

    /**
     * Server's http server.
     *
     * @property httpServer
     * @type any
     */
    httpServer:any;

    /**
     * Constructor.
     *
     * @param {number} listeningPort - Listening port.
     * @param {Array<string>} arguments - Command line arguments.
     */
    constructor(listeningPort:number, arguments:Array<string>) {
        this.listeningPort = listeningPort;

        this._buildDatabase();
        this._buildServer();
    }

    /**
     * Build database.
     *
     * @method _buildDatabase
     * @private
     */
    private _buildDatabase() {
        relations.init();

        /*
         connection.sequelize.sync({force: false})
         .then(function () {
         console.log("Base created !");
         });
         */
        connection.sequelize.drop()
            .then(function () {
                console.log("All tables dropped !");
                connection.sequelize.sync({force: false})
                    .then(function () {
                        console.log("Base created !");
                    });
            });

    }

    /**
     * Build server.
     *
     * @method _buildServer
     * @private
     */
    private _buildServer() {
        this.app = express();
        this.app.use(bodyParser.json()); // for parsing application/json
        this.app.use(bodyParser.urlencoded({extended: true})); // for parsing application/x-www-form-urlencoded

        this.app.use(function (req, res, next) {
            res.header("Access-Control-Allow-Origin", "*");
            res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
            res.header("Access-Control-Allow-Methods", "POST, GET, DELETE");
            next();
        });
        this.httpServer = http.createServer(this.app);
        /*
         this.app.get('/', function(req, res){

         var b:Badge = new Badge('pouic', 10);

         var leftOP:Operand = new Operand('TMP_CLI', true);
         var rightOP:Operand = new Operand('10', false);

         var timeBox:TimeBox = new TimeBox(Date.now()/1000, (Date.now()+50)/1000);

         var goalCondition:GoalCondition = new GoalCondition(leftOP,'>', rightOP,'a desc', timeBox);


         b.create(
         () => {
         console.log("badge crée");
         },
         () => {
         console.log("badge : oups");
         }
         );


         timeBox.create(
         () => {
         console.log("timebox créée");
         },
         () => {
         console.log("timebox : oups");
         }
         );



         var successCallBackGoalCondition = function (_conditionSequelize) {
         _conditionSequelize.countOperands().then( function (nbOperands) {
         console.log("goalCondition crée avec", nbOperands );
         });

         _conditionSequelize.getTimeBox().then( function (_timeBox) {
         var timeBox:TimeBox = TimeBox.fromJSONObject(_timeBox.dataValues);
         console.log("TIME BOX", timeBox);
         });

         };

         var failCallBackGoalCondition = function (_conditionSequelize) {
         console.log("goalCondition : oups");
         };

         goalCondition.create(successCallBackGoalCondition,failCallBackGoalCondition);

         //goalCondition.initFieldsInDB();



         //goalCondition.create(() => { console.log("YES");}, () => {console.log("FAIL");});


         res.send('LOL');
         });
         */
    }

    /**
     * Runs the Server.
     *
     * @method run
     */
    run() {
        var self = this;

        this.httpServer.listen(this.listeningPort, function () {
            self.onListen();
        });
    }

    /**
     * Method called on server listen action.
     *
     * @method onListen
     */
    onListen() {
        console.log("Server listening on *:" + this.listeningPort);
    }
}

export = Server;
