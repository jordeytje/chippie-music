const { MessageEmbed } = require("discord.js");

module.exports = {
	name: 'help',
	description: "Help",
	async execute(client, message) {
		const embed = new MessageEmbed()
		  .setColor('#0099ff')
		  .setTitle('Chippie music Help')
		  .setDescription(
		  	'Onderstaande commando\'s worden uitgevoerd met **een streepje** als **prefix -**\n' +
		  	'De blokhaken zoals [deze] staan voor argumenten, deze haken moet je niet typen.\n\n' +
		  	'Je kan gebruik maken van **play** | **p**, **skip** | **s**, **queue** | **q** of **stop**.')
		  .setFooter('Heb je een idee of toevoeging voor de bot? Let me know.');

		  message.channel.send(embed);
	}
};