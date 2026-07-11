const {
    EmbedBuilder,
    ActionRowBuilder,
    ChannelSelectMenuBuilder,
    RoleSelectMenuBuilder,
    ButtonBuilder,
    ButtonStyle,
    ChannelType
} = require("discord.js");

module.exports = async (interaction) => {

    await interaction.deferReply({ ephemeral: true });

    const embed = new EmbedBuilder()
        .setColor(0x5865F2)
        .setTitle("🛠️ Blacklist Setup Wizard")
        .setDescription(`Configure your blacklist system.

🟥 Blacklist Channel
🟥 Blacklist Staff Roles

Press **Save** when finished.`);

    const channel = new ChannelSelectMenuBuilder()
        .setCustomId("wizard_blist_channel")
        .setPlaceholder("Select Blacklist Channel")
        .addChannelTypes(ChannelType.GuildText);

    const roles = new RoleSelectMenuBuilder()
        .setCustomId("wizard_blist_roles")
        .setPlaceholder("Select Blacklist Staff Roles")
        .setMinValues(1)
        .setMaxValues(10);

    const buttons = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
            .setCustomId("wizard_blist_save")
            .setLabel("Save")
            .setEmoji("💾")
            .setStyle(ButtonStyle.Success),

        new ButtonBuilder()
            .setCustomId("wizard_blist_cancel")
            .setLabel("Cancel")
            .setEmoji("❌")
            .setStyle(ButtonStyle.Danger)
    );

    await interaction.editReply({
        embeds: [embed],
        components: [
            new ActionRowBuilder().addComponents(channel),
            new ActionRowBuilder().addComponents(roles),
            buttons
        ]
    });

};
