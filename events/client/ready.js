module.exports = (Discord, client) => {
	console.log('Chippie is online.');
	client.user.setActivity('-help', { type: 'WATCHING' }).catch(console.error);
};
