# king-bot-api <!-- omit in toc -->

this is an advanced bot, since it's only using api calls.

[![MIT license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/scriptworld-git/king-bot/blob/master/LICENSE)

# table of contents <!-- omit in toc -->

- [getting-started](#getting-started)
- [development](#development)

## getting-started

1. create a file named `cred.txt`
2. insert credentials
    1. `your_email@mail.com;your_password`
3. edit `main.js`
4. `$ npm start`

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

---

_we love lowercase_
