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

While all 8 of these transactions are valid transactions that occurred in the Plasma Chain, all we need store in our Plasma Chain is one hash: `ABCDEFGH`. 

As a client in this system, you can see this block mined with proof that transaction `D` has been stored in the Root Chain and therefore your transfer is complete!

Meanwhile, our plasma chain effectively batched 8 transactions into one block. Not too shabby! 