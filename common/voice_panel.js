const { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require('discord.js');

function panelBody(){
    const embed = new EmbedBuilder()
    .setColor('#ffee00')
    .setTitle('Voice Channel Management Panel')
    .setDescription(`- **__Channel Lock/Unlock__**
                    > Lock voice channel (<:vc_lock:1279102791314440273>)
                    > Unlock voice channel (<:vc_unlock:1279102807936335964>)
                    \n
                    - **__Channel Visibility__**
                    > Unhide voice channel (<:vc_hide:1279104573734387773>)
                    > Hide voice channel from others (<:vc_unhide:1279102805579403375>)
                    \n
                    - **__Channel Management__**
                    > Set voice channel Limit (<:vc_limit:1279102788718297099>)
                    > Get voice channel invite link (<:vc_add_user:1279102743314829363>)
                    > Ban user from voice channel (<:vc_remove_user:1279102794392932442>)
                    > Allow user in voice channel (<:vc_allow_user:1279102783215108189>)
                    \n
                    - **__Channel Customization__**
                    > Rename voice channel (<:vc_rename:1279102797459099699>)
                    > Claim ownership of the voice channel (<:vc_claim_ownership:1279102785945600173>)
                    > Transfer ownership of the voice channel (<:vc_transfer:1279102802668552314>)
                    > Change the voice channel server (<:vc_server:1279102799912898620>)`)
    .setTimestamp();

    return embed
}

function panelRowOne() {
    const row1 = new ActionRowBuilder().addComponents(
        new ButtonBuilder().setCustomId('lock').setEmoji('1278197399508226174').setStyle(ButtonStyle.Secondary),
        new ButtonBuilder().setCustomId('unlock').setEmoji('1278197548133257226').setStyle(ButtonStyle.Secondary),
        new ButtonBuilder().setCustomId('hide').setEmoji('1278197617217765498').setStyle(ButtonStyle.Secondary),
        new ButtonBuilder().setCustomId('unhide').setEmoji('1278197680509681717').setStyle(ButtonStyle.Secondary)
    );

    return row1
}

function panelRowTwo(){
    const row2 = new ActionRowBuilder().addComponents(
        new ButtonBuilder().setCustomId('setLimit').setEmoji('1278197732124786719').setStyle(ButtonStyle.Secondary),
        new ButtonBuilder().setCustomId('invite').setEmoji('1278197927839268864').setStyle(ButtonStyle.Secondary),
        new ButtonBuilder().setCustomId('ban').setEmoji('1278197883170062421').setStyle(ButtonStyle.Secondary),
        new ButtonBuilder().setCustomId('permit').setEmoji('1278198032948793418').setStyle(ButtonStyle.Secondary)
    );
    return row2
}

function panelRowThree(){
    const row3 = new ActionRowBuilder().addComponents(
        new ButtonBuilder().setCustomId('rename').setEmoji('1278198084274491433').setStyle(ButtonStyle.Secondary),
        new ButtonBuilder().setCustomId('claim').setEmoji('1278198179799633941').setStyle(ButtonStyle.Secondary),
        new ButtonBuilder().setCustomId('transfer').setEmoji('1030227495892557826').setStyle(ButtonStyle.Secondary),
        new ButtonBuilder().setCustomId('region').setEmoji('1278198135729950762').setStyle(ButtonStyle.Secondary)
    );
    return row3
}

module.exports = { panelBody, panelRowOne, panelRowTwo, panelRowThree };