const { SlashCommandBuilder } = require('@discordjs/builders');
const steam = require('steamidconvert')();
const steamAPI = require('../modules/steamApi.js');
const { MessageEmbed } = require('discord.js');


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
		const basicProfileInfo = await steamAPI.fetchBasicProfileInfo(steamid);
		const steamLevel = await steamAPI.fetchSteamLevel(steamid);
		const GMData = await  steamAPI.fetchGMstats(steamid);
		const profile = basicProfileInfo.response.players[0];
		const embed = new MessageEmbed()
			.setColor('#39CEDB')
			.setURL(String(profile.profileurl))
			.setTitle(`Informacion de ${String(profile.personaname)}`)
			.setThumbnail(profile.avatarfull)
			.addFields(
				{ name: 'Nivel de Steam', value: steamLevel.response.player_level.toString()},
				{ name: 'Estado', value: steamAPI.checkStatus(profile.personastate) },
				{ name: 'SteamID', value: steam.convertToText(profile.steamid), inline: true },
				{ name: 'SteamID64', value: profile.steamid, inline: true },
				{ name: "Horas en Garry's Mod", value: steamAPI.checkGModOwnership(GMData) }
			);
		await interaction.reply({ embeds: [embed] });
	},
};

