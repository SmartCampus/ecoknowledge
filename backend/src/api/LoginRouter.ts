import RouterItf = require('./RouterItf');

import UserRepository = require('../user/UserRepository');
import User = require('../user/User');
import Context = require('../Context');
import BadRequestException = require('../exceptions/BadRequestException');
import BadArgumentException = require('../exceptions/BadArgumentException');

class LoginRouter extends RouterItf {
    private userRepository:UserRepository;

    constructor(context:Context){
        super();
        this.userRepository = context.getUserRepository();
    }

    buildRouter() {
        var self = this;
        this.router.get('/', function (req, res) {
            res.send({});
        });

        this.router.post('/', function (req, res) {
            var userProfile:User = null;

            try {
                userProfile = self.checkUserProfile(req.body);
                res.send({success:'User profile was found', data:{token:userProfile.getUUID()}});
            }
            catch(e) {
                if(e instanceof BadRequestException) {
                    res.status(400).send({error:e.getMessage()});

                }
                else if(e instanceof BadArgumentException) {
                    res.status(400).send({error:e.getMessage()});

                }
                else {
                    res.status(500).send({error:e.getMessage()});
                }
            }

        });
    }

    checkUserProfile(data):User {
        console.log('Data received ', data);
        console.log('Login :', data.username);

        if(!data.username) {
            throw new BadRequestException('Field username is missing in request');
        }

        var currentUser:User = this.userRepository.getUserByName(data.username);
        if(currentUser == null) {
            throw new BadArgumentException('Given username can not be found');
        }

        return currentUser;
    }
}

export = LoginRouter;