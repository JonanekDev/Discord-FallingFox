const discord = require("discord.js");

class embeds {
    constructor() {
    }

    ErrEmbed(Err, Solution, Author) {
        const embed = new discord.MessageEmbed()
            .setTitle("❌ Oopps... Nastala chybka ❌")
            .setColor("#ff0000")
            .setDescription("Omlouváme se, ale nastala chyba **" + Err + "**! \n 👉 " + Solution)
            .setTimestamp()
            .setFooter("FallingFox v3 | " + Author.tag, Author.displayAvatarURL());
        return embed;
    }
}

module.exports = embeds;