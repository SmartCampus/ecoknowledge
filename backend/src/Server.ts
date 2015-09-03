/**
 * @author Christian Brel <ch.brel@gmail.com>
 */

/// <reference path="../typings/node/node.d.ts" />

var http:any = require("http");
var express:any = require("express");
var bodyParser:any = require("body-parser");

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


    /**
     * Constructor.
     *
     * @param {number} listeningPort - Listening port.
     * @param {Array<string>} arguments - Command line arguments.
     */
    constructor(listeningPort:number, arguments:Array<string>) {
        this.listeningPort = listeningPort;
        this._buildServer();
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

        this.app.use(function (req, res, next) {
            res.header("Access-Control-Allow-Origin", "*");
            res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
            res.header("Access-Control-Allow-Methods", "POST, GET, DELETE");
            next();
        });

        this.httpServer = http.createServer(this.app);
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
