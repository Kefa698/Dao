const { network, ethers } = require("hardhat")
const {
    developmentChains,
    VERIFICATION_BLOCK_CONFIRMATIONS,
    VOTING_DELAY,
    VOTING_PERIOD,
    QUARAM_PERCANTAGE,
    ADRESSZERO,
} = require("../helper-hardhat-config")
const { verify } = require("../utils/verify")

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log, get } = deployments
    const { deployer } = await getNamedAccounts()
    const governor = await ethers.getContract("GovernorContract", deployer)
    const timelock = await ethers.getContract("Timelock", deployer)
    const waitBlockConfirmations = developmentChains.includes(network.name)
        ? 1
        : VERIFICATION_BLOCK_CONFIRMATIONS

    log("roles set----------------------------------")
    const proposerRole = await timelock.PROPOSER_ROLE()
    const executorRole = await timelock.EXECUTOR_ROLE()
    const adminRole = await timelock.TIMELOCK_ADMIN_ROLE()

    const proposerTx = await timelock.grantRole(proposerRole, governor.address)
    await proposerTx.waitBlockConfirmations
    const executorTx = await timelock.grantRole(executorRole, ADRESSZERO)
    executorTx.waitBlockConfirmations
    const revokeTx = await timelock.revokeRole(adminRole, deployer)
    revokeTx.waitBlockConfirmations

    // Verify the deployment
    if (!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
        log("Verifying...")
        await verify(GovernorContract.address, arguments)
    }
    log("----------------------------------------------------")
}

module.exports.tags = ["all", "setupContracts"]
