## Attack Visualization

![Attack Scenario](https://res.cloudinary.com/divzjiip8/image/upload/v1555013316/DoubleSpendAttack_p0ym0w.png)

You agree to send 1 ETH to Bob. **However**, the operator decides to include this transaction **twice**! 

**Why is this bad?**

Since the transaction has been included twice, Bob can technically eixit with both outputs created and there would be no valid challenge. 

If there is at least 1 ETH left in the plasma chain, Bob would be able to steal this from the pot and escape with someone else's funds. 

**So, how do we mitigate this issue?**

We'll need to create a **priority** for our exits. Earlier UTXOs should be able to exit earlier. If this were the case, clients could detect that Bob is trying to exit with his double-spent transaction and they could all exit with their UTXOs that were created prior to this attack.

## Priority Queue 

A Priority Queue is a Queue that mantains the order of it's elements by a priority value. In our case, the priority will be the **lowest** integer value.

![Priority Queue](https://res.cloudinary.com/divzjiip8/image/upload/v1555017230/PriorityQueue_ooguqu.png)

Here you can see we're looking to insert a priority `3` into a queue with the values `0`, `2`, `6`, and `7`.

Algorithmically, we can look at this as we want to create some space for our `3` value. If we're using an array or a mapping with `uint` values, we'll want to move everything with lower priority down so that we have a spot for `3`. 

> This is not the only approach that will work here, and there are certainly more **efficient** algorithms that are not necessary here for our learning purposes.

Once we have created a space for the `3` value, we can simply insert it into that index. 