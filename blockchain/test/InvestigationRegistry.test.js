const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("InvestigationRegistry Contract Tests", function () {
  let registry;
  let owner;
  let investigator1;
  let investigator2;

  const sampleWallet = "0x742d35Cc6634C0532925a3b844Bc454e4438f44e";
  const sampleWallet2 = "0x388c81500594100674661924840de2651475c400";

  beforeEach(async function () {
    [owner, investigator1, investigator2] = await ethers.getSigners();
    const InvestigationRegistry = await ethers.getContractFactory("InvestigationRegistry");
    registry = await InvestigationRegistry.deploy();
    await registry.waitForDeployment();
  });

  it("1. Should deploy contract successfully with 0 initial investigations", async function () {
    const total = await registry.getTotalInvestigations();
    expect(total).to.equal(0);
  });

  it("2. Should register a new investigation on-chain", async function () {
    const tx = await registry.connect(investigator1).registerInvestigation(
      sampleWallet,
      78,
      "HIGH RISK",
      "High transaction frequency & large transfers"
    );

    await expect(tx)
      .to.emit(registry, "InvestigationRegistered")
      .withArgs(1, sampleWallet, 78, "HIGH RISK", (await ethers.provider.getBlock("latest")).timestamp, investigator1.address);

    const total = await registry.getTotalInvestigations();
    expect(total).to.equal(1);
  });

  it("3. Should retrieve a registered investigation by ID accurately", async function () {
    await registry.connect(investigator1).registerInvestigation(
      sampleWallet,
      45,
      "MEDIUM RISK",
      "Moderate transaction volume"
    );

    const inv = await registry.getInvestigation(1);
    expect(inv.id).to.equal(1);
    expect(inv.walletAddress).to.equal(sampleWallet);
    expect(inv.riskScore).to.equal(45);
    expect(inv.riskLevel).to.equal("MEDIUM RISK");
    expect(inv.primaryReason).to.equal("Moderate transaction volume");
    expect(inv.investigator).to.equal(investigator1.address);
  });

  it("4. Should handle multiple investigations and retrieve all of them", async function () {
    await registry.connect(investigator1).registerInvestigation(
      sampleWallet,
      20,
      "LOW RISK",
      "Standard activity"
    );

    await registry.connect(investigator2).registerInvestigation(
      sampleWallet2,
      85,
      "HIGH RISK",
      "Rapid sequence transfers"
    );

    const total = await registry.getTotalInvestigations();
    expect(total).to.equal(2);

    const allInv = await registry.getAllInvestigations();
    expect(allInv.length).to.equal(2);
    expect(allInv[0].riskLevel).to.equal("LOW RISK");
    expect(allInv[1].riskLevel).to.equal("HIGH RISK");
  });

  it("5. Should reject registration with zero/invalid address", async function () {
    await expect(
      registry.registerInvestigation(
        ethers.ZeroAddress,
        50,
        "MEDIUM RISK",
        "Invalid address test"
      )
    ).to.be.revertedWith("Invalid target wallet address");
  });

  it("6. Should reject risk score greater than 100", async function () {
    await expect(
      registry.registerInvestigation(
        sampleWallet,
        105,
        "HIGH RISK",
        "Overflow score test"
      )
    ).to.be.revertedWith("Risk score must be between 0 and 100");
  });
});
