const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const fs = require('fs');
const suggestionsPath = './database/suggestions.json';

module.exports = {
    data: new SlashCommandBuilder()
        .setName('suggest')
        .setDescription('Submit a new suggestion.')
        .addStringOption(option =>
            option.setName('content')
                .setDescription('The content of the suggestion')
                .setRequired(true)),
    async execute(interaction) {
        const suggestionContent = interaction.options.getString('content');

        let suggestionsData = {};
        if (fs.existsSync(suggestionsPath)) {
            suggestionsData = JSON.parse(fs.readFileSync(suggestionsPath, 'utf8'));
        }

        const suggestionChannelId = suggestionsData.suggestionChannel;
        const suggestionChannel = interaction.guild.channels.cache.get(suggestionChannelId);
        
        if (!suggestionChannel) {
            return interaction.reply({ content: 'Suggestion channel not found.', ephemeral: true });
        }

        const embed = new EmbedBuilder()
            .setTitle('New Suggestion')
            .setDescription(suggestionContent)
            .setAuthor({ name: interaction.user.username, iconURL: interaction.user.displayAvatarURL() })
            .setColor(0x2F3136)
            .setTimestamp();

        try {
            const suggestionMessage = await suggestionChannel.send({ embeds: [embed] });
            await suggestionMessage.react('👍');
            await suggestionMessage.react('👎');

            if (!suggestionsData.suggestions) {
                suggestionsData.suggestions = [];
            }

            suggestionsData.suggestions.push({
                id: suggestionMessage.id,
                user: interaction.user.id,
                content: suggestionContent,
                timestamp: new Date().toISOString(),
                status: 'pending'
            });

            fs.writeFileSync(suggestionsPath, JSON.stringify(suggestionsData, null, 2));

            await interaction.reply({ content: 'Your suggestion has been submitted!', ephemeral: true });
        } catch (error) {
            console.error('Error creating suggestion:', error);
            return interaction.reply({ content: 'Failed to submit your suggestion.', ephemeral: true });
        }
    }
};
