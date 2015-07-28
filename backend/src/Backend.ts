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

    public badgeRepository:BadgeRepository;
    public badgeFactory:BadgeFactory;

    public goalDefinitionRepository:GoalDefinitionRepository;
    public goalDefinitionFactory:GoalDefinitionFactory;

    public goalInstanceRepository:GoalInstanceRepository;
    public goalInstanceFactory:GoalInstanceFactory;

    public userRepository:UserRepository;

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
        var self = this;

        this.app.use("/badges", (new BadgeRouter(self.badgeRepository, self.badgeFactory)).getRouter());
        this.app.use("/goalsDefinition", (new GoalDefinitionRouter(self.goalDefinitionRepository, self.goalDefinitionFactory)).getRouter());
        this.app.use("/goalsInstance", (new GoalInstanceRouter(self.goalInstanceRepository, self.goalInstanceFactory, self.goalDefinitionRepository, self.userRepository)).getRouter());

        var jsonSerializer = require('./JSONSerializer');
        this.app.get('/test', function(req, res) {
           jsonSerializer.save(this);
            res.send('OK');
        });
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