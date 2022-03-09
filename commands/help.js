const { MessageEmbed } = require("discord.js");

module.exports = {
	name: 'help',
	description: "Help",
	async execute(client, message) {
		const embed = new MessageEmbed()
		  .setColor('#0099ff')
		  .setTitle('Chippie music Help')
		  .setDescription(
        '**play** of **p** om je nummertjes af te spelen \n' +
        '**skip** of **s** om je nummertjes te skippen \n' +
        '**queue** of **q** om je nummertjes te skippen \n' +
        '**stop** nummertje te stoppen \n' +
        '**help** makker wat denk je zelf \n\n' +
        '**Als de bot em tript** gebruik een paar keer **skip** en dan **play** zonder argumenten. (dit triggert *The Suprise* en fixt de bot).')
		  .setFooter('Heb je een idee of toevoeging voor de bot? Let me know.');

		  message.channel.send(embed);
	}
};