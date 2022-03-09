module.exports = (Discord, client) => {
	console.log('Chippie music is online.');
	client.user.setActivity('-help', { type: 'WATCHING' }).catch(console.error);
};
