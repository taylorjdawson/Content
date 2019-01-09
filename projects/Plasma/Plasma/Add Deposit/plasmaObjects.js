const {encodeUtxoId, decodeUtxoId, decodeTxId} = require('./utils.js');
const {sha3} = require ("./sha3Util.js");
const rlp = require("./rlp.js");
const MerkleTree = require("./merkleTree.js");

class Block {
    constructor(transactionSet, blockNumber) {
        this.transactionSet = transactionSet;
        this.blockNumber = blockNumber;
        this.spentUtxos = {};
    }

    addTransaction(tx) {
        this.transactionSet.push(tx);
        // Implementation encodes the inputs then marks the inputId as True in the spent utxos object
        // Not sure why this has to occur and what it exactly means if the spent on the actual transaction is still false
        // => This occurs to store the utxos that are spent during the phase before the block is submitted. This way you are able to track which utxos have already been spent and properly validate the transaction.
        let inputs = [[tx.blkNum1, tx.txIndex1, tx.oIndex1], [tx.blkNum2, tx.txIndex2, tx.oIndex2]];
        inputs.forEach(input => {
            const inputId = encodeUtxoId(...input);
            this.spentUtxos[inputId] = true;
        });
        // Since the 3 inputs above are directly related to the utxo that was spent to create this new UTXO, we are able to refer back to these arguments and mark as spent.
    }

    merkle() {
        let hashedTxSet = [];
        this.transactionSet.forEach(tx => {
            const hashed = tx.merkleHash().slice(2);
            hashedTxSet.push(hashed);
        });

        return new MerkleTree(hashedTxSet, sha3);
    }
}

// Should set sig1/2 to NULL_SIGNATURE
class Transaction {
    constructor(blkNum1=0, txIndex1=0, oIndex1=0, blkNum2=0, txIndex2=0, oIndex2=0,
        newOwner1=NULL_ADDRESS, amount1=0, newOwner2=NULL_ADDRESS, amount2=0, sig1, sig2) {
        this.blkNum1 = blkNum1;
        this.txIndex1 = txIndex1;
        this.oIndex1 = oIndex1;
        this.blkNum2 = blkNum2;
        this.txIndex2 = txIndex2;
        this.oIndex2 = oIndex2;
        this.newOwner1 = newOwner1;
        this.amount1 = amount1;
        this.newOwner2 = newOwner2;
        this.amount2 = amount2;
        this.sig1 = sig1;
        this.sig2 = sig2;

        this.spent1 = false;
        this.spent2 = false;
    }

    hash() {
        return sha3(this.encoded);
    }

    merkleHash() {
        return sha3(this.hash + this.sig1 + this.sig2);
    }

    encoded() {
        return rlp.encode(this, UnsignedTransaction(new Transaction()));
    }
}
// Not sure this works
const UnsignedTransaction = ({blkNum1, txIndex1, oIndex1, blkNum2, txIndex2, oIndex2, newOwner1, amount1, newOwner2, amount2, spent1, spent2}) => ({blkNum1, txIndex1, oIndex1, blkNum2, txIndex2, oIndex2, newOwner1, amount1, newOwner2, amount2, spent1, spent2})

module.exports = {
    Block,
    Transaction
}
