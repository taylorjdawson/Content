## Utils

Transactions created on the Plasma chain follow the UTXO format, similar to Bitcoin. The UTXO model was chosen for Plasma MVP due to it's simplicity compared to an account-based design like the main Ethereum chain. 

## `encodeUtxoId` 

Provides a unique way to transfer, and possibly store, a reference to a specific UTXO.

## `decodeUtxoId` 

Decodes the UTXO ID created from `encodeUtxoId` and allows access to a specific UTXO's details.

## `validateTransaction`
Used to check for a valid transaction. A valid transaction in this context is described as none of its input UTXO's are already spent and the signatures used to sign the transactions are not null.

## Plasma Objects

This file consists of objects used to create the blocks and transactions on the Plasma chain.

## `Block`

This block can consist of thousands of transactions and is a crucial part of the scalability solution Plasma is attempting to solve. 

## `Transaction`

A UTXO format transaction.

The first 6 attributes (`blkNum`, `txIndex`, `oIndex`) in the constructor refer to the input UTXO's for the transaction. There can be up to two inputs for each transaction. Consistent with the UTXO model, when a UTXO is used as an input in a transaction, that specific UTXO is considered spent. 

The next 4 attributes (`newOwner`, `amount`) are the new UTXO's created by this transaction. There can be up to two UTXO's created by each transaction. If you were to send funds on the Plasma chain to another address, a typical situation would be to create a UTXO for the amount sent to that address and create a second UTXO which maps to your address and the amount remaining from the input UTXO used minus the amount sent to the other address. 

Next we have `sig1` and `sig2`, these signatures refer to the creator of the transaction when it is signed. 

Finally, we have whether a UTXO is `spent`. Each spent attribute will be set to `true` when the relative UTXO (`newOwner` and `amount`) is used as an input in another transaction.