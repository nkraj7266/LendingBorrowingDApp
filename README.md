# Steps to run DApp on local server

## Use These Command for React, Hardhat and Ethers

Make sure to `cd .\app-name` before installing Hardhat

```js
npm create-react-app app-name
npm install --save-dev hardhat
npm install ethers
```

### Run this command to create Hardhat Project

Run below command and choose Create an empty hardhat.config.js

```js
npx hardhat
```

Add Below Lines in `hardhat.config.js`

```js
    require("@nomicfoundation/hardhat-toolbox");

    module.exports = {
        solidity: "0.8.19",
        paths: {
            artifacts: './src/artifacts',
        },
        networks: {
            hardhat: {
            chainId: 31337
            }
        }
    };
```

`npx hardhat compile` Use to compile the smart contract

To deploy to the local network, first start the local test node and then run the deploy script

```js
    npx hardhat node
    npx hardhat run scripts/deploy.js --network localhost
```

Connect any Virtual Hardhat account to Metamask by setting Hardhat local network in it

To test the DApp, start the React server:

```js
    npm start
```
