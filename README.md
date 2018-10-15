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
    - [upgrade resource fields](#upgrade-resource-fields)
    - [finish 5 min earlier](#finish-5-min-earlier)
- [development](#development)

# getting-started

1. install latest version of [nodeJS](https://nodejs.org/)
2. clone or download this repository
3. open project in console
4. install all dependencies
    1. `$ npm install`
5. edit `main.js`
    1. look up `sample_main.js` for help
6. start the bot
    1. `$ npm start`


# features

just an overview with an example and the function signature for all features.  
for details check each chapter.

```typescript
kingbot.start_farming([ 'startup farm list', 'rocking farms' ], '-02- rome', 600);
async function start_farming(farmlists: string[], village: string, interval: number);
```

you can stack each feature as often as you wish with different parameters.

## send farmlists

the bot will simply just send the farmlists out of the named village in a given interval.

```typescript
kingbot.start_farming([ 'startup farm list', 'rocking farms' ], '-02- rome', 600);
```

**farmlists:** _(non case-sensitiv)_  
names of the farmlists which should be send together

**village:** _(non case-sensitiv)_  
name of the village from where the lists are going to be send

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

when the bot has to upgrade crop and iron fields in this example it will always try to upgrade the type with the lowest production per hour.  
crop production will be count * 2 since its not as important as the other resource types.

when all crop and iron level requirements are done, it will go on the with the next queue statement you wrote with the same village.  
it is able to handle multiple qeueues each village.

this feature is made if you settled a new village so you can specify how you want the fields to be build and just let the bot handle all of that stuff.

## finish 5 min earlier

as you might already now, it's possible to upgrade a buidling or resource 5 minutes earlier for free.

```typescript
kingbot.finish_earlier();
```

this will auto finish building or resource fields below 5 minutes rest time.  
it will scan you queue every minute and wake up one second after the five minute line is crossed to finish it instantly.

# development

you can also create a file names `cred.txt` in the root folder which contains your login credentials:
```csv
your_email@mail.com;your_password
```
this file will be ignored by git so you don't have to be scared to accidentally commit your credentials.

---

_we love lowercase_
