const EthUtils = require('ethereumjs-util');
const NULL_ADDRESS = '0x0000000000000000000000000000000000000000';
const NULL_HASH = "0x" + new Array(64 + 1).join("0");
const NULL_SIGNATURE = "0x" + new Array(130 + 1).join("0");
const BLKNUM_OFFSET = 1000000000;
const TXINDEX_OFFSET = 10000;

const moduleIsAvailable = (path) => {
    try {
        require.resolve(path);
        return true;
    } catch (e) {
        return false;
    }
}

const decodeUtxoId = (utxoId) => {
    const blkNum = Math.round(utxoId / BLKNUM_OFFSET);
    // Changed divisor to TXINDEX_OFFSET, was BLKNUM_OFFSET in mvp
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

// Validates a transaction for valid signatures and spent UTXO's
// @param {object} tx : Transaction that requires validation
// @param {object} blocks : All blocks stored on the Plasma chain
// @param {object} currentBlock : Current block where new plasma chain transactions are added
// @param {object} tempSpent : Collection of UTXO's already spent in the current block

// Issues:
// => Not checking for the signer
// => Not checking for input amounts > output amounts for tx's other than deposits
const validateTransaction = (tx, blocks, currentBlock, tempSpent = {}) => {
    let inputAmount = 0;
    let outputAmount = tx.amount1 + tx.amount2;
    let validSignature;
    let spent;

    let inputs = [[tx.blkNum1, tx.txIndex1, tx.oIndex1], [tx.blkNum2, tx.txIndex2, tx.oIndex2]];
    for (let i = 0; i < inputs.length; i++) {
        const [blkNum, txIndex, oIndex] = inputs[i];
    
        if (blkNum === 0) continue;

        let inputTx;
        if (blocks[blkNum]) {
            
            inputTx = blocks[blkNum].transactionSet[txIndex];
        } else {
            inputTx = currentBlock.transactionSet[txIndex];
        }

        if (oIndex === 0) {
            // validSignature = tx.sig1 !== NULL_SIGNATURE && inputTx.newOwner1 === tx.sender1;
            validSignature = tx.sig1 !== NULL_SIGNATURE;
            spent = inputTx.spent1;
            inputAmount += inputTx.amount1;
        } else {
            // validSignature = tx.sig2 !== NULL_SIGNATURE && inputTx.newOwner2 === tx.sender2;
            validSignature = tx.sig2 !== NULL_SIGNATURE;
            spent = inputTx.spent2;
            inputAmount += inputTx.amount2;
        }
        const utxoId = encodeUtxoId(blkNum, txIndex, oIndex);
        if (spent || tempSpent.hasOwnProperty(utxoId)) throw "Transaction already spent";
        // if (!validSignature) throw "Invalid Signature";
        // Not sure how their isDepositBlock(fx) makes sense. Its just checking that the blkNum === 0, but we know that its dependent on whats passed in on the root chain
        // if (!tx.isDepositBlock() && inputAmount < outputAmount) throw "Not enough funds";
    }
};

module.exports = {
    validateTransaction,
    decodeUtxoId,
    encodeUtxoId,
    decodeTxId,
    NULL_ADDRESS,
    NULL_SIGNATURE,
    NULL_HASH,
    sign,
    moduleIsAvailable,
}