# firefox-command-palette
An extension for Firefox that introduces a 'Command Palette' like in VSCode

## Usage
Use the shortcut 'Ctrl + Alt + P' to open the Command Palette.

All of your bookmarklets should be supported as custom actions.

## Build steps
* Prerequisites: Nodejs v22.14.0, npm 10.9.2
* Built on Linux (Ubuntu 24.04), should work on Windows on Mac as well
* Run `npm install` to install node dependencies
* Run `npm run build` to build the project into the 'dist' folder
* Run `cd dist` to change directory to the 'dist' folder
* Run `npx web-ext build` to build the actual extension zip