# Real Estate DApp

## Overview

The Real Estate DApp is a decentralized application that allows users to manage real estate properties on the Ethereum blockchain. This application enables users to connect their MetaMask wallet, view and interact with properties listed on the blockchain, add new properties, update existing ones, buy properties, and toggle their sale status.

## Features

- Connect to Ethereum using MetaMask.
- View a list of properties with details such as name, location, price, owner, and sale status.
- Add new properties to the blockchain.
- Buy properties listed for sale.
- Update details of existing properties.
- Remove properties from the blockchain.
- Toggle the sale status of properties.

## Technologies

- **React**: Frontend framework for building the user interface.
- **ethers.js**: Library for interacting with the Ethereum blockchain.
- **MetaMask**: Browser extension for managing Ethereum accounts and transactions.
- **Solidity**: Smart contract programming language used to deploy the real estate contract.

## Setup

### Prerequisites

- Node.js and npm (Node Package Manager)
- MetaMask browser extension
- Ethereum wallet and test network (e.g., Rinkeby, Ropsten) for testing

### Executing Program

To run this program, you can use Gitpod.

# Starter Next/Hardhat Project

After cloning the GitHub repository, follow these steps to get the code running on your computer.

### Installation

1. **Install Dependencies:**
   Inside the project directory, open the terminal and type:
   ```bash
   npm i
   npx hardhat node
   npx hardhat run --network localhost scripts/deploy.js
   npm run dev

### SETTING UP METAMASK
Connect MetaMask to Localhost Network

Open MetaMask and click on the network dropdown at the top.

Select "Add Network Manually".
Fill in the following details:
Network Name: Localhost 8545
New RPC URL: http://localhost:8545
Chain ID: 1337 (default for Hardhat)
Currency Symbol: ETH
Click "Save".

### AUTHOR
Clyde Calub