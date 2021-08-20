import Mp3 from "./Mp3";
import { SiteMap, Spider, SpiderOptions } from "./Spider";

module.exports = function configure(
  options: SpiderOptions
): () => Promise<[SiteMap, Mp3[]]> {
  const spidey = Spider.create(options);
  return spidey.forMp3s.bind(spidey, "http://archives.bassdrivearchive.com");
};
