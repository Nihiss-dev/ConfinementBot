const Discord = require('discord.js');
const client = new Discord.Client();


console.log(client);
client.on('ready', () => {
		console.log(`Logged in as ${client.user.tag}!`);
	});

client.on('message', msg => {
	if (msg.content.substring(0,1) == '!')
	{
		var args = msg.content.substring(1).split(' ');
		var cmd = args[0];
		
		args = args.splice(1);
		switch (cmd)
		{
		}
	}
});

client.on('voiceStateUpdate', (oldState, newState) => {
    if (!newState.channel || !newState.member) return; // Triggered if the user left a channel
    const testChannel = newState.guild.channels.cache.find(c => c.name === 'test-voice');
    if (newState.channelID === testChannel.id) { // Triggered when the user joined the channel we tested for
        const role = newState.guild.roles.cache.find(r => r.name === 'Test');
        if (!newState.member.roles.cache.has(role)) newState.member.roles.add(role); // Add the role to the user if they don't already have it
    }
});
client.login("ODI0MzQzNTIwMjk0ODYyOTE5.YFt_ug.ICucTKtG3EWYVmvdYh9sOZmfvvw");
//client.login(process.env.DISCORD_TOKEN);