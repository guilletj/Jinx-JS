const { Client, Intents, Collection } = require('discord.js');
const { cfg } = require('./modules/configLoader.js')
const fs = require('fs');

console.log('Loading modules...')
const interactionCreate = require('./modules/discordEvents/interactionCreate.js');
console.log('All modules loaded!')

const allIntents = new Intents();
allIntents.add(Intents.FLAGS.DIRECT_MESSAGES,
    Intents.FLAGS.DIRECT_MESSAGE_REACTIONS,
    Intents.FLAGS.DIRECT_MESSAGE_TYPING,
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_BANS,
    Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS,
    Intents.FLAGS.GUILD_INTEGRATIONS,
    Intents.FLAGS.GUILD_INVITES,
    Intents.FLAGS.GUILD_MEMBERS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
    Intents.FLAGS.GUILD_MESSAGE_TYPING,
    Intents.FLAGS.GUILD_PRESENCES,
    Intents.FLAGS.GUILD_VOICE_STATES,
    Intents.FLAGS.GUILD_WEBHOOKS);

console.log('Initializing client and commands...')
const client = new Client({ intents: allIntents });
client.commands = new Collection();

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.data.name, command);
}
console.log('Everything fine for now... Logging to Discord...')

client.login(cfg.token).then(() => {
    console.log('Logging success! Everything is ready now');
    client.user.setStatus(cfg.profile.presence.status)
    client.user.setActivity(cfg.profile.presence.text, {type: cfg.profile.presence.type});
});

client.on('interactionCreate', (interaction) => {
    interactionCreate(interaction, client).then();
});
