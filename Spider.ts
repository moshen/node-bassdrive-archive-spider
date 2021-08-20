import request from "request";
import libxml from "libxmljs";
import Mp3 from "./Mp3";

export interface SpiderOptions {
  onError?: (err: Error) => Promise<[]>;
}

export interface SiteMap {
  root: string;
  mp3s: Mp3[];
  paths: SiteMapPaths;
}

export interface SiteMapPaths {
  [prop: string]: SiteMap;
}

export class Spider {
  static create(options: SpiderOptions) {
    return new Spider(options);
  }

  options: SpiderOptions;

  constructor(options: SpiderOptions = {}) {
    this.options = options;
  }

  private _doGet(url: string): Promise<string> {
    return new Promise((resolve, reject) => {
      request({ method: "GET", uri: url }, (err, res, body: string) => {
        if (err) {
          reject(err);
          return;
        }

        if (res.statusCode !== 200) {
          reject("Request Failed: " + url + " - " + res.statusCode);
          return;
        }

        resolve(body);
      });
    });
  }

  async getLinks(url: string): Promise<string[]> {
    try {
      const body = await this._doGet(url);
      return libxml
        .parseHtmlString(body)
        .find("//a")
        .map((v) => v.attr("href")?.value())
        .filter(
          (v_1) =>
            v_1 !== null &&
            v_1 !== undefined &&
            v_1 !== "/" &&
            v_1.slice(0, 4) !== "http" &&
            url.indexOf(v_1) < 0
        ) as string[];
    } catch (err) {
      if (this.options.onError) {
        return this.options.onError(err);
      }
      return [];
    }
  }

  async forMp3s(
    url: string,
    siteMap: SiteMap = { root: "", mp3s: [], paths: {} },
    allMp3s: Mp3[] = []
  ): Promise<[SiteMap, Mp3[]]> {
    siteMap.root = url;
    const parts = await this.getLinks(url);
    await Promise.all(
      parts.map((part) => {
        if (part.slice(part.length - 4) === ".mp3") {
          const mp3 = Mp3.create(url + part);
          siteMap.mp3s.push(mp3);
          allMp3s.push(mp3);
          return [siteMap, allMp3s];
        } else {
          const newMap: SiteMap = { root: "", mp3s: [], paths: {} };
          siteMap.paths[part] = newMap;
          return new Promise((resolve) =>
            setTimeout(
              () => resolve(this.forMp3s(url + part, newMap, allMp3s)),
              0
            )
          );
        }
      })
    );
    return [siteMap, allMp3s];
  }
}
