/**
 * @author Christian Brel <ch.brel@gmail.com>
 */

import Server = require('./Server');
import BadgeRouter = require('./api/BadgeRouter');
import GoalDefinitionRouter = require('./api/GoalDefinitionRouter');
import GoalInstanceRouter = require('./api/GoalInstanceRouter');

import BadgeRepository = require('./badge/BadgeRepository');
import BadgeFactory = require('./badge/BadgeFactory');

import GoalDefinitionRepository = require('./goal/definition/GoalDefinitionRepository');
import GoalDefinitionFactory = require('./goal/definition/GoalDefinitionFactory');

import GoalInstanceRepository = require('./goal/instance/GoalInstanceRepository');
import GoalInstanceFactory = require('./goal/instance/GoalInstanceFactory');

import UserRepository = require('./user/UserRepository');

import Operand = require('./goal/condition/Operand');
import GoalCondition = require('./goal/condition/GoalCondition');
import OverallGoalCondition = require('./goal/condition/OverallGoalCondition');
import TimeBox = require('./TimeBox');

import StoringHandler = require('./StoringHandler');

class Backend extends Server {

    public badgeRepository:BadgeRepository;
    public badgeFactory:BadgeFactory;

    public goalDefinitionRepository:GoalDefinitionRepository;
    public goalDefinitionFactory:GoalDefinitionFactory;

    public goalInstanceRepository:GoalInstanceRepository;
    public goalInstanceFactory:GoalInstanceFactory;

    public userRepository:UserRepository;

    private storingHandler:StoringHandler;

    /**
     * Constructor.
     *
     * @param {number} listeningPort - Server's listening port..
     * @param {Array<string>} arguments - Server's command line arguments.
     */
    constructor(listeningPort:number, arguments:Array<string>) {
        super(listeningPort, arguments);

        this.badgeRepository = new BadgeRepository();
        this.badgeFactory = new BadgeFactory();

        this.goalDefinitionRepository = new GoalDefinitionRepository(this.badgeRepository);
        this.goalDefinitionFactory = new GoalDefinitionFactory();

        this.goalInstanceRepository = new GoalInstanceRepository();
        this.goalInstanceFactory = new GoalInstanceFactory();

        this.userRepository = new UserRepository();

        this.storingHandler = new StoringHandler(this);

        this.buildAPI();
        this.loadData();
    }

    /**
     * Method to build backend's API.
     *
     * @method buildAPI
     */
    buildAPI() {
        var self = this;

        this.app.use("/badges", (new BadgeRouter(self.badgeRepository, self.badgeFactory)).getRouter());
        this.app.use("/goals", (new GoalDefinitionRouter(self.goalDefinitionRepository, self.goalDefinitionFactory)).getRouter());
        this.app.use("/challenges", (new GoalInstanceRouter(self.goalInstanceRepository, self.goalInstanceFactory, self.goalDefinitionRepository, self.userRepository)).getRouter());

        this.app.get('/test', function (req, res) {
            self.storingHandler.save(
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
        var self = this;
        var result = self.storingHandler.load();
        console.log(result);
    }
}

export = Backend;

/**
 * Server's Backend listening port.
 *
 * @property _BackendListeningPort
 * @type number
 * @private
 */
var _BackendListeningPort:number = 3000;

/**
 * Server's Backend command line arguments.
 *
 * @property _BackendArguments
 * @type Array<string>
 * @private
 */
var _BackendArguments:Array<string> = process.argv;

var serverInstance = new Backend(_BackendListeningPort, _BackendArguments);
serverInstance.run();