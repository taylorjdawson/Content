import loadVote from './loadVote';
import toPromiseFunction from './toPromiseFunction';

// turn the loadVote observable into function returning a promise
let votePromiseFn = toPromiseFunction(loadVote);

async function stateUpdate(state, { event, returnValues }) {
    state = state || { votes: [] };
    if (event === 'VoteCreated') {
        const vote = await votePromiseFn(returnValues[0]);
        state.votes.push(vote);
    }
    if (event === 'VoteCast') {
        const vote = state.votes[returnValues];
        vote.yes++;
    }
    return state;
}

export default stateUpdate;
