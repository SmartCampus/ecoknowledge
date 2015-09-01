/**
 * @author Christian Brel <ch.brel@gmail.com>
 */

import Server = require('./Server');

import DashboardRouter = require('./api/DashboardRouter');
import LoginRouter = require('./api/LoginRouter');

import Context = require('./Context');

import StoringHandler = require('./StoringHandler');
import Middleware = require('./Middleware');

class Backend extends Server {

    private context:Context;

    public static PATH_TO_DB:string = "./db.json";
    public static PATH_TO_STUB:string = "./stub_values.json";

    /**
     * Constructor.
     *
     * @param {number} listeningPort - Server's listening port..
     * @param {Array<string>} arguments - Server's command line arguments.
     */
    constructor(listeningPort:number, arguments:Array<string>) {
        super(listeningPort, arguments);

        this.context = new Context(Backend.PATH_TO_DB, Backend.PATH_TO_STUB);


        this.loadData();
        this.buildAPI();
    }

    /**
     * Method to build backend's API.
     *
     * @method buildAPI
     */
    buildAPI() {
        var self = this;

        this.app.use('/dashboard', (new DashboardRouter(self.context, new Middleware())).getRouter());
        this.app.use('/login', (new LoginRouter(self.context)).getRouter());

        /*
         this.app.use("/badges", (new BadgeRouter(self.badgeRepository, self.badgeFactory, self.userRepository, loginCheck)).getRouter());
         this.app.use("/goals", (new GoalDefinitionRouter(self.goalDefinitionRepository, self.goalDefinitionFactory, self.challengeRepository, self.userRepository)).getRouter());
         this.app.use("/challenges", (new GoalInstanceRouter(self.challengeRepository, self.challengeFactory, self.goalDefinitionRepository, self.userRepository)).getRouter());
         */

        this.app.get('/save', function (req, res) {
            self.context.saveData(
                function (result) {
                    console.log(result.success);
                },
                function (err) {
                    console.log(err.error);
                });
            res.send('OK');
        });
    }

    loadData():void {
        var result = this.context.loadData();
    }
}

export = Backend;

/**
 * Server's Context listening port.
 *
 * @property _BackendListeningPort
 * @type number
 * @private
 */
var _BackendListeningPort:number = 3000;

/**
 * Server's Context command line arguments.
 *
 * @property _BackendArguments
 * @type Array<string>
 * @private
 */
var _BackendArguments:Array<string> = process.argv;

var serverInstance = new Backend(_BackendListeningPort, _BackendArguments);
serverInstance.run();