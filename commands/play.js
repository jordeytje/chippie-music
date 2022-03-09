const ytdl = require('ytdl-core');
const ytSearch = require('yt-search');

const queue = new Map();

require('dotenv').config();

module.exports = {
	name: 'play',
	aliases: ['skip', 'stop', 'queue', 'q', 's', 'p'],
	description: 'Voegt de bot toe en speelt Youtube af',

	async execute(client, message, cmd, args) {
		const voiceChannel = message.member.voice.channel;

		// check of ze in een voice channel zitten
		if (!voiceChannel)
			return message.channel.send('Je moet in een spraakkanaal zitten om dit commando uit te voeren.');

		const serverQueue = queue.get(message.guild.id);

		if (cmd === 'play' || cmd === 'p') {
			// check of een argument wordt meegegeven
			if (!args.length) {
				args = [ 'https://www.youtube.com/watch?v=iik25wqIuFo&ab_channel=Rickroll%2Cbutwithadifferentlink' ];

				message.channel.send(
					`${message.author} You fcked up. Gottemmm. Much love - Rick`
				);
			} else if (args[0].includes('spotify')) {
				return message.channel.send(`${message.author} Spotify wordt niet ondersteund.`);
			}

			let song = {};

			if (ytdl.validateURL(args[0])) {
				// video via URL
				const songInfo = await ytdl.getInfo(args[0]);

				song = {
					title: songInfo.videoDetails.title,
					url: songInfo.videoDetails.video_url,
					time: calculateTime(songInfo.videoDetails.lengthSeconds)
				};
			} else {
				//video via keywords
				const videoFinder = async (query) => {
					const videoResult = await ytSearch(query);
					return videoResult.videos.length > 1 ? videoResult.videos[0] : null;
				};

				const video = await videoFinder(args.join(' '));

				if (video) {
					song = {
						title: video.title ? video.title : 'Onbekend, but it will work',
						url: video.url ? video.url : 'Onbekend, but it will work',
						time: video.timestamp ? video.timestamp : '0'
					};
				} else {
					return message.channel.send('Niks gevonden');
				}
			}

			// muziek queue
			if (!serverQueue) {
				const queueConstructor = {
					voiceChannel: voiceChannel,
					textChannel: message.channel,
					connection: null,
					songs: []
				};

				queue.set(message.guild.id, queueConstructor);
				queueConstructor.songs.push(song);

				try {
					const connection = await voiceChannel.join();
					queueConstructor.connection = connection;
					videoPlayer(message.guild, queueConstructor.songs[0]);
				} catch (err) {
					queue.delete(message.guild.id);
					message.channel.send('RIP der ging wat fout, probeer \'t ff opnieuw..');
					throw err;
				}
			} else {
				serverQueue.songs.push(song);
				return message.channel.send(`**${song.title}** toegevoegd aan queue.`);
			}
		} else if (cmd === 'skip' || cmd === 's') {
			skipSong(message, serverQueue);
		} else if (cmd === 'stop') {
			stopSong(message, serverQueue);
		} else if (cmd === 'queue' || cmd === 'q') {
			songList(message, serverQueue);
		}
	}
};

const videoPlayer = async (guild, song) => {
	const songQueue = queue.get(guild.id);

	if (!song) {
		songQueue.voiceChannel.leave();
		queue.delete(guild.id);
		return;
	}

	const stream = ytdl(song.url, { filter: 'audioonly' });
	songQueue.connection.play(stream, { seek: 0, volume: 0.5 }).on('finish', () => {
		songQueue.songs.shift();
		videoPlayer(guild, songQueue.songs[0]);
	});

	await songQueue.textChannel.send(`Aan het genieten van **${song.title}**`);
};

const skipSong = (message, serverQueue) => {
	if (message && !message.member.voice.channel)
		return message.channel.send('Je moet in een spraakkanaal zitten om dit commando uit te voeren.');

	if (serverQueue) serverQueue.connection.dispatcher.end();
};

const stopSong = (message, serverQueue) => {
	if (!message.member.voice.channel)
		return message.channel.send('Je moet in een spraakkanaal zitten om dit commando uit te voeren.');

  if (serverQueue) {
   serverQueue.songs = []
   serverQueue.connection.dispatcher.end(); 
  }

	message.channel.send('*De bot is geyeet into oblivion.*');
};

const songList = (message, serverQueue) => {
	if (!message.member.voice.channel)
		return message.channel.send('Je moet in een spraakkanaal zitten om dit commando uit te voeren.');

	if (!serverQueue) return message.channel.send('Er is geen queue.');

	let list = [];
  
	serverQueue.songs.forEach((q) => {
		list.push(`${q.title} - ${q.time}`);
	});

	message.channel.send('```' + list.map((i) => `${list.indexOf(i) + 1}. ${i}`).join('\n') + '```');
};

// secondes naar minuten en secondes
function calculateTime(time) {
	var hr = ~~(time / 3600);
	var min = ~~((time % 3600) / 60);
	var sec = time % 60;
	var sec_min = '';
	if (hr > 0) {
		sec_min += '' + hr + ':' + (min < 10 ? '0' : '');
	}
	sec_min += '' + min + ':' + (sec < 10 ? '0' : '');
	sec_min += '' + sec;
	return sec_min;
}
