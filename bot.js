// This line MUST be first, for discord.js to read the process envs!
require('dotenv').config(); 
const Discord = require('discord.js');
const { write } = require('./utils');
const client = new Discord.Client({ partials: ['MESSAGE', 'CHANNEL', 'REACTION'] });
const utils = require('./utils');
const fs = require('fs');

var channels = {};

var infos = function() {
	this.messageId = "";
	this.Role = "";
}

var IdtoRole = {
	table : []
}

console.log(client);
client.on('ready', () => {
		console.log(`Logged in as ${client.user.tag}!`);

		if (fs.existsSync("data.json")) {

			var loadedInfo = utils.loadIdToRole();
			
			infosJson = JSON.parse(loadedInfo);

			infosJson.table.forEach(function(info) {
				console.log(`infos: ${info.messageId}`);
				console.log(`loadedInfo: ${info.Role}`);	
				IdtoRole.table.push(info);
			});

			IdtoRole.table.forEach(function(value) {
				console.log(`${value.messageId} on message`);
			});
		}
	});

client.on('message', message => {
	if (message.author.bot) return;
	// The process.env.PREFIX is your bot's prefix in this case.
	if (message.content.indexOf(process.env.PREFIX) !== 0) return;
  
	// This is the usual argument parsing we love to use.
	const args = message.content.slice(process.env.PREFIX.length).trim().split(/ +/g);
	const command = args.shift().toLowerCase();
  
	// And our 2 real basic commands!
	if(command === 'ping') {
	  message.channel.send('Pong!');
	} else
	if (command === 'blah') {
	  message.channel.send('Meh.');
	} else
	if (command === 'addmessage') {
		channels[args[0]] = args[1];
		infos.messageId = args[0];
		infos.Role = args[1];
		IdtoRole.table.push(infos);
		utils.writeId(IdtoRole);
	}
  });


// There's zero need to put something here. Discord.js uses process.env.CLIENT_TOKEN if it's available,
// and this is what is being used here. If on discord.js v12, it's DISCORD_TOKEN
client.login();

client.on('voiceStateUpdate', (oldState, newState) => {
	const role = newState.guild.roles.cache.find(r => r.name === 'JDR-InGame');
    if (!newState.channel || !newState.member) newState.member.roles.remove(role)//return; // Triggered if the user left a channel
    const testChannel = newState.guild.channels.cache.find(c => c.name === 'En jeu vocal');
    //const testChannel = newState.guild.channels.cache.find(c => c.name === 'test');
    if (newState.channelID === testChannel.id) { // Triggered when the user joined the channel we tested for
        if (!newState.member.roles.cache.has(role)) newState.member.roles.add(role); // Add the role to the user if they don't already have it
    }
});

client.on('messageReactionAdd', async (reaction, user) => {
	// When we receive a reaction we check if the reaction is partial or not
	if (reaction.partial) {
		// If the message this reaction belongs to was removed the fetching might result in an API error, which we need to handle
		try {
			await reaction.fetch();
		} catch (error) {
			console.error('Something went wrong when fetching the message: ', error);
			// Return as `reaction.message.author` may be undefined/null
			return;
		}
	}
	// Now the message has been cached and is fully available
	console.log(`${reaction.message.author}'s message "${reaction.message.content}" gained a reaction!`);
	// The reaction is now also fully available and the properties will be reflected accurately:
	console.log(`${reaction.count} user(s) have given the same reaction to this message!`);
	console.log(`${reaction.emoji.name} has been added`);
	console.log(`${reaction.message.id}: message id`);

	IdtoRole.table.forEach(function(info) {
		if (info.messageId == reaction.message.id) {
			console.log(`${reaction.emoji.name} on message`);
			const role = reaction.message.guild.roles.cache.find(r => r.name === info.Role);

            const { guild } = reaction.message //store the guild of the reaction in variable
            const member = guild.members.cache.find(member => member.id === user.id); //find the member who reacted (because user and member are seperate things)
            member.roles.add(role); //assign selected role to member
		}
	});

});