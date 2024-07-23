// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

contract RealEstate {
    // The owner of the contract
    address public owner;

    // A structure to hold property details
    struct Property {
        uint256 id;
        string name;
        string location;
        uint256 price;
        address payable owner;
        bool forSale;
    }

    // Mapping from property ID to Property details
    mapping(uint256 => Property) public properties;
    // Total count of properties
    uint256 public propertyCount;

    // Event emitted when a property is listed for sale
    event PropertyListed(uint256 id, string name, uint256 price);
    // Event emitted when a property is sold
    event PropertySold(uint256 id, address newOwner);
    // Event emitted when a property is removed from sale
    event PropertyRemoved(uint256 id);

    // Constructor to initialize the contract owner
    constructor() {
        owner = msg.sender;
        propertyCount = 0;
    }

    // Function to list a new property for sale
    function listProperty(string memory _name, string memory _location, uint256 _price) public {
        // Increment the property count
        propertyCount++;
        // Create a new property and add it to the properties mapping
        properties[propertyCount] = Property(propertyCount, _name, _location, _price, payable(msg.sender), true);
        // Emit the PropertyListed event
        emit PropertyListed(propertyCount, _name, _price);
    }

    // Function to buy a listed property
    function buyProperty(uint256 _id) public payable {
        // Fetch the property from the mapping
        Property memory property = properties[_id];
        // Ensure the property is for sale
        require(property.forSale, "Property not for sale");
        // Ensure the buyer has sent enough funds
        require(msg.value >= property.price, "Insufficient funds");

        // Transfer the funds to the current owner
        property.owner.transfer(msg.value);
        // Update the property's owner and mark it as not for sale
        properties[_id].owner = payable(msg.sender);
        properties[_id].forSale = false;

        // Emit the PropertySold event
        emit PropertySold(_id, msg.sender);
    }

    // Function to remove a property from sale
    function removeProperty(uint256 _id) public {
        // Fetch the property from the mapping
        Property storage property = properties[_id];
        // Ensure the caller is the owner of the property
        require(msg.sender == property.owner, "Only the owner can remove this property");
        // Mark the property as not for sale
        property.forSale = false;

        // Emit the PropertyRemoved event
        emit PropertyRemoved(_id);
    }

    // Function to get the details of a property
    function getPropertyDetails(uint256 _id) public view returns (Property memory) {
        return properties[_id];
    }
}
