# Basic Lending and Borrowing dApp

## Steps to run dApp on local server

Use These Command for installing React, Hardhat and Ethers,
make sure to `cd .\app-name` before installing Hardhat

```js
npm create-react-app app-name
npm install --save-dev hardhat
npm install ethers
```

Use `npx hardhat compile` to compile the smart contract

To deploy the contract, first start the Hardhat local test node and then run the `deploy.js` script using below commands

```js
    npx hardhat node
    npx hardhat run scripts/deploy.js --network localhost
```

After deploying the contract make sure to check the output contract address and cotract address in App.js file are same.

Connect any of the local Hardhat account to Metamask by setting Hardhat local network `http://127.0.0.1:8545/` on it.

To test the dApp, start the React server:

```js
    npm start
```

## Technoligies and Framework used

- React.js
- Hardhat
  - `A development environment for the Ethereum blockchain that    enables developers to easily compile, edit, debug, and deploy Smart Contracts and dApps.`
- Ethers.js
  - `Ethers.js is a complete and compact library for interacting with the Ethereum Blockchain and its ecosystem.`

## Explanation of the design choices made

- Used **React.js** for frontend design.
- Used **Hardhat** beacuse it helps in testing, compiling, deploying, and debugging dApps on the Ethereum blockchain.
- Used **Ethers.js** for interacting with the smart contract beacuse it is particularly useful for applications that require sending transactions and querying data from the Blockchain.
