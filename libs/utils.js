/**
 * dependencies
 */

var _           = require('lodash'),
    Promise     = require('bluebird'),
    cheerio     = require('cheerio'),
    superagent  = require('superagent');


/**
 * do ajax request
 *
 * @param {String} url                  target url
 * @param {Object} [options]
 * @param {String} [options.method]     request method, default 'GET'
 * @param {Object} [options.headers]    custom request headers
 * @param {String} [options.dataType]   'text', 'json', 'binary' or 'html', default 'text'
 * @param {Object} [options.data]
 * @return {Promise}
 */

var ajax = function(url, options) { // TODO split/simplify this function

  // set default options
  options = _.defaults(options, {

    // request method
    method: 'GET',

    // expected response type
    dataType: 'text',

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

  // requests json response
  if (options.dataType === 'json') agent.accept('json');

  // if binary request add parsing middleware
  if (options.dataType === 'binary') agent.parse(function(res, callback) {

    // set encoding
    res.setEncoding('binary');

    // set initial data
    res.data = '';

    // listen for incoming data
    res.on('data', function (chunk) {
      res.data += chunk;
    });

    // listen for request end
    res.on('end', function () {
      callback(null, new Buffer(res.data, 'binary'));
    });

  });

  // return new promise
  return new Promise(function(resolve, reject) {

    // send request
    agent.end(function(err, res) {

      // reject promise on error
      if (err) return reject(err);

      // response
      var body = res.body;

      // parse response (options.dataType)
      if (options.dataType === 'json') {

        // parse JSON
        if (_.isString(body)) body = JSON.parse(body);

      } else if (options.dataType === 'html') {

        // instance cheerio (like jQuery)
        body = cheerio.load(res.text);

      } else if (options.dataType === 'binary') {

        // get response buffer
        body = res.data;

      }

      // resolve promise
      resolve(body);

    });

  });

};


/**
 * exports
 */

module.exports = {
  ajax: ajax
};
