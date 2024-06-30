const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);
  console.log("Account balance:", (await deployer.getBalance()).toString());

  const Assessment = await hre.ethers.getContractFactory("Assessment");
  const assessment = await Assessment.deploy({ value: hre.ethers.utils.parseEther("10") });

  await assessment.deployed();

  console.log("Contract deployed to:", assessment.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
