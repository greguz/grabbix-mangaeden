/**
 * dependencies
 */

var _       = require('lodash'),
    moment  = require('moment'),
    utils   = require('../libs/utils');


/**
 * TODO write docs
 *
 * @param {Object} comic    comic data (from #searchComics)
 * @param {Function} add    new chapter found callback
 * @param {Function} done   process end callback
 */

var loadChapters = function(comic, add, done) {

  utils.ajax(comic.url, { dataType: 'html' }).then(function($) {

    $('tr').each(function() {

      var $tr = $(this);

      var link = $tr.find('a.chapterLink');

      if (link.length <= 0) return;

      var url = link.attr('href');

      var number = url.split('/')[4];

      var title = $tr.find('b').text();

      if (_.startsWith(title, number)) {
        title = title.substr(number.length).trim();
      }

      if (_.startsWith(title, ':')) {
        title = title.substr(1).trim();
      }

      add({
        language  : comic.language,
        title     : title,
        number    : parseFloat(number),
        group     : $tr.find('td.hideM0').find('a').text(),
        url       : 'http://www.mangaeden.com' + url,
        added     : moment($tr.find('td.chapterDate').html(), 'MMM D, YYYY').toDate()
      });

    });

  }).then(function() {

    done();

  }).catch(function(err) {

    done(err);

  });

};


/**
 * exports
 */

module.exports = loadChapters;
