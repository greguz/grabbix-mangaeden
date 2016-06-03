// get lodash
var _ = require('lodash');

// get package.json
var pkg = require('../package');

// get base data from package
var plugin = _.pick(pkg, 'description', 'author');

// add custom data from package
plugin = _.extend(plugin, pkg.grabbix);

// add plugin ID
plugin.id = pkg.name;

// add plugin's API
plugin = _.extend(plugin, {
  searchByTitle: require('../api/searchByTitle'),
  loadChapters: require('../api/loadChapters'),
  loadPages: require('../api/loadPages')
});

// export plugin
module.exports = plugin;
