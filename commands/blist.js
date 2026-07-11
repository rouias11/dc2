const {
    SlashCommandBuilder,
    PermissionFlagsBits
} = require("discord.js");

const settings = require("../utils/settings");

module.exports = {

    data: new SlashCommandBuilder()
        .setName("blist")
        .setDescription("Blacklist system")

        .addSubcommand(sub =>
            sub
                .setName("wizard")
                .setDescription("Configure the blacklist system")
        )

        .addSubcommand(sub =>
            sub
                .setName("post")
                .setDescription("Post a blacklist")

                .addStringOption(opt =>
                    opt
                        .setName("link")
                        .setDescription("Google Docs link")
                        .setRequired(true)
                )

                .addStringOption(opt =>
                    opt
                        .setName("vanity")
                        .setDescription("Discord invite")
                        .setRequired(true)
                )

                .addBooleanOption(opt =>
                    opt
                        .setName("ping")
                        .setDescription("Ping everyone?")
                        .setRequired(false)
                )
        )

        .addSubcommand(sub =>
            sub
                .setName("ban")
                .setDescription("Ban multiple users")

                .addStringOption(opt =>
                    opt
                        .setName("ids")
                        .setDescription("User IDs separated by spaces")
                        .setRequired(true)
                )
        ),

    async execute(interaction) {

        const sub = interaction.options.getSubcommand();

        // ==========================
        // Wizard
        // ==========================

        if (sub === "wizard") {

            if (
                !interaction.member.permissions.has(
                    PermissionFlagsBits.Administrator
                )
            ) {
                return interaction.reply({
                    content: "❌ Only administrators can use this command.",
                    ephemeral: true
                });
            }

            const wizard = require("../handlers/blistWizard");
            return wizard(interaction);

        }

        // ==========================
        // Load Guild Settings
        // ==========================

        const guild = settings.getGuild(interaction.guild.id);

        if (!guild.blistChannel) {

            return interaction.reply({
                content:
                    "❌ This server hasn't been configured yet.\nRun **/blist wizard** first.",
                ephemeral: true
            });

        }

        if (
            !guild.blistRoles ||
            guild.blistRoles.length === 0
        ) {

            return interaction.reply({
                content:
                    "❌ No blacklist staff roles have been configured.\nRun **/blist wizard** first.",
                ephemeral: true
            });

        }

        const hasRole = interaction.member.roles.cache.some(role =>
            guild.blistRoles.includes(role.id)
        );

        if (!hasRole) {

            return interaction.reply({
                content: "❌ You don't have permission to use this command.",
                ephemeral: true
            });

        }

        // ==========================
        // /blist post
        // ==========================

        if (sub === "post") {

            const link = interaction.options.getString("link");
            const vanity = interaction.options.getString("vanity");
            const ping = interaction.options.getBoolean("ping") || false;

            const channel = await interaction.client.channels.fetch(
                guild.blistChannel
            );

            if (!channel) {

                return interaction.reply({
                    content: "❌ Blacklist channel not found.",
                    ephemeral: true
                });

            }

            let message = "";

            if (ping) {
                message += "@everyone\n\n";
            }

            message +=
`woohooo new blist ig on /${vanity}

blist doc: ${link}

dont join the link pls
Serv link: ${vanity}

sent by ${interaction.user}`;

            await channel.send({
                content: message
            });

            return interaction.reply({
                content: "✅ Blacklist posted successfully.",
                ephemeral: true
            });

        }

        // ==========================
        // /blist ban
        // ==========================

        if (sub === "ban") {

            const ids = interaction.options
                .getString("ids")
                .trim()
                .split(/\s+/);

            const results = [];

            for (const id of ids) {

                try {

                    const member = await interaction.guild.members.fetch(id);

                    await member.ban({
                        reason: `Banned by ${interaction.user.tag} via /blist ban`
                    });

                    results.push(`✅ Banned: ${id}`);

                } catch {

                    results.push(`❌ Failed: ${id}`);

                }

            }

            return interaction.reply({
                content: results.join("\n"),
                ephemeral: true
            });

        }

    }

};
