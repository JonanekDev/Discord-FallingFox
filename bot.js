const discord = require("discord.js");
const levely = require("./levely");
const { SlashCommandBuilder } = require("@discordjs/builders");
const commands = require("./commands");

const client = new discord.Client({intents: [discord.Intents.FLAGS.GUILDS, discord.Intents.FLAGS.GUILD_MEMBERS, discord.Intents.FLAGS.GUILD_MESSAGES, discord.Intents.FLAGS.DIRECT_MESSAGES, discord.Intents.FLAGS.DIRECT_MESSAGE_REACTIONS, discord.Intents.FLAGS.DIRECT_MESSAGE_TYPING ]});

client.on("ready", () => {
    console.log("[Start] Login to Discord bot was successful!");

})

client.on("message", (message) => {
    if(message.author.bot || message.channel.type == "DM") return;
    new levely().AddExpByMsg(message);
})

client.login(process.env.DISCORD_BOT_TOKEN)
.catch((err) => {
    console.log("[FATAL ERROR] Nepodařilo se připojit na Discord bota, zkontroluj .env soubor. Aplikace se automaticky vypne! Err: " + err)
    process.exit(1);
})

client.on('interactionCreate', interaction => {
    if (interaction.isCommand()) {
        new commands(interaction);
    }   
})

module.exports = client;