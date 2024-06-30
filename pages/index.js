import { useState, useEffect } from "react";
import { ethers } from "ethers";
import atm_abi from "../artifacts/contracts/Assessment.sol/Assessment.json";

export default function HomePage() {
  const [ethWallet, setEthWallet] = useState(undefined);
  const [account, setAccount] = useState(undefined);
  const [atm, setATM] = useState(undefined);
  const [balance, setBalance] = useState(undefined);

  const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"; // Replace with your deployed contract address
  const atmABI = atm_abi.abi;

  const getWallet = async () => {
    if (window.ethereum) {
      setEthWallet(window.ethereum);
      console.log("Ethereum wallet found");
    } else {
      console.log("Please install MetaMask!");
      return;
    }

    if (ethWallet) {
      const accounts = await ethWallet.request({ method: "eth_accounts" });
      handleAccount(accounts);
    }
  };

  const handleAccount = (accounts) => {
    if (accounts.length > 0) {
      console.log("Account connected: ", accounts[0]);
      setAccount(accounts[0]);
    } else {
      console.log("No account found");
    }
  };

  const connectAccount = async () => {
    if (!ethWallet) {
      alert("MetaMask wallet is required to connect");
      return;
    }

    const accounts = await ethWallet.request({ method: "eth_requestAccounts" });
    handleAccount(accounts);

    // once wallet is set we can get a reference to our deployed contract
    getATMContract();
  };

  const getATMContract = () => {
    const provider = new ethers.providers.Web3Provider(ethWallet);
    const signer = provider.getSigner();
    const atmContract = new ethers.Contract(contractAddress, atmABI, signer);

    setATM(atmContract);
    console.log("ATM Contract set:", atmContract);
  };

  const getBalance = async () => {
    if (atm) {
      try {
        console.log("Fetching balance...");
        const balance = await atm.getBalance();
        console.log("Balance fetched:", balance.toString());
        setBalance(ethers.utils.formatEther(balance));
      } catch (error) {
        console.error("Error getting balance:", error);
      }
    }
  };

  const deposit = async () => {
    if (atm) {
      try {
        console.log("Depositing 1 ETH...");
        const tx = await atm.deposit({
          value: ethers.utils.parseEther("1"),
        });
        await tx.wait();
        console.log("Deposit successful");
        getBalance();
      } catch (error) {
        console.error("Error depositing:", error);
      }
    } else {
      console.log("ATM contract is not set");
    }
  };

  const withdraw = async () => {
    if (atm) {
      try {
        console.log("Withdrawing 1 ETH...");
        const tx = await atm.withdraw(ethers.utils.parseEther("1"));
        await tx.wait();
        console.log("Withdrawal successful");
        getBalance();
      } catch (error) {
        console.error("Error withdrawing:", error);
      }
    } else {
      console.log("ATM contract is not set");
    }
  };

  const initUser = () => {
    // Check to see if user has Metamask
    if (!ethWallet) {
      return <p>Please install MetaMask in order to use this ATM.</p>;
    }

    // Check to see if user is connected. If not, connect to their account
    if (!account) {
      return (
        <button onClick={connectAccount}>Please connect your MetaMask wallet</button>
      );
    }

    if (balance === undefined) {
      getBalance();
    }

    return (
      <div>
        <p>Your Account: {account}</p>
        <p>Your Balance: {balance !== undefined ? `${balance} ETH` : "Loading..."}</p>
        <button onClick={deposit}>Deposit 1 ETH</button>
        <button onClick={withdraw}>Withdraw 1 ETH</button>
      </div>
    );
  };

  useEffect(() => {
    getWallet();
  }, []);

  useEffect(() => {
    if (atm) {
      getBalance();
    }
  }, [atm]);

  return (
    <main className="container">
      <header>
        <h1>Welcome to the Metacrafters ATM!</h1>
      </header>
      {initUser()}
      <style jsx>
        {`
          .container {
            text-align: center;
          }
        `}
      </style>
    </main>
  );
}
