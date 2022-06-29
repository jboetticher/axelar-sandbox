const { AxelarGMPRecoveryAPI, Environment } = require("@axelar-network/axelarjs-sdk");

const sdk = new AxelarGMPRecoveryAPI({
    environment: Environment.TESTNET,
});



async function queryTransaction() {
    const txHash =
        "0xc2fcbe785d77aee2ec4a2c2ca3b9f07c9ed641e957b7f0b44472214d27e11a52";
    const txStatus = await sdk.queryTransactionStatus(txHash);
    console.log(txStatus);
}

queryTransaction();