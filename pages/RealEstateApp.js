import { useState, useEffect } from "react";
import { ethers } from "ethers";
import realEstate_abi from "../artifacts/contracts/RealEstate.sol/RealEstate.json";

export default function RealEstateApp() {
  const [ethWallet, setEthWallet] = useState(undefined);
  const [account, setAccount] = useState(undefined);
  const [balance, setBalance] = useState("0");
  const [realEstate, setRealEstate] = useState(undefined);
  const [properties, setProperties] = useState([]);
  const [newProperty, setNewProperty] = useState({ name: "", location: "", price: 0 });

  const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"; // Replace with your new contract address
  const realEstateABI = realEstate_abi.abi;

  const getWallet = async () => {
    if (window.ethereum) {
      setEthWallet(window.ethereum);
    }

    if (ethWallet) {
      const accounts = await ethWallet.request({ method: "eth_accounts" });
      handleAccount(accounts);
    }
  };

  const handleAccount = (accounts) => {
    if (accounts && accounts.length > 0) {
      console.log("Account connected: ", accounts[0]);
      setAccount(accounts[0]);
      getBalance(accounts[0]);
    } else {
      console.log("No account found");
    }
  };

  const getBalance = async (account) => {
    if (ethWallet) {
      const provider = new ethers.providers.Web3Provider(ethWallet);
      const balance = await provider.getBalance(account);
      setBalance(ethers.utils.formatEther(balance));
    }
  };

  const connectAccount = async () => {
    if (!ethWallet) {
      alert("MetaMask wallet is required to connect");
      return;
    }

    const accounts = await ethWallet.request({ method: "eth_requestAccounts" });
    handleAccount(accounts);

    getRealEstateContract();
  };

  const getRealEstateContract = () => {
    const provider = new ethers.providers.Web3Provider(ethWallet);
    const signer = provider.getSigner();
    const realEstateContract = new ethers.Contract(contractAddress, realEstateABI, signer);

    setRealEstate(realEstateContract);
  };

  const listProperty = async () => {
    if (realEstate) {
      const { name, location, price } = newProperty;
      try {
        const provider = new ethers.providers.Web3Provider(ethWallet);
        const gasPrice = await provider.getGasPrice();
        const gasEstimate = await realEstate.estimateGas.listProperty(name, location, ethers.utils.parseEther(price.toString()));
        const tx = await realEstate.listProperty(name, location, ethers.utils.parseEther(price.toString()), {
          gasLimit: gasEstimate,
          maxFeePerGas: gasPrice.add(gasPrice.div(2)), // Adding 50% to the current gas price
          maxPriorityFeePerGas: ethers.utils.parseUnits('2', 'gwei') // Set a reasonable priority fee
        });
        await tx.wait();
        loadProperties();
      } catch (error) {
        console.error("Error listing property:", error);
        alert("Error listing property: " + (error.message || error));
      }
    }
  };

  const buyProperty = async (id, price) => {
    if (realEstate) {
      try {
        const provider = new ethers.providers.Web3Provider(ethWallet);
        const gasPrice = await provider.getGasPrice();
        const gasEstimate = await realEstate.estimateGas.buyProperty(id, { value: ethers.utils.parseEther(price.toString()) });
        const tx = await realEstate.buyProperty(id, { 
          value: ethers.utils.parseEther(price.toString()),
          gasLimit: gasEstimate,
          maxFeePerGas: gasPrice.add(gasPrice.div(2)), // Adding 50% to the current gas price
          maxPriorityFeePerGas: ethers.utils.parseUnits('2', 'gwei') // Set a reasonable priority fee
        });
        await tx.wait();
        setProperties(properties.filter(property => property.id !== id));
        getBalance(account);
      } catch (error) {
        console.error("Error buying property:", error);
        alert("Error buying property: " + (error.message || error));
      }
    }
  };

  const removeProperty = async (id) => {
    if (realEstate) {
      try {
        const provider = new ethers.providers.Web3Provider(ethWallet);
        const gasPrice = await provider.getGasPrice();
        const gasEstimate = await realEstate.estimateGas.removeProperty(id);
        const tx = await realEstate.removeProperty(id, {
          gasLimit: gasEstimate,
          maxFeePerGas: gasPrice.add(gasPrice.div(2)), // Adding 50% to the current gas price
          maxPriorityFeePerGas: ethers.utils.parseUnits('2', 'gwei') // Set a reasonable priority fee
        });
        await tx.wait();
        setProperties(properties.filter(property => property.id !== id));
      } catch (error) {
        console.error("Error removing property:", error);
        alert("Error removing property: " + (error.message || error));
      }
    }
  };

  const loadProperties = async () => {
    if (realEstate) {
      try {
        const count = await realEstate.propertyCount();
        let propertiesArray = [];
        for (let i = 1; i <= count; i++) {
          const property = await realEstate.getPropertyDetails(i);
          propertiesArray.push({
            ...property,
            price: ethers.utils.formatEther(property.price), // Convert price to string
            id: property.id.toNumber() // Convert id to number
          });
        }
        setProperties(propertiesArray);
      } catch (error) {
        console.error("Error loading properties:", error);
      }
    }
  };

  const initUser = () => {
    if (!ethWallet) {
      return <p>Please install MetaMask to use this application.</p>;
    }

    if (!account) {
      return <button onClick={connectAccount}>Connect MetaMask Wallet</button>;
    }

    if (properties.length === 0) {
      loadProperties();
    }

    return (
      <div className="app-container">
        <p>Your Account: {account}</p>
        <p>Your Balance: {balance} ETH</p>
        <div className="property-form">
          <h2>List New Property</h2>
          <input 
            type="text" 
            placeholder="Name" 
            onChange={(e) => setNewProperty({ ...newProperty, name: e.target.value })} 
          />
          <input 
            type="text" 
            placeholder="Location" 
            onChange={(e) => setNewProperty({ ...newProperty, location: e.target.value })} 
          />
          <input 
            type="number" 
            placeholder="Price in ETH" 
            onChange={(e) => setNewProperty({ ...newProperty, price: parseFloat(e.target.value) })} 
          />
          <button onClick={listProperty}>List Property</button>
        </div>
        <h2>Available Properties</h2>
        <div className="properties-list">
          {properties.map((property) => (
            <div key={property.id} className="property-card">
              <p>Property ID: {property.id}</p>
              <p>Name: {property.name}</p>
              <p>Location: {property.location}</p>
              <p>Price: {property.price} ETH</p>
              <p>Owner: {property.owner}</p>
              {property.forSale && (
                <>
                  <button onClick={() => buyProperty(property.id, property.price)}>Buy Property</button>
                  {account.toLowerCase() === property.owner.toLowerCase() && (
                    <button onClick={() => removeProperty(property.id)}>Remove Property</button>
                  )}
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  useEffect(() => { getWallet(); }, []);

  return (
    <main className="container">
      <header>
        <h1>Welcome to Arjay's RealEstate</h1>
      </header>
      {initUser()}
      <style jsx>{`
        .container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          background-color: #f0f4f8; /* Light blue background */
          text-align: center;
          padding: 20px;
        }
        .app-container {
          background-color: white;
          padding: 20px;
          border-radius: 10px;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }
        .property-form {
          margin-bottom: 20px;
        }
        .property-form input {
          margin: 5px;
          padding: 10px;
          width: 80%;
          max-width: 300px;
          border: 1px solid #ccc;
          border-radius: 5px;
        }
        .property-form button {
          background-color: #28a745;
          color: white;
          padding: 10px 20px;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          margin-top: 10px;
        }
        .properties-list {
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .property-card {
          background-color: #ffffff;
          border: 1px solid #ccc;
          border-radius: 5px;
          padding: 15px;
          margin: 10px;
          width: 80%;
          max-width: 400px;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }
        .property-card button {
          background-color: #007bff;
          color: white;
          padding: 10px 20px;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          margin-top: 10px;
          margin-right: 5px;
        }
      `}</style>
    </main>
  );
}
