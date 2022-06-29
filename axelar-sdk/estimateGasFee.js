const { AxelarQueryAPI, Environment, EvmChain } = require("@axelar-network/axelarjs-sdk");

const sdk = new AxelarQueryAPI({
    environment: Environment.TESTNET,
});

async function main(ORIGIN, DESTINATION, GAS_TOKEN, GAS) {
    // Returns avax amount to pay gas
    const gasFee = await sdk.estimateGasFee(
        ORIGIN,
        DESTINATION,
        GAS_TOKEN,
        GAS
    );
    console.log(gasFee);
}

const ORIGIN = EvmChain.ETHEREUM;
const DESTINATION = EvmChain.MOONBEAM;
const GAS_TOKEN = "ETH";
const GAS = 700000;

main(ORIGIN, DESTINATION, GAS_TOKEN, GAS);