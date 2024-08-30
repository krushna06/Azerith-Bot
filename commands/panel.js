const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require('discord.js');
const { panelBody, panelRowOne, panelRowTwo, panelRowThree } = require('../common/voice_panel');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('panel')
        .setDescription('Sends the channel management panel'),
    async execute(interaction) {

        await interaction.channel.send({
            embeds: [panelBody()],
            components: [panelRowOne(), panelRowTwo(), panelRowThree()]
        });

        await interaction.reply({ content: "Sucessfully generated vc panel", ephemeral: true });
    }
};
