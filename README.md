# bassdrive-archive-spider

## Installation

```shell
npm i bassdrive-archive-spider
```

## Usage

```javascript
const bassdriveSpider = require("bassdrive-archive-spider")({
  // Default options
  onError: undefined,
});

// Get all the archives!
bassdriveSpider().then(([siteMap, allMp3s]) => {
  console.log(
    siteMap.paths["/1%20-%20Monday/"].paths["Monday%20Night%20Live%20-%20BMK/"]
  );
  console.log(allMp3s.slice(0, 20));
});
```

The `Mp3` objects in `siteMap` and `allMp3s` are defined in [Mp3.ts](Mp3.ts)
and look like:

```javascript
{
  url: 'http://archives.bassdrivearchive.com/1%20-%20Monday/Translation%20Sound%20-%20Rogue%20State/%5b2016.02.08%5d%20Translation%20Sound%20-%20Rogue%20State.mp3',
  filename: '[2016.02.08] Translation Sound - Rogue State.mp3',
  date: moment("2016-02-08T00:00:00.000"),
  show: 'Translation Sound',
  artist: 'Rogue State' },
}
```

All the fields are scraped from the `url` with simple Regexps and may not be
accurate. Only the `url` and `filename` properties are guaranteed, but the
naming conventions are simple enough that most files will have all properties
populated.

### Options

**`onError`**

Type: `Function|Falsey`

Default: `undefined`

`onError` is an error handler used during the spidering process. If a page
fails to load, or if links are incorrectly parsed, this will fire. To ignore
the error, simply return an empty array. To elevate the error, return a
rejected promise. By default errors are ignored.

```javascript
// Log errors to console and continue
function onError(err) {
  console.error(err);
  return [];
}

// Stop everything on error
function onError(err) {
  return Promise.reject(err);
}
```
