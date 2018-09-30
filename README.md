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

## getting-started

1. install latest version of [nodeJS](https://nodejs.org/)
2. clone or download this repository
3. create a file named `cred.txt`
4. insert credentials
    1. `your_email@mail.com;your_password`
5. edit `main.js`
6. `$ npm start`



## features

just an overview with an example and the function signature for all features.  
for details check each chapter.

```typescript
kingbot.start_farming([ 'Startup farm list', 'rocking farms' ], '-02- Rome', 600);
async function start_farming(farmlists: string[], village: string, interval: number);
```

you can stack each feature as often as you wish with different parameters.

### send farmlists

the bot will simply just send the farmlists out of the named village in a given interval.

```typescript
kingbot.start_farming([ 'Startup farm list', 'rocking farms' ], '-02- Rome', 600);
```

**farmlists:** _(non case-sensitiv)_  
names of the farmlists which should be send together

**village:** _(non case-sensitiv)_  
name of the village from where the lists are going to be send

**interval:**  
interval of sending the lists _in seconds_

## development

start a local server which logs into the gameworld, stays logged in, and forwards your request.  
this is for faster testing since you don't always have to do the login handshake.  
paste in the correct gameworld in `dev_server.js`.

```bash
$ npm run server
```  

write your test script in `dev_main.js`.  
remember: you don't have to login anymore !  

```bash
$ npm run dev
```

you can also create a file names `cred.txt` in the root folder which contains your login credentials:
```csv
your_email@mail.com;your_password
```
this file will be ignored by git so you don't have to be scared to accidentally commit your credentials.

---

_we love lowercase_
