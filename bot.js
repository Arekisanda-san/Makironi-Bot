// Load up the discord.js library
const Discord = require("discord.js");

// This is your client. Some people call it `bot`, some people call it `self`,
// some might call it `cootchie`. Either way, when you see `client.something`, or `bot.something`,
// this is what we're refering to. Your client.
const client = new Discord.Client();

// Here we load the config.json file that contains our token and our prefix values.
const config = require("./config.json");
// config.token contains the bot's token
// config.prefix contains the message prefix.

client.on("ready", () => {
  // This event will run if the bot starts, and logs in, successfully.
  console.log(`Bot has started, with ${client.users.size} users, in ${client.channels.size} channels of ${client.guilds.size} guilds.`);
  // Example of changing the bot's playing game to something useful. `client.user` is what the
  // docs refer to as the "ClientUser".
  client.user.setActivity(`Taking notes`);
});

client.on("guildCreate", guild => {
  // This event triggers when the bot joins a guild.
  console.log(`New guild joined: ${guild.name} (id: ${guild.id}). This guild has ${guild.memberCount} members!`);
  client.user.setActivity(`Serving ${client.guilds.size} servers`);
});

client.on("guildDelete", guild => {
  // this event triggers when the bot is removed from a guild.
  console.log(`I have been removed from: ${guild.name} (id: ${guild.id})`);
  client.user.setActivity(`Serving ${client.guilds.size} servers`);
});


client.on("message", async message => {
  // This event will run on every single message received, from any channel or DM.

  // It's good practice to ignore other bots. This also makes your bot ignore itself
  // and not get into a spam loop (we call that "botception").
  if(message.author.bot) return;

  // Also good practice to ignore any message that does not start with our prefix,
  // which is set in the configuration file.
  if(message.content.indexOf(config.prefix) !== 0) return;

  // Here we separate our "command" name, and our "arguments" for the command.
  // e.g. if we have the message "+say Is this the real life?" , we'll get the following:
  // command = say
  // args = ["Is", "this", "the", "real", "life?"]
  const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();

  // Let's go with a few common example commands! Feel free to delete or change those.

  if(command === "remember") {
    // Calculates ping between sending a message and editing it, giving a nice round-trip latency.
    // The second ping is an average latency between the bot and the websocket server (one-way, not round-trip)
    const m = await message.channel.send("remember");
    m.edit(`who you are. Latency is ${m.createdTimestamp - message.createdTimestamp}ms. API Latency is ${Math.round(client.ping)}ms`);
  }

  if(command === "record") {
    // makes the bot say something and delete the message. As an example, it's open to anyone to use.
    // To get the "message" itself we join the `args` back into a string with spaces:
    const sayMessage = args.join(" ");
    // Then we delete the command message (sneaky, right?). The catch just ignores the error with a cute smiley thing.
    message.delete().catch(O_o=>{});
    // And we get the bot to say the thing:
    //channel = message.guild.channels.get("436745249122025472");
    //message.guild.channels.get("436745249122025472").send(sayMessage);
    message.guild.channels.get("436745249122025472").send(message.member + ":  " + sayMessage);
    //message.channel.send(sayMessage);
  }

  if(command === "avatar") {
	//If no member specified, grabs the author's avi
	if (args.length === 0)
	{
		return message.channel.send(message.author.avatarURL);
	}

    let member = message.mentions.users.first() || client.users.find("username", args.join(" ")) || message.guild.members.find("nickname", args.join(" ")).user;

    // Grabs the mentioned user's avi
    message.channel.send(member.avatarURL);
  }

/*
  if(command === "kick") {
    // This command must be limited to mods and admins. In this example we just hardcode the role names.
    // Please read on Array.some() to understand this bit:
    // https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Array/some?
    if(!message.member.roles.some(r=>["Administrator", "Moderator"].includes(r.name)) )
      return message.reply("Sorry, you don't have permissions to use this!");

    // Let's first check if we have a member and if we can kick them!
    // message.mentions.members is a collection of people that have been mentioned, as GuildMembers.
    // We can also support getting the member by ID, which would be args[0]
    let member = message.mentions.members.first() || message.guild.members.get(args[0]);
    if(!member)
      return message.reply("Please mention a valid member of this server");
    if(!member.kickable)
      return message.reply("I cannot kick this user! Do they have a higher role? Do I have kick permissions?");

    // slice(1) removes the first part, which here should be the user mention or ID
    // join(' ') takes all the various parts to make it a single string.
    let reason = args.slice(1).join(' ');
    if(!reason) reason = "No reason provided";

    // Now, time for a swift kick in the nuts!
    await member.kick(reason)
      .catch(error => message.reply(`Sorry ${message.author} I couldn't kick because of : ${error}`));
    message.reply(`${member.user.tag} has been kicked by ${message.author.tag} because: ${reason}`);

  }

  */
/*
  if(command === "ban") {
    // Most of this command is identical to kick, except that here we'll only let admins do it.
    // In the real world mods could ban too, but this is just an example, right? ;)
    if(!message.member.roles.some(r=>["Administrator"].includes(r.name)) )
      return message.reply("Sorry, you don't have permissions to use this!");

    let member = message.mentions.members.first();
    if(!member)
      return message.reply("Please mention a valid member of this server");
    if(!member.bannable)
      return message.reply("I cannot ban this user! Do they have a higher role? Do I have ban permissions?");

    let reason = args.slice(1).join(' ');
    if(!reason) reason = "No reason provided";

    await member.ban(reason)
      .catch(error => message.reply(`Sorry ${message.author} I couldn't ban because of : ${error}`));
    message.reply(`${member.user.tag} has been banned by ${message.author.tag} because: ${reason}`);
  }*/
/*
  if(command === "purge") {
    // This command removes all messages from all users in the channel, up to 100.

    // get the delete count, as an actual number.
    const deleteCount = parseInt(args[0], 10);

    // Ooooh nice, combined conditions. <3
    if(!deleteCount || deleteCount < 2 || deleteCount > 100)
      return message.reply("Please provide a number between 2 and 100 for the number of messages to delete");

    // So we get our messages, and delete them. Simple enough, right?
    const fetched = await message.channel.fetchMessages({limit: deleteCount});
    message.channel.bulkDelete(fetched)
      .catch(error => message.reply(`Couldn't delete messages because of: ${error}`));
  }   */
});


client.on('messageDelete', async (message) => {
  //message.guild.channels.get("472868596301692928").send("About to initialize entry");
  const logs = message.guild.channels.find('name', 'logs');
  if (message.guild.me.hasPermission('MANAGE_CHANNELS') && !logs) {
    message.guild.createChannel('logs', 'text');
  }
  if (!message.guild.me.hasPermission('MANAGE_CHANNELS') && !logs) {
    console.log('The logs channel does not exist and tried to create the channel but I am lacking permissions')
  }
  //message.guild.channels.get("472868596301692928").send("About to initialize entry");
  const entry = await message.guild.fetchAuditLogs({type: 'MESSAGE_DELETE'}).then(audit => audit.entries.first())
  //logs.send(`passed entry initialization`);
  let user = ""


    if (entry.extra.channel.id === message.channel.id
      && (entry.target.id === message.author.id)
      && (entry.createdTimestamp > (Date.now() - 5000))
      && (entry.extra.count >= 1)) {
    user = entry.executor.username
  } else {
    user = message.author.username
  }
    //user = entry.executor.username
  logs.send(`A message was deleted in ${message.channel.name} by ${user}`);
})





client.on('roleCreate', async (message) => {
  //message.guild.channels.get("472868596301692928").send("About to initialize entry");
  const logs = message.guild.channels.find('name', 'logs');
  if (message.guild.me.hasPermission('MANAGE_CHANNELS') && !logs) {
    message.guild.createChannel('logs', 'text');
  }
  if (!message.guild.me.hasPermission('MANAGE_CHANNELS') && !logs) {
    console.log('The logs channel does not exist and tried to create the channel but I am lacking permissions')
  }
  //message.guild.channels.get("472868596301692928").send("About to initialize entry");
  const entry = await message.guild.fetchAuditLogs({type: 'ROLE_CREATE'}).then(audit => audit.entries.first())
  //logs.send(`passed entry initialization`);
  let user = ""



    user = entry.executor.username

    //user = entry.executor.username
  logs.send(`A new role was created by ${user}`);
})


client.on('roleDelete', async (role) => {
  let guild = client.guilds.get("332159937545240588");
  const logs = guild.channels.find('name', 'logs');
  const entry = await guild.fetchAuditLogs({type: 'ROLE_DELETE'}).then(audit => audit.entries.first())
  //console.log(roleDelete.role)
  //console.log(`target name is ${entry.target.name}`)
  let user = entry.executor.username
  //let deletedRole = entry.target.name
  logs.send(`The role ${role.name} was deleted by ${user}`);
})




client.on('roleUpdate', async (role) => {
  let guild = client.guilds.get("332159937545240588");
  const logs = guild.channels.find('name', 'logs');
  const entry = await guild.fetchAuditLogs({type: 'ROLE_UPDATE'}).then(audit => audit.entries.first())
  //console.log(entry.changes)
  //console.log(roleDelete.role)
  //console.log(`target name is ${entry.target.name}`)
  let user = entry.executor.username
  //let deletedRole = entry.target.name
  logs.send(`The role ${role.name} was changed by ${user}.  Due to how Discord is handling permissions, I don't know how to display the change at the moment.  Please consult the actual audit log to see the changes made.`);
})



client.on('guildMemberAdd', async (member) => {
  let guild = client.guilds.get("332159937545240588");
  const logs = guild.channels.find('name', 'logs');


  logs.send(`${member.user.username} has entered the server`);
})



client.on('guildMemberRemove', async (member) => {
  let guild = client.guilds.get("332159937545240588");
  const logs = guild.channels.find('name', 'logs');
  const entry = await guild.fetchAuditLogs({type: 'MEMBER_KICK'}).then(audit => audit.entries.first())
  //console.log(entry.changes)
  //console.log(roleDelete.role)
  //console.log(`target name is ${entry.target.name}`)
  if(entry.executor){
  let user = entry.executor.username
  return logs.send(`${member.user.username} was kicked by ${user}.`);
}
  //let deletedRole = entry.target.name
  logs.send(`${member.user.username} has left the server`);
})



client.on('guildBanAdd', async (guild, user) => {
  //let guild = client.guilds.get("332159937545240588");
  const logs = guild.channels.find('name', 'logs');
  const entry = await guild.fetchAuditLogs({type: 'MEMBER_BAN_ADD'}).then(audit => audit.entries.first())
  //console.log(entry.changes)

  //console.log(roleDelete.role)
  //console.log(`target name is ${entry.target.name}`)

  //console.log(`${user}`)
  let banner = entry.executor.username
  logs.send(`${user.username} has been banned by ${banner}`);
})


client.on('guildBanRemove', async (guild, user) => {
  //let guild = client.guilds.get("332159937545240588");
  const logs = guild.channels.find('name', 'logs');
  const entry = await guild.fetchAuditLogs({type: 'MEMBER_BAN_REMOVE'}).then(audit => audit.entries.first())
  //console.log(user)   CURSED.  DO NOT USE.
  //console.log(roleDelete.role)
  //console.log(`target name is ${entry.target.name}`)
  //console.log(`${members.user}`)
  //let deletedRole = entry.target.name
  let unbanner = entry.executor.username
  logs.send(`${user.username} has been unbanned by ${unbanner}`);
})



client.login(config.token);
