var moment = require('moment'),
    mp3Regex = /\[([0-9]{4}\.[0-9]{2}\.[0-9]{2})\]\s+(.+)\s+-\s+(.+)\.mp3/,
    dateRegex = /[0-9]{4}\.[0-9]{2}\.[0-9]{2}/,
    datePattern = 'YYYY.MM.DD';

module.exports = class Mp3 {
  static create(url) {
    return new Mp3(url);
  }

  constructor(url) {
    this.url = url;
    var splitMp3 = decodeURIComponent(url).split('/'),
        filename = splitMp3[splitMp3.length-1],
        mp3Match = filename.match(mp3Regex);

    this.filename = filename;

    if (mp3Match !== null && mp3Match[1] && mp3Match[2] && mp3Match[3]) {
      this.date = moment(mp3Match[1], datePattern);
      this.show = mp3Match[2];
      this.artist = mp3Match[3];
    } else {
      let filedate = filename.match(dateRegex);
      this.date = filedate === null ? null :
        moment(filedate[0], datePattern);
    }
  }

  // You typically don't want to be calling any of these methods, they're
  // mostly for debugging
  toString() {
    return JSON.stringify(this.valueOf());
  }

  toJSONString() {
    return this.toString();
  }

  valueOf() {
    return Object.keys(this).reduce((memo, key) => (memo[key] = this[key]) && memo, {});
  }
}
