const settings = require("../utils/settings");
const sessions = require("../utils/wizardSessions");

module.exports = async (interaction) => {

    const session = sessions.get(interaction.guild.id);

    if (!session) {
        return interaction.reply({
            content: "❌ No setup session found.",
            ephemeral: true
        });
    }

    // ==========================
    // Save
    // ==========================

    if (interaction.customId === "wizard_blist_save") {

        settings.setGuild(interaction.guild.id, {
            blistChannel: session.blistChannel,
            blistRoles: session.blistRoles
        });

        sessions.remove(interaction.guild.id);

        return interaction.update({
            content: "✅ Blacklist configuration saved successfully!",
            embeds: [],
            components: []
        });

    }

    // ==========================
    // Cancel
    // ==========================

    if (interaction.customId === "wizard_blist_cancel") {

        sessions.remove(interaction.guild.id);

        return interaction.update({
            content: "❌ Blacklist setup cancelled.",
            embeds: [],
            components: []
        });

    }

};
