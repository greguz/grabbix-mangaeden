/**
 * dependencies
 */

var _       = require('lodash'),
    Promise = require('bluebird'),
    utils   = require('../libs/utils');


/**
 * global vars
 */

var cache = {};


/**
 * fetch and cache the complete list of available manga
 *
 * @param {String} [language]   language, default 'en'
 * @return {Promise}
 */

var loadMangaList = function(language) {

  // ensure language
  language = language || 'en';

  // if cached return
  if (cache[ language ]) return Promise.resolve(cache[ language ]);

  // set invalidate cache timeout
  setInterval(function() {

    // invalidate cache
    delete cache[ language ];

  }, 60 * 60 * 1000); // 1h

  // get language ID
  var langID = language === 'it' ? 1 : 0;

  // api url (see mangaeden docs)
  var api = 'https://www.mangaeden.com/api/list/' + langID + '/';

  // launch web request
  return utils.getJSON(api).then(function(data) {

    // save result to cache
    cache[ language ] = _.get(data, 'manga') || [];

    // return cached data
    return cache[ language ];

  });

};


/**
 * load manga data from website url
 *
 * @param {String} url
 * @return {Promise}
 */

var loadManga = function(url) {

  // get manga's page HTML
  return utils.getDOM(url).then(function($) {

    var author, artist;

    // get author and artist from description box on page's right
    $('.rightBox a').each(function() {
      var $a = $(this);

      if ($a.attr('href').indexOf('?author=') >= 0) {
        author = $a.text();
      } else if ($a.attr('href').indexOf('?artist=') >= 0) {
        artist = $a.text();
      }
    });

    // return data
    return {
      author      : author,
      artist      : artist,
      url         : url,
      language    : url.indexOf('/it-manga/') >= 0 ? 'it' : 'en',
      title       : $('.manga-title').text(),
      description : $('#mangaDescription').text(),
      thumbnail   : 'http:' + $('div.mangaImage2 img').attr('src')
    };

  });

};


/**
 * start plugin-specific code to search comics
 *
 * @param {Function} match    matching function for comic's title
 * @param {String} language   requested language
 * @param {Function} add      function to invoke with comic's attributes
 * @param {Function} done     function to invoke at the end of searching process
 */

var searchComics = function(match, language, add, done) {

  // ensure language
  language = language || 'en';

  // manga page url's template
  var template = _.template('http://www.mangaeden.com/<%= language %>/<%= language %>-manga/<%= title %>/');

  // load manga list
  return loadMangaList(language).map(function(manga) {

    // check if this manga has at least one chapter
    if (!manga.ld) return;

    // match searched title with manga title
    if (!match(manga.a)) return;

    // get target url
    var url = template({
      language: language,
      title: manga.a
    });

    // load manga data
    return loadManga(url).then(add);

  }, {

    // set max mapped promises concurrency
    concurrency: 3

  }).then(function() {

    // on success
    done();

  }).catch(function(err) {

    // on error
    done(err);

  });

};


/**
 * exports
 */

module.exports = searchComics;
