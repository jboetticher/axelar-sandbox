const hre = require("hardhat");
const ethers = hre.ethers;

async function main() {
  await hre.run('compile');

  // Gets the gateway & gasReceiver address for our network
  const gatewayAddress = ((network) => {
    switch(network) {
      case 'ropsten': return '0xBC6fcce7c5487d43830a219CA6E7B83238B41e71';
      case 'moonbase': return '0x5769D84DD62a6fD969856c75c7D321b84d455929';
      case 'mumbai': return '0xBF62ef1486468a6bd26Dd669C06db43dEd5B849B';
      case 'fuji': return '0xC249632c2D40b9001FE907806902f63038B737Ab';
      case 'fantom': return '0x97837985Ec0494E7b9C71f5D3f9250188477ae14';
      default: return '';
    }
  })(hre.network.name);
  const gasReceiverAddress = "0xbE406F0189A0B4cf3A05C286473D23791Dd44Cc6";

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

// Moonbase   0x64d19F9B92879626B035dd59961b58D236946103
// Ropsten    0xB5F906476d7eCA41Fd00593A20D838611285B0B2
// Mumbai     0xFF0FAF2C30bcbAa9757ea19C74196C4D8F70a5fb (yes they're the same)
// Fuji       0xFF0FAF2C30bcbAa9757ea19C74196C4D8F70a5fb
// Fantom     0xFF0FAF2C30bcbAa9757ea19C74196C4D8F70a5fb