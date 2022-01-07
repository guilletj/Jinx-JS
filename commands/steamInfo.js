const yaml = require('js-yaml');
const fs = require('fs');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const https = require('https');
const steam = require('steamidconvert')();
const { cfg } = require('../modules/configLoader.js');

const steamAPI = cfg.steamApi;

module.exports = {
	data: new SlashCommandBuilder()
		.setName('steaminfo')
		.setDescription('Obtiene datos del usuario en cuestión dada una SteamID')
		.addStringOption(option => option
			.setName('steamid')
			.setDescription('SteamID estándar del usuario')
			.setRequired(true)),
	async execute(interaction) {
		let steamID;
		try {
			steamID = steam.convertTo64(interaction.options.getString('steamid'));
		} catch (ex) {
			await interaction.reply({ content: 'SteamID inválida', ephemeral: true });
			return;
		}
		const options = {
			hostname: 'api.steampowered.com',
			port: 443,
			path: `https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${steamAPI}&steamids=${steam.convertTo64(interaction.options.getString('steamid'))}`,
			method: 'GET'
		}

		//TODO: Manejar el resultado y mostrarlo bonito
		const req = https.request(options, res => {
			console.log(`statusCode: ${res.statusCode}`)
			res.on('data', d => {
				//TODO: La respuesta será vacia si la SteamID no es correcta, hay que manejar esa situación
				const json = JSON.parse(d);
				console.log(json.response.players[0]);
				const embed = new MessageEmbed()
					.setColor('#39CEDB')
					.setURL(String(json.response.players[0].profileurl))
					.setTitle(`Informacion de ${String(json.response.players[0].personaname)}`)
					.setThumbnail(json.response.players[0].avatarfull)
					.addFields(
						{ name: 'Estado', value: checkStatus(json.response.players[0].personastate) },
						{ name: 'SteamID', value: interaction.options.getString('steamid'), inline: true},
						{ name: 'SteamID64', value: steam.convertTo64(interaction.options.getString('steamid')), inline: true }
					)
				interaction.reply({ embeds: [embed] });
			})
		})

		req.end();
	},
};

function checkStatus(status) {
	switch (status) {
	case 0:
		return 'Desconectado';
	default:
		return 'Conectado';
	}
}