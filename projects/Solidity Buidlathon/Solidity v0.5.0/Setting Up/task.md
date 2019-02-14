## Setting up our Buidlathon

Let's create a Buidlathon contract that will allow participants to enter our Buidlathon! 

First let's set the maximum number of participants who can enter.

### Max Participants Integer

For our Buidlathon we want to determine the maximum number of participants we can admit. 

Let's set a `public` `uint` called `maxParticipants` within our contract. 

### Constructor

Next we'll want to create a constructor which will take in a `uint` of its own and store it within the public `maxParticipants` integer we just created.