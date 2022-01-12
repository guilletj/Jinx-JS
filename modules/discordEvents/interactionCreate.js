module.exports = async (interaction, client) => {
    if (!interaction.isCommand()) return;
	const command = client.commands.get(interaction.commandName);
	if (!command) return;
	try {
		await command.execute(interaction);
	}
	catch (error) {
		console.error(error);
		await interaction.reply({ content: 'Fallo al ejecutar el comando', ephemeral: true });
	}
};