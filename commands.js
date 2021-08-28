const Discord = require("discord.js");
const client = require("./bot");
const embeds = require("./embeds");

class commands {
    constructor () {
    }

    async command (interaction) {
        const config = require("./config.json");
        //TVL on ten kód někdo fakt čte jo? Se nudíš nebo co kurva?
        switch (interaction.commandName) {
            case "level":
                const levely69 = require("./levely");
                const Leveluser = interaction.options.getUser("uživatel") || interaction.user;
                const LevelData = await new levely69().GetUserLevel(Leveluser.id);
                let LevelCmdEmbed;
                if (LevelData !== "USERNOTFOUND") {
                    LevelCmdEmbed = new Discord.MessageEmbed()
                    .setTitle("⌨️ Level uživatele - " + Leveluser.tag + " ⌨️")
                    .setColor("#bd7739")
                    .setThumbnail(Leveluser.displayAvatarURL())
                    .setDescription("Uživatel <@" + Leveluser.id +  "> má level **" + LevelData.Level + "**, **" + LevelData.EXP + "** EXPů a celkově poslal **" + LevelData.CountOfMessages + "** zpráv!\n\nChceš vidět jak an tom jsou ostatní uživatelé? Mrkni na webovej leaderboard: **" + config.leaderboardWeb + "**")
                    .setTimestamp()
                    .setFooter("FallingFox v3 | " + interaction.user.tag, interaction.user.displayAvatarURL());
                } else {
                    LevelCmdEmbed = new Discord.MessageEmbed()
                    .setTitle("⌨️ Level uživatele - " + Leveluser.tag + " ⌨️")
                    .setColor("#bd7739")
                    .setThumbnail(Leveluser.displayAvatarURL())
                    .setDescription("Level uživatele <@" + Leveluser.id + "> nebyl nalezen! Uživatel nenapsal ještě ani jednu zprávu.")
                    .setTimestamp()
                    .setFooter("FallingFox v3 | " + interaction.user.tag, interaction.user.displayAvatarURL());
                }
                interaction.reply({ embeds: [LevelCmdEmbed] });
                break;


            case "levely-role":
                let roleZaLevely;
                config.rolesForLevels.forEach((role, index) => {
                    if (index == 0) {
                        roleZaLevely = "**" + role.roleName + "** - Potřebný level: " + role.levelNeeded;
                    } else {
                        roleZaLevely += "\n**" + role.roleName + "** - Potřebný level: " + role.levelNeeded;
                    }
                })
                const LevelyRoleEmbed = new Discord.MessageEmbed()
                .setTitle("⌨️ Role získatelné za levely ⌨️")
                .setColor("#bd7739")
                .setDescription(roleZaLevely)
                .setTimestamp()
                .setFooter("FallingFox v3 | " + interaction.user.tag, interaction.user.displayAvatarURL());
                interaction.reply({ embeds: [LevelyRoleEmbed] });
                break;


            case "linky":
                const LinkyEmbed = new Discord.MessageEmbed()
                .setTitle("🖥️ Důležité odkazy 🖥️")
                .setColor("#bd7739")
                .setTimestamp()
                .setFooter("FallingFox v3 | " + interaction.user.tag, interaction.user.displayAvatarURL());
                config.linky.forEach((link) => {
                    LinkyEmbed.addField(link.nadpis, link.link, true);
                })
                interaction.reply({ embeds: [LinkyEmbed] });
                break;


            case "avatar":
                const avatarUser = interaction.options.getUser("uživatel") || interaction.user;
                const AvatarEmbed = new Discord.MessageEmbed()
                .setTitle("⭐ Hodnocení avataru uživatele " + avatarUser.tag + " ⭐")
                .setColor("#bd7739")
                .setDescription(config.avatarRecenze[Math.floor(Math.random() * config.avatarRecenze.length)])
                .setImage(avatarUser.displayAvatarURL())
                .setTimestamp()
                .setFooter("FallingFox v3 | " + interaction.user.tag, interaction.user.displayAvatarURL());
                interaction.reply({ embeds: [AvatarEmbed] });
                break;


            case "slap":
                const slapUser = interaction.options.getUser("uživatel");
                const SlapEmbed = new Discord.MessageEmbed()
                .setTitle("✋ Letí facka něco si přej ✋")
                .setColor("#bd7739")
                .setDescription("Hej <@" + slapUser.id + "> letí pro tebe facka od <@" + interaction.user.id + ">")
                .setImage(config.slapGify[Math.floor(Math.random() * config.slapGify.length)])
                .setTimestamp()
                .setFooter("FallingFox v3 | " + interaction.user.tag, interaction.user.displayAvatarURL());
                interaction.reply({ embeds: [SlapEmbed] });
                break;
            
            
            case "anketa":
                const client1 = require("./bot");
                const anketa = interaction.options.getString("anketa");
                const AnketaEmbed = new Discord.MessageEmbed()
                .setTitle("🤔 ANKETA! 🤔")
                .setColor("#bd7739")
                .setDescription("**" + anketa + "**\n\n(👍 - Ano, 🤷 - Nevím, 👎 - Ne)")
                .setTimestamp()
                .setFooter("FallingFox v3 | " + interaction.user.tag, interaction.user.displayAvatarURL());
                client1.channels.cache.get(config.anketaChannelID).send({ embeds: [AnketaEmbed] })
                .then((botMsg) => {
                    botMsg.react("👍");
                    botMsg.react("🤷");
                    botMsg.react("👎");
                    interaction.reply({ content: "**Hlasování bylo vytvořeno v channelu <#" + config.anketaChannelID + ">**", ephemeral: true })
                })
                break; 


            case "leaderboard":
                const levely = require("./levely");
                const leaderboarddata = await new levely().GetLeaderBoard(5, 0)
                let leaderbord;
                leaderboarddata.forEach((clovek, index) => {
                    if (index == 0) {
                        leaderbord = "**" + (index + 1)  + ".** <@" + clovek.DisUserID + "> - Level: " + clovek.Level + ", EXPů: " + clovek.EXP + ", počet zpráv: " + clovek.CountOfMessages;
                    } else {
                        leaderbord += "\n**" + (index + 1)  + ".** <@" + clovek.DisUserID + "> - Level: " + clovek.Level + ", EXPů: " + clovek.EXP + ", počet zpráv: " + clovek.CountOfMessages;
                    }
                })
                leaderbord += "\n\nWebový leaderboard: **" + config.leaderboardWeb + "**";
                const LeaderboardEmbed = new Discord.MessageEmbed()
                .setTitle("🏆 Level Leaderboard 🏆")
                .setColor("#bd7739")
                .setDescription(leaderbord)
                .setTimestamp()
                .setFooter("FallingFox v3 | " + interaction.user.tag, interaction.user.displayAvatarURL());
                interaction.reply({ embeds: [LeaderboardEmbed] });
                break;


            case "8ball":
                const dotaz = interaction.options.getString("dotaz");
                const BallEmbed = new Discord.MessageEmbed()
                .setTitle("🔮 8BALL 🔮")
                .setColor("#bd7739")
                .setDescription("Zadaný dotaz: \n**" + dotaz + "**\n\nMoje odpověď: \n**" + config.EjtBallAnswers[Math.floor(Math.random() * config.EjtBallAnswers.length)] + "**")
                .setTimestamp()
                .setFooter("FallingFox v3 | " + interaction.user.tag, interaction.user.displayAvatarURL());
                interaction.reply({ embeds: [BallEmbed] });
                break;
            

            case "random-food":
                const axios1 = require("axios");
                axios1.get("https://api.pinktube.eu/api/reddit/FoodPorn/randompost?onlyPhotos=true&noNSFW=true")
                .then((apiData) => {
                    const data = apiData.data;
                    if (data.status == "OK") {
                        const post = data.post;
                        const FoodEmbed = new Discord.MessageEmbed()
                        .setTitle("🥩 Náhodné jídlo 🥩")
                        .setColor("#bd7739")
                        .setDescription("**" + post.title + "**\n\nUpvotes: " + post.ups + ", autor: " + post.author)
                        .setURL(post.postlink)
                        .setImage(post.url)
                        .setTimestamp()
                        .setFooter("FallingFox v3 | " + interaction.user.tag, interaction.user.displayAvatarURL());
                        interaction.reply({ embeds: [FoodEmbed] });
                    } else {
                        interaction.reply({ embeds: [new embeds().ErrEmbed("nepodařilo se získat náhodné jídlo", "Zkuste to znovu později", interaction.user)] });
                    }
                })
                .catch((err) => {
                    interaction.reply({ embeds: [new embeds().ErrEmbed("při získávání jídla nastala kritická chyba", "Kontaktujte tvůrce bota <@781556627899547690>", interaction.user)] });
                    console.log("[ERROR] Nepodařilo se získat data z API pro náhodné jídlo, chyba: " + err)
                })
                break;

                
            case "počasí":
                const axios2 = require("axios");
                axios2.get("https://api.pinktube.eu/api/weather/" + encodeURI(interaction.options.getString("město")) + "/current")
                .then((apiData) => {
                    const data = apiData.data;
                    if (data.status !== "KO") {
                        const VychodSLunce = new Date((data.sys.sunrise * 1000));
                        const ZapadSLunce = new Date((data.sys.sunset * 1000));
                        const srazky = (data.rain == undefined) ? 0:data.rain["1h"];
                        const snih = (data.snow == undefined) ? 0:data.rain["1h"];
                        const PocasiEmbed = new Discord.MessageEmbed()
                        .setTitle("🌞 Počasí - " + data.name + "🌞")
                        .setColor("#bd7739")
                        .addField("🌞 Počasí 🌞", data.weather[0].description, true)
                        .addField("🌡️ Aktuální teplota 🌡️", data.main.temp + "°C", true)
                        .addField("🖐️ Aktuální pocitová teplota 🖐️", data.main.feels_like + "°C", true)
                        .addField("🍹 Vlhkost 🍹", data.main.humidity + "%", true)
                        .addField("🌅 Východ slunce 🌅", VychodSLunce.getDate() + ". " + (VychodSLunce.getMonth() + 1) + ". " + VychodSLunce.getHours() + ":" + VychodSLunce.getMinutes(), true)
                        .addField("🌇 Západ slunce 🌇", ZapadSLunce.getDate() + ". " + (ZapadSLunce.getMonth() + 1) + ". " + ZapadSLunce.getHours() + ":" + ZapadSLunce.getMinutes(), true)
                        .addField("🧯 Tlak 🧯", data.main.pressure + "hPa", true)
                        .addField("💨 Rychlost větru 💨", data.wind.speed + "m/s", true)
                        .addField("☁️ Mračnost ☁️", data.clouds.all + "%", true)
                        .addField("🌧️ Srážky za poslední hodinu 🌧️", srazky + "mm", true)
                        .addField("❄️ Nasněženo za poslední hodinu ❄️", snih + "mm", true)
                        .setThumbnail("http://openweathermap.org/img/wn/" + data.weather[0].icon + "@2x.png")
                        .setTimestamp()
                        .setFooter("FallingFox v3 | " + interaction.user.tag, interaction.user.displayAvatarURL());
                        interaction.reply({ embeds: [PocasiEmbed] });
                    } else {
                        interaction.reply({ embeds: [new embeds().ErrEmbed("zadané město nejspíše neexistuje", "Zadej nějaké pěkné město jako je třeba Prostějov", interaction.user)] });
                    }
                })
                .catch((err) => {
                    interaction.reply({ embeds: [new embeds().ErrEmbed("při získávání jídla nastala kritická chyba", "Kontaktujte tvůrce bota <@781556627899547690>", interaction.user)] });
                    console.log("[ERROR] Nepodařilo se získat data z API pro náhodné jídlo, chyba: " + err)
                })
                break;

             
            case "user-info":
                const client2 = require("./bot");
                const user = interaction.options.getUser("uživatel");
                const member = client2.guilds.cache.get(config.guildID).members.cache.get(user.id);
                const datumVytvoreniUctu = user.createdAt;
                const datumPripojeni = member.joinedAt;
                const bannable = (member.bannable == false) ? "Ne":"Ano";
                const bot = (user.bot == false) ? "Ne":"Ano";
                const UserInfoEmbed = new Discord.MessageEmbed()
                .setTitle("🙎 Informace o uživateli - " + user.tag + "🙎")
                .setColor("#bd7739")
                .addField("ID Uživatele", user.id, true)
                .addField("Datum vytvoření účtu", datumVytvoreniUctu.getDate() + ". " + (datumVytvoreniUctu.getMonth() + 1) + ". " + datumVytvoreniUctu.getFullYear() + " " + datumVytvoreniUctu.getHours() + ":" + datumVytvoreniUctu.getMinutes(), true)
                .addField("Datum připojení na server", datumPripojeni.getDate() + ". " + (datumPripojeni.getMonth() + 1) + ". " + datumPripojeni.getFullYear() + " " + datumPripojeni.getHours() + ":" + datumPripojeni.getMinutes(), true)
                .addField("Přezdívka na serveru", member.displayName, true)
                .addField("Nejvyšší role na serveru", String(member.roles.highest), true)
                .addField("Můžu ho zabanovat?", bannable, true)
                .addField("Je to bot?", bot)
                .setThumbnail(user.displayAvatarURL())
                .setTimestamp()
                .setFooter("FallingFox v3 | " + interaction.user.tag, interaction.user.displayAvatarURL());
                interaction.reply({ embeds: [UserInfoEmbed] });
                break;

            
            case "clear":
                interaction.channel.bulkDelete(interaction.options.getInteger("počet"))
                .then((del) => {
                    const ClearEmbed = new Discord.MessageEmbed()
                    .setColor("#bd7739")
                    .setTitle("📝 Proběhlo smazání zpráv! 📝")
                    .setDescription("Bylo smazáno **" + del.size + "** zpráv")
                    .setTimestamp()
                    .setFooter("FallingFox v3 | " + interaction.user.tag, interaction.user.displayAvatarURL());
                    interaction.reply({ embeds: [ClearEmbed] });
                })
                break;
            
            
            case "random-reddit":
                const axios3 = require("axios");
                axios3.get("https://api.pinktube.eu/api/reddit/" + interaction.options.getString("reddit") + "/randompost?onlyPhotos=true&noNSFW=true")
                .then((apiData) => {
                    const data = apiData.data;
                    if (data.status == "OK") {
                        const post = data.post;
                        const RandomRedditEmbed = new Discord.MessageEmbed()
                        .setTitle("👀 Náhodný post z Redditu - " + interaction.options.getString("reddit") + " 👀")
                        .setColor("#bd7739")
                        .setDescription("**" + post.title + "**\n\nUpvotes: " + post.ups + ", autor: " + post.author)
                        .setURL(post.postlink)
                        .setImage(post.url)
                        .setTimestamp()
                        .setFooter("FallingFox v3 | " + interaction.user.tag, interaction.user.displayAvatarURL());
                        interaction.reply({ embeds: [RandomRedditEmbed] });
                    } else if (data.errCode == 1) {
                        interaction.reply({ embeds: [new embeds().ErrEmbed("nepodařilo se nám na zadaném Redditu najít post, který by nebyl NSFW a nebyl video", "Zadej nějakej slušnej Reddit kde jsou spíš obrázky", interaction.user)] });
                    } else {
                        nteraction.reply({ embeds: [new embeds().ErrEmbed("nepodařilo se najít hledaný Reddit", "Zadej nějakej kvalitní jako je třeba Duklock", interaction.user)] });
                    }

                })
                .catch((err) => {
                    interaction.reply({ embeds: [new embeds().ErrEmbed("při získávání postů nastala kritická chyba", "Kontaktujte tvůrce bota <@781556627899547690>", interaction.user)] });
                    console.log("[ERROR] Nepodařilo se získat data z API pro náhodný post, chyba: " + err)
                })
                break;


            case "sourcecode":
                interaction.reply( {content: "https://github.com/JonanekDev/Discord-FallingFox"} );
                break;


            default:
                interaction.reply({ embeds: [new embeds().ErrEmbed("zadaný příkaz nebyl nalezen v botovi", "Kontaktujte tvůrce bota <@781556627899547690>", interaction.user)] });
                break;
        }
    }
}

module.exports = commands;