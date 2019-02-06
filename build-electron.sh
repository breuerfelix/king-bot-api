#!/bin/bash
./node_modules/.bin/electron-packager --overwrite --electron-version=4.0.3 --arch=x64,ia32 --platform=darwin,linux,win32 --ignore=assets/ .
./node_modules/.bin/electron-installer-dmg --overwrite ./king-bot-api-darwin-x64/king-bot-api.app KingBotApi
