const { MessageEmbed } = require("discord.js");

module.exports = {
	name: 'say',
    aliases: ['speak'],
	description: "Praat als bot",
	async execute(client, message, cmd, args) {
        if (message.author.id === process.env.DEV_ID && args[0] && args[1]) {
            let text = args.slice(1).join();
            text = text.replace(/,/g, ' ');

            const embed = new MessageEmbed()
                .setColor('#13ec9c')
                .setTitle(`${args[0]}`)
                .setDescription(`${text}`)
                .setTimestamp();

            message.channel.send(embed);
        }
    }
};