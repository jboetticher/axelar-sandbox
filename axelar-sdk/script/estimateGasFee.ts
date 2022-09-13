const { AxelarQueryAPI, Environment, EvmChain } = require("@axelar-network/axelarjs-sdk");
import yargs from 'yargs';

/*
Requires ts-node to be installed.

ts-node estimateGasFee.ts -o Moonbeam -t DEV -g 100000 -d Ethereum
ts-node estimateGasFee.ts -o Moonbeam -t DEV -g 100000 -d Polygon
ts-node estimateGasFee.ts -o Moonbeam -t DEV -g 100000 -d Avalanche
ts-node estimateGasFee.ts -o Moonbeam -t DEV -g 100000 -d Polygon

*/

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

/*

Ropsten Testnet:    356806741787800000
                    16078410246397597000
Polygon Mumbai:     3390032863000000
                    150179749261484700
Avalanche Fuji:     97036323830100000
                    189508513681809730
Fantom Testnet:     55389864900000
                    100319259770461700
*/