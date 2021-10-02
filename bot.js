const discord = require("discord.js");

const client = new discord.Client({intents: [discord.Intents.FLAGS.GUILDS, discord.Intents.FLAGS.GUILD_MEMBERS, discord.Intents.FLAGS.GUILD_MESSAGES, discord.Intents.FLAGS.DIRECT_MESSAGES, discord.Intents.FLAGS.DIRECT_MESSAGE_REACTIONS, discord.Intents.FLAGS.DIRECT_MESSAGE_TYPING, discord.Intents.FLAGS.GUILD_MESSAGE_REACTIONS, discord.Intents.FLAGS.GUILD_PRESENCES ]});

function UpdateCountOfUsers() {
    const config = require("./config.json");
    const channel = client.channels.cache.get(config.countOfUsersChannel);
    const UpdateNazev = "Uživatelů na serveru: " + client.guilds.cache.get(config.guildID).memberCount;
    if (channel.name !== UpdateNazev){
        channel.setName(UpdateNazev);
    }
}

client.on("ready", () => {
    console.log("[Start] Přihlášení na DIscord bota bylo úspěšné!");
    client.user.setPresence({ activities: [{ type: "WATCHING", name: "github.com/JonanekDev/Discord-FallingFox" }] });
    setInterval(() => {
        //TODO: Zobrazení dočastného statusu, pokud je nastaven
        const config = require("./config.json");
        const status = config.permanentniStatusy[Math.floor(Math.random() * config.permanentniStatusy.length)];
        client.user.setPresence({ activities: [{ type: status.type, name: status.CONTENT }] });
    }, require("./config.json").meneniStatusuIntervalSekundy * 1000);
    UpdateCountOfUsers();
    setInterval(() => {
        const parser = new (require("rss-parser"))();
        const config = require("./config.json");
        parser.parseURL("https://www.youtube.com/feeds/videos.xml?channel_id=" + config.youtubeChannelID)
        .then((data) => {
            if (data.items[0].id !== config.lastCheckedVideo) {
                const fs = require("fs");
                config.lastCheckedVideo = data.items[0].id;
                console.log("nove video");
                const NewVideoEmbed = new discord.MessageEmbed()
                .setTitle("🎉 VYŠLO NOVÉ VIDEO 🎉")
                .setColor("#bd7739")
                .setDescription("Na FallingFox kanále aktuálně vyšlo nové video s názvem **" + data.items[0].title + "**, běž se na něj mrknout: \n **" + data.items[0].link + "**")
                .setTimestamp()
                .setFooter("FallingFox v3 | Nové video");
                client.channels.cache.get(config.youtubeNotificationsChannelID).send({ embeds: [NewVideoEmbed], content: data.items[0].link});
                fs.writeFile("./config.json", JSON.stringify(config), "utf8", (err) => {
                    if (err) {
                        console.log("[Error] Nastala chyba při ukládání ID posledního videa. Zkontrolujte permisse souboru config.json")
                    }
                })
            }
        })
    }, 60 * 10 * 1000);
    if (process.argv[2] == "regcommands") {
        console.log("[Start] Probíhá registrování příkazů!")
        const { SlashCommandBuilder } = require("@discordjs/builders");
        const config = require("./config.json");
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

        const RandomRedditCMD = new SlashCommandBuilder()
        .setName("random-reddit")
        .setDescription("Zobrazí náhodný post z Redditu")
        .addStringOption(option => 
            option.setName("reddit")
                .setDescription("Reddit ze, které ho chceš post")
                .setRequired(true)
            );
        client.application.commands.create(RandomRedditCMD);

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

        const SourceCodeCMD = new SlashCommandBuilder()
        .setName("sourcecode")
        .setDescription("Zobrazí odkaz na GitHub, kde nalezneš můj kód");
        client.application.commands.create(SourceCodeCMD);

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
            //TODO: FIX ERROR
            command.permissions.add({ permissions });
        })
    }
})

client.on("message", (message) => {
    if(message.author.bot || message.channel.type == "DM") return;
    //TODO: Detekce spamu a následná blokace
    const levely = require("./levely");
    new levely().AddExpByMsg(message);
})

client.on("guildMemberAdd", (member) => {
    const config = require("./config.json");
    const WelcomeEmbed = new discord.MessageEmbed()
    .setTitle("Vítej! - " + member.user.tag)
    .setColor("#bd7739") 
    .setThumbnail(member.user.displayAvatarURL())
    .setDescription("Hej <@" + member.user.id + ">,\n Vítej na FallingFox Discord serveru.\nDoufám, že se ti u nás bude líbit!")
    .setTimestamp()
    .setFooter("FallingFox v3 | Vítej!");
    client.channels.cache.get(config.welcomeChannelID).send({ embeds: [WelcomeEmbed] });
    member.roles.add(config.roleAfterJoin);
    UpdateCountOfUsers();
    const levely = require("./levely");
    new levely().SetUserLeavl(member.id, 0);
})

client.on("guildMemberRemove", (member) => {
    UpdateCountOfUsers();
    new levely().SetUserLeavl(member.id, 1);
})

client.login(process.env.DISCORD_BOT_TOKEN)
.catch((err) => {
    console.log("[FATAL ERROR] Nepodařilo se připojit na Discord bota, zkontroluj .env soubor. Aplikace se automaticky vypne! Err: " + err)
    process.exit(1);
})

client.on('interactionCreate', interaction => {
    if (interaction.isCommand()) {
        const commands = require("./commands")
        new commands().command(interaction);
    }   
})

module.exports = client;