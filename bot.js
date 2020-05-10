// Load up the discord.js library
const Discord = require("discord.js");

// This is your client. Some people call it `bot`, some people call it `self`,
// some might call it `cootchie`. Either way, when you see `client.something`, or `bot.something`,
// this is what we're refering to. Your client.
const client = new Discord.Client();

let Parser = require('rss-parser');
let parser = new Parser();

// Here we load the config.json file that contains our token and our prefix values.
const config = require("./config.json");
// config.token contains the bot's token
// config.prefix contains the message prefix.
const feeds = require("./feeds.json");

client.on("ready", () => {
  // This event will run if the bot starts, and logs in, successfully.
  console.log(`Bot has started, with ${client.users.size} users, in ${client.channels.size} channels of ${client.guilds.size} guilds.`);
  // Example of changing the bot's playing game to something useful. `client.user` is what the
  // docs refer to as the "ClientUser".
  client.user.setActivity(`Type =h for commands`);

  var postedFeeds = [];
  feeds.forEach(rssFeed => {
    let timer = setInterval(async () => {

      let feed = await parser.parseURL(rssFeed.feed);
      let channels = rssFeed.channels;

      feed.items.forEach(item => {
        if (!postedFeeds.includes(item.title)) {
          console.log(item.title);
          channels.forEach(channel => {
            client.channels.get(channel).send(item.title);
          });
          postedFeeds.push(item.title);
        }

        if (!postedFeeds.includes(item.link)) {
          console.log(item.link);
          channels.forEach(channel => {
            client.channels.get(channel).send(item.link);
          });
          postedFeeds.push(item.link);
        }

      });
    }, 1000 * rssFeed.intervalInSeconds);
  });
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
    if (message.guild.id === "529575902787534848" || message.guild.id === "357359971089907712" || message.guild.id === "241698498926477313")
    {
    const m = await message.channel.send("remember");
    m.edit(`who you are. Latency is ${m.createdTimestamp - message.createdTimestamp}ms. API Latency is ${Math.round(client.ping)}ms`);
    }
  }


//THIS NEEDS TO BE MADE ROBUST.  IT ONLY WORKS WITH A SPECIFIC SPE CHANNEL RIGHT NOW
  if(command === "record") {
    // makes the bot say something and delete the message. As an example, it's open to anyone to use.
    // To get the "message" itself we join the `args` back into a string with spaces:
    if (message.guild.id === "529575902787534848" || message.guild.id === "357359971089907712" || message.guild.id === "241698498926477313")
    {
    const sayMessage = args.join(" ");
    // Then we delete the command message (sneaky, right?). The catch just ignores the error with a cute smiley thing.
    message.delete().catch(O_o=>{});
    // And we get the bot to say the thing:
    //channel = message.guild.channels.get("436745249122025472");
    //message.guild.channels.get("436745249122025472").send(sayMessage);
    //Targeting welcomes
    message.guild.channels.get("474584725466513408").send(message.member + ":  " + sayMessage);
    //message.channel.send(sayMessage);
    }
  }



  if(command === "avatar" || command === "avi" || command === "a") {
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
if(command === "createRole") {
  if (message.member.user.id === "266777226412949504")
  {
  return client.user.setActivity(`${args.join(" ")}`);
  }
  message.channel.send("Sorry, this command is only available to the owner of this bot")

}
*/

// Ninian is dead.
  if(command === "dead")
  {
    if (message.guild.id === "529575902787534848" || message.guild.id === "357359971089907712" || message.guild.id === "241698498926477313")
    {
    if (args.length === 0)
    {
      return message.channel.send(`Ninian is dead.`);
    }
    message.channel.send(`${args.join(" ")} is dead.`);
    }
  }

if(command === "emoji" || command === "e")
{
const calledEmoji = args.join(" ");
  const calledEmojiID = client.emojis.find("name", `${calledEmoji}`)
  if (!calledEmojiID)
  {
    return message.channel.send("Emoji could not be found. It is either in a server I'm not in, or it's a default emoji.");
  }


  message.channel.send(`${calledEmojiID}`)
}

if(command === "bigemoji" || command === "be")
{
const calledEmoji = args.join(" ");
  const calledEmojiID = client.emojis.find("name", `${calledEmoji}`)

  if (!calledEmojiID)
  {
    return message.channel.send("Emoji could not be found. It is either in a server I'm not in, or it's a default emoji.");
  }


  message.channel.send(`${calledEmojiID.url}`)
}


if(command === "genesis")
{
  if (message.guild.id === "529575902787534848" || message.guild.id === "357359971089907712" || message.guild.id === "241698498926477313")
  {
  message.channel.send("https://cdn.discordapp.com/attachments/359166220609650688/478388553475424256/unknown.png")
  message.channel.send("This was the screen that popped up when I first started the bot")
  }
}


if(command === "help" || command === "h")
{
  if (message.guild.id === "529575902787534848" || message.guild.id === "357359971089907712" || message.guild.id === "241698498926477313")
  {
  message.channel.send("=avatar/avi/a \n=dead <text here> \n=bigemoji/be <emoji name here> \n=emoji/e <emoji name here> \n=genesis \n=help/h \n=inviteme \n=record <text here> \n=react/r <messageID(get it by right clicking in dev view)> <emoji name>\n=remember \n=setactivity BOT OWNER ONLY \n")
  }
  else {
    {
      message.channel.send("=avatar/avi/a \n=bigemoji/be <emoji name here> \n=emoji/e <emoji name here> \n=help/h \n=inviteme \n=react/r <messageID(get it by right clicking in dev view)> <emoji name> \n")
    }
  }
}

if(command === "inviteme")
{
  message.channel.send("https://discordapp.com/oauth2/authorize?&client_id=472593993692348416&scope=bot&permissions=0")
}

// Remember who you are.
if(command === "makironi")
  {
    if (message.guild.id === "529575902787534848" || message.guild.id === "357359971089907712" || message.guild.id === "241698498926477313")
    {
    message.channel.send("https://cdn.discordapp.com/attachments/529575902787534850/545077071731359764/13250396_1281523045209977_1237959082_n.jpg");
    }
  }

// Remember who you are.  Again.  And again.  And again.

if(command === "unlimitedmakironiworks"){
if (message.member.user.id === "266777226412949504")
{
  message.channel.send("I am the bringer of my macaroni");
  message.channel.send("Noodle is my body and cheese is my blood");
  message.channel.send("I have reminded over a thousand people");
  message.channel.send("Unknown to Kraft");
  message.channel.send("Nor known to Love Live");
  message.channel.send("Have withstood persecution to upload many Makironis");
  message.channel.send("Yet, those images will never feed anyone");
  message.channel.send("So as I pray, Unlimited Makironi Works");
  message.channel.send("https://cdn.discordapp.com/attachments/529575902787534850/545077071731359764/13250396_1281523045209977_1237959082_n.jpg");
  message.channel.send("https://cdn.discordapp.com/attachments/529575902787534850/545077071731359764/13250396_1281523045209977_1237959082_n.jpg");
  message.channel.send("https://cdn.discordapp.com/attachments/529575902787534850/545077071731359764/13250396_1281523045209977_1237959082_n.jpg");
  message.channel.send("https://cdn.discordapp.com/attachments/529575902787534850/545077071731359764/13250396_1281523045209977_1237959082_n.jpg");
  message.channel.send("https://cdn.discordapp.com/attachments/529575902787534850/545077071731359764/13250396_1281523045209977_1237959082_n.jpg");
  message.channel.send("https://cdn.discordapp.com/attachments/529575902787534850/545077071731359764/13250396_1281523045209977_1237959082_n.jpg");
  message.channel.send("https://cdn.discordapp.com/attachments/529575902787534850/545077071731359764/13250396_1281523045209977_1237959082_n.jpg");
  message.channel.send("https://cdn.discordapp.com/attachments/529575902787534850/545077071731359764/13250396_1281523045209977_1237959082_n.jpg");
  message.channel.send("https://cdn.discordapp.com/attachments/529575902787534850/545077071731359764/13250396_1281523045209977_1237959082_n.jpg");
  message.channel.send("https://cdn.discordapp.com/attachments/529575902787534850/545077071731359764/13250396_1281523045209977_1237959082_n.jpg");

}
else
{
  if (message.guild.id === "529575902787534848" || message.guild.id === "357359971089907712" || message.guild.id === "241698498926477313")
  {
    message.channel.send("Sorry, you do not have the necessary religious authority to use this command.")
  }
}
}
if(command === "react" || command === "r")
{
  const calledMessageID = (`${args[0]}`);
  const calledEmoji     = (`${args[1]}`);
  const calledEmojiID   = client.emojis.find("name", `${calledEmoji}`)
  if (!calledEmojiID)
  {
    return message.channel.send("Emoji could not be found");
  }
  channel = message.channel
  message.channel.fetchMessage(`${calledMessageID}`)
  .then(message => message.react(client.emojis.find("name", `${calledEmoji}`)))
  .catch(console.error)
}

// Only I can use this command, as it's checking for my ID


if(command === "selfassess")
{
  message.channel.send("REMEMBER, THESE ARE NOT REPLACEMENTS FOR A HEALTH CARE PROVIDER \nhttps://www.mayoclinic.org/covid-19-self-assessment-tool \nhttps://www.hopkinsmedicine.org/coronavirus/covid-19-self-checker.html \nhttps://www.cdc.gov/coronavirus/2019-ncov/symptoms-testing/symptoms.html")
}

if(command === "setactivity")
{

  if (message.member.user.id === "266777226412949504" || message.member.user.id === "166343129643876352" || message.member.user.id === "340964304516022272")
  {
return client.user.setActivity(`${args.join(" ")}`);
  }
  message.channel.send("Sorry, this command is only available to the owner of this bot")
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
  /*
  const logs = message.guild.channels.find('name', 'logs');
  if (message.guild.me.hasPermission('MANAGE_CHANNELS') && !logs) {
    message.guild.createChannel('logs', 'text');
  }
  if (!message.guild.me.hasPermission('MANAGE_CHANNELS') && !logs) {
    console.log('The logs channel does not exist and tried to create the channel but I am lacking permissions')
  }
  */
//  Locks audits to SPEcord
  if (message.guild.id === "188345757265297418")
  {
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
    // Currently targeting audits
  return message.guild.channels.get("474584778159423488").send(`A message was deleted in ${message.channel.name} by ${user} at [${new Date().toTimeString().split(" ")[0]}].`);
}

})





client.on('roleCreate', async (message) => {
  //message.guild.channels.get("472868596301692928").send("About to initialize entry");
  /*
  const logs = message.guild.channels.find('name', 'logs');
  if (message.guild.me.hasPermission('MANAGE_CHANNELS') && !logs) {
    message.guild.createChannel('logs', 'text');
  }
  if (!message.guild.me.hasPermission('MANAGE_CHANNELS') && !logs) {
    console.log('The logs channel does not exist and tried to create the channel but I am lacking permissions')
  }
  */
  if (message.guild.id === "188345757265297418")
  {
  //message.guild.channels.get("472868596301692928").send("About to initialize entry");
  const entry = await message.guild.fetchAuditLogs({type: 'ROLE_CREATE'}).then(audit => audit.entries.first())
  //logs.send(`passed entry initialization`);
  let user = ""



    user = entry.executor.username

    //user = entry.executor.username
    // Targeting audits
message.guild.channels.get("474584725466513408").send(`A new role was created by ${user} at [${new Date().toTimeString().split(" ")[0]}].`);
}
})


client.on('roleDelete', async (role) =>
{
  if (role.guild.id === "188345757265297418"){
  let guild = client.guilds.get("188345757265297418");

  //const logs = guild.channels.find('name', 'logs');

  const entry = await guild.fetchAuditLogs({type: 'ROLE_DELETE'}).then(audit => audit.entries.first())
  //console.log(roleDelete.role)
  //console.log(`target name is ${entry.target.name}`)
  let user = entry.executor.username
  //let deletedRole = entry.target.name
  //  Targeting audits
  guild.channels.get("474584725466513408").send(`The role ${role.name} was deleted by ${user} at [${new Date().toTimeString().split(" ")[0]}].`);
}})


// Commented out until I can fix the spam
/*
client.on('roleUpdate', async (role) => {
  let guild = client.guilds.get("188345757265297418");
  //const logs = guild.channels.find('name', 'logs');
  const entry = await guild.fetchAuditLogs({type: 'ROLE_UPDATE'}).then(audit => audit.entries.first())
  //console.log(entry.changes)
  //console.log(roleDelete.role)
  //console.log(`target name is ${entry.target.name}`)
  let user = entry.executor.username
  //let deletedRole = entry.target.name
  // Targeting audits
  guild.channels.get("474584778159423488").send(`The role ${role.name} was changed by ${user} at [${new Date().toTimeString().split(" ")[0]}].  Due to how Discord is handling permissions, I don't know how to display the change at the moment.  Please consult the actual audit log to see the changes made.`);
})
*/
client.on('emojiCreate', async (emoji) => {
if (emoji.guild.id === "188345757265297418"){
  let guild = emoji.guild;
  const entry = await guild.fetchAuditLogs({type: 'EMOJI_CREATE'}).then(audit => audit.entries.first())
  let creator = entry.executor.username

  //Targeting audits
  guild.channels.get("474584725466513408").send(`${emoji.name} has been created by ${creator} at [${new Date().toTimeString().split(" ")[0]}].  The URL is ${emoji.url} `);
}})

client.on('emojiUpdate', async (emoji) => {
  if (emoji.guild.id === "188345757265297418"){
  let guild = emoji.guild;
  const entry = await guild.fetchAuditLogs({type: 'EMOJI_UPDATE'}).then(audit => audit.entries.first())
  let updater = entry.executor.username

  //Targeting audits
  guild.channels.get("474584725466513408").send(`${emoji.name} has been updated by ${updater} at [${new Date().toTimeString().split(" ")[0]}].  The URL is ${emoji.url} `);
}})

client.on('emojiDelete', async (emoji) => {
if (emoji.guild.id === "188345757265297418"){
  let guild = emoji.guild;
  const entry = await guild.fetchAuditLogs({type: 'EMOJI_DELETE'}).then(audit => audit.entries.first())
  let deleter = entry.executor.username
  //Targeting audits
  guild.channels.get("474584725466513408").send(`${emoji.name} has been deleted by ${deleter} at [${new Date().toTimeString().split(" ")[0]}].  The URL is ${emoji.url} `);
}})



client.on('guildMemberAdd', async (member) => {
if (member.guild.id === "188345757265297418"){
  console.log("MEMBER HAS ENTERED")
  let guild = client.guilds.get("188345757265297418");
  //const logs = guild.channels.find('name', 'boolin');

//Targeting welcomes
  guild.channels.get("280222534929219584").send(`${member.user.username} has entered the server at [${new Date().toTimeString().split(" ")[0]}].`);
  //logs.send(`${member.user.username} has entered the server`)
}})



client.on('guildMemberRemove', async (member) => {
  if (member.guild.id === "188345757265297418"){
  let guild = client.guilds.get("188345757265297418");
  //const logs = guild.channels.find('name', 'logs');
  const entry = await guild.fetchAuditLogs({type: 'MEMBER_KICK'}).then(audit => audit.entries.first())

  console.log('SOMEBODY HAS LEFT THE SERVER.  THE EXECUTOR ID IS')
  console.log(entry.executor)

  //console.log(entry.changes)
  //console.log(roleDelete.role)
  //console.log(`target name is ${entry.target.name}`)
  /*
  if(entry.executor){
  let user = entry.executor.username
  //Targeting kicks
   guild.channels.get("474584725466513408").send(`${member.user.username} was kicked by ${user}.`);
}
*/
  //let deletedRole = entry.target.name
  // Targeting welcomes
  guild.channels.get("280222534929219584").send(`${member.user.username} has left the server at [${new Date().toTimeString().split(" ")[0]}].`);
}})



client.on('guildBanAdd', async (guild, user) => {
  //let guild = client.guilds.get("332159937545240588");
  //const logs = guild.channels.find('name', 'logs');
  if (guild.id === "188345757265297418"){
  const entry = await guild.fetchAuditLogs({type: 'MEMBER_BAN_ADD'}).then(audit => audit.entries.first())
  //console.log(entry.changes)

  //console.log(roleDelete.role)
  //console.log(`target name is ${entry.target.name}`)

  //console.log(`${user}`)
  let banner = entry.executor.username
  // Targeting bans
  guild.channels.get("474584636417245184").send(`${user.username} has been banned by ${banner} at [${new Date().toTimeString().split(" ")[0]}].`);
}})


client.on('guildBanRemove', async (guild, user) => {
  //let guild = client.guilds.get("332159937545240588");
  //const logs = guild.channels.find('name', 'logs');
  if (guild.id === "188345757265297418"){
  const entry = await guild.fetchAuditLogs({type: 'MEMBER_BAN_REMOVE'}).then(audit => audit.entries.first())
  //console.log(user)   CURSED.  DO NOT USE.
  //console.log(roleDelete.role)
  //console.log(`target name is ${entry.target.name}`)
  //console.log(`${members.user}`)
  //let deletedRole = entry.target.name
  let unbanner = entry.executor.username
  //Targeting bans
  guild.channels.get("474584636417245184").send(`${user.username} has been unbanned by ${unbanner} at [${new Date().toTimeString().split(" ")[0]}].`);
}})



client.login(config.token);
