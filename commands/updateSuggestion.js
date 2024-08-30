const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const fs = require('fs');
const suggestionsPath = './database/suggestions.json';

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
                ))
        .addStringOption(option =>
            option.setName('reason')
                .setDescription('The reason for the status update')
                .setRequired(false)),
    async execute(interaction) {
        const suggestionId = interaction.options.getString('id');
        const newStatus = interaction.options.getString('status');
        const reason = interaction.options.getString('reason') || 'No reason provided';
        
        let suggestionsData = {};
        if (fs.existsSync(suggestionsPath)) {
            suggestionsData = JSON.parse(fs.readFileSync(suggestionsPath, 'utf8'));
        }

        const suggestion = suggestionsData.suggestions.find(s => s.id === suggestionId);
        if (!suggestion) {
            return interaction.reply({ content: 'Suggestion not found.', ephemeral: true });
        }

        suggestion.status = newStatus;
        suggestion.reason = reason;

        const channel = interaction.channel;
        try {
            const suggestionMessage = await channel.messages.fetch(suggestionId);

            const embed = new EmbedBuilder()
                .setDescription("> " + suggestion.content)
                .addFields(
                    { name: 'Status', value: newStatus.charAt(0).toUpperCase() + newStatus.slice(1), inline: false },
                    { name: 'Reason', value: reason, inline: false }
                )
                .setAuthor({ name: interaction.client.users.cache.get(suggestion.user).username + "'s Suggestion", iconURL: interaction.client.users.cache.get(suggestion.user).displayAvatarURL() })
            	.setThumbnail(interaction.client.users.cache.get(suggestion.user).displayAvatarURL())
                .setColor(newStatus === 'approved' ? 0x00FF00 : 0xFF0000)
                .setTimestamp();

            if (!suggestion.votes) {
                suggestion.votes = {}; 
            }
            
            const upvotes = Object.values(suggestion.votes).filter(vote => vote === 'upvote').length;
            const downvotes = Object.values(suggestion.votes).filter(vote => vote === 'downvote').length;
            
            const upvoteButton = new ButtonBuilder()
              .setCustomId('upvote')
              .setLabel(`${upvotes}`)
              .setEmoji("1278739683148435518")
              .setDisabled(true)
              .setStyle(ButtonStyle.Secondary);

            const downvoteButton = new ButtonBuilder()
              .setCustomId('downvote')
              .setLabel(`${downvotes}`)
              .setEmoji("1278739689884614757")
              .setDisabled(true)
              .setStyle(ButtonStyle.Secondary);

            const whoVotedButton = new ButtonBuilder()
              .setCustomId('whoVoted')
              .setLabel('Who Voted?')
              .setEmoji('1278742237840146473')
              .setStyle(ButtonStyle.Success);
            
            const row = new ActionRowBuilder().addComponents(upvoteButton, downvoteButton, whoVotedButton);

            await suggestionMessage.edit({ embeds: [embed], components: [row] });
        } catch (error) {
            return interaction.reply({ content: 'Failed to update the suggestion message. ' + error, ephemeral: true });
        }

        fs.writeFileSync(suggestionsPath, JSON.stringify(suggestionsData, null, 2));

        await interaction.reply({ content: `Suggestion status updated to "${newStatus.charAt(0).toUpperCase() + newStatus.slice(1)}". Reason: ${reason}`, ephemeral: true });
    }
};
