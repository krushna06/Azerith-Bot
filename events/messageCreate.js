const { Events, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const fs = require('fs');
const suggestionsPath = './database/suggestions.json';

module.exports = {
    name: Events.MessageCreate,
    async execute(message) {
        if (message.author.bot) return;

        let suggestionsData = {};
        if (fs.existsSync(suggestionsPath)) {
            suggestionsData = JSON.parse(fs.readFileSync(suggestionsPath, 'utf8'));
        }
        const suggestionChannelId = suggestionsData.suggestionChannel;

        if (message.channel.id === suggestionChannelId) {
            await message.delete();
            const embed = new EmbedBuilder()
              .setDescription("> " + message.content)
              .setAuthor({
                name: message.author.username + "'s Suggestions",
                iconURL: message.author.displayAvatarURL(),
                url: 'https://azerithmc.com'
              })
              .setThumbnail(message.author.displayAvatarURL())
              .setColor(0x2F3136)
              .setTimestamp();

            const upvoteButton = new ButtonBuilder()
              .setCustomId('upvote')
              .setLabel('0')
              .setEmoji("1192654081953648761")
              .setStyle(ButtonStyle.Secondary);
      
            const downvoteButton = new ButtonBuilder()
              .setCustomId('downvote')
              .setLabel('0')
              .setEmoji("1192654097048940554")
              .setStyle(ButtonStyle.Secondary);

            const whoVotedButton = new ButtonBuilder()
              .setCustomId('whoVoted')
              .setLabel('Who Voted?')
              .setEmoji('1205513769900580884')
              .setStyle(ButtonStyle.Success);

            const row = new ActionRowBuilder().addComponents(upvoteButton, downvoteButton, whoVotedButton);

            const suggestionMessage = await message.channel.send({ embeds: [embed], components: [row] });

            suggestionsData.suggestions.push({
                id: suggestionMessage.id,
                user: message.author.id,
                content: message.content,
                timestamp: new Date().toISOString(),
                status: 'pending'
            });

            fs.writeFileSync(suggestionsPath, JSON.stringify(suggestionsData, null, 2));
        }
    }
};
