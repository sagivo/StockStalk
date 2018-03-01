# Robinhood on desktop

Free and open source Robinhood desktop version.  
Built on top of Electron and React, allows you to build a version for Mac, Windows and Linux.  


# Robinhood for Mac

At the moment we compiled a Mac version you can download it from the [StockStalk website](https://stockstalk.club).

# Robinhood for Windows

The code to compile the windows version is here in this repo. Official release is coming soon.

# Robinhood for Linux

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

