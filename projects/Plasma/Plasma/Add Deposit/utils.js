// Is this the correct way for address?
const NULL_ADDRESS = '0x0000000000000000000000000000000000000000';
// Is this the correct way for signature?
const NULL_SIGNATURE = "";
const BLKNUM_OFFSET = 1000000000;
const TXINDEX_OFFSET = 10000;

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

// Issues:
// => Not checking for the signer
// => Not checking for input amounts > output amounts for tx's other than deposits
// => Not passing in a tempSpent object. Not sure its necessary.
// => tempSpent is necessary. This is because you could be spending utxos before the block is submitted. The block object should store the spent utxos until it is submitted
const validateTransaction = (tx, blocks, currentBlock, tempSpent={}) => {
    let inputAmount = 0;
    let outputAmount = tx.amount1 + tx.amount2;
    let validSignature;
    let spent;

    let inputs = [[tx.blkNum1, tx.txIndex1, tx.oIndex1], [tx.blkNum2, tx.txIndex2, tx.oIndex2]];
    for(let i = 0; i < inputs.length; i++) {
        const [blkNum, txIndex, oIndex] = inputs[i];
        // How do you prevent the deposit block from being used if it continues?
        // For example, you create the first txn with its input as the output from the deposit transaction.
        // Another txn is created that also uses the output of the deposit block as the input for the new txn
        if (blkNum === 0) continue;

        // Original implementation does not have current Block. Needed to add to transact with Utxos sitting in the current block
        let inputTx;
        if (blocks[blkNum]) {
            inputTx = blocks[blkNum].transactionSet[txIndex];
        } else {
            inputTx = currentBlock.transactionSet[txIndex];
        }

        // How can we access ethereum utils for signing while using coderunner?
        // Does it need to be installed on the docker? Probably a bit too complex to parse out.
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
        if (!validSignature) throw "Invalid Signature";
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
}
