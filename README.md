# king-bot-api <!-- omit in toc -->

this is a really high performance based bot for [travian kingdoms](https://www.kingdoms.com/) written in typescript.  
it's designed to run in a console for better server support.

feel free to join the [official discord channel](https://discord.gg/5n2btF7) or **[contact me! (:](mailto:f.breuer@scriptworld.net)**

you want to run the bot **24/7**, but don't want to use your computer? **[contact me aswell! (:](mailto:f.breuer@scriptworld.net)**

[![ko-fi](https://img.shields.io/badge/buy%20me%20a-coffee-yellowgreen.svg)](https://ko-fi.com/Y8Y6KZHJ)
[![Build Status](https://travis-ci.org/scriptworld-git/king-bot-api.svg?branch=master)](https://travis-ci.org/scriptworld-git/king-bot-api)
[![MIT license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/scriptworld-git/king-bot/blob/master/LICENSE)

# table of contents <!-- omit in toc -->

- [getting-started](#getting-started)
- [features](#features)
    - [send farmlists](#send-farmlists)
    - [upgrade resource fields](#upgrade-resource-fields)
    - [finish 5 min earlier](#finish-5-min-earlier)
    - [easy scout](#easy-scout)
    - [auto adventure](#auto-adventure)
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

after changing `main.js` only use `$ npm start` to restart the bot.  
when downloading a new project version you have to `$ npm install && npm run build` again before starting the bot.

# features

just an overview with an example and the function signature for all features.  
for details check each chapter.

```typescript
kingbot.start_farming([ 'startup farm list', 'rocking farms' ], '-02- rome', 600);
async function start_farming(farmlists: string[], village: string | string[], interval: number);

kingbot.add_building_queue({ crop: [4, 4, 3], iron: [5] }, '-01-');
async add_building_queue(resources: Iresource_type, village: string);

kingbot.finish_earlier();

kingbot.auto_adventure();

kingbot.scout('scout', '-01-', 1);
async scout(farmlist_name: string, village_name: string, amount: number = 1);
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

## upgrade resource fields

with this feature you are able to build up a queue for your resource fields in a village.  
this queue can be stacked up unlimited and be as detailed as you wish.

```typescript
kingbot.add_building_queue({ crop: [4, 4, 3], iron: [5] }, '-01-');
kingbot.add_building_queue({ crop: [6, 5, 5, 4], clay: [5, 4] }, '-01-');
kingbot.add_building_queue({ clay: [10, 6], wood: [7], iron: [6] }, '-01-');
kingbot.add_building_queue({ clay: [6], wood: [7], iron: [6], crop: [10, 7, 7, 5] }, '-01-');
```

**object:**  
queue object, explained below

**village:** _(non case-sensitiv)_  
name of the village where to apply the queue

all 4 resource types are available to use: `crop, iron, clay, wood`.  
they all take an array of numbers as a value.  
our example will be `kingbot.add_building_queue({ crop: [4, 4, 3], iron: [5] }, '-01-');`:  
the bot will upgrade __all__ crop fields to lvl 3 since its the lowest number in the array.  
it will also upgrade __all__ iron fields to lvl 5.  
after upgrading the crop and iron fields it will upgrade 2 crop fields to level 4 before jumping to your next `add_building_queue` statement.

when the bot has to upgrade crop and iron fields in this example it will always try to upgrade the type with the lowest storage percentage.  
crop production will be added 25 % since it's not as important as the other resource types.

when all crop and iron level requirements are done, it will go on the with the next queue statement you wrote with the same village.  
it is able to handle multiple qeueues each village.

this feature is made if you settled a new village so you can specify how you want the fields to be build and just let the bot handle all of that stuff.

## finish 5 min earlier

as you might already now, it's possible to upgrade a buidling or resource field 5 minutes earlier for free.

```typescript
kingbot.finish_earlier();
```

this will auto finish building or resource fields below 5 minutes rest time.  
it will scan your queue every minute and wake up one second after the five minute line is crossed to finish it instantly.

## easy scout

sometimes there are some bigger farms, you can't put into a farmlist, so you scout them during the day and send a little army to clear them.  
this feature allows you to store all of these farms into a farmlist and the bot will send a given amount of scouts to this village when executed.

the following command with send the scouts once.

```bash
$ npm run scout
```

```typescript
kingbot.scout('scout', '-01-', 1);
```

**farmlist:** _(non case-sensitiv)_  
names of the farmlist with all scout farms

**village:** _(non case-sensitiv)_  
name of the village from where the scouts are going to be send

**amount:** _(optional)_  
amount of scouts being send per list
default value is 1

## auto adventure

**special thanks [@Tom-Boyd](https://github.com/Tom-Boyd)**

this feature will just send your hero on an adventure if available.

```typescript
kingbot.auto_adventure(adventure_type.short, 35);
```

**adventure type:**  
`adventure_type.short` or `adventure_type.long`

**health:** _(optional)_  
default is 15  
required amount of health _in percent_ for the hero to be send on a adventure

# development

you can also create a file names `cred.txt` in the root folder which contains your login credentials:
```csv
your_email@mail.com;your_password;your_gameworld
```
this file will be ignored by git so you don't have to be scared to accidentally commit your credentials.

create a file names `own_main.js` which is going to be ignore by git, you can modify it as you wish, without pushing your custom feature set to github.

---

_we love lowercase_
