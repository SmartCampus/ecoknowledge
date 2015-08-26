/**
 * @author Christian Brel <ch.brel@gmail.com>
 */

import Server = require('./Server');

import DashboardRouter = require('./api/DashboardRouter');

import BadgeRepository = require('./badge/BadgeRepository');
import BadgeFactory = require('./badge/BadgeFactory');

import GoalRepository = require('./goal/GoalRepository');
import GoalFactory = require('./goal/GoalFactory');

import ChallengeRepository = require('./challenge/ChallengeRepository');
import ChallengeFactory = require('./challenge/ChallengeFactory');

import UserRepository = require('./user/UserRepository');
import UserFactory = require('./user/UserFactory');
import User = require('./user/User');

import Operand = require('./condition/expression/Operand');
import GoalExpression = require('./condition/expression/GoalExpression');
import OverallGoalCondition = require('./condition/OverallGoalCondition');
import TimeBox = require('./TimeBox');

import StoringHandler = require('./StoringHandler');
import Middleware = require('./Middleware');

class Backend extends Server {

    public badgeRepository:BadgeRepository;
    public badgeFactory:BadgeFactory;

    public goalDefinitionRepository:GoalRepository;
    public goalDefinitionFactory:GoalFactory;

    public goalInstanceRepository:ChallengeRepository;
    public goalInstanceFactory:ChallengeFactory;

    public userRepository:UserRepository;
    public userFactory:UserFactory;

    private storingHandler:StoringHandler;

    /**
     * Constructor.
     *
     * @param {number} listeningPort - Server's listening port..
     * @param {Array<string>} arguments - Server's command line arguments.
     */
    constructor(listeningPort:number, arguments:Array<string>) {
        this.userRepository = new UserRepository();

        super(listeningPort, arguments, this.userRepository);

        this.badgeRepository = new BadgeRepository();
        this.badgeFactory = new BadgeFactory();

        this.goalDefinitionRepository = new GoalRepository(this.badgeRepository);
        this.goalDefinitionFactory = new GoalFactory();

        this.goalInstanceRepository = new ChallengeRepository();
        this.goalInstanceFactory = new ChallengeFactory();

        this.userRepository = new UserRepository();
        this.userFactory = new UserFactory();

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

        this.app.use('/dashboard', (new DashboardRouter(self.goalInstanceRepository, self.goalInstanceFactory, self.goalDefinitionRepository, self.userRepository,self.badgeRepository, new Middleware())).getRouter());

        /*
        this.app.use("/badges", (new BadgeRouter(self.badgeRepository, self.badgeFactory, self.userRepository, loginCheck)).getRouter());
        this.app.use("/goals", (new GoalDefinitionRouter(self.goalDefinitionRepository, self.goalDefinitionFactory, self.goalInstanceRepository, self.userRepository)).getRouter());
        this.app.use("/challenges", (new GoalInstanceRouter(self.goalInstanceRepository, self.goalInstanceFactory, self.goalDefinitionRepository, self.userRepository)).getRouter());
        */

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
        if(result.success) {
            console.log(result.success);
        }
        else {
            this.userRepository.setCurrentUser(new User('Jackie'));
        }
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