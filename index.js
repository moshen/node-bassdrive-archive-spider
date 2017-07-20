var Spider = require('./Spider');

module.exports = function configure(options) {
  var spidey = Spider.create(options);
  return spidey.forMp3s.bind(spidey, 'http://archives.bassdrivearchive.com');
};
