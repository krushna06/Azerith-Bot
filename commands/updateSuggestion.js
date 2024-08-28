const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const fs = require('fs');
const suggestionsPath = './suggestions.json';

module.exports = {
    data: new SlashCommandBuilder()
        .setName('updatesuggestion')
        .setDescription('Update the status of a suggestion.')
        .addStringOption(option =>
            option.setName('id')
                .setDescription('The ID of the suggestion')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('status')
                .setDescription('The new status of the suggestion')
                .setRequired(true)
                .addChoices(
                    { name: 'Approved', value: 'approved' },
                    { name: 'Rejected', value: 'rejected' }
                )),
    async execute(interaction) {
        const suggestionId = interaction.options.getString('id');
        const newStatus = interaction.options.getString('status');
        
        let suggestionsData = {};
        if (fs.existsSync(suggestionsPath)) {
            suggestionsData = JSON.parse(fs.readFileSync(suggestionsPath, 'utf8'));
        }

        const suggestion = suggestionsData.suggestions.find(s => s.id === suggestionId);
        if (!suggestion) {
            return interaction.reply({ content: 'Suggestion not found.', ephemeral: true });
        }

        suggestion.status = newStatus;

        const channel = interaction.channel;
        try {
            const suggestionMessage = await channel.messages.fetch(suggestionId);

            const embed = new EmbedBuilder()
                .setTitle('Suggestion:')
                .setDescription(suggestion.content)
                .addFields(
                    { name: 'Status', value: newStatus.charAt(0).toUpperCase() + newStatus.slice(1), inline: true }
                )
                .setAuthor({ name: interaction.client.users.cache.get(suggestion.user).username, iconURL: interaction.client.users.cache.get(suggestion.user).displayAvatarURL() })
                .setColor(newStatus === 'approved' ? 0x00FF00 : 0xFF0000)
                .setTimestamp();

            await suggestionMessage.edit({ embeds: [embed] });
        } catch (error) {
            return interaction.reply({ content: 'Failed to update the suggestion message.', ephemeral: true });
        }

        fs.writeFileSync(suggestionsPath, JSON.stringify(suggestionsData, null, 2));

        await interaction.reply({ content: `Suggestion status updated to "${newStatus.charAt(0).toUpperCase() + newStatus.slice(1)}".`, ephemeral: true });
    }
};
