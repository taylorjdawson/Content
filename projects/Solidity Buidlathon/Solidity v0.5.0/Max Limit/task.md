## Maximum Limit

You may have seen this coming: at some point we need to cut off our participants! 

We initially set a `maxParticipants` in our constructor on the first stage. Let's use this value to make sure we never exceed the maximum number of participants. 

If we do exceed the maximum, let's throw a state-reverting exception within our Buidlathon Contract.