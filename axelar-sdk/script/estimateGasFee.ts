const { AxelarQueryAPI, Environment, EvmChain } = require("@axelar-network/axelarjs-sdk");
import yargs from 'yargs';

const args = yargs.options({
    origin: { type: 'string', demandOption: true, alias: 'o' },
    destination: { type: 'string', demandOption: true, alias: 'd' },
    gasToken: { type: 'string', demandOption: true, alias: 't' },
    gas: { type: 'number', demandOption: false, alias: 'g', default: 70000 }
  }).argv;

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

/*
const ORIGIN = EvmChain.ETHEREUM;
const DESTINATION = EvmChain.MOONBEAM;
const GAS_TOKEN = "ETH";
const GAS = 7000000;
*/

main(args.origin, args.destination, args.gasToken, args.gas);
