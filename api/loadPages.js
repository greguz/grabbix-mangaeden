/**
 * dependencies
 */

var utils = require('../libs/utils');


/**
 * TODO write docs
 *
 * @param {Object} chapter    chapter data
 * @param {Function} add      add page callback
 * @param {Function} done     process end callback
 */

var loadPages = function(chapter, add, done) {

  return utils.getDOM(chapter.url).then(function($) {

    return $('select#pageSelect option').map(function() {
      return 'http://www.mangaeden.com' + $(this).attr('value');
    }).get();

  }).map(function(url) {

    return utils.getDOM(url).then(function($) {

      var data = url.split('/');

      add({
        number: parseInt(data[7], 10),
        url: 'http:' + $('img#mainImg').attr('src')
      });

    });

  }, {

    concurrency: 3

  }).then(function() {

    done();

  }).catch(function(err) {

    done(err);

  });

};


/**
 * exports
 */

module.exports = loadPages;
