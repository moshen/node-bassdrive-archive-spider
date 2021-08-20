import moment from "moment";
const mp3Regex = /\[([0-9]{4}\.[0-9]{2}\.[0-9]{2})\]\s+(.+)\s+-\s+(.+)\.mp3/;
const dateRegex = /[0-9]{4}\.[0-9]{2}\.[0-9]{2}/;
const datePattern = "YYYY.MM.DD";

export interface IMp3 {
  readonly url: string;
  readonly filename: string;
  readonly date: moment.Moment | null;
  readonly show?: string;
  readonly artist?: string;
}

export default class Mp3 implements IMp3 {
  static create(url: string): Mp3 {
    return new Mp3(url);
  }

  readonly url: string;
  readonly filename: string;
  readonly date: moment.Moment | null;
  readonly show?: string;
  readonly artist?: string;

  constructor(url: string) {
    this.url = url;
    const splitMp3 = decodeURIComponent(url).split("/");
    const filename = splitMp3[splitMp3.length - 1] || "";
    const mp3Match = filename.match(mp3Regex);

    this.filename = filename;

    if (mp3Match !== null && mp3Match[1] && mp3Match[2] && mp3Match[3]) {
      this.date = moment(mp3Match[1], datePattern);
      this.show = mp3Match[2];
      this.artist = mp3Match[3];
    } else {
      let filedate = filename.match(dateRegex);
      this.date = filedate === null ? null : moment(filedate[0], datePattern);
    }
  }

  // You typically don't want to be calling any of these methods, they're
  // mostly for debugging
  toString(): string {
    return JSON.stringify(this.valueOf());
  }

  toJSONString(): string {
    return this.toString();
  }

  valueOf(): IMp3 {
    return {
      url: this.url,
      filename: this.filename,
      date: this.date,
      show: this.show,
      artist: this.artist,
    };
  }
}
