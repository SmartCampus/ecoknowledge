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
        this.app.use("/goalsInstance", (new GoalInstanceRouter(this.goalInstanceRepository, this.goalInstanceFactory, this.goalDefinitionRepository)).getRouter());

        this.app.get('/test', function(req, res) {

            var leftOperand:Operand = new Operand('TMP_CLI', true);
            var rightOperand:Operand = new Operand('10', false);

            var timeBox:TimeBox = new TimeBox(Date.now() / 1000, Date.now() / 1000 + 500);

            var goalCondition:GoalCondition = new GoalCondition(leftOperand, '>', rightOperand, 'a desc', timeBox);
            var overall:OverallGoalCondition = new OverallGoalCondition(goalCondition, new Date(Date.now()), new Date(Date.now()+5000),50);

            var successReadCallBack = function (conditionObject:GoalCondition) {
                console.log("SUCCESS READ CALL BACK\nHAS SAME LEFT OPERAND ?");
                console.log(goalCondition.hasLeftOperand(conditionObject.getLeftOperand().getStringDescription()));
                console.log("ORIGINAL OBJECT\n\t", goalCondition.getStringRepresentation());
                console.log("READ FROM BDD OBJECT\n\t", conditionObject.getStringRepresentation());
            };

            var failReadCallBack = function (conditionObject) {
                console.log("FAIL READ CALL BACK");
            };


            var successCreateCallBack = function (_conditionSequelize) {
                console.log("SUCCESS CREATE CALL BACK WITH DB ID", goalCondition.getId());
                OverallGoalCondition.read(overall.getId(), successReadCallBack, failReadCallBack);
            };

            var failCreateCallBack = function (_conditionSequelize) {
                console.log("FAIL CREATE CALL BACK", _conditionSequelize);
            };

            overall.create(successCreateCallBack, failCreateCallBack);
        });
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