/**
 * @author Christian Brel <ch.brel@gmail.com>
 */

import RouterItf = require('./RouterItf');

import BadgeRepository = require('../badge/BadgeRepository');
import BadgeFactory = require('../badge/BadgeFactory');

/**
 * BadgeRouter class</br>
 * This class handle all the API for
 * badge class and related.
 *
 * @class BadgeRouter
 * @extends RouterItf
 */
class BadgeRouter extends RouterItf {

    private badgeRepository:BadgeRepository;
    private badgeFactory:BadgeFactory;

    /**
     * Constructor : will take the specified badgeRepository
     * and init the embedded badge factory.
     * @param badgeRepository
     *      The badge repository to save and retrieve badges
     */
    constructor(badgeRepository:BadgeRepository, badgeFactory:BadgeFactory) {
        super();
        this.badgeRepository = badgeRepository;
        this.badgeFactory = badgeFactory;
    }

    buildRouter() {
        var self = this;

        this.router.get('/all', this.getAllBadges);
        this.router.post('/new', function(req,res) {
            self.newBadge(req,res);
        });
    }

    /**
     *  This method will return all badges
     *  using badgeRepository#getAllBadges
     * @param req
     * @param res
     */
    getAllBadges(req:any, res:any) {
        var result = this.badgeRepository.getAllBadges();
        res.send(result);
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