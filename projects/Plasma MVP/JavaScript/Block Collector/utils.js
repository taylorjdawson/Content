const EthUtils = require('ethereumjs-util');
const NULL_ADDRESS = '0x0000000000000000000000000000000000000000';
const NULL_HASH = "0x" + new Array(64 + 1).join("0");
const NULL_SIGNATURE = "0x" + new Array(130 + 1).join("0");
const BLKNUM_OFFSET = 1000000000;
const TXINDEX_OFFSET = 10000;

const decodeUtxoId = (utxoId) => {
    const blockNumber = Math.round(utxoId / BLKNUM_OFFSET);
    const transactionIndex = Math.round((utxoId % BLKNUM_OFFSET) / TXINDEX_OFFSET);
    const outputIndex = Math.round(utxoId - blockNumber * BLKNUM_OFFSET - transactionIndex * TXINDEX_OFFSET);
    return [blockNumber, transactionIndex, outputIndex];
}

const encodeUtxoId = (blockNumber, transactionIndex, outputIndex) => {
    return Math.round((blockNumber * BLKNUM_OFFSET) + (transactionIndex * TXINDEX_OFFSET) + (outputIndex * 1));
};

const decodeTxId = (utxoId) => {
    const [blockNumber, transactionIndex] = decodeUtxoId(utxoId);
    return encodeUtxoId(blockNumber, transactionIndex, 0);
};

const sign = (hash, key) => {
    const { r, s, v } = EthUtils.ecsign(EthUtils.toBuffer(hash), EthUtils.toBuffer(key));
    const rsvBytes = Buffer.concat([EthUtils.setLengthLeft(r, 32), EthUtils.setLengthLeft(s, 32), EthUtils.toBuffer(v)]);
    return rsvBytes;
};

module.exports = {
    decodeUtxoId,
    encodeUtxoId,
    decodeTxId,
    NULL_ADDRESS,
    NULL_SIGNATURE,
    NULL_HASH,
    sign,
}
