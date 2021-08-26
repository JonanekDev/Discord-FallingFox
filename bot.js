const discord = require("discord.js");
const levely = require("./levely");
const { SlashCommandBuilder } = require("@discordjs/builders");
const commands = require("./commands");
const config = require("./config.json");

const client = new discord.Client({intents: [discord.Intents.FLAGS.GUILDS, discord.Intents.FLAGS.GUILD_MEMBERS, discord.Intents.FLAGS.GUILD_MESSAGES, discord.Intents.FLAGS.DIRECT_MESSAGES, discord.Intents.FLAGS.DIRECT_MESSAGE_REACTIONS, discord.Intents.FLAGS.DIRECT_MESSAGE_TYPING ]});

client.on("ready", () => {
    console.log("[Start] Login to Discord bot was successful!");
    if (process.argv[2] == "regcommands") {
        const LevelCMD = new SlashCommandBuilder()
        .setName("level")
        .setDescription("Zobrazí aktuální tvůj level nebo level zadaného uživatele")
        .addUserOption(option => 
            option.setName("uživatel")
                .setDescription("Uživatele, kterého chceš vidět level")
                .setRequired(false)
            );
    
        client.application.commands.create(LevelCMD);
        const LevelRoleCMD = new SlashCommandBuilder()
        .setName("levely-role")
        .setDescription("Zobrazí role získatelné získáním určitého levelu");
        client.application.commands.create(LevelRoleCMD);

        const AnketaCMD = new SlashCommandBuilder()
        .setName("anketa")
        .setDescription("Vytvoří hlasování")
        .addStringOption(option => 
            option.setName("anketa")
                .setDescription("Otázka, na kterou se chceš zeptat")
                .setRequired(true)
            );
    
        client.application.commands.create(AnketaCMD);

        const LeaderboardCMD = new SlashCommandBuilder()
        .setName("leaderboard")
        .setDescription("Zobrazí level leaderboard serveru");
        client.application.commands.create(LeaderboardCMD);

        const RandomFoodCMD = new SlashCommandBuilder()
        .setName("random-food")
        .setDescription("Zobrazí náhodné jídlo z Redditu");
        client.application.commands.create(RandomFoodCMD);

        const RandomMemeCMD = new SlashCommandBuilder()
        .setName("random-meme")
        .setDescription("Zobrazí náhodný meme z Redditu");
        client.application.commands.create(RandomMemeCMD);

        const LinkyCMD = new SlashCommandBuilder()
        .setName("linky")
        .setDescription("Zobrazí důležité linky týkající se FallingFox");
        client.application.commands.create(LinkyCMD);

        const AvatarCMD = new SlashCommandBuilder()
        .setName("avatar")
        .setDescription("Zobrazí tvůj avatar nebo avatar zadaného uživatele a zrecenzuje ho")
        .addUserOption(option => 
            option.setName("uživatel")
                .setDescription("Uživatele, kterého chceš vidět avatar")
                .setRequired(false)
            );
        client.application.commands.create(AvatarCMD);

        const SlapCMD = new SlashCommandBuilder()
        .setName("slap")
        .setDescription("Pošle facku zadanému uživateli")
        .addUserOption(option => 
            option.setName("uživatel")
                .setDescription("Uživatele, kterému chceš poslat facku")
                .setRequired(true)
            );
        client.application.commands.create(SlapCMD);


        const BallCMD = new SlashCommandBuilder()
        .setName("8ball")
        .setDescription("Odpoví ti na tvůj dotaz")
        .addStringOption(option => 
            option.setName("dotaz")
                .setDescription("Dotaz na, který chceš odpověď")
                .setRequired(true)
            );
        client.application.commands.create(BallCMD);

        const PocasiCMD = new SlashCommandBuilder()
        .setName("počasí")
        .setDescription("Zobrazí počasí v zadaném městě")
        .addStringOption(option => 
            option.setName("město")
                .setDescription("Město ve, kterém chceš vidět město")
                .setRequired(true)
            );
        client.application.commands.create(PocasiCMD);

        const UserInfoCMD = new SlashCommandBuilder()
        .setName("user-info")
        .setDescription("Zobrazí informace o zadaném uživateli")
        .addUserOption(option => 
            option.setName("uživatel")
                .setDescription("Uživatel o, kterém chceš vědět info")
                .setRequired(true)
            );
        client.application.commands.create(UserInfoCMD);

        const ClearCMD = new SlashCommandBuilder()
        .setName("clear")
        .setDescription("Smaže určitý počet zpráv")
        .setDefaultPermission(false)
        .addIntegerOption(option => 
            option.setName("počet")
                .setDescription("Počet zpráv na smazání")
                .setRequired(true)
            );
        client.application.commands.create(ClearCMD)
        .then(async (cmd) => {
            const command = client.application.commands.fetch(cmd.id);
            const permissions = [];
            config.adminPermRolesIDs.forEach((role) => {
                permissions.push({
                    id: role,
                    type: "ROLE",
                    permission: true,
                })
            })
            permissions.push({
                id: config.everyoneRoleID,
                type: "ROLE",
                permission: false,
            })
            await command.permissions.add({ permissions })
        })
    }
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
        new commands().command(interaction);
    }   
})

module.exports = client;