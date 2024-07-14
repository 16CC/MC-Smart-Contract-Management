import { useState, useEffect } from "react";
import { ethers } from "ethers";
import atm_abi from "../artifacts/contracts/Assessment.sol/Assessment.json";

export default function HomePage() {
  const [ethWallet, setEthWallet] = useState(undefined);
  const [account, setAccount] = useState(undefined);
  const [atm, setATM] = useState(undefined);
  const [balance, setBalance] = useState(undefined);
  const [amount, setAmount] = useState(0); // New state for amount

  const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
  const atmABI = atm_abi.abi;

  const getWallet = async () => {
    if (window.ethereum) {
      setEthWallet(window.ethereum);
    }

    if (ethWallet) {
      const account = await ethWallet.request({ method: "eth_accounts" });
      handleAccount(account);
    }
  };

  const handleAccount = (account) => {
    if (account) {
      console.log("Account connected: ", account);
      setAccount(account);
    } else {
      console.log("No account found");
    }
  };

  const connectAccount = async () => {
    if (!ethWallet) {
      alert('MetaMask wallet is required to connect');
      return;
    }

    const accounts = await ethWallet.request({ method: 'eth_requestAccounts' });
    handleAccount(accounts);

    // once wallet is set we can get a reference to our deployed contract
    getATMContract();
  };

  const getATMContract = () => {
    const provider = new ethers.providers.Web3Provider(ethWallet);
    const signer = provider.getSigner();
    const atmContract = new ethers.Contract(contractAddress, atmABI, signer);

    setATM(atmContract);
  };

  const getBalance = async () => {
    if (atm)
 {
      setBalance((await atm.getBalance()).toNumber());
    }
  };

  const deposit = async () => {
    if (atm && amount > 0) {
      let tx = await atm.deposit(amount);
      await tx.wait();
      getBalance();
    }
  };

  const withdraw = async () => {
    if (atm && amount > 0) {
      let tx = await atm.withdraw(amount);
      await tx.wait();
      getBalance();
    }
  };

  const initUser = () => {
    // Check to see if user has Metamask
    if (!ethWallet) {
      return <p>Please install Metamask in order to use this ATM.</p>;
    }

    // Check to see if user is connected. If not, connect to their account
    if (!account) {
      return <button onClick={connectAccount}>Please connect your Metamask wallet</button>;
    }

    if (balance == undefined) {
      getBalance();
    }

    return (
      <div>
        <p>Your Account: {account}</p>
        <p>Your Balance: {balance}</p>
        <input 
          type="number" 
          value={amount} 
          onChange={(e) => setAmount(parseInt(e.target.value))} 
          placeholder="Enter amount"
        />
        <button onClick={deposit} style={{ backgroundColor: 'green', color: 'white', padding: '10px 20px', border: 'none', borderRadius: '5px', margin: '5px' }}>Deposit ETH</button>
        <button onClick={withdraw} style={{ backgroundColor: 'red', color: 'white', padding: '10px 20px', border: 'none', borderRadius: '5px', margin: '5px' }}>Withdraw ETH</button>
      </div>
    );
  };

  useEffect(() => { getWallet(); }, []);

  return (
    <main className="container">
      <header><h1>Welcome to the Metacrafters ATM!</h1></header>
      {initUser()}
      <style jsx>{`
        .container {
          text-align: center;
          background-color: #e0f7fa; / Light blue background /
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }
      `}
      </style>
    </main>
  );
}

// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

contract Assessment {
    // State variable to store the owner's address
    address payable public owner;

    // State variable to store the contract's balance
    uint256 public balance;

    // Events to log deposits and withdrawals
    event Deposit(uint256 amount);
    event Withdraw(uint256 amount);

    // Constructor to initialize the contract with an initial balance and set the owner
    constructor(uint initBalance) payable {
        owner = payable(msg.sender);
        balance = initBalance;
    }

    // Function to get the current balance of the contract
    function getBalance() public view returns(uint256) {
        return balance;
    }

    // Function to deposit a specified amount into the contract
    function deposit(uint256 _amount) public payable {
        uint _previousBalance = balance;

        // Ensure that only the owner can deposit funds
        require(msg.sender == owner, "You are not the owner of this account");

        // Perform the deposit transaction
        balance += _amount;

        // Assert to ensure the transaction completed successfully
        assert(balance == previousBalance + amount);

        // Emit the deposit event
        emit Deposit(_amount);
    }

    // Custom error for insufficient balance
    error InsufficientBalance(uint256 balance, uint256 withdrawAmount);

    // Function to withdraw a specified amount from the contract
    function withdraw(uint256 _withdrawAmount) public {
        // Ensure that only the owner can withdraw funds
        require(msg.sender == owner, "You are not the owner of this account");

        uint _previousBalance = balance;

        // Check if the balance is sufficient for the withdrawal
        if (balance < _withdrawAmount) {
            revert InsufficientBalance({
                balance: balance,
                withdrawAmount: _withdrawAmount
            });
        }

        // Perform the withdrawal transaction
        balance -= _withdrawAmount;

        // Assert to ensure the balance is correct after withdrawal
        assert(balance == (previousBalance - withdrawAmount));

        // Emit the withdrawal event
        emit Withdraw(_withdrawAmount);
    }
}
