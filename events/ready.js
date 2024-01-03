const { Events } = require("discord.js");
const data = require("../config.json");

module.exports = {
  name: Events.ClientReady,
  once: true,
  async execute(client) {
    const guild = client.guilds.cache.get(data.guildId);
    console.log("guild foun with this id : " + data.guildId);
    console.log("The bot is Ready to Use !");
    client.user.setActivity("Bot Ticket");
  },
};
