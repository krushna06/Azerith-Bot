const { setLimitModal, renameModal, banModal, permitModal, transferModal } = require('./modalBuilder');
const { createRegionSelectMenu } = require('./selectMenuBuilder');
const { handleClaimButton } = require('../handlers/claimHandler');
const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, '../database/data.json');
const channelData = require(dataPath);
const saveData = () => fs.writeFileSync(dataPath, JSON.stringify(channelData, null, 2));

const handleButtonInteraction = async (interaction) => {
    const buttonId = interaction.customId;
    const channel = interaction.member.voice.channel;

    if (channel) {
        const channelId = channel.id;
        const ownerId = channelData.channels[channelId]?.ownerId;

        try {
            if (buttonId === 'lock') {
                if (ownerId && ownerId !== interaction.user.id) {
                    await interaction.reply({ content: 'You are not the owner of this channel.', ephemeral: true });
                } else {
                    await channel.permissionOverwrites.edit(interaction.guild.roles.everyone, { Connect: false });
                    await interaction.reply({ content: 'Channel locked!', ephemeral: true });
                }
            } else if (buttonId === 'unlock') {
                if (ownerId && ownerId !== interaction.user.id) {
                    await interaction.reply({ content: 'You are not the owner of this channel.', ephemeral: true });
                } else {
                    await channel.permissionOverwrites.edit(interaction.guild.roles.everyone, { Connect: true });
                    await interaction.reply({ content: 'Channel unlocked!', ephemeral: true });
                }
            } else if (buttonId === 'hide') {
                if (ownerId && ownerId !== interaction.user.id) {
                    await interaction.reply({ content: 'You are not the owner of this channel.', ephemeral: true });
                } else {
                    await channel.permissionOverwrites.edit(interaction.guild.roles.everyone, { ViewChannel: false });
                    await interaction.reply({ content: 'Channel hidden!', ephemeral: true });
                }
            } else if (buttonId === 'unhide') {
                if (ownerId && ownerId !== interaction.user.id) {
                    await interaction.reply({ content: 'You are not the owner of this channel.', ephemeral: true });
                } else {
                    await channel.permissionOverwrites.edit(interaction.guild.roles.everyone, { ViewChannel: true });
                    await interaction.reply({ content: 'Channel unhidden!', ephemeral: true });
                }
            } else if (buttonId === 'setLimit') {
                if (ownerId && ownerId !== interaction.user.id) {
                    await interaction.reply({ content: 'You are not the owner of this channel.', ephemeral: true });
                } else {
                    await setLimitModal(interaction);
                }
            } else if (buttonId === 'rename') {
                if (ownerId && ownerId !== interaction.user.id) {
                    await interaction.reply({ content: 'You are not the owner of this channel.', ephemeral: true });
                } else {
                    await renameModal(interaction);
                }
            } else if (buttonId === 'ban') {
                if (ownerId && ownerId !== interaction.user.id) {
                    await interaction.reply({ content: 'You are not the owner of this channel.', ephemeral: true });
                } else {
                    await banModal(interaction);
                }
            } else if (buttonId === 'permit') {
                if (ownerId && ownerId !== interaction.user.id) {
                    await interaction.reply({ content: 'You are not the owner of this channel.', ephemeral: true });
                } else {
                    await permitModal(interaction);
                }
            } else if (buttonId === 'transfer') {
                if (ownerId && ownerId !== interaction.user.id) {
                    await interaction.reply({ content: 'You are not the owner of this channel.', ephemeral: true });
                } else {
                    await transferModal(interaction);
                }
            } else if (buttonId === 'invite') {
                if (ownerId && ownerId !== interaction.user.id) {
                    await interaction.reply({ content: 'You are not the owner of this channel.', ephemeral: true });
                } else {
                    const invite = await channel.createInvite({ maxAge: 0, maxUses: 0 });
                    await interaction.reply({ content: `Here is your invite link: ${invite.url}`, ephemeral: true });
                }
            } else if (buttonId === 'region') {
                if (ownerId && ownerId !== interaction.user.id) {
                    await interaction.reply({ content: 'You are not the owner of this channel.', ephemeral: true });
                } else {
                    const regionSelectMenu = createRegionSelectMenu();
                    await interaction.reply({
                        content: 'Select the new region for the voice channel:',
                        components: [regionSelectMenu],
                        ephemeral: true
                    });
                }
            } else if (buttonId === 'claim') {
                await handleClaimButton(interaction, channelData);
            } else {
                await interaction.reply({ content: 'Unknown button.', ephemeral: true });
            }
        } catch (error) {
            console.error(error);
            await interaction.reply({ content: 'There was an error processing this interaction.', ephemeral: true });
        }
    } else {
        await interaction.reply({ content: 'You need to be in a voice channel to use this button.', ephemeral: true });
    }
};

module.exports = { handleButtonInteraction };
