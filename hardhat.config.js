require("@nomiclabs/hardhat-waffle");

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

const { privateKey } = require('./secrets.json');

module.exports = {
  solidity: "0.8.9",
  networks: {
    ropsten: {
      url: 'https://eth-ropsten.gateway.pokt.network/v1/lb/62a0c8ff87017d0039b81bb6',
      chainId: 3, // 0x507 in hex,
      accounts: [privateKey]
    },
    moonbase: {
      url: 'https://rpc.api.moonbase.moonbeam.network',
      chainId: 1287, // 0x507 in hex,
      accounts: [privateKey]
    }
  }
};
