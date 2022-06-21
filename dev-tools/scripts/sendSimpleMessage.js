// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");

async function main() {
  // Moonbase 0x06417f812b033aDA3e0F7cdce910d1af0fb27e7b
  // Ropsten 0xaF91f0324A3E5959cDD25FADf97348684d3824f9
  const sgm = await hre.ethers.getContractAt(
    "SimpleGeneralMessage", 
    "0x06417f812b033aDA3e0F7cdce910d1af0fb27e7b");
  await sgm.sendMessage("helloo!", "Ethereum");

  const currentEVMMsg = await sgm.lastMessage();
  
  console.log("CURRENT MESSAGE: " + currentEVMMsg);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
