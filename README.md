# Robinhood on desktop

![StockStalk](https://media.giphy.com/media/cRMNl8P3mt4OFL8Sxm/giphy.gif)

Free and open source Robinhood desktop version.  
Built on top of Electron and React, allows you to build a version for Mac, Windows and Linux.  
🤘[Join our Slack channel](https://join.slack.com/t/stockstalkapp/shared_invite/enQtMzI1NzcwNDA0MTkyLWI1MGZmMDI3Yjk5YzRhZDQ5NDM1ZjVmNmUyOTQxMDFkMGE1MGQ1ZjE4MWY5YWNjMDFhZjllNzM1NjdlYWQwYmE)🤘

# Downloads

[Download Robinhood for Mac](https://stockstalk.club/robinhood-mac).  
[Download Robinhood for Windows](https://www.stockstalk.club/robinhood-windows).  
[Download Robinhood for Linux](https://www.stockstalk.club/robinhood-linux).  

## Stack

Built on top of electron to support mac, windows and linux. The front is written using React frameworks. 
The state is managed by mobX.  

## Install
- Make sure you have electron and react istalled first.  
- You will also need to create a firebase file account under `src/helpers/firebase.js` with this code (make sure to insert your credentials):  
```js
const firebase = window.firebase;
const config = {
  apiKey: "",
  authDomain: "",
  databaseURL: "",
  projectId: "",
  storageBucket: "",
  messagingSenderId: ""
} 

firebase.initializeApp(config);
const db = firebase.firestore();
const auth = firebase.auth();
 
export { auth, db }

```

To start developing:  
```
yarn install
yarn dev
```

## Develop
- Make sure you have: `"main": "public/electron-starter.js",` under `package.json` so you can always use the develop stack then:  
```
yarn dev
```
## Build
- Make sure you have electron-builder installed.
- Make sure you have: `"main": "build/electron-starter.js",` under `package.json`.  
- You can build per platform by `yarn dist` or for all platforms by using the doecker script under `scripts/docker.sh`
- Build for a specific version by usin `yarn dist-win`/`yarn dist-mac`/`yarn dist-linux`

## Publish
We use electron-builder to publish the packages to github. You will need to sign them for win or mac my purchasing certificate. Once you're done use: 
```
yarn publish
```


## Donate
The best donation is by submiting a PR and improving the code.  
Alternatively, you can just [buy me a coffee](https://www.buymeacoffee.com/sagivo)
