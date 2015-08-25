/**
 * @author Christian Brel <ch.brel@gmail.com>
 */

/// <reference path="../typings/node/node.d.ts" />

var http:any = require("http");
var express:any = require("express");
var bodyParser:any = require("body-parser");
var session = require('client-sessions');

import UserRepository = require('./user/UserRepository');

/**
 * Represents a Server managing Namespaces.
 *
 * @class Server
 */
class Server {

    /**
     * Server's listening port.
     *
     * @property listeningPort
     * @type number
     */
    listeningPort:number;

    /**
     * Server's app.
     *
     * @property app
     * @type any
     */
    app:any;

    /**
     * Server's http server.
     *
     * @property httpServer
     * @type any
     */
    httpServer:any;

    userRepository:UserRepository;

    /**
     * Constructor.
     *
     * @param {number} listeningPort - Listening port.
     * @param {Array<string>} arguments - Command line arguments.
     */
    constructor(listeningPort:number, arguments:Array<string>, userRepository:UserRepository) {
        this.listeningPort = listeningPort;
        this._buildServer();
        this.userRepository = userRepository;
    }

    /**
     * Build server.
     *
     * @method _buildServer
     * @private
     */
    private _buildServer() {
        this.app = express();
        this.app.use(bodyParser.json()); // for parsing application/json
        this.app.use(bodyParser.urlencoded({extended: true})); // for parsing application/x-www-form-urlencoded

        //  Handle client session with mozilla library
        this.app.use(session({
            cookieName: 'session',
            secret: 'random_string_goes_here', //   TODO : make secret field a high-entropy string instead of this bullshit
            duration: 30 * 60 * 1000,
            activeDuration: 5 * 60 * 1000,
        }));

        this.app.use(function (req, res, next) {
            res.header("Access-Control-Allow-Origin", "*");
            res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
            res.header("Access-Control-Allow-Methods", "POST, GET, DELETE");
            next();
        });

        this.app.use('/login', function (req, res, next) {
            if (req.session && req.session.user) {
                this.userRepository.userExists(req.session.user.id,
                    function (user) {
                        if (user) {
                            req.user = user;
                            delete req.user.password; // delete the password from the session
                            req.session.user = user;  //refresh the session value
                            res.locals.user = user;
                        }
                        // finishing processing the middleware and run the route
                        next();
                    },
                    function (err) {
                        console.log("PROBLEME");
                        res.send(err);
                    });
            } else {
                next();
            }

        });


        this.httpServer = http.createServer(this.app);
    }

    requireLogin(req, res, next) {
        if (!req.user) {
            var route = req.get('host')+'/login';
            console.log('redirection vers', route);
            res.redirect(route);
        } else {
            next();
        }
    }

    /**
     * Runs the Server.
     *
     * @method run
     */
    run() {
        var self = this;

        this.httpServer.listen(this.listeningPort, function () {
            self.onListen();
        });
    }

    /**
     * Method called on server listen action.
     *
     * @method onListen
     */
    onListen() {
        console.log("Server listening on *:" + this.listeningPort);
    }
}

export = Server;
