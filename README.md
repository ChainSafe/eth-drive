# Overview

The goal of this repository is to provide a software cold storage solution to developers and users of the Ethereum ecosystem. At the time of this writing all available cold storage solutions require proprietary hardware that is cost prohibitive and exclusionary for holders of small amounts of crypto. 

The application is an electron desktop app with the ethereumjs-wallet npm module providing all of the Ethereum wallet functionality.

=======
# eth-drive 

#### Created by
[@stupeters187](https://github.com/stupeters187)

[@gregthegreek](https://github.com/GregTheGreek)

[@ChainSafe](https://github.com/chainsafe)

#### Created at
[ethwaterloo](https://ethwaterloo.com)

# Dependencies:
```
node >=v6.11.3
```

# In order to run:
```
git clone git@github.com:ChainSafe/eth-drive.git
cd eth-drive
cd app
npm install
npm start
```
## In app instructions:
1. Select a drive to format. Warning this is permanent
2. Choose 'Fast Format' or 'Deep Scrub' ** Deep Scrub can take upwards of 30 minutes **
3. Once drive is not mounted, unplug it and re-insert.
4. Press 'Generate Wallet, make a password and choose a location to store your public key.
