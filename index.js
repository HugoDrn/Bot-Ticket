// Require the necessary discord.js classes

const fs = require("node:fs");
const path = require("node:path");
const {
  Client,
  Collection,
  Events,
  GatewayIntentBits,
  PermissionsBitField,
  EmbedBuilder,
  ButtonBuilder,
  ActionRowBuilder,
  ChannelType,
  StringSelectMenuComponent,
  StringSelectMenuInteraction,
} = require("discord.js");
const dotenv = require("dotenv");
dotenv.config();

//Discord client

const dataJSON = require("./config.json");
const { channel } = require("node:diagnostics_channel");
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
  ],
});

//Cooldown

const buttonCooldown = new Set();

client.commands = new Collection();
const foldersPath = path.join(__dirname, "commands");
const commandFolders = fs.readdirSync(foldersPath);

//Claim Status
var claimStatus = false;

//Command handler

for (const folder of commandFolders) {
  const commandsPath = path.join(foldersPath, folder);
  const commandFiles = fs
    .readdirSync(commandsPath)
    .filter((file) => file.endsWith(".js"));
  for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    if ("data" in command && "execute" in command) {
      client.commands.set(command.data.name, command);
    } else {
      console.log(
        `[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`
      );
    }
  }
}

//Event handler

const eventsPath = path.join(__dirname, "events");
const eventFiles = fs
  .readdirSync(eventsPath)
  .filter((file) => file.endsWith(".js"));

for (const file of eventFiles) {
  const filePath = path.join(eventsPath, file);
  const event = require(filePath);
  if (event.once) {
    client.once(event.name, (...args) => event.execute(...args));
  } else {
    client.on(event.name, (...args) => event.execute(...args));
  }
}

// Create ticket

creatorUserId = "";
client.on(Events.InteractionCreate, async (interaction) => {
  if (
    !interaction.isStringSelectMenu() &&
    interaction.customId !== "ticket-type"
  ) {
    return;
    // Owner
  } else if (
    interaction.isStringSelectMenu() &&
    interaction.customId === "ticket-type" &&
    interaction.values[0] === "owner"
  ) {
    const channelName = `ticketowner-${interaction.user.username}`;
    const channelSend = client.channels.cache.find(
      (channel) => channel.name === channelName
    );
    if (channelSend) {
      await interaction.reply({
        content: "You already have a ticket open!",
        ephemeral: true,
      });
      return;
    } else {
      let userID = interaction.guild.members.cache.get(interaction.user.id);

      await interaction.guild.channels.create({
        name: `ticketowner-${interaction.user.username}`,
        type: ChannelType.GuildText,
        parent: dataJSON.ticketParent,
        permissionOverwrites: [
          {
            id: userID.id,
            allow: [
              PermissionsBitField.Flags.ViewChannel,
              PermissionsBitField.Flags.SendMessages,
              PermissionsBitField.Flags.ReadMessageHistory,
            ],
          },
          {
            id: dataJSON.ownerRole,
            allow: [
              PermissionsBitField.Flags.ViewChannel,
              PermissionsBitField.Flags.SendMessages,
              PermissionsBitField.Flags.ReadMessageHistory,
            ],
          },
          {
            id: interaction.guild.id,
            deny: [
              PermissionsBitField.Flags.ViewChannel,
              PermissionsBitField.Flags.SendMessages,
            ],
          },
        ],
      });

      const embed = new EmbedBuilder().setTitle("Ticket Opened").setFooter({
        text: `Ticket ID: ticket-${interaction.user.username}`,
        iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
      });
      const closeBtn = new ButtonBuilder()
        .setStyle("Danger")
        .setLabel("Close Ticket")
        .setCustomId("closeTicket");

      const pingBtn = new ButtonBuilder()
        .setStyle("Primary")
        .setLabel("Ping Support")
        .setCustomId("pingSupport");

      const claimBtn = new ButtonBuilder()
        .setStyle("Success")
        .setLabel("Claim Ticket")
        .setCustomId("claimTicket");

      const row = new ActionRowBuilder().addComponents(
        closeBtn,
        claimBtn,
        pingBtn
      );
      const channelSend = client.channels.cache.find(
        (channel) => channel.name === channelName
      );

      await channelSend.send({ embeds: [embed], components: [row] });
      await interaction.reply({
        content: "Your ticket has been created!",
        ephemeral: true,
      });
    }
    // GestionStaff
  } else if (
    interaction.isStringSelectMenu() &&
    interaction.customId === "ticket-type" &&
    interaction.values[0] === "staff"
  ) {
    const channelName = `ticketstaff-${interaction.user.username}`;
    const channelSend = client.channels.cache.find(
      (channel) => channel.name === channelName
    );
    if (channelSend) {
      await interaction.reply({
        content: "You already have a ticket open!",
        ephemeral: true,
      });
      return;
    } else {
      let userID = interaction.guild.members.cache.get(interaction.user.id);

      await interaction.guild.channels.create({
        name: `ticketstaff-${interaction.user.username}`,
        type: ChannelType.GuildText,
        parent: dataJSON.ticketParent,
        permissionOverwrites: [
          {
            id: userID.id,
            allow: [
              PermissionsBitField.Flags.ViewChannel,
              PermissionsBitField.Flags.SendMessages,
              PermissionsBitField.Flags.ReadMessageHistory,
            ],
          },
          {
            id: dataJSON.staffRole,
            allow: [
              PermissionsBitField.Flags.ViewChannel,
              PermissionsBitField.Flags.SendMessages,
              PermissionsBitField.Flags.ReadMessageHistory,
            ],
          },
          {
            id: dataJSON.ownerRole,
            allow: [
              PermissionsBitField.Flags.ViewChannel,
              PermissionsBitField.Flags.SendMessages,
              PermissionsBitField.Flags.ReadMessageHistory,
            ],
          },
          {
            id: interaction.guild.id,
            deny: [
              PermissionsBitField.Flags.ViewChannel,
              PermissionsBitField.Flags.SendMessages,
            ],
          },
        ],
      });

      const embed = new EmbedBuilder().setTitle("Ticket Opened").setFooter({
        text: `Ticket ID: ticket-${interaction.user.username}`,
        iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
      });
      const closeBtn = new ButtonBuilder()
        .setStyle("Danger")
        .setLabel("Close Ticket")
        .setCustomId("closeTicket");

      const pingBtn = new ButtonBuilder()
        .setStyle("Primary")
        .setLabel("Ping Support")
        .setCustomId("pingSupport");

      const claimBtn = new ButtonBuilder()
        .setStyle("Success")
        .setLabel("Claim Ticket")
        .setCustomId("claimTicket");

      const row = new ActionRowBuilder().addComponents(
        closeBtn,
        claimBtn,
        pingBtn
      );
      const channelSend = client.channels.cache.find(
        (channel) => channel.name === channelName
      );

      await channelSend.send({ embeds: [embed], components: [row] });

      await interaction.reply({
        content: "Your ticket has been created!",
        ephemeral: true,
      });
    }
    // Moderation
  } else if (
    interaction.isStringSelectMenu() &&
    interaction.customId === "ticket-type" &&
    interaction.values[0] === "moderation"
  ) {
    const channelName = `ticketmoderation-${interaction.user.username}`;
    const channelSend = client.channels.cache.find(
      (channel) => channel.name === channelName
    );
    if (channelSend) {
      await interaction.reply({
        content: "You already have a ticket open!",
        ephemeral: true,
      });
      return;
    } else {
      let userID = interaction.guild.members.cache.get(interaction.user.id);

      await interaction.guild.channels.create({
        name: `ticketmoderation-${interaction.user.username}`,
        type: ChannelType.GuildText,
        parent: dataJSON.ticketParent,
        permissionOverwrites: [
          {
            id: userID.id,
            allow: [
              PermissionsBitField.Flags.ViewChannel,
              PermissionsBitField.Flags.SendMessages,
              PermissionsBitField.Flags.ReadMessageHistory,
            ],
          },
          {
            id: dataJSON.modoRole,
            allow: [
              PermissionsBitField.Flags.ViewChannel,
              PermissionsBitField.Flags.SendMessages,
              PermissionsBitField.Flags.ReadMessageHistory,
            ],
          },
          {
            id: dataJSON.modoTestRole,
            allow: [
              PermissionsBitField.Flags.ViewChannel,
              PermissionsBitField.Flags.SendMessages,
              PermissionsBitField.Flags.ReadMessageHistory,
            ],
          },
          {
            id: dataJSON.modoConfirmRole,
            allow: [
              PermissionsBitField.Flags.ViewChannel,
              PermissionsBitField.Flags.SendMessages,
              PermissionsBitField.Flags.ReadMessageHistory,
            ],
          },
          {
            id: dataJSON.responsableRole,
            allow: [
              PermissionsBitField.Flags.ViewChannel,
              PermissionsBitField.Flags.SendMessages,
              PermissionsBitField.Flags.ReadMessageHistory,
            ],
          },
          {
            id: dataJSON.ownerRole,
            allow: [
              PermissionsBitField.Flags.ViewChannel,
              PermissionsBitField.Flags.SendMessages,
              PermissionsBitField.Flags.ReadMessageHistory,
            ],
          },
          {
            id: interaction.guild.id,
            deny: [
              PermissionsBitField.Flags.ViewChannel,
              PermissionsBitField.Flags.SendMessages,
            ],
          },
        ],
      });

      const embed = new EmbedBuilder().setTitle("Ticket Opened").setFooter({
        text: `Ticket ID: ticket-${interaction.user.username}`,
        iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
      });
      const closeBtn = new ButtonBuilder()
        .setStyle("Danger")
        .setLabel("Close Ticket")
        .setCustomId("closeTicket");

      const pingBtn = new ButtonBuilder()
        .setStyle("Primary")
        .setLabel("Ping Support")
        .setCustomId("pingSupport");

      const claimBtn = new ButtonBuilder()
        .setStyle("Success")
        .setLabel("Claim Ticket")
        .setCustomId("claimTicket");

      const row = new ActionRowBuilder().addComponents(
        closeBtn,
        claimBtn,
        pingBtn
      );
      const channelSend = client.channels.cache.find(
        (channel) => channel.name === channelName
      );

      await channelSend.send({ embeds: [embed], components: [row] });

      await interaction.reply({
        content: "Your ticket has been created!",
        ephemeral: true,
      });
    }
  }
});

// Claim ticket
client.on(Events.InteractionCreate, async (interaction) => {
  if (
    interaction.isButton() &&
    interaction.customId === "claimTicket" &&
    (interaction.member.roles.cache.has(dataJSON.ownerRole) ||
      interaction.member.roles.cache.has(dataJSON.staffRole) ||
      interaction.member.roles.cache.has(dataJSON.modoRole) ||
      interaction.member.roles.cache.has(dataJSON.modoTestRole) ||
      interaction.member.roles.cache.has(dataJSON.modoConfirmRole) ||
      interaction.member.roles.cache.has(dataJSON.responsableRole))
  ) {
    await interaction.reply({
      content: "Ticket claimed",
      ephemeral: true,
    });
    claimStatus = true;
    const channelName = interaction.channel.name;
    if (String(channelName).startsWith("ticketowner")) {
      var userName = String(channelName).replace("ticketowner-", "");
    } else if (String(channelName).startsWith("ticketstaff")) {
      var userName = String(channelName).replace("ticketstaff-", "");
    } else if (String(channelName).startsWith("ticketmoderation")) {
      var userName = String(channelName).replace("ticketmoderation-", "");
    }
    const userId = client.users.cache.find(
      (user) => user.username === userName
    );
    await interaction.channel.permissionOverwrites.set([
      {
        id: userId.id,
        allow: [PermissionsBitField.Flags.ViewChannel],
        deny: [PermissionsBitField.Flags.SendMessages],
      },
      {
        id: dataJSON.responsableRole,
        allow: [
          PermissionsBitField.Flags.ViewChannel,
          PermissionsBitField.Flags.SendMessages,
        ],
      },
      {
        id: dataJSON.ownerRole,
        allow: [
          PermissionsBitField.Flags.ViewChannel,
          PermissionsBitField.Flags.SendMessages,
        ],
      },

      {
        id: interaction.user.id,
        allow: [PermissionsBitField.Flags.ViewChannel],
        deny: [PermissionsBitField.Flags.SendMessages],
      },
    ]);
  } else if (interaction.isButton() && interaction.customId === "claimTicket") {
    await interaction.reply({
      content: "You don't have the permission to do that!",
      ephemeral: true,
    });
  }
});

// Delete ticket

client.on(Events.InteractionCreate, async (interaction) => {
  if (
    interaction.isButton() &&
    interaction.customId === "closeTicket" &&
    claimStatus === false
  ) {
    await interaction.channel.delete();
  } else if (
    interaction.isButton() &&
    interaction.customId === "closeTicket" &&
    claimStatus === true &&
    (interaction.member.roles.cache.has(dataJSON.ownerRole) ||
      interaction.member.roles.cache.has(dataJSON.staffRole) ||
      interaction.member.roles.cache.has(dataJSON.modoRole) ||
      interaction.member.roles.cache.has(dataJSON.modoTestRole) ||
      interaction.member.roles.cache.has(dataJSON.modoConfirmRole) ||
      interaction.member.roles.cache.has(dataJSON.responsableRole))
  ) {
    await interaction.channel.delete();
  } else if (
    interaction.isButton() &&
    interaction.customId === "closeTicket" &&
    claimStatus === true
  ) {
    await interaction.reply({
      content: "You don't have the permission to do that!",
      ephemeral: true,
    });
  }
});

// Ping support

client.on(Events.InteractionCreate, async (interaction) => {
  if (
    interaction.isButton() &&
    interaction.customId === "pingSupport" &&
    interaction.channel.name.startsWith("ticketowner")
  ) {
    if (buttonCooldown.has(interaction.user.id)) {
      await interaction.reply({
        content: "You can only ping support every 5 minutes!",
        ephemeral: true,
      });
      return;
    } else {
      await interaction.reply("<@&" + dataJSON.ownerRole + ">");
      buttonCooldown.add(interaction.user.id);
      setTimeout(() => {
        buttonCooldown.delete(interaction.user.id);
      }, 300000);
    }
  }
});

client.on(Events.InteractionCreate, async (interaction) => {
  if (
    interaction.isButton() &&
    interaction.customId === "pingSupport" &&
    interaction.channel.name.startsWith("ticketstaff")
  ) {
    if (buttonCooldown.has(interaction.user.id)) {
      await interaction.reply({
        content: "You can only ping support every 5 minutes!",
        ephemeral: true,
      });
      return;
    } else {
      await interaction.reply("<@&" + dataJSON.staffRole + ">");
      buttonCooldown.add(interaction.user.id);
      setTimeout(() => {
        buttonCooldown.delete(interaction.user.id);
      }, 300000);
    }
  }
});

client.on(Events.InteractionCreate, async (interaction) => {
  if (
    interaction.isButton() &&
    interaction.customId === "pingSupport" &&
    interaction.channel.name.startsWith("ticketmoderation")
  ) {
    if (buttonCooldown.has(interaction.user.id)) {
      await interaction.reply({
        content: "You can only ping support every 5 minutes!",
        ephemeral: true,
      });
      return;
    } else {
      await interaction.channel.send(
        "<@&" +
          dataJSON.modoTestRole +
          ">" +
          " " +
          "<@&" +
          dataJSON.modoRole +
          ">" +
          " " +
          "<@&" +
          dataJSON.modoConfirmRole +
          ">"
      );
      buttonCooldown.add(interaction.user.id);
      setTimeout(() => {
        buttonCooldown.delete(interaction.user.id);
      }, 30);
    }
  }
});

// Login

client.login(process.env.TOKEN);
