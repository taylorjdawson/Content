## Merkle Root

The merkle root that is passed into the `submitBlock` function will be calculated on the JavaScript Plasma chain. 

We use a merkle library to handle building the merkle tree, getting the root of that tree, and creating/verifying a merkle proof. 

If you would like to learn more about merkle trees, try out our Merkle Tree lesson to build your own JS implementation.

## Called by Operator

Since we are building an operator Plasma implementation, it is essential that only the operator can submit a block to the chain. 

This functionality would differ if we were running on another ownership structure such as Proof of Stake.