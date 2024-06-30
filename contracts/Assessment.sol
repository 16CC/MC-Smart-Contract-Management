// SPDX-License-Identifier: MIT
// This line specifies the license type for the contract, in this case, MIT license.

pragma solidity ^0.8.17;
// This line specifies the version of Solidity compiler to be used for compiling this contract.

contract Assessment {
    // Declare a state variable 'balance' of type uint256 to store the contract balance.
    uint256 public balance;

    // Constructor function that runs once when the contract is deployed.
    // It is marked 'payable' to allow the contract to receive Ether upon deployment.
    constructor() payable {
        // Initialize the contract balance with the Ether sent during deployment.
        balance = msg.value;
    }

    // Function to get the current balance of the contract.
    // It is marked as 'view' because it does not modify the state.
    function getBalance() public view returns (uint256) {
        return balance;
    }

    // Function to deposit Ether into the contract.
    // It is marked as 'payable' to allow the function to receive Ether.
    function deposit() public payable {
        // Increment the balance by the amount of Ether sent in the transaction.
        balance += msg.value;
    }

    // Function to withdraw a specified amount of Ether from the contract.
    function withdraw(uint256 amount) public {
        // Ensure that the contract has enough balance to fulfill the withdrawal request.
        require(balance >= amount, "Insufficient balance");

        // Decrement the balance by the amount to be withdrawn.
        balance -= amount;

        // Transfer the specified amount of Ether to the caller of the function.
        payable(msg.sender).transfer(amount);
    }
}
