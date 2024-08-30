const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const path = require('path');

const suggestionsPath = path.join(__dirname, '../database/suggestions.json');
const fs = require('fs');

const handleSuggestionButtonInteraction = async (interaction) => {
    const { customId, message, user } = interaction;
    const suggestionId = message.id;
    const suggestionsData = JSON.parse(fs.readFileSync(suggestionsPath, 'utf8'));

    const suggestion = suggestionsData.suggestions.find(s => s.id === suggestionId);
    if (!suggestion) return;

    if (!suggestion.votes) {
        suggestion.votes = {}; 
      }

    if (customId === 'whoVoted') {
        const upvoters = Object.keys(suggestion.votes).filter(voterId => suggestion.votes[voterId] === 'upvote');
        const downvoters = Object.keys(suggestion.votes).filter(voterId => suggestion.votes[voterId] === 'downvote');
    
        const upvoterMentions = upvoters.map(id => `> <@${id}>`).join('\n') || '> No upvotes yet.';
        const downvoterMentions = downvoters.map(id => `> <@${id}>`).join('\n') || '> No downvotes yet.';
    
        await interaction.reply({
          content: `- **__Upvoters__:** \n${upvoterMentions}\n- **__Downvoters__:** \n${downvoterMentions}`,
          ephemeral: true
        });
        return;
    }

    if (!suggestion.votes) suggestion.votes = {};
    if (suggestion.votes[user.id] === customId) {
      return await interaction.reply({ content: 'You have already voted for this option!', ephemeral: true });
    }

    suggestion.votes[user.id] = customId;
    fs.writeFileSync(suggestionsPath, JSON.stringify(suggestionsData, null, 2));

    const upvotes = Object.values(suggestion.votes).filter(vote => vote === 'upvote').length;
    const downvotes = Object.values(suggestion.votes).filter(vote => vote === 'downvote').length;

    const upvoteButton = new ButtonBuilder()
      .setCustomId('upvote')
      .setLabel(`${upvotes}`)
      .setEmoji("1192654081953648761")
      .setStyle(ButtonStyle.Secondary);

    const downvoteButton = new ButtonBuilder()
      .setCustomId('downvote')
      .setLabel(`${downvotes}`)
      .setEmoji("1192654097048940554")
      .setStyle(ButtonStyle.Secondary);
    
    const whoVotedButton = new ButtonBuilder()
      .setCustomId('whoVoted')
      .setLabel('Who Voted?')
      .setEmoji('1205513769900580884')
      .setStyle(ButtonStyle.Success);

    const row = new ActionRowBuilder().addComponents(upvoteButton, downvoteButton, whoVotedButton);

    await message.edit({ components: [row] });
    await interaction.reply({ content: `You ${customId === 'upvote' ? 'upvoted' : 'downvoted'} this suggestion!`, ephemeral: true });
}

module.exports = { handleSuggestionButtonInteraction };