## Encoded UTXO ID

For this plasma implementation we'll be encoding & decoding our UTXO ID. This will take our three properties `blockNumber`, `transactionIndex` and `outputIndex` and provide us with a single integer value to lookup the UTXO:

![UTXO ID](https://res.cloudinary.com/divzjiip8/image/upload/v1553559789/utxoid_nosxvu.png)

If you take a look at the `utils.js` file you'll see that  in the `encodeUtxoId` function the values passed in are multiplied by these factors and then added together to get the one integer value.