# Robinhood on desktop

Free and open source Robinhood desktop version.  
Built on top of Electron and React, allows you to build a version for Mac, Windows and Linux.  
[Join our Slack channel](https://join.slack.com/t/stockstalkapp/shared_invite/enQtMzI1NzcwNDA0MTkyLWI1MGZmMDI3Yjk5YzRhZDQ5NDM1ZjVmNmUyOTQxMDFkMGE1MGQ1ZjE4MWY5YWNjMDFhZjllNzM1NjdlYWQwYmE)

# Downloads

[Download Robinhood for Mac](https://stockstalk.club/robinhood-mac).  
[Download Robinhood for Windows](https://www.stockstalk.club/robinhood-windows).  
The code to compile the linux version is here in this repo. Official release is coming soon.

![Robinhood desktop](https://i.imgur.com/sF20GCi.png)

## Stack

Built on top of electron to support mac, windows and linux. The front is written using React frameworks. 

## Install
Make sure you have electron istalled first.  
You will also need to provide credentials to a firebase account under `src/helpers/firebase.js`.  
```
yarn install
yarn dev
```
To deploy simply call 
```
yarn publish
```

