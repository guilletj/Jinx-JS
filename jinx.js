const { Client, Intents, Collection } = require('discord.js');
const yaml = require('js-yaml')
const fs = require('fs');
let cfg;

try {
    console.log('Loading config...')
    cfg = yaml.load(fs.readFileSync('./config.yaml', 'utf8'));
    console.log('Config loaded successfully');
} catch (ex) {
    console.log('Failed to load config, exiting now...');
    process.exit(1);
}

const token = cfg.token;

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

const client = new Client({ intents: allIntents });
client.commands = new Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.data.name, command);
}

client.login(token).then(() => console.log('Ready'));