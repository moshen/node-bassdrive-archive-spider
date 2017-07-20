var request = require('request'),
    libxml = require('libxmljs'),
    Mp3 = require('./Mp3');

module.exports = class Spider {
  static create(options) {
    return new Spider(options);
  }

  constructor(options = {}) {
    this.options = options;
  }

  _doGet(url) {
    return new Promise((resolve, reject) => {
      request({method: 'GET', uri: url}, (err, res, body) => {
        if (err) {
          reject(err);
          return;
        }

        if (res.statusCode !== 200) {
          reject('Request Failed: ' + url + ' - ' + res.statusCode);
          return;
        }

        resolve(body);
      });
    });
  }

  getLinks(url) {
    return this._doGet(url)
    .then(body => libxml.parseHtmlString(body).find('//a')
      .map(v => v.attr('href') && v.attr('href').value())
      .filter(v => v !== null && v !== '/' && v.slice(0,4) !== 'http' && url.indexOf(v) < 0)
    )
    .catch(err => {
      if (this.options.onError) {
        return this.options.onError(err);
      }

      return [];
    });
  }

  forMp3s(url, siteMap = {}, allMp3s = []) {
    siteMap.root = url;
    return this.getLinks(url)
    .then(parts => Promise.all(parts.map(part => {
      if (part.slice(part.length-4) === '.mp3') {
        if (!Array.isArray(siteMap.mp3s)) {
          siteMap.mp3s = [];
        }

        let mp3 = Mp3.create(url + part);
        siteMap.mp3s.push(mp3);
        allMp3s.push(mp3);
        return [siteMap, allMp3s];
      } else {
        let newMap = {};
        siteMap[part] = newMap;
        return new Promise(resolve => setTimeout(() => resolve(this.forMp3s(url + part, newMap, allMp3s)), 0));
      }
    })))
    .then(() => [siteMap, allMp3s]);
  }
};
