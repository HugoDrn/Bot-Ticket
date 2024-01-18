const {
  SlashCommandBuilder,
  EmbedBuilder,
  ButtonBuilder,
  ActionRowBuilder,
  PermissionBuilder,
  PermissionFlagsBits,
  StringSelectMenuBuilder,
  ComponentType,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ticket-setup")
    .setDescription("Setup the ticket system.")
    .setDMPermission(false)
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  async execute(interaction) {
    const embed = new EmbedBuilder()
      .setTitle("Ticket System")
      .setDescription("Create a ticket")
      .setColor("Aqua");

    const menu = new StringSelectMenuBuilder()
      .setCustomId("ticket-type")
      .setPlaceholder("Selectionner quel membre du staff vous voulez contacter")
      .addOptions([
        {
          label: "Selectionner un role",
          description: "Selectionner un role pour contacter le staff",
          value: "role",
          emoji: "🔨",
          default: true,
        },
        {
          label: "Owner",
          description: "Contacter un owner pour un problème",
          value: "owner",
          emoji: "🔧",
        },
        {
          label: " Gestion Staff",
          description: "Contacter le staff pour un problème",
          value: "staff",
          emoji: "🔨",
        },
        {
          label: "Gestion Abus",
          description: "Contacter un moderateur pour un problème",
          value: "moderation",
          emoji: "🔩",
        },
      ]);
    const rowMenu = new ActionRowBuilder().addComponents(menu);

    await interaction.reply({
      embeds: [embed],
      components: [rowMenu],
    });
  },
};
