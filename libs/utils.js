/**
 * dependencies
 */

var _           = require('lodash'),
    Promise     = require('bluebird'),
    cheerio     = require('cheerio'),
    superagent  = require('superagent');


/**
 * create a configured agent
 *
 * @param {String} url                      url to request
 * @param {Object} [options]
 * @param {String} [options.method='GET']   request method
 * @param {Object} [options.headers]        request headers as raw object
 * @return {*}                              superagent instance
 */

var createAgent = function(url, options) {

  // set default options
  options = _.defaults(options, {

    // request method
    method: 'GET',

    // custom request headers
    headers: {
      'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/47.0.2526.73 Safari/537.36'
    }

  });

  // ensure method upper cased
  options.method = options.method.toUpperCase();

  // create agent
  var agent = superagent(options.method, url);

  // set request headers
  agent.set(options.headers);

  // return configured agent
  return agent;

};


/**
 * execute agent request as promise
 *
 * @param {*} agent     superagent instance
 * @return {Promise}
 */

var launchAgent = function(agent) {

  // return new promise
  return new Promise(function(resolve, reject) {

    // send request
    agent.end(function(err, res) {

      // reject promise on error
      if (err) {
        reject(err);
      } else {
        resolve(res);
      }

    });

  });

};


/**
 * perform JSON request
 *
 * @return {Promise}
 */

var getJSON = function(url, options) {

  // get base-configured agent
  var agent = createAgent(url, options);

  // add JSON request config
  agent.accept('json');

  // execute request
  return launchAgent(agent).then(function(res) {

    // get response body
    var body = res.body;

    // ensure parsed JSON object
    if (_.isString(body)) body = JSON.parse(body);

    // return parsed response body
    return body;

  });

};


/**
 * get and parse HTML page with cheerio
 *
 * @return {Promise}
 */

var getDOM = function(url, options) {

  // get base-configured agent
  var agent = createAgent(url, options);

  // execute request
  return launchAgent(agent).then(function(res) {

    // return cheerio instance
    return cheerio.load(res.text);

  });

};


/**
 * exports
 */

module.exports = {
  createAgent: createAgent,
  launchAgent: launchAgent,
  getJSON: getJSON,
  getDOM: getDOM
};
