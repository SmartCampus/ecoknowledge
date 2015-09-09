
import RouterItf = require('./RouterItf');

import BadgeRepository = require('../badge/BadgeRepository');
import BadgeFactory = require('../badge/BadgeFactory');
import UserRepository = require('../user/UserRepository');
import Context = require('../Context');

import BadArgumentException = require('../exceptions/BadArgumentException');

/**
 * BadgeRouter class</br>
 * This class handle all the API for
 * badge class and related.
 *
 * @class BadgeRouter
 * @extends RouterItf
 */
class BadgeRouter extends RouterItf {

    private userRepository:UserRepository;
    private badgeRepository:BadgeRepository;
    private badgeFactory:BadgeFactory;

    /**
     * Constructor : will take the specified badgeRepository
     * and init the embedded badge factory.
     * @param badgeRepository
     *      The badge repository to save and retrieve badges
     */
    constructor(context:Context) {
        super();
        this.badgeRepository = context.getBadgeRepository();
        this.badgeFactory = context.getBadgeFactory();
        this.userRepository = context.getUserRepository();
    }

    buildRouter() {
        var self = this;

        this.router.post('/new', function(req,res) {
            self.newBadge(req,res);
        });

        this.router.get('/all', function(req,res) {
            self.getAllBadges(req,res);
        });

        this.router.get('/:id', function(req, res) {
            self.getBadge(req, res);
        });
    }

    /**
     *  This method will return all badges
     *  using badgeRepository#getAllBadges
     * @param req
     * @param res
     */
    getAllBadges(req:any, res:any) {
        var badges = this.badgeRepository.getDataInJSON();
        res.send(badges);
    }

    /**
     *  This method will return a specific badge
     *  using badgeRepository#getBadge
     * @param req
     * @param res
     */
    getBadge(req:any, res:any) {
        var badge = this.badgeRepository.getBadge(req.params.id).getDataInJSON();
        res.send(badge);
    }

    /**
     * This method will create the badge via
     * its internal badge factory and will add it
     * into the specified badge repository</br>
     * See badgeFactory#createBadge method to
     * see required request fields
     * @param req
     * @param res
     */
    newBadge(req:any, res:any) {
        var badgeData = req.body;

        try {
            var badge = this.badgeFactory.createBadge(badgeData);
            this.badgeRepository.addBadge(badge);
            res.send({success:'Badge successfully created', info:badge.getUuid(), description:badge.getDataInJSON()});
        } catch (e) {
            res.status(400).send({'error': e.toString()});
        }
    }
}

export = BadgeRouter;