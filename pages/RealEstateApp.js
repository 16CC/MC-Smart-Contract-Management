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
  const [updateProperty, setUpdateProperty] = useState({ id: 0, name: "", location: "", price: 0 });

  const contractAddress = "0x959922bE3CAee4b8Cd9a407cc3ac1C251C2007B1"; // Replace with your new contract address
  const realEstateABI = realEstate_abi.abi;

  const styles = {
    container: {
      maxWidth: '1000px',
      margin: '0 auto',
      padding: '20px',
      fontFamily: 'Arial, sans-serif',
    },
    header: {
      textAlign: 'center',
      marginBottom: '20px',
    },
    section: {
      marginBottom: '20px',
      padding: '10px',
      border: '1px solid #ccc',
      borderRadius: '4px',
      backgroundColor: '#fafafa',
    },
    input: {
      width: '100%',
      padding: '8px',
      marginBottom: '10px',
      border: '1px solid #ddd',
      borderRadius: '4px',
    },
    button: {
      backgroundColor: '#007bff',
      color: '#fff',
      border: 'none',
      padding: '10px 15px',
      borderRadius: '4px',
      cursor: 'pointer',
    },
    buttonHover: {
      backgroundColor: '#0056b3',
    },
    list: {
      listStyleType: 'none',
      padding: '0',
    },
    listItem: {
      marginBottom: '10px',
      padding: '10px',
      border: '1px solid #ddd',
      borderRadius: '4px',
      backgroundColor: '#fff',
    }
  };

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
  
      if (!name || !location || isNaN(price) || price <= 0) {
        alert("Please provide valid property details.");
        return;
      }
  
      try {
        const provider = new ethers.providers.Web3Provider(ethWallet);
        const gasPrice = await provider.getGasPrice();
        const gasEstimate = await realEstate.estimateGas.listProperty(name, location, ethers.utils.parseEther(price.toString()));
        const maxPriorityFeePerGas = ethers.utils.parseUnits('2', 'gwei'); // Set a reasonable priority fee
  
        // Ensure maxFeePerGas is at least maxPriorityFeePerGas
        let maxFeePerGas = gasPrice.add(gasPrice.div(2)); // Adding 50% to the current gas price
        if (maxFeePerGas.lt(maxPriorityFeePerGas)) {
          maxFeePerGas = maxPriorityFeePerGas;
        }
  
        const tx = await realEstate.listProperty(name, location, ethers.utils.parseEther(price.toString()), {
          gasLimit: gasEstimate,
          maxFeePerGas: maxFeePerGas,
          maxPriorityFeePerGas: maxPriorityFeePerGas
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
        const maxPriorityFeePerGas = ethers.utils.parseUnits('2', 'gwei'); // Set a reasonable priority fee
        let maxFeePerGas = gasPrice.add(gasPrice.div(2)); // Adding 50% to the current gas price
  
        if (maxFeePerGas.lt(maxPriorityFeePerGas)) {
          maxFeePerGas = maxPriorityFeePerGas;
        }
  
        const tx = await realEstate.buyProperty(id, {
          value: ethers.utils.parseEther(price.toString()),
          gasLimit: gasEstimate,
          maxFeePerGas: maxFeePerGas,
          maxPriorityFeePerGas: maxPriorityFeePerGas
        });
        await tx.wait();
        loadProperties();
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
        const maxPriorityFeePerGas = ethers.utils.parseUnits('2', 'gwei'); // Set a reasonable priority fee
        let maxFeePerGas = gasPrice.add(gasPrice.div(2)); // Adding 50% to the current gas price
  
        if (maxFeePerGas.lt(maxPriorityFeePerGas)) {
          maxFeePerGas = maxPriorityFeePerGas;
        }
  
        const tx = await realEstate.removeProperty(id, {
          gasLimit: gasEstimate,
          maxFeePerGas: maxFeePerGas,
          maxPriorityFeePerGas: maxPriorityFeePerGas
        });
        await tx.wait();
        loadProperties();
      } catch (error) {
        console.error("Error removing property:", error);
        alert("Error removing property: " + (error.message || error));
      }
    }
  };
  
  const updatePropertyDetails = async () => {
    if (realEstate) {
      const { id, name, location, price } = updateProperty;
      try {
        const provider = new ethers.providers.Web3Provider(ethWallet);
        const gasPrice = await provider.getGasPrice();
        const gasEstimate = await realEstate.estimateGas.updateProperty(id, name, location, ethers.utils.parseEther(price.toString()));
        const maxPriorityFeePerGas = ethers.utils.parseUnits('2', 'gwei'); // Set a reasonable priority fee
        let maxFeePerGas = gasPrice.add(gasPrice.div(2)); // Adding 50% to the current gas price
  
        if (maxFeePerGas.lt(maxPriorityFeePerGas)) {
          maxFeePerGas = maxPriorityFeePerGas;
        }
  
        const tx = await realEstate.updateProperty(id, name, location, ethers.utils.parseEther(price.toString()), {
          gasLimit: gasEstimate,
          maxFeePerGas: maxFeePerGas,
          maxPriorityFeePerGas: maxPriorityFeePerGas
        });
        await tx.wait();
        loadProperties();
      } catch (error) {
        console.error("Error updating property:", error);
        alert("Error updating property: " + (error.message || error));
      }
    }
  };
  
  const setForSale = async (id, forSale) => {
    if (realEstate) {
      try {
        const provider = new ethers.providers.Web3Provider(ethWallet);
        const gasPrice = await provider.getGasPrice();
        const gasEstimate = await realEstate.estimateGas.setForSale(id, forSale);
        const maxPriorityFeePerGas = ethers.utils.parseUnits('2', 'gwei'); // Set a reasonable priority fee
        let maxFeePerGas = gasPrice.add(gasPrice.div(2)); // Adding 50% to the current gas price
  
        if (maxFeePerGas.lt(maxPriorityFeePerGas)) {
          maxFeePerGas = maxPriorityFeePerGas;
        }
  
        const tx = await realEstate.setForSale(id, forSale, {
          gasLimit: gasEstimate,
          maxFeePerGas: maxFeePerGas,
          maxPriorityFeePerGas: maxPriorityFeePerGas
        });
        await tx.wait();
        loadProperties();
      } catch (error) {
        console.error("Error setting property for sale:", error);
        alert("Error setting property for sale: " + (error.message || error));
      }
    }
  };  
  

  const loadProperties = async () => {
    if (realEstate) {
      const propertyCount = await realEstate.propertyCount();
      let loadedProperties = [];
      for (let i = 1; i <= propertyCount; i++) {
        const property = await realEstate.properties(i);
        loadedProperties.push({
          id: property.id.toNumber(),
          name: property.name,
          location: property.location,
          price: ethers.utils.formatEther(property.price),
          owner: property.owner,
          forSale: property.forSale,
        });
      }
      setProperties(loadedProperties);
    }
  };

  useEffect(() => {
    getWallet();
  }, []);

  useEffect(() => {
    if (realEstate) {
      loadProperties();
    }
  }, [realEstate]);

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>Real Estate DApp</h1>
      <div style={styles.section}>
        <button style={styles.button} onClick={connectAccount}>Connect MetaMask</button>
        {account && (
          <div>
            <p>Account: {account}</p>
            <p>Balance: {balance} ETH</p>
          </div>
        )}
      </div>
      <div style={styles.section}>
        <h2>Properties</h2>
        {properties.length > 0 ? (
          <ul style={styles.list}>
            {properties.map((property) => (
              <li key={property.id} style={styles.listItem}>
                <h3>{property.name}</h3>
                <p>Location: {property.location}</p>
                <p>Price: {property.price} ETH</p>
                <p>Owner: {property.owner}</p>
                <p>For Sale: {property.forSale ? "Yes" : "No"}</p>
                <button style={styles.button} onClick={() => buyProperty(property.id, property.price)}>Buy</button>
                <button
                  style={{ ...styles.button, ...(property.forSale ? styles.buttonHover : {}) }}
                  onClick={() => setForSale(property.id, !property.forSale)}
                >
                  {property.forSale ? "Remove from Sale" : "Set for Sale"}
                </button>
                <button style={styles.button} onClick={() => removeProperty(property.id)}>Remove Property</button>
              </li>
            ))}
          </ul>
        ) : (
          <p>No properties available.</p>
        )}
      </div>
      <div style={styles.section}>
        <h2>Add New Property</h2>
        <input
          type="text"
          placeholder="Name"
          value={newProperty.name}
          onChange={(e) => setNewProperty({ ...newProperty, name: e.target.value })}
          style={styles.input}
        />
        <input
          type="text"
          placeholder="Location"
          value={newProperty.location}
          onChange={(e) => setNewProperty({ ...newProperty, location: e.target.value })}
          style={styles.input}
        />
        <input
          type="number"
          placeholder="Price in ETH"
          value={newProperty.price}
          onChange={(e) => setNewProperty({ ...newProperty, price: Number(e.target.value) })}
          style={styles.input}
        />
        <button style={styles.button} onClick={listProperty}>Add Property</button>
      </div>
      <div style={styles.section}>
        <h2>Update Property</h2>
        <input
          type="number"
          placeholder="Property ID"
          value={updateProperty.id}
          onChange={(e) => setUpdateProperty({ ...updateProperty, id: Number(e.target.value) })}
          style={styles.input}
        />
        <input
          type="text"
          placeholder="Name"
          value={updateProperty.name}
          onChange={(e) => setUpdateProperty({ ...updateProperty, name: e.target.value })}
          style={styles.input}
        />
        <input
          type="text"
          placeholder="Location"
          value={updateProperty.location}
          onChange={(e) => setUpdateProperty({ ...updateProperty, location: e.target.value })}
          style={styles.input}
        />
        <input
          type="number"
          placeholder="Price in ETH"
          value={updateProperty.price}
          onChange={(e) => setUpdateProperty({ ...updateProperty, price: Number(e.target.value) })}
          style={styles.input}
        />
        <button style={styles.button} onClick={updatePropertyDetails}>Update Property</button>
      </div>
    </div>
  );
}