// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");


async function main() {

  // We get the contract to deploy
  const SGM = await hre.ethers.getContractFactory("SimpleGeneralMessage");
  const sgm = await SGM.deploy();
  
  // Moonbase init 0x06417f812b033aDA3e0F7cdce910d1af0fb27e7b
  /*
  await sgm.init(
    "Moonbeam",
    "0x5769D84DD62a6fD969856c75c7D321b84d455929",
    "0xbE406F0189A0B4cf3A05C286473D23791Dd44Cc6"
  );*/
  

  // Ropsten init 0xaF91f0324A3E5959cDD25FADf97348684d3824f9
  
  await sgm.init(
    "Ethereum",
    "0xBC6fcce7c5487d43830a219CA6E7B83238B41e71",
    "0xbE406F0189A0B4cf3A05C286473D23791Dd44Cc6"
  );
  

  console.log("SimpleGeneralMessage deployed to:", sgm.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
