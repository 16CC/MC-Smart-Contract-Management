# Real Estate DApp

This Solidity program is a decentralized application (DApp) for managing real estate properties. It demonstrates the basic functionality of listing, buying, and managing properties on the Ethereum blockchain.

## Description

This program is a smart contract written in Solidity, a programming language for developing smart contracts on the Ethereum blockchain. The contract has several functions to handle the lifecycle of a property:

- `listProperty`: Allows users to list a property for sale.
- `buyProperty`: Allows users to buy a listed property.
- `removeProperty`: Allows property owners to remove their property from the sale list.
- `getPropertyDetails`: Returns the details of a specified property.

The DApp also includes a frontend interface built with React and ethers.js to interact with the contract.

## Prerequisites

- Node.js
- npm or yarn
- MetaMask extension for interacting with the DApp
- Hardhat

## Getting Started

### Executing Program

To run this program, you can use Gitpod.

# Starter Next/Hardhat Project

After cloning the GitHub repository, follow these steps to get the code running on your computer.

### Installation

1. **Install Dependencies:**
   Inside the project directory, open the terminal and type:
   ```npm i```
2. **Setup Local Ethereum Network:**
   Open a second terminal and type:
   ```npx hardhat node```
3. **Setup Local Ethereum Network:**
   Open a third terminal and type:
   ```npx hardhat run --network localhost scripts/deploy.js```
4. **Launch the Front-End**
   Go back to the first terminal and type::
   ```npm run dev```

### Setting up Metamask
1. Connect MetaMask to Localhost Network

2. Open MetaMask and click on the network dropdown at the top.
   
- Select "Add Network Manually".
- Fill in the following details:
- Network Name: Localhost 8545
- New RPC URL: http://localhost:8545
- Chain ID: 1337 (default for Hardhat)
- Currency Symbol: ETH
- Click "Save".

