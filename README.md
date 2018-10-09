# king-bot-api <!-- omit in toc -->

this is a really high performance based bot for [travian kingdoms](https://www.kingdoms.com/) written in javascript.  
it's designed to run in a console for better server support.

feel free to join the [official discord channel](https://discord.gg/5n2btF7) or **[contact me! (:](mailto:f.breuer@scriptworld.net)**

you want to run the bot **24/7**, but don't want to use your computer? **[contact me aswell! (:](mailto:f.breuer@scriptworld.net)**

[![MIT license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/scriptworld-git/king-bot/blob/master/LICENSE)

# table of contents <!-- omit in toc -->

- [getting-started](#getting-started)
- [features](#features)
    - [send farmlists](#send-farmlists)
- [development](#development)

# getting-started

1. install latest version of [nodeJS](https://nodejs.org/)
2. clone or download this repository
3. open project in console
4. install all dependencies
    1. `$ npm install`
1. build the project
    1. `$ npm run build`
5. edit `main.js`
    1. look up `sample_main.js` for help
6. start the bot
    1. `$ npm start`

after changing `main.js` you can exit the script and then restart the bot with `$ npm start`.  
if you downloaded a new project version you have to `$ npm install && npm run build` again before starting the bot.

# features

just an overview with an example and the function signature for all features.  
for details check each chapter.

```typescript
kingbot.start_farming([ 'startup farm list', 'rocking farms' ], '-02- rome', 600);
async function start_farming(farmlists: string[], village: string | string[], interval: number);
```

you can stack each feature as often as you wish with different parameters.

## send farmlists

the bot will simply just send the farmlists out of the named village in a given interval.

```typescript
kingbot.start_farming([ 'startup farm list', 'rocking farms' ], '-02- rome', 600);
kingbot.start_farming([ 'startup farm list', 'rocking farms' ], [ '-02- rome', '-03- paris' ], 600);
```

**farmlists:** _(non case-sensitiv)_  
names of the farmlists which should be send together

**village:** _(non case-sensitiv)_  
name of the village from where the lists are going to be send  
could also be an array of villages if you need same lists in same interval for different villages

**interval:**  
interval of sending the lists _in seconds_

# development

you can also create a file names `cred.txt` in the root folder which contains your login credentials:
```csv
your_email@mail.com;your_password
```
this file will be ignored by git so you don't have to be scared to accidentally commit your credentials.

---

_we love lowercase_
