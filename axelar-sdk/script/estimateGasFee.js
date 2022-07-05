const { AxelarQueryAPI, Environment, EvmChain } = require("@axelar-network/axelarjs-sdk");
import yargs from 'yargs';

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
const GAS = 7000000;

main(ORIGIN, DESTINATION, GAS_TOKEN, GAS);

//0xFFFFFFFF0CA324C842330521525E7DE111F38972
//0x588538D1Eb40dB215C41eE02C298Ec54b8da0bB2
//