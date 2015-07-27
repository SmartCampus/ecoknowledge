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

class Backend extends Server {

    private badgeRepository:BadgeRepository;
    private badgeFactory:BadgeFactory;

    private goalDefinitionRepository:GoalDefinitionRepository;
    private goalDefinitionFactory:GoalDefinitionFactory;

    private goalInstanceRepository:GoalInstanceRepository;
    private goalInstanceFactory:GoalInstanceFactory;

    private userRepository:UserRepository;

    /**
     * Constructor.
     *
     * @param {number} listeningPort - Server's listening port..
     * @param {Array<string>} arguments - Server's command line arguments.
     */
    constructor(listeningPort:number, arguments:Array<string>) {
        super(listeningPort, arguments);

        console.log("IM BUILDING THIS SHIT");

        this.badgeRepository = new BadgeRepository();
        this.badgeFactory = new BadgeFactory();

        this.goalDefinitionRepository = new GoalDefinitionRepository();
        this.goalDefinitionFactory = new GoalDefinitionFactory();

        this.goalInstanceRepository = new GoalInstanceRepository();
        this.goalInstanceFactory = new GoalInstanceFactory();

        this.userRepository = new UserRepository();

        this.buildAPI();
    }

    /**
     * Method to build backend's API.
     *
     * @method buildAPI
     */
    buildAPI() {
        console.log("Build API !");
        this.app.use("/badges", (new BadgeRouter(this.badgeRepository, this.badgeFactory)).getRouter());
        this.app.use("/goalsDefinition", (new GoalDefinitionRouter(this.goalDefinitionRepository, this.goalDefinitionFactory)).getRouter());
        this.app.use("/goalsInstance", (new GoalInstanceRouter(this.goalInstanceRepository, this.goalInstanceFactory, this.goalDefinitionRepository, this.userRepository)).getRouter());
    }
}

/**
 * Server's Backend listening port.
 *
 * @property _BackendListeningPort
 * @type number
 * @private
 */
var _BackendListeningPort:number = process.env.PORT || 4000;

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