## What is Plasma?

Plasma is set of design patterns for batching transactions on top of a secure blockchain for the purposes of scalability, while mantaining the security gaurantees of that base level blockchain. 

Don't worry if we lost you there! Let's break it down. 

By design patterns we mean there are many different versions of Plasma. They are similar in the base architecture while there are many nuances that make some versions more advantageous in certain scenarios. 

Plasma achieves scalability by creating a smart contract on the main blockchain, which acts as a sort of Supreme Court. You don't need to settle all disputes at the Supreme Court. Similarly in Plasma you can complete most of your transactions without having to go back to the main blockchain. 

The rest of the Plasma architecture consists of a centralized operator and a bunch of client nodes which you can think of as users. The advantage of the centralized operator is that all transactions can occur efficiently. At the same time, the design is such that the central operator has no ability to steal your funds. Sound like magic? Stick around, you'll build your very own Plasma MVP and understand it's core mechanisms! 
 
### What is Plasma MVP?

This tutorial is called Plasma MVP. So what is that, exactly?

Plasma MVP or Minimal Viable Plasma, is the first proposed iteration of Plasma. As its name implies, it is the minimal concievable functionality necessary to achieve the design goals set out above (scalability with base layer security). 

There are many drawbacks to Plasma MVP in it's usability and there are many new proposed versions of Plasma being designed as we speak. However, it is the easiest one to teach and a great way to learn Plasma! 

### Components of Plasma

What are the components that make up Plasma, you ask? Great Question. Let's define them:

1. **Plasma Contract** - This is the Smart Contract that exists on the base blockchain (which may also be referred to as the "main" or "root" chain in this architecture). This is the contract you'll use if you want to enter assets into or exit assets from Plasma. It is also where all disputes occur, which is where the Supreme Court analogy came from. If you see in the plasma chain that Charlie sent some money to Bob, and Charlie tries to exit with that money you'd better let the root chain know (there may be a reward in it for you!). 

2. **Plasma Operator** - This is the centralized operator of the Plasma Chain (also referred to as the "child" or "side" chain). The operator manages and broadcasts all of the transactions that occur within the Plasma Chain. While it may sound like it has quite a bit of power in this architecture, don't worry! As a user within the Plasma Chain you can exit directly to the Root Chain at any time. So long as you haven't signed a message to send your asset anywhere else you'll be able to redeem it on the main chain.

3. **Client** - Think of this as a user within the Plasma Chain. They can transact with other clients in the plasma chain and can exit their funds to the root chain to go back to the base layer blockchain at any time.