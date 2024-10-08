const { Events } = require('discord.js');
const path = require('path');
const { handleButtonInteraction } = require('./buttonCreate');
const { handleModalSubmit } = require('./modalCreate');
const { handleMenuButtonInteraction } = require('./menuCreate');
const { handleSuggestionButtonInteraction } = require('./suggestionHandle');

const dataPath = path.join(__dirname, '../database/data.json');
let channelData = require(dataPath);

module.exports = {
    name: Events.InteractionCreate,
    async execute(interaction) {
        if (interaction.isCommand()) {
            const command = interaction.client.commands.get(interaction.commandName);
            if (!command) return;

            try {
                await command.execute(interaction);
            } catch (error) {
                console.error(error);
                await interaction.reply({ content: 'There was an error executing this command.', ephemeral: true });
            }
        } else if (interaction.isButton()) {
            if (interaction.customId.startsWith('menu_')) {
                await handleMenuButtonInteraction(interaction);
            } 
            else if (interaction.customId === 'upvote' || interaction.customId === 'downvote' || interaction.customId === 'whoVoted') {
                handleSuggestionButtonInteraction(interaction);
            }
            else {
                await handleButtonInteraction(interaction, channelData);
            }
        } else if (interaction.isModalSubmit()) {
            await handleModalSubmit(interaction, channelData);
        } else if (interaction.isStringSelectMenu()) {
            if (interaction.customId === 'regionSelect') {
                const channel = interaction.member.voice.channel;
                if (!channel) {
                    await interaction.reply({ content: 'You need to be in a voice channel to change its region.', ephemeral: true });
                    return;
                }

                const region = interaction.values[0];
                try {
                    if (region === 'automatic') {
                        await channel.edit({ rtcRegion: null });
                        await interaction.reply({ content: 'Voice channel region set to automatic.', ephemeral: true });
                    } else {
                        await channel.setRTCRegion(region);
                        await interaction.reply({ content: `Voice channel region changed to ${region}.`, ephemeral: true });
                    }
                } catch (error) {
                    console.error(error);
                    await interaction.reply({ content: 'There was an error while changing the region.', ephemeral: true });
                }
            }
        }
    }
};
