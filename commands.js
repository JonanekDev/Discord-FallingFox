const Discord = require("discord.js");
const levely = require("./levely");
const config = require("./config.json");

class commands {
    constructor () {
    }

    async command (interaction) {
        switch (interaction.commandName) {
            case "level":
                const user = interaction.options.getUser("uživatel") || interaction.user;
                const LevelData = await new levely().GetUserLevel(user.id);
                let LevelCmdEmbed;
                if (LevelData !== "USERNOTFOUND") {
                    LevelCmdEmbed = new Discord.MessageEmbed()
                    .setTitle("Level uživatele - " + user.tag)
                    .setColor("#bd7739")
                    .setThumbnail(user.displayAvatarURL())
                    .setDescription("Uživatel <@" + user.id +  "> má level **" + LevelData.Level + "**, **" + LevelData.EXP + "** EXPů a celkově poslal **" + LevelData.CountOfMessages + "** zpráv!\n\nChceš vidět jak an tom jsou ostatní uživatelé? Mrkni na webovej leaderboard: **" + config.leaderboardWeb + "**")
                    .setTimestamp()
                    .setFooter("FallingFox v3 | " + interaction.user.tag, interaction.user.displayAvatarURL());
                } else {
                    LevelCmdEmbed = new Discord.MessageEmbed()
                    .setTitle("Level uživatele - " + user.tag)
                    .setColor("#bd7739")
                    .setThumbnail(user.displayAvatarURL())
                    .setDescription("Level uživatele <@" + user.id + "> nebyl nalezen! Uživatel nenapsal ještě ani jednu zprávu.")
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
            default:
                break;
        }
    }
}

module.exports = commands;