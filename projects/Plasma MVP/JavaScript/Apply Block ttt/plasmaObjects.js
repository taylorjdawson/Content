const { encodeUtxoId, decodeUtxoId, decodeTxId, NULL_ADDRESS,
    NULL_SIGNATURE, NULL_HASH, sign } = require('./utils.js');
const { sha3 } = require("./sha3Util.js");
// const Web3Utils = require('web3-utils');
// const CryptoJS = require('crypto-js');
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
        let inputs = [[tx.blkNum1, tx.txIndex1, tx.oIndex1], [tx.blkNum2, tx.txIndex2, tx.oIndex2]];
        inputs.forEach(input => {
            const inputId = encodeUtxoId(...input);
            this.spentUtxos[inputId] = true;
        });
    }

    merkle() {
        let hashedTxSet = [];
        this.transactionSet.forEach((tx, idx) => {
            const hashed = tx.merkleHash().slice(2);
            hashedTxSet.push(hashed);
        });

        let i = 0;
        while (Math.pow(2, i) < hashedTxSet.length) i++;
        let leftOver = Math.pow(2, i) - hashedTxSet.length;
        for (let j = 0; j < leftOver; j++) hashedTxSet.push(NULL_HASH.slice(2));
        return new MerkleTree(hashedTxSet, (...args) => {
            let transformed = args.map((buffer) => {
                return "0x" + buffer.toString('hex');
            })
            // let hexStrings = Web3Utils.soliditySha3(...transformed).slice(2);
            let hexStrings = sha3(...transformed).slice(2);
            return Buffer.from(hexStrings, 'hex');
        });
    }
}

class Transaction {
    constructor(blkNum1 = 0, txIndex1 = 0, oIndex1 = 0, blkNum2 = 0, txIndex2 = 0, oIndex2 = 0,
        newOwner1 = NULL_ADDRESS, amount1 = 0, newOwner2 = NULL_ADDRESS, amount2 = 0, token = NULL_ADDRESS, sig1 = NULL_SIGNATURE, sig2 = NULL_SIGNATURE) {
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
        this.token = token;
        this.sig1 = sig1;
        this.sig2 = sig2;

        this.spent1 = false;
        this.spent2 = false;
    }

    hash() {
        // return Web3Utils.soliditySha3("0x" + this.encoded().toString('hex'))
        return sha3("0x" + this.encoded().toString('hex'))
    }

    merkleHash() {
        // return Web3Utils.soliditySha3(this.hash(), this.sig1, this.sig2);
        return sha3(this.hash(), this.sig1, this.sig2);
    }

    // In order to encode the Transaction object we need to make sure all attributes are properly encodable
    encoded() {
        return rlp.encode([
            this.blkNum1, this.txIndex1, this.oIndex1,
            this.blkNum2, this.txIndex2, this.oIndex2,
            Buffer.from(this.newOwner1.slice(2), 'hex'), this.amount1,
            Buffer.from(this.newOwner2.slice(2), 'hex'), this.amount2,
            Buffer.from(this.token.slice(2), 'hex')
        ]);
    }

    // Need Web3Utils soliditySha3 for ease of adding multiple arguments to the sha3 function
    // The sha3 function in sha3Util has an odd way of passing in multiple arguments
    confirm(root, key) {
        // return sign(Web3Utils.soliditySha3(this.hash(), root), key).toString('hex');
        return sign(sha3(this.hash(), root), key).toString('hex');
    }

    sign1(key) {
        this.sig1 = '0x' + sign(this.hash(), key).toString('hex');
    }

    sign2(key) {
        this.sig2 = '0x' + sign(this.hash(), key).toString('hex');
    }
}

module.exports = {
    Block,
    Transaction,
}




// const {encodeUtxoId, decodeUtxoId, decodeTxId} = require('./utils.js');
// const {sha3} = require ("./sha3Util.js");
// const rlp = require("./rlp.js");
// const MerkleTree = require("./merkleTree.js");

// class Block {
//     constructor(transactionSet, blockNumber) {
//         this.transactionSet = transactionSet;
//         this.blockNumber = blockNumber;
//         this.spentUtxos = {};
//     }

//     addTransaction(tx) {
//         this.transactionSet.push(tx);
//         // Implementation encodes the inputs then marks the inputId as True in the spent utxos object
//         // Not sure why this has to occur and what it exactly means if the spent on the actual transaction is still false
//         // => This occurs to store the utxos that are spent during the phase before the block is submitted. This way you are able to track which utxos have already been spent and properly validate the transaction.
//         let inputs = [[tx.blkNum1, tx.txIndex1, tx.oIndex1], [tx.blkNum2, tx.txIndex2, tx.oIndex2]];
//         inputs.forEach(input => {
//             const inputId = encodeUtxoId(...input);
//             this.spentUtxos[inputId] = true;
//         });
//         // Since the 3 inputs above are directly related to the utxo that was spent to create this new UTXO, we are able to refer back to these arguments and mark as spent.
//     }

//     merkle() {
//         let hashedTxSet = [];
//         this.transactionSet.forEach(tx => {
//             const hashed = tx.merkleHash().slice(2);
//             hashedTxSet.push(hashed);
//         });

//         return new MerkleTree(hashedTxSet, sha3);
//     }
// }

// // Should set sig1/2 to NULL_SIGNATURE
// class Transaction {
//     constructor(blkNum1=0, txIndex1=0, oIndex1=0, blkNum2=0, txIndex2=0, oIndex2=0,
//         newOwner1=NULL_ADDRESS, amount1=0, newOwner2=NULL_ADDRESS, amount2=0, sig1, sig2) {
//         this.blkNum1 = blkNum1;
//         this.txIndex1 = txIndex1;
//         this.oIndex1 = oIndex1;
//         this.blkNum2 = blkNum2;
//         this.txIndex2 = txIndex2;
//         this.oIndex2 = oIndex2;
//         this.newOwner1 = newOwner1;
//         this.amount1 = amount1;
//         this.newOwner2 = newOwner2;
//         this.amount2 = amount2;
//         this.sig1 = sig1;
//         this.sig2 = sig2;

//         this.spent1 = false;
//         this.spent2 = false;
//     }

//     hash() {
//         return sha3(this.encoded);
//     }

//     merkleHash() {
//         return sha3(this.hash + this.sig1 + this.sig2);
//     }

//     encoded() {
//         return rlp.encode([
//             this.blkNum1, this.txIndex1, this.oIndex1,
//             this.blkNum2, this.txIndex2, this.oIndex2,
//             Buffer.from(this.newOwner1.slice(2), 'hex'), this.amount1,
//             Buffer.from(this.newOwner2.slice(2), 'hex'), this.amount2,
//             Buffer.from(this.token.slice(2), 'hex')
//         ]);
//     }
// }

// module.exports = {
//     Block,
//     Transaction
// }


