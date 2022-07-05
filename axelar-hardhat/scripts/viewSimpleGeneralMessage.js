const hre = require("hardhat");
const ethers = hre.ethers;

async function main() {
  await hre.run('compile');

  // Gets the simple general message address for the network
  const simpleGeneralMessageAddress = ((network) => {
    switch(network) {
      case 'ropsten': return '0xB5F906476d7eCA41Fd00593A20D838611285B0B2';
      case 'moonbase': return '0x64d19F9B92879626B035dd59961b58D236946103';
      case 'mumbai': return '0xFF0FAF2C30bcbAa9757ea19C74196C4D8F70a5fb';
      case 'fuji': return '0xFF0FAF2C30bcbAa9757ea19C74196C4D8F70a5fb';
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

// Moonbase   0x64d19F9B92879626B035dd59961b58D236946103
// Ropsten    0xB5F906476d7eCA41Fd00593A20D838611285B0B2
// Mumbai     0xFF0FAF2C30bcbAa9757ea19C74196C4D8F70a5fb (yes they're the same)
// Fuji       0xFF0FAF2C30bcbAa9757ea19C74196C4D8F70a5fb
