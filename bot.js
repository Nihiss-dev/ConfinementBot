// This line MUST be first, for discord.js to read the process envs!
require('dotenv').config(); 
const Discord = require('discord.js');
const { write } = require('./utils');
const clientDiscord = new Discord.Client({ partials: ['MESSAGE', 'CHANNEL', 'REACTION'] });
const utils = require('./utils');

const { Client } = require('pg');

const clientPG = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

clientPG.connect();

console.log(clientDiscord);
clientDiscord.on('ready', () => {
		console.log(`Logged in as ${clientDiscord.user.tag}!`);
});

clientDiscord.on('message', message => {
	if (message.author.bot) return;

	if (message.content.length < 5 && message.content.toLowerCase().substring(0,3) === 'oui') {
		if (utils.between(0, 100) > 50) {
			message.channel.send("stiti.");			
		}
	}

	if (message.content.length < 6 && message.content.toLowerCase().substring(0,4) === 'quoi') {
		if (utils.between(0, 100) > 50) {
			message.channel.send("feur.");			
		}
	}
	// COMMANDS

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
		text = 'INSERT INTO MessageToRole(messageId, role, emoji) VALUES($1, $2, $3)';
		values = [args[0], args[1], args[2]];

		clientPG.query(text, values, (err, res) => {
			if (err) {
			  console.log(err.stack)
			} else {
			  console.log(res.rows[0])
			}
		  })
	}
  });


// There's zero need to put something here. Discord.js uses process.env.CLIENT_TOKEN if it's available,
// and this is what is being used here. If on discord.js v12, it's DISCORD_TOKEN
clientDiscord.login();

clientDiscord.on('voiceStateUpdate', (oldState, newState) => {
	const role = newState.guild.roles.cache.find(r => r.name === 'JDR-InGame');
    if (!newState.channel || !newState.member) newState.member.roles.remove(role)//return; // Triggered if the user left a channel
    const testChannel = newState.guild.channels.cache.find(c => c.name === 'En jeu vocal');
    //const testChannel = newState.guild.channels.cache.find(c => c.name === 'test');
    if (newState.channelID === testChannel.id) { // Triggered when the user joined the channel we tested for
        if (!newState.member.roles.cache.has(role)) newState.member.roles.add(role); // Add the role to the user if they don't already have it
    }
});

clientDiscord.on('messageReactionAdd', async (reaction, user) => {
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
	query = {
		name : 'getRoleFromMessageIdAndEmoji',
		text : 'SELECT role FROM MessageToRole WHERE messageId=$1 AND emoji=$2',
		values : [reaction.message.id, `${reaction.emoji}`],
	}

	clientPG.query(query, (err, res) => {
		if (err) {
		  console.log(err.stack)
		} else {
			let newRole;
			try {
				newRole = res.rows[0].role;

			}
			catch (error) {
				newRole = null;
			}
			if (newRole != null) {
				const role = reaction.message.guild.roles.cache.find(r => r.name === newRole);
	  
				const { guild } = reaction.message //store the guild of the reaction in variable
				const member = guild.members.cache.find(member => member.id === user.id); //find the member who reacted (because user and member are seperate things)
				member.roles.add(role); //assign selected role to member	  	
			}
  		}
	  })
});

clientDiscord.on('messageReactionRemove', async (reaction, user) => {
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
	query = {
		name : 'getRoleFromMessageIdAndEmoji',
		text : 'SELECT role FROM MessageToRole WHERE messageId=$1 AND emoji=$2',
		values : [reaction.message.id, `${reaction.emoji}`],
	}

	clientPG.query(query, (err, res) => {
		if (err) {
		  console.log(err.stack)
		} else {
			let newRole;
			try {
				newRole = res.rows[0].role;
			} catch (error) {
				newRole = null;
			}

			if (newRole != null) {
				const role = reaction.message.guild.roles.cache.find(r => r.name === newRole);

				const { guild } = reaction.message //store the guild of the reaction in variable
				const member = guild.members.cache.find(member => member.id === user.id); //find the member who reacted (because user and member are seperate things)
				member.roles.remove(role); //remove selected role to member	  
			}
		  }
	  })
});