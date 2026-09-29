const { ethers } = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  console.log("==========================================");
  console.log(" Deploying InvestigationRegistry Contract");
  console.log("==========================================");

  const [deployer] = await ethers.getSigners();
  console.log("Deployer Address:", deployer.address);
  const balance = await ethers.provider.getBalance(deployer.address);
  console.log("Deployer ETH Balance:", ethers.formatEther(balance));

  const InvestigationRegistry = await ethers.getContractFactory("InvestigationRegistry");
  const registry = await InvestigationRegistry.deploy();
  await registry.waitForDeployment();

  const contractAddress = await registry.getAddress();
  console.log("------------------------------------------");
  console.log("InvestigationRegistry deployed to:", contractAddress);
  console.log("------------------------------------------");

  // Export metadata to frontend
  const frontendContractsDir = path.join(__dirname, "../../frontend/src/contracts");

  if (!fs.existsSync(frontendContractsDir)) {
    fs.mkdirSync(frontendContractsDir, { recursive: true });
  }

  // Save Contract Address
  fs.writeFileSync(
    path.join(frontendContractsDir, "contractAddress.json"),
    JSON.stringify({ address: contractAddress }, null, 2)
  );

  // Save Artifact / ABI
  const artifact = artifacts.readArtifactSync("InvestigationRegistry");
  fs.writeFileSync(
    path.join(frontendContractsDir, "InvestigationRegistry.json"),
    JSON.stringify(artifact, null, 2)
  );

  console.log("Successfully exported contract ABI & address to frontend!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Deployment failed:", error);
    process.exit(1);
  });
