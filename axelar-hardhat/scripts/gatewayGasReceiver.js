// Gets the gateway & gasReceiver address for our network
const getGatewayAddress = (network) => {
    switch (network) {
        case 'ropsten': return '0xBC6fcce7c5487d43830a219CA6E7B83238B41e71';
        case 'moonbase': return '0x5769D84DD62a6fD969856c75c7D321b84d455929';
        case 'mumbai': return '0xBF62ef1486468a6bd26Dd669C06db43dEd5B849B';
        case 'fuji': return '0xC249632c2D40b9001FE907806902f63038B737Ab';
        case 'fantom': return '0x97837985Ec0494E7b9C71f5D3f9250188477ae14';
        default: return '';
    }
};
const gasReceiverAddress = "0xbE406F0189A0B4cf3A05C286473D23791Dd44Cc6";

module.exports = { getGatewayAddress, gasReceiverAddress };