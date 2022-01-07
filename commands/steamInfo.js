const { SlashCommandBuilder } = require('@discordjs/builders');
const steam = require('steamidconvert')();
const { cfg } = require('../modules/configLoader.js');
const { fetchProfileInfo } = require('../modules/steamApi.js')
const { MessageEmbed } = require('discord.js');

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
		const profileInfo = await fetchProfileInfo(steamID)
		const embed = new MessageEmbed()
			.setColor('#39CEDB')
			.setURL(String(profileInfo.response.players[0].profileurl))
			.setTitle(`Informacion de ${String(profileInfo.response.players[0].personaname)}`)
			.setThumbnail(profileInfo.response.players[0].avatarfull)
			.addFields(
				{ name: 'Estado', value: checkStatus(profileInfo.response.players[0].personastate) },
				{ name: 'SteamID', value: interaction.options.getString('steamid'), inline: true},
				{ name: 'SteamID64', value: steamID, inline: true }
			)
		await interaction.reply({ embeds: [embed] });
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

