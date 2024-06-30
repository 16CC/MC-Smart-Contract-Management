# Assessment Contract

This Solidity program is a simple smart contract that demonstrates the basic syntax and functionality of the Solidity programming language. The purpose of this program is to serve as a starting point for those who are new to Solidity and want to understand how smart contracts can handle balance management on the Ethereum blockchain.

## Description

This program is a smart contract written in Solidity, a programming language used for developing smart contracts on the Ethereum blockchain. The contract has three main functions:

- `getBalance`: Returns the current balance of the contract.
- `deposit`: Allows users to send Ether to the contract, increasing its balance.
- `withdraw`: Allows users to withdraw a specified amount of Ether from the contract, decreasing its balance.

This program serves as a simple and straightforward introduction to Solidity programming, demonstrating basic concepts like state variables, payable functions, and Ether transfers. It can be used as a stepping stone for more complex projects in the future.

## Getting Started

### Executing Program

To run this program, you can use Remix, an online Solidity IDE. To get started, go to the Remix website at [Remix Ethereum](https://remix.ethereum.org/).

1. Once you are on the Remix website, create a new file by clicking on the "+" icon in the left-hand sidebar. Save the file with a `.sol` extension (e.g., `Assessment.sol`). Copy and paste the following code into the file:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

contract Assessment {
    uint256 public balance;

    constructor() payable {
        balance = msg.value;
    }

    function getBalance() public view returns (uint256) {
        return balance;
    }

    function deposit() public payable {
        balance += msg.value;
    }

    function withdraw(uint256 amount) public {
        require(balance >= amount, "Insufficient balance");
        balance -= amount;
        payable(msg.sender).transfer(amount);
    }
}
```
2. To compile the code, click on the "Solidity Compiler" tab in the left-hand sidebar. Make sure the "Compiler" option is set to "0.8.17" (or another compatible version), and then click on the "Compile Assessment.sol" button.

3. Once the code is compiled, you can deploy the contract by clicking on the "Deploy & Run Transactions" tab in the left-hand sidebar. Select the "Assessment" contract from the dropdown menu, and then click on the "Deploy" button.

4. Once the contract is deployed, you can interact with it by calling the getBalance, deposit, and withdraw functions. Click on the "Assessment" contract in the left-hand sidebar, and then interact with the functions provided.
