## Plasma Block

So, what is a Plasma Block and why is it in our Plasma Contract? 

The Plasma Block exists as a structure that contains a **hash merkle root** of all transactions within the Plasma Chain.

Think of a Merkle Tree of 8 transactions. Let's call them `A`, `B`, `C`, `D`, `E`, `F`, `G`, and `H`. 

```
    ABCDEFGH
    /     \
  ABCD    EFGH
  / \     / \
 AB CD   EF GH
/ \ / \ / \ / \
A B C D E F G H 
```

> In this Merkle Tree, consider each joining of the letters a hashing of the two nodes. So `AB` `==` `Hash(A,B)`

While all 8 of these transactions occurred within the Plasma Chain, all we need store in the Root Chain is one hash: `ABCDEFGH`. 

As a client in this system, you can watch this block mined with proof that transaction `D` has been stored in the Root Chain and therefore your transfer is complete!

Meanwhile, our plasma chain effectively batched 8 transactions into one block. Not too shabby! 

For more on Merkle Trees, check out our [Merkle Tree Lesson](https://www.chainshot.com/lessons/5c36bf15143eed0017f579755ba1558bd9f997cd2e33eba7/stage/5c36bf15143eed0017f579755ba155e6d9f997cd2e33eba8).

## Architecture

The goal of these first three stages is to create a Plasma Contract that allows users to deposit ether into a plasma chain.

![Plasma Contract](https://res.cloudinary.com/divzjiip8/image/upload/v1553299880/ContractDeposits_flbay7.png)

For each deposit we'll create a special Plasma Block called a Deposit Block that will keep track of who deposited the block and how much they deposited.
