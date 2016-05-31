
var _ = require('lodash');

var chai = require('chai');

var assert = chai.assert;

var should = chai.should();

var plugin, comic, chapter;







describe('Manga Eden plugin', function() {


  it('should start without errors', function() {

    // just try to load plugin
    plugin = require('../libs/plugin');

  });


  describe('#searchComics', function() {

    // set timeout to 30 seconds
    this.timeout(30 * 1000);

    it('should find comics', function(done) {

      // title matching function
      var matchTitle = function(title) {
        return title === 'one-piece';
      };

      // requested language
      var language = 'it';

      // found comic callback
      var onComic = function(data) {

        // perform tests
        assert.equal(data.author, 'ODA Eiichiro');
        assert.equal(data.url, 'http://www.mangaeden.com/it/it-manga/one-piece/');

        // save comic data globally
        comic = data;

      };

      // start plugin API
      plugin.searchComics(matchTitle, language, onComic, done);

    });

  });


  describe('#loadChapters', function() {

    // set timeout to 30 seconds
    this.timeout(30 * 1000);

    it('should load comic\'s chapters', function(done) {

      // all loaded chapters array
      var chapters = [];

      // launch plugin API
      plugin.loadChapters(comic, chapters.push.bind(chapters), function(err) {

        // notify error
        if (err) return done(err);

        // ensure chapters number
        assert.isAtLeast(chapters.length, 1261);

        // save last chapter globally
        chapter = _.maxBy(chapters, 'number');

        // calculate url
        var url = _.template('http://www.mangaeden.com/<%=language%>/<%=language%>-manga/one-piece/<%=number%>/1/')(chapter);

        // ensure correct data
        assert.equal(chapter.url, url);

        // test end
        done();

      });

    });

  });


  // TODO #loadPages test


});
