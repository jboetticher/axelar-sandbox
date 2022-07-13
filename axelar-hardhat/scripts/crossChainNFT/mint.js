const hre = require("hardhat");
const { AxelarQueryAPI, Environment, EvmChain, GasToken } = require("@axelar-network/axelarjs-sdk");
const { getGatewayAddress } = require("../gatewayGasReceiver");


const ethers = hre.ethers;
const sdk = new AxelarQueryAPI({
    environment: Environment.TESTNET,
});

/*

This script will mint an NFT across chains.
It serves as a demo on using the axelar sdk in conjunction with ethers.

For sake of simplicity, the script requires moonbase alpha for the origin.

Use the constants below to change the parameters of the script.

*/

const DESTINATION_CHAIN = EvmChain.FANTOM;
const ORIGIN_CHAIN_ADDRESS = '0x09B8493556401ab4f4fC7303078132fEDdAd6295';
const DESTINATION_CHAIN_ADDRESS = '0x7F553ebD8DcDDef432a7ebC35f74ec9926B00AD0';

async function main() {
    if (hre.network.name !== 'moonbase') {
        console.log("Can only be run on Moonbase Alpha!");
        process.exit(1);
    }


    // Gets the gateway
    const gatewayAddress = getGatewayAddress(hre.network.name);
    const MOONBASE_WDEV_ADDRESS = '0x1436aE0dF0A8663F18c0Ec51d7e2E46591730715';

    // Connect to contract
    const CrossChainNFT = await ethers.getContractFactory("CrossChainNFT");
    const nft = CrossChainNFT.attach(ORIGIN_CHAIN_ADDRESS);

    /*
    Here we attempt to estimate the gas we have to pay for.
    Typically you could estimate required gas like so: 
    nft.estimateGas.executeWithToken()

    But the "executeWithToken" function can only be called by Axelar gateway: gas estimation is difficult.

    Axelar recommends 400000 to 700000 gas, which is usually more than enough for transactions.
    Chains may refund gas if you paid much more than what was paid.
    Feel free to experiment to figure out what a benchmark gas fee would be for your implementation.

    The following code will return DEV amount to pay in gas.
    */
    const estimateGasUsed = 400000;
    const gasFee = await sdk.estimateGasFee(
        EvmChain.MOONBEAM,
        DESTINATION_CHAIN,
        GasToken.GLMR,
        estimateGasUsed
    );
    const gasFeeToHuman = ethers.utils.formatEther(ethers.BigNumber.from(gasFee));
    console.log(`Cross-Chain Gas Fee: ${gasFee} Wei / ${gasFeeToHuman} Ether`);

    // Approve WDEV to be used by the NFT contract (transfer to contract, contract transfers to Gateway)
    const wDEV = await ethers.getContractAt(
        "IERC20", 
        MOONBASE_WDEV_ADDRESS
    );
    const approveTx = await wDEV.approve(
        ORIGIN_CHAIN_ADDRESS, 
        ethers.utils.parseUnits("0.05", "ether")
    );
    // there's an issue with approval. I think it doesn't register until next block
    console.log("Approved: ", ethers.utils.parseUnits("0.05", "ether")); 
    console.log("Approve transaction hash: ", approveTx.hash);

    // Begin the minting
    ethers.provider.waitForTransaction(approveTx.hash, 3);
    const mintRes = await nft.mintXCNFT(
        DESTINATION_CHAIN_ADDRESS,
        DESTINATION_CHAIN,
        { value: gasFee }
    );
    console.log("Minting transaction hash: ", mintRes.hash);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });