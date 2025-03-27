const { expect } = require("chai");
const { ethers } = require("hardhat");
const { time } = require("@nomicfoundation/hardhat-network-helpers");

describe("Crowdfunding", function () {
  let Crowdfunding, crowdfunding, owner, donor1, donor2;
  const TITLE = "Test Campaign";
  const GOAL = ethers.parseEther("10"); // 10 ETH goal
  const DURATION = 60 * 60 * 24; // 1 day in seconds

  // Deploy the contract and set up accounts before each test
  async function deployCrowdfundingFixture() {
    [owner, donor1, donor2] = await ethers.getSigners();
    Crowdfunding = await ethers.getContractFactory("Crowdfunding");
    crowdfunding = await Crowdfunding.deploy();
    return { crowdfunding, owner, donor1, donor2 };
  }

  // Test deployment and campaign creation
  it("Should create a campaign successfully", async function () {
    const { crowdfunding, owner } = await deployCrowdfundingFixture();

    await expect(crowdfunding.createCampaign(TITLE, GOAL, DURATION))
      .to.emit(crowdfunding, "CampaignCreated")
      .withArgs(1, owner.address, TITLE, GOAL, ethers.provider.getBlock("latest").then(b => b.timestamp + DURATION));

    const campaign = await crowdfunding.getCampaign(1);
    expect(campaign.owner).to.equal(owner.address);
    expect(campaign.title).to.equal(TITLE);
    expect(campaign.goal).to.equal(GOAL);
    expect(campaign.amountRaised).to.equal(0);
    expect(campaign.completed).to.be.false;
  });

  // Test invalid campaign creation
  it("Should fail to create a campaign with zero goal", async function () {
    const { crowdfunding } = await deployCrowdfundingFixture();
    await expect(crowdfunding.createCampaign(TITLE, 0, DURATION)).to.be.revertedWith("Goal must be greater than 0");
  });

  // Test donation to a campaign
  it("Should accept donations and update amountRaised", async function () {
    const { crowdfunding, donor1 } = await deployCrowdfundingFixture();

    await crowdfunding.createCampaign(TITLE, GOAL, DURATION);
    const donationAmount = ethers.parseEther("2");

    await expect(crowdfunding.connect(donor1).donate(1, { value: donationAmount }))
      .to.emit(crowdfunding, "DonationReceived")
      .withArgs(1, donor1.address, donationAmount);

    const campaign = await crowdfunding.getCampaign(1);
    expect(campaign.amountRaised).to.equal(donationAmount);
  });

  // Test donation after deadline
  it("Should reject donations after deadline", async function () {
    const { crowdfunding, donor1 } = await deployCrowdfundingFixture();

    await crowdfunding.createCampaign(TITLE, GOAL, DURATION);
    await time.increase(DURATION + 1); // Move time past deadline

    await expect(crowdfunding.connect(donor1).donate(1, { value: ethers.parseEther("1") }))
      .to.be.revertedWith("Campaign has ended");
  });

  // Test withdrawal by owner when goal is met
  it("Should allow owner to withdraw funds when goal is met", async function () {
    const { crowdfunding, owner, donor1 } = await deployCrowdfundingFixture();

    await crowdfunding.createCampaign(TITLE, GOAL, DURATION);
    await crowdfunding.connect(donor1).donate(1, { value: GOAL });

    await time.increase(DURATION + 1); // Move past deadline

    const ownerBalanceBefore = await ethers.provider.getBalance(owner.address);
    await expect(crowdfunding.withdrawFunds(1))
      .to.emit(crowdfunding, "FundsWithdrawn")
      .withArgs(1, owner.address, GOAL);

    const ownerBalanceAfter = await ethers.provider.getBalance(owner.address);
    expect(ownerBalanceAfter).to.be.above(ownerBalanceBefore); // Account for gas costs
    const campaign = await crowdfunding.getCampaign(1);
    expect(campaign.completed).to.be.true;
    expect(campaign.amountRaised).to.equal(0);
  });

  // Test withdrawal before deadline
  it("Should reject withdrawal before deadline", async function () {
    const { crowdfunding } = await deployCrowdfundingFixture();

    await crowdfunding.createCampaign(TITLE, GOAL, DURATION);
    await expect(crowdfunding.withdrawFunds(1)).to.be.revertedWith("Campaign is still active");
  });

  // Test withdrawal by non-owner
  it("Should reject withdrawal by non-owner", async function () {
    const { crowdfunding, donor1 } = await deployCrowdfundingFixture();

    await crowdfunding.createCampaign(TITLE, GOAL, DURATION);
    await time.increase(DURATION + 1);
    await expect(crowdfunding.connect(donor1).withdrawFunds(1)).to.be.revertedWith("Only owner can withdraw");
  });

  // Test withdrawal when goal not met
  it("Should reject withdrawal if goal not met", async function () {
    const { crowdfunding } = await deployCrowdfundingFixture();

    await crowdfunding.createCampaign(TITLE, GOAL, DURATION);
    await time.increase(DURATION + 1);
    await expect(crowdfunding.withdrawFunds(1)).to.be.revertedWith("Goal not reached");
  });
});
