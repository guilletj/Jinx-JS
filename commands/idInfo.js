const { SlashCommandBuilder } = require('@discordjs/builders');
const steam = require('steamidconvert')();
const { fetchProfileInfo } = require('../modules/steamApi.js');
const { MessageEmbed } = require('discord.js');
const { db } = require('../modules/mysql.js');

const query = 'SELECT steamid64 FROM ne_id WHERE id = ?'

module.exports = {
	data: new SlashCommandBuilder()
		.setName('idinfo')
		.setDescription('Obtiene los datos de un usuario del servidor a partir de su ID InGame')
		.addIntegerOption(option => option
			.setName('id')
			.setDescription('ID del usuario InGame')
			.setMinValue(1)
			.setRequired(true)),
	async execute(interaction) {
		db.query(query, [interaction.options.getInteger('id')], async function(err, results) {
			if (err) {
				console.log(err);
				interaction.reply({ content: 'Fallo al leer la DB', ephemeral: true });
			} else if (!results.length) {
				await interaction.reply({ content: 'No hay datos para esa ID', ephemeral: true });
			} else {
				const profileInfo = await fetchProfileInfo(results[0].steamid64)
				const profile = profileInfo.response.players[0];
				const embed = new MessageEmbed()
					.setColor('#39CEDB')
					.setURL(String(profile.profileurl))
					.setTitle(`Informacion de ${String(profile.personaname)}`)
					.setThumbnail(profile.avatarfull)
					.addFields(
						{ name: 'Estado', value: checkStatus(profile.personastate) },
						{ name: 'SteamID', value: steam.convertToText(profile.steamid), inline: true },
						{ name: 'SteamID64', value: profile.steamid, inline: true }
					)
				await interaction.reply({ embeds: [embed] });
			}
		});
	}
};

function checkStatus(status) {
	switch (status) {
	case 0:
		return 'Desconectado/Perfil privado';
	default:
		return 'Conectado';
	}
}