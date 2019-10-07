const PLACEHOLDER_FOR_SCRIPTS = /<!-- Add js below -->.*<!-- Add js above -->/s;
const SCRIPT_REGEX = /<div id="root"><\/div>(.*)<\/body>/;

const builtFilePath = './build/index.html';
const appFilePath = './app/round_robin_settings.html';
const fs = require('fs');

const htmlData = fs.readFileSync(builtFilePath).toString();
const appHTML = fs.readFileSync(appFilePath).toString();

const matches = htmlData.match(SCRIPT_REGEX);
const processedScript = matches[1].replace(/\/static/g, 'static');

const processedAppHTML = appHTML.replace(PLACEHOLDER_FOR_SCRIPTS, `
  <!-- Add js below -->
  ${processedScript}
  <!-- Add js above -->
`)

fs.writeFileSync(appFilePath, processedAppHTML);
