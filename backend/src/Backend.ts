/**
 * @author Christian Brel <ch.brel@gmail.com>
 */

import Server = require('./Server');

import DashboardRouter = require('./api/DashboardRouter');
import LoginRouter = require('./api/LoginRouter');

import BadgeRepository = require('./badge/BadgeRepository');
import BadgeFactory = require('./badge/BadgeFactory');

import GoalRepository = require('./goal/GoalRepository');
import GoalFactory = require('./goal/GoalFactory');

import UserChallengeRepository = require('./challenge/UserChallengeRepository');
import UserChallengeFactory = require('./challenge/UserChallengeFactory');

import UserRepository = require('./user/UserRepository');
import UserFactory = require('./user/UserFactory');
import User = require('./user/User');

import TeamRepository = require('./user/TeamRepository');
import TeamFactory = require('./user/TeamFactory');

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

    public challengeRepository:UserChallengeRepository;
    public challengeFactory:UserChallengeFactory;

    public userRepository:UserRepository;
    public userFactory:UserFactory;

    public teamRepository:TeamRepository;
    public teamFactory:TeamFactory;

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

        this.challengeRepository = new UserChallengeRepository();
        this.challengeFactory = new UserChallengeFactory();

        this.userRepository = new UserRepository();
        this.userFactory = new UserFactory();

        this.teamRepository = new TeamRepository();
        this.teamFactory = new TeamFactory();

        this.storingHandler = new StoringHandler(this);

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

        this.app.use('/dashboard', (new DashboardRouter(self.challengeRepository, self.challengeFactory, self.goalDefinitionRepository, self.userRepository, self.teamRepository, self.badgeRepository, new Middleware())).getRouter());
        this.app.use('/login', (new LoginRouter(self.userRepository)).getRouter());

        /*
         this.app.use("/badges", (new BadgeRouter(self.badgeRepository, self.badgeFactory, self.userRepository, loginCheck)).getRouter());
         this.app.use("/goals", (new GoalDefinitionRouter(self.goalDefinitionRepository, self.goalDefinitionFactory, self.challengeRepository, self.userRepository)).getRouter());
         this.app.use("/challenges", (new GoalInstanceRouter(self.challengeRepository, self.challengeFactory, self.goalDefinitionRepository, self.userRepository)).getRouter());
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
        var result = this.storingHandler.load();
        if (result.success) {
            console.log(result.success);
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