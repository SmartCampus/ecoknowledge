import RouterItf = require('./RouterItf');

import UserRepository = require('../user/UserRepository');
import User = require('../user/User');

class LoginRouter extends RouterItf {
    private userRepository:UserRepository;

    constructor(userRepository:UserRepository) {
        super();
        this.userRepository = userRepository;
    }

    buildRouter() {
        var self = this;
        this.router.get('/', function (req, res) {
            res.send({});
        });

        this.router.post('/', function (req, res) {
            console.log('Data received ', req.body);

            console.log('Login :', req.body.username);

            if(!req.body.username) {
                res.status(400).send({error:'Field username is missing in request'});
                return;
            }

            var currentUser:User = self.userRepository.getUserByName(req.body.username);
            if(currentUser == null) {
                res.status(400).send({error:'Given username can not be found'});
                return;
            }

            res.send({success:'User profile was found', data:{token:currentUser.getUUID()}});
        });
    }
}

export = LoginRouter;