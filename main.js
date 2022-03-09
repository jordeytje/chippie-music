const Discord = require('discord.js');
require('dotenv').config();
const keepAlive = require('./server');
const client = new Discord.Client();

const fs = require('fs');

client.commands = new Discord.Collection();
client.events = new Discord.Collection();

[ 'command_handler', 'event_handler' ].forEach((handler) => {
	require(`./handlers/${handler}`)(client, Discord);
});

keepAlive();
client.login(process.env.DISCORD_TOKEN);
