const hre = require("hardhat");
const ethers = hre.ethers;

async function main() {
  await hre.run('compile');

  // Gets the simple general message address for the network
  const simpleGeneralMessageAddress = ((network) => {
    switch(network) {
      case 'moonbase': return '0x4d7A40C0F7950Ea270DA795B4e68a36a0d9FE8ad';
      case 'ropsten': return '0xb96f012b2879117F9D4a2393Bd630202D6D4ba38';
      case 'mumbai': return '0x06071356e3A09EA6365f63744aC5a4e0B2EE1f68';
      case 'fuji': return '0x06071356e3A09EA6365f63744aC5a4e0B2EE1f68';
      case 'fantom': return '0x06071356e3A09EA6365f63744aC5a4e0B2EE1f68';
      default: return '';
    }
  })(hre.network.name);

  // Deploy our contract
  const SimpleGeneralMessage = await ethers.getContractFactory("SimpleGeneralMessage");
  const generalMsg = SimpleGeneralMessage.attach(simpleGeneralMessageAddress);

  const latestMessage = await generalMsg.lastMessage();
  console.log(`Latest message on ${hre.network.name}: ${latestMessage}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

