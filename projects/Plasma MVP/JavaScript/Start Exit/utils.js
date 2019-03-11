const EthUtils = require('ethereumjs-util');
const NULL_ADDRESS = '0x0000000000000000000000000000000000000000';
const NULL_HASH = "0x" + new Array(64 + 1).join("0");
const NULL_SIGNATURE = "0x" + new Array(130 + 1).join("0");
const BLKNUM_OFFSET = 1000000000;
const TXINDEX_OFFSET = 10000;

const decodeUtxoId = (utxoId) => {
    const blkNum = Math.round(utxoId / BLKNUM_OFFSET);
    const txIndex = Math.round((utxoId % BLKNUM_OFFSET) / TXINDEX_OFFSET);
    const oIndex = Math.round(utxoId - blkNum * BLKNUM_OFFSET - txIndex * TXINDEX_OFFSET);
    return [blkNum, txIndex, oIndex];
}

// Unique way to store entire UTXO as a unique ID
const encodeUtxoId = (blkNum, txIndex, oIndex) => {
    return Math.round((blkNum * BLKNUM_OFFSET) + (txIndex * TXINDEX_OFFSET) + (oIndex * 1));
};

const decodeTxId = (utxoId) => {
    const [blkNum, txIndex, _] = decodeUtxoId(utxoId);
    return encodeUtxoId(blkNum, txIndex, 0);
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