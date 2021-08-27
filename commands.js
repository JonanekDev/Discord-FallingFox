const Discord = require("discord.js");
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
                    .setTitle("Level uživatele - " + Leveluser.tag)
                    .setColor("#bd7739")
                    .setThumbnail(Leveluser.displayAvatarURL())
                    .setDescription("Uživatel <@" + Leveluser.id +  "> má level **" + LevelData.Level + "**, **" + LevelData.EXP + "** EXPů a celkově poslal **" + LevelData.CountOfMessages + "** zpráv!\n\nChceš vidět jak an tom jsou ostatní uživatelé? Mrkni na webovej leaderboard: **" + config.leaderboardWeb + "**")
                    .setTimestamp()
                    .setFooter("FallingFox v3 | " + interaction.user.tag, interaction.user.displayAvatarURL());
                } else {
                    LevelCmdEmbed = new Discord.MessageEmbed()
                    .setTitle("Level uživatele - " + Leveluser.tag)
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
                .setTitle("Role získatelné za levely")
                .setColor("#bd7739")
                .setDescription(roleZaLevely)
                .setTimestamp()
                .setFooter("FallingFox v3 | " + interaction.user.tag, interaction.user.displayAvatarURL());
                interaction.reply({ embeds: [LevelyRoleEmbed] });
                break;


            case "linky":
                const LinkyEmbed = new Discord.MessageEmbed()
                .setTitle("Důležité odkazy")
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
                .setTitle("Hodnocení avataru uživatele " + avatarUser.tag)
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
                .setTitle("Letí facka něco si přej")
                .setColor("#bd7739")
                .setDescription("Hej <@" + slapUser.id + "> letí pro tebe facka od <@" + interaction.user.id + ">")
                .setImage(config.slapGify[Math.floor(Math.random() * config.slapGify.length)])
                .setTimestamp()
                .setFooter("FallingFox v3 | " + interaction.user.tag, interaction.user.displayAvatarURL());
                interaction.reply({ embeds: [SlapEmbed] });
                break;
            
            
            case "anketa":
                const client = require("./bot");
                const anketa = interaction.options.getString("anketa");
                const AnketaEmbed = new Discord.MessageEmbed()
                .setTitle("🤔 ANKETA! 🤔")
                .setColor("#bd7739")
                .setDescription("**" + anketa + "**\n\n(👍 - Ano, 🤷 - Nevím, 👎 - Ne)")
                .setTimestamp()
                .setFooter("FallingFox v3 | " + interaction.user.tag, interaction.user.displayAvatarURL());
                client.channels.cache.get(config.anketaChannelID).send({ embeds: [AnketaEmbed] })
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
                        const FoodEmbed = new Discord.MessageEmbed()
                        .setTitle("🥩 Náhodné jídlo 🥩")
                        .setColor("#bd7739")
                        .setDescription(data.title)
                        .setImage(data.url)
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

            default:
                interaction.reply({ embeds: [new embeds().ErrEmbed("zadaný příkaz nebyl nalezen v botovi", "Kontaktujte tvůrce bota <@781556627899547690>", interaction.user)] });
                break;
        }
    }
}

module.exports = commands;