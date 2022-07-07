const hre = require("hardhat");
const { getGatewayAddress, gasReceiverAddress } = require("../gatewayGasReceiver");
const ethers = hre.ethers;

async function main() {
  await hre.run('compile');

  // Gets the gateway
  const gatewayAddress = getGatewayAddress(hre.network.name);

  // Deploy our contract
  const SimpleGeneralMessage = await ethers.getContractFactory("SimpleGeneralMessage");
  const generalMsg = await SimpleGeneralMessage.deploy(gatewayAddress, gasReceiverAddress);
  console.log("Deployed SimpleGeneralMessage on " + hre.network.name + " at: " + generalMsg.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
