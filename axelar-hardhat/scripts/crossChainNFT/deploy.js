const hre = require("hardhat");
const { getGatewayAddress, gasReceiverAddress } = require("../gatewayGasReceiver");
const ethers = hre.ethers;

async function main() {
  await hre.run('compile');

  // Gets the gateway for our network
  const gatewayAddress = getGatewayAddress(hre.network.name);

  // Deploy our contract
  const CrossChainNFT = await ethers.getContractFactory("CrossChainNFT");
  const nft = await CrossChainNFT.deploy(gatewayAddress, gasReceiverAddress);
  console.log("Deployed CrossChainNFT on " + hre.network.name + " at: " + nft.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
