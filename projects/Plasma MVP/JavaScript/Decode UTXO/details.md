## UTXO Position

UTXO Position: `2000003030001`

Can be decoded to:

Block Number: `2000`
Transaction Index: `303`
Output Index: `1`

![UTXO Position](https://res.cloudinary.com/divzjiip8/image/upload/v1554142977/CorrectedUTXOPosition_katge7.png)

## Hints

1. First try to decode the Block Number before decoding the other two numbers. If you return the block number as the first `uint` and it's wrong the test cases will say "Wrong Block Number". If they don't, it means you returned the correct block number!

> The block number will be the value above the ninth decimal place. For instance UTXO position `1000000000` indicates block number `1` and UTXO position `2000000000000` indicates block number `2000`.

2. After you have solved for the block number you can use that value to solve for your transaction index. Similar to the block number, you can return this value and see if it passes the test cases. 

> The transaction index is the value from the fifth decimal place to the ninth decimal place. For instance `1005010000` indicates a transaction index of `501`.

3. Finally, just solve for the output index! As an easy trick, the output index can only be `0` or `1` for our implementation. Making this assumption will pass test cases and is perfectly valid for our purposes. 
