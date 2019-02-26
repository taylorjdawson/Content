import app from './app';

/**
 * Returns an observable that will call for votes by their id and transform the data received
 * @param {number} id
 * @returns {observable}
 */
function loadVote(id) {
	return app.call('votes', id)
		.map((vote) => {
			vote.yes = parseInt(vote.yes);
			vote.no = parseInt(vote.no);
			vote.id = id;
			return vote;
		})
}

export default loadVote;
