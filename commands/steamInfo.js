const yaml = require('js-yaml');
const fs = require('fs');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const https = require('https');
let steamAPI;

try {
	const cfg = yaml.load(fs.readFileSync('./config.yaml', 'utf8'));
	steamAPI = cfg.steamApi;
} catch (ex) {
	console.log('Failed to load config when getting SteamAPI key...');
}

module.exports = {
	data: new SlashCommandBuilder()
		.setName('steaminfo')
		//TODO: Introducir SteamID clasica y convertirla a SteamID64 de forma transparente al usuario
		.setDescription('Obtiene datos del usuario en cuestión dada una SteamID')
		.addStringOption(option => option
			.setName('steamid')
			.setDescription('SteamID estándar del usuario')
			.setRequired(true)),
	async execute(interaction) {
		const options = {
			hostname: 'api.steampowered.com',
			port: 443,
			path: `https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${steamAPI}&steamids=${interaction.options.getString('steamid')}`,
			method: 'GET'
		}

		//TODO: Manejar el resultado y mostrarlo bonito
		const req = https.request(options, res => {
			console.log(`statusCode: ${res.statusCode}`)
			res.on('data', d => {
				//TODO: La respuesta será vacia si la SteamID no es correcta, hay que manejar esa situación
				const json = JSON.parse(d);
				const embed = new MessageEmbed()
					.setTitle(String(json.response.players[0].personaname))
					.setImage(json.response.players[0].avatarfull)
					.setDescription('Test')
				interaction.reply({ embeds: [embed] });
			})
		})

		req.end();
	},
};