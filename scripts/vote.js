const fs = require("fs");
const { network, ethers } = require("hardhat");
const {
  developmentChains,
  proposalFile,
  VOTING_PERIOD,
} = require("../helper-hardhat-config");
const { moveBlocks } = require("../utils/move-blocks");

const index = 0;

async function vote(proposalIndex) {
  const proposal = JSON.parse(fs.readFileSync(proposalFile, "utf8"));
  const proposalId = proposal[network.config.chainId][proposalIndex];
  //0=against,1=for,2=abstain
  const voteWay = 1;
  const governor = await ethers.getContract("GovernorContract");
  const reason = "i am a blockchain Engineer";
  const voteTxResponse = await governor.castVoteWithReason(
    proposalId,
    voteWay,
    reason
  );
  await voteTxResponse.wait(1);

  if (developmentChains.includes(network.name)) {
    await moveBlocks(VOTING_PERIOD + 1);
  }
  console.log("voted ready to go");
}

vote(index)
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
