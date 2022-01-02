const { SlashCommandBuilder } = require('@discordjs/builders');
const { Permissions } = require('discord.js');
const wait = require('util').promisify(setTimeout);

module.exports = {
    data: new SlashCommandBuilder()
        .setName('clear')
        .setDescription('Borra X cantidad de mensajes')
        .addIntegerOption(option =>
            option
                .setName('mensajes')
                .setDescription('Cantidad de mensajes a borrar')
                .setRequired(true),
                ),
    async execute(interaction) {
        const messageNumber = interaction.options.get('mensajes').value;
        if (!interaction.memberPermissions.has(Permissions.FLAGS.MANAGE_MESSAGES)) {
            await interaction.reply('¿Quien te crees?');
            return;
        }
        if (messageNumber < 1) {
            await interaction.reply('¿COMO VOY A BORRAR 0 MENSAJES?');
        }
        else {
            const canal = interaction.channel;
            await canal.bulkDelete(messageNumber);
            await interaction.reply('Mensajes borrados');
            await wait(4000);
            await interaction.deleteReply();
        }
    },
};