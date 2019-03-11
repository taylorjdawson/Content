## UTXO  

A UTXO format transaction.

The first 6 attributes (`blkNum`, `txIndex`, `oIndex`) in the constructor refer to the input UTXO's for the transaction. There can be up to two inputs for each transaction. Consistent with the UTXO model, when a UTXO is used as an input in a transaction, that specific UTXO is considered spent. 

The next 4 attributes (`newOwner`, `amount`) are the new UTXO's created by this transaction. There can be up to two UTXO's created by each transaction. If you were to send funds on the Plasma chain to another address, a typical situation would be to create a UTXO for the amount sent to that address and create a second UTXO which maps to your address and the amount remaining from the input UTXO used minus the amount sent to the other address. 

Next we have `sig1` and `sig2`, these signatures refer to the creator of the transaction when it is signed. 

Finally, we have whether a UTXO is `spent`. Each spent attribute will be set to `true` when the relative UTXO (`newOwner` and `amount`) is used as an input in another transaction.