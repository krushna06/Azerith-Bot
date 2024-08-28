const { Events, EmbedBuilder } = require('discord.js');
const fs = require('fs');
const suggestionsPath = './suggestions.json';

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
            const embed = new EmbedBuilder()
                .setTitle('New Suggestion')
                .setDescription(message.content)
                .setAuthor({ name: message.author.username, iconURL: message.author.displayAvatarURL() })
                .setColor(0x00FF00)
                .setTimestamp();

            const suggestionMessage = await message.channel.send({ embeds: [embed] });
            await suggestionMessage.react('👍');
            await suggestionMessage.react('👎');

            suggestionsData.suggestions.push({
                id: suggestionMessage.id,
                user: message.author.id,
                content: message.content,
                timestamp: new Date().toISOString(),
                status: 'pending'
            });

            fs.writeFileSync(suggestionsPath, JSON.stringify(suggestionsData, null, 2));

            message.delete();
        }
    }
};
