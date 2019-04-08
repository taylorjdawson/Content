The function should create a confirmation hash from the transaction hash and block root.

The function should then require the owner address located at the exit UTXO position within `exits` to be equal to the recovered address, from the confirmation hash created above, and the confirmation signature passed into the function.

> Hint: Use the `ECRecovery` library to `recover` the appropriate address.