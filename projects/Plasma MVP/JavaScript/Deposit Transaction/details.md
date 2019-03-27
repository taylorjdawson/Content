## Architecture

Now we add the JS Operator to our Plasma Chain! Let's take a look at how that updates the overall picture of architecture:

![Plasma Operator](https://res.cloudinary.com/divzjiip8/image/upload/v1553482058/Operator_elgws0.png)

Notice how we're using the UTXO (Unspent Transaction Output) model here on our JS Operator. We'll need some way of determining which payments have been used and which haven't!

## UTXOs

For a simple analogy of UTXO let's think of cash.

You start with $1. You spend $0.45 and recieve back $0.55 in change. This results in two UTXOs for both $0.45 and $0.55.

The **$0.45** becomes someone else's unspent transaction output. **They own that output**.

You'll end up with a **$0.55** UTXO, which is **your** change. The original **$1** becomes marked as **spent**, so nobody has access to the original **$1** after the transaction is completed.

## Helper Files

### utils.js

Transactions created on the Plasma chain follow the UTXO format, similar to Bitcoin. This Plasma MVP implementation uses UTXO model due to it's simplicity compared to an account-based design like in Ethereum.

**`encodeUtxoId`**

Provides a unique way to transfer, and possibly store, a reference to a specific UTXO.

**`decodeUtxoId`**

Decodes the UTXO ID created from `encodeUtxoId` and allows access to a specific UTXO's details.

### plasmaObjects.js

This file consists of objects used to create the blocks and transactions on the Plasma chain.

**`Block`**

This block can consist of thousands of transactions and is a crucial part of the scalability solution Plasma is attempting to solve.

**`Transaction`**

A UTXO format transaction.

The first two arguments to construct a `Transaction` are of the `TransactionInput` type. There can be up to two inputs for each transaction. Consistent with the UTXO model, when a UTXO is used as an input in a transaction, that specific UTXO is considered spent.

Within the `TransactionInput` class we have four properties:

- **`blockNumber`** - The block number that this input comes from. Remember in our [Analogy](?tab=details&scroll=UTXOs) that an input in a transaction is an output of some other transaction.
- **`txIndex`** - Similar to our `blockNumber` property, the `txIndex` helps us find the UTXO by pointing us to the right transaction in the block's transaction set.
- **`outputIndex`** - As mentioned in the UTXO section and further explained below, a transaction may have two outputs in our implementation. The `outputIndex` tells us which one to look at to find this `input`.
- **`signature`** - The signatures verifies the owner of the UTXO intended this transaction.

The last two arguments in a `Transaction` are the new UTXO's created by this transaction. There can be up to two UTXO's created by each transaction. These are the results of the transaction. A UTXO input always refers to some unspent output in the past.

Within the `TransactionOutput` class we have three properties:

- **`owner`** - The address who can spend this output.
- **`amount`** - The amount stored in this output.
- **`spent`** - A boolean indicating whether or not this UTXO has already been spent. It should be marked `true` after a transaction is completed.
