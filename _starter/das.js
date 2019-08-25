// import node modules
const fs = require('fs-extra'),
      os = require('os'),
      request = require('request');

// import global functions
const g = require('./global.js');

// load package file
let pkg = require(`${ process.cwd() }/package.json`);

// set constants
const argv = g.parseArgv(),
      env = process.env.NODE_ENV || 'development';

// use CLI arguments to set variables
const anim    = argv.options.anim || 'idle',
      verbose = pkg.verboseOverride || argv.options.verbose || false;

// set other variables
let localConfig = false;

// Das-specific variables
const backendUrl = 'http://localhost:27301',
      headers = { "Content-Type": "application/json" },
      pid = 'DK5QPID';

// get local config file
// g.log('verbose', `Looking for local configuration file in home directory: .wb-starter.config.json`, verbose);
if (fs.existsSync(`${ os.homedir() }/.wb-starter.config.json`)) {
    // g.log('verbose', `wb-starter configuration file found`, verbose);

    localConfig = require(`${ os.homedir() }/.wb-starter.config.json`);
} else {
    // g.log('verbose', `wb-starter configuration file not found`, verbose);
}

module.exports = {
    animate: function (anim = 'idle', options = {}, verbose) {
        let signals = [];
        const useVerbose = options.verbose || verbose;
        // g.log('verbose', `Starting animation: ${ anim }`, useVerbose);

        switch (anim) {
            case 'highlight':
                highlight(options.key, options.color, options.title, useVerbose);
                break;
            case 'test':
                signals = [{
                    'zoneId': 'KEY_Q',
                    'color': '#'+Math.floor(Math.random()*16777215).toString(16),
                    'effect': 'SET_COLOR',
                    'pid': 'DK5QPID',
                    'clientName': 'Node script',
                    'name': 'Test'
                }];
                sendDasSignals(signals, options, useVerbose);
                break;
            case 'rainbow':
                rainbow(options.key, options.color, options.title, useVerbose);
                break;
        }
    },
    remove: function (zone, options, verbose) {
        const useVerbose = options.verbose || verbose;
        removeDasSignal(zone, options, useVerbose);
    }
};
function getDasSignal(zone, options = {}, verbose) {
    request.get({
        url: backendUrl + '/api/1.0/signals/pid/' + pid + '/zoneId/' + zone,
        headers: headers,
        json: true
    }, (error, response) => {
        // g.log('verbose', `Das Get Zone: ${ zone }`, verbose);
        // OK
        if (response && response.statusCode == 200) {
            // g.log('dump', response.body, verbose);
        }
        // OK from API response
        if(response && response.statusCode != 200) {
            // g.log('dump', response.body, verbose);
        }
        // OK
        if (error) {
            console.error(error);
        }
    });
}
function removeDasSignal(zone, options = {}, verbose) {
    request.delete({
        url: backendUrl + '/api/1.0/signals/pid/' + pid + '/zoneId/' + zone,
        headers: headers,
        json: true
    }, (error, response) => {
        // g.log('verbose', `Das Deleted Zone: ${ zone }`, verbose);
        // OK
        if (response && response.statusCode == 200) {
            // g.log('dump', response.body, verbose);
        }
        // OK from API response
        if(response && response.statusCode != 200) {
            // g.log('dump', response.body, verbose);
        }
        // OK
        if (error) {
            console.error(error);
        }
    });
}
function sendDasSignals(signals, options = {}, verbose) {
    if (localConfig.das.enabled) {
        if (signals) {
            signals.forEach((signal) => {
                request.post({
                    url: backendUrl + '/api/1.0/signals',
                    headers: headers,
                    body: signal,
                    json: true
                }, (error, response) => {
                    // g.log('verbose', `Das Sent Signal to Zone: ${ signal.zoneId }`, verbose);
                    // OK
                    if (response && response.statusCode == 200) {
                        // g.log('dump', response.body, verbose);
                    }
                    // OK from API response
                    if(response && response.statusCode != 200) {
                        // g.log('dump', response.body, verbose);
                    }
                    // OK
                    if (error) {
                        console.error(error);
                    }
                });
            });
        }
    }
}

// animations
function highlight(zone, color, title, verbose) {
    let signals = [];

    signals.push({
        'zoneId': zone,
        'color': color,
        'effect': 'BLINK',
        'pid': 'DK5QPID',
        'clientName': 'Node script',
        'name': title,
    });

    sendDasSignals(signals, null, verbose);
}
function rainbow(zone, color, title, verbose) {
    let signals = [];

    signals.push({
        'zoneId': zone,
        'color': color,
        'effect': 'COLOR_CYCLE',
        'pid': 'DK5QPID',
        'clientName': 'Node script',
        'name': title,
    });

    sendDasSignals(signals, null, verbose);
}