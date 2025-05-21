import { builtinModules } from "module";
import { join } from "path";

/**
 * @type {import("puppeteer").Configuration}
 */
module.exports = {
  //Changed the cache Location for Puppeteer.
  cacheDirectory: join(__dirname, '.cache', "puppeteer"),
};