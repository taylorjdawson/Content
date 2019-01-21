## Clean Up

Now that we have a function for adding a deposit to the Plasma chain, we need to re-factor some of our code in order to take advantage of this function.

1. Re-factor `depositListener` to call `addDeposit` upon returning an event
2. Remove `events` from the constructor

The `events` array is no longer needed as the `addDeposit` function is immediate invoked upon receipt of the `DepositCreated` event.