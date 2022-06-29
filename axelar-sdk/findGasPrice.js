const {
    constants: { AddressZero },
} = require("ethers");
const axios = require("axios");

async function getGasPrice(
    sourceChain,
    destinationChain,
    tokenAddress,
    tokenSymbol
) {
    const api_url = "https://devnet.api.gmp.axelarscan.io";

    const requester = axios.create({ baseURL: api_url });
    const params = {
        method: "getGasPrice",
        destinationChain: destinationChain,
        sourceChain: sourceChain,
    };

    // set gas token address to params
    if (tokenAddress != AddressZero) {
        params.sourceTokenAddress = tokenAddress;
    } else {
        params.sourceTokenSymbol = tokenSymbol;
    }
    // send request
    const response = await requester.get("/", { params }).catch((error) => {
        return { data: { error } };
    });
    return response.data.result;
}

const SOURCE_CHAIN = 'Ethereum';
const DESTINATION_CHAIN = 'Moonbeam';
const TOKEN_ADDRESS = AddressZero;
const TOKEN_SYMBOL = 'ETH';

getGasPrice(
    SOURCE_CHAIN,
    DESTINATION_CHAIN,
    TOKEN_ADDRESS,
    TOKEN_SYMBOL
)
    .then(result => {
        console.log("RESULT: ", result);
        const dest = result.destination_native_token;
        const destPrice = 1e18 * dest.gas_price * dest.token_price.usd;
        console.log(destPrice / result.source_token.token_price.usd);
    });