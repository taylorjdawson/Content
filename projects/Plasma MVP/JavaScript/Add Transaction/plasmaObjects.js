const { web3 } = require('./web3Util.js');
const { encodeUtxoId, decodeUtxoId, decodeTxId, NULL_ADDRESS,
    NULL_SIGNATURE, NULL_HASH, sign } = require('./utils.js');
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
            let hexStrings = web3.utils.soliditySha3(...transformed).slice(2);
            return Buffer.from(hexStrings, 'hex');
        });
    }
}

class TransactionInput {
    constructor(blkNum = 0, txIndex = 0, oIndex = 0, signature = NULL_SIGNATURE) {
        this.blkNum = blkNum;
        this.txIndex = txIndex;
        this.oIndex = oIndex;
        this.signature = signature;
    }

    encode() {
        return encodeUtxoId(this.blkNum, this.txIndex, this.oIndex);
    }
}

class TransactionOutput {
    constructor(owner = NULL_ADDRESS, amount = 0) {
        this.owner = owner;
        this.amount = amount;
        this.spent = false;
    }
}

class Transaction {
    constructor(input1 = new TransactionInput(), input2 = new TransactionInput(), output1 = new TransactionOutput(), output2 = new TransactionOutput()) {
        this.input1 = input1;
        this.input2 = input2;
        this.output1 = output1;
        this.output2 = output2;
    }

    hash() {
        return web3.utils.soliditySha3("0x" + this.encoded().toString('hex'))
    }

    merkleHash() {
        return web3.utils.soliditySha3(this.hash(), this.sig1, this.sig2);
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

    
    confirm(root, key) {
        return sign(web3.utils.soliditySha3(this.hash(), root), key).toString('hex');
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
    TransactionInput,
    TransactionOutput,
}