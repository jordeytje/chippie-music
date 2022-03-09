module.exports = (Discord, client) => {
	console.log('Chippie is online.');
	client.user.setActivity('De BerenClub -help', { type: 'WATCHING' }).catch(console.error);
};
