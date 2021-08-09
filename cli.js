#!/usr/bin/env node
const fs = require("fs");
const path = require("path");
const { getRootDir, getSidebar } = require("./common");

let baseOption = undefined;

(function() {
  // 参数为指定的文档父文件夹，如不指定，就默认从cwd 开始遍历
  const argv = process.argv;
  let dir = [];
  if (argv.length > 2) {
    dir = argv.slice(2);
  }
  let sidebar = getSidebar(process.cwd(), dir);
  rewriteConfig(sidebar);
  console.log("config rewriting completed...");
})();

function rewriteConfig(sidebar) {
  let config = require(path.join(getRootDir(), "/.vuepress/config.js"));
  config.themeConfig.sidebar = sidebar;
  let content = getConfigFileContent();
  let match = content.match(/(?<=themeConfig: )(.(.|\r\n|\r|\n)*)/);
  let output = JSON.stringify(config.themeConfig, null, 4);
  let newContent = content.substring(0, match.index) + output + "\r\n}";
  fs.writeFileSync(path.join(getRootDir(), "/.vuepress/config.js"), newContent);
}

function getConfigFileContent() {
  let configFile = path.join(getRootDir(), "/.vuepress/config.js");
  return fs.readFileSync(configFile, "utf8");
}
