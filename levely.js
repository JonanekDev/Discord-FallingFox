const Discord = require("discord.js");
const configFile = require("./config.json");

//Level system
const db = require("./db");
const embeds = require("./embeds");

class levely {
    constructor () {
        return;
    }

    //Výpočet EXP potřebných pro další level
    CalculateXPForNextLevel (LevelBefore) {
        const BaseLevels = [10, 50, 100, 150, 200, 300, 400, 500, 600, 1000];   
        if (LevelBefore < BaseLevels.length) {
            return BaseLevels[LevelBefore];
        } else {
            return (LevelBefore + 1) * 250 - (BaseLevels.length *250) + 1000;
        }
    }

    GetUserLevel (UserID) {
        db.query("SELECT * FROM Levels WHERE DisUserID LIKE '" + UserID + "'", (err, result) => {
            if (err) {
                console.log("[ERROR] Nepovedlo se získat data z databáze. Zkontroluj jeslti je vytvořená tabulka Levels, chyba:" + err);
                return;
            }
            return result[0];
        })
    }

    //Funkce vyvolaná při zaslání nezablokované zprávy
    AddExpByMsg (message) {
        db.query("SELECT * FROM Levels WHERE DisUserID LIKE '" + message.author.id + "'", (err, result) => {
            if (err) {
                message.channel.send(new embeds().ErrEmbed("při získávání dat z MySQL", "Kontaktujte tvůrce bota <@781556627899547690>", message.author));
                console.log("[ERROR] Nepovedlo se získat data z databáze. Zkontroluj jeslti je vytvořená tabulka Levels, chyba:" + err);
                return;
            }
            //Výpočet EXP, které dostane uživatel
            let ZiskaneEXP;
            if (message.content.length < 15){
                ZiskaneEXP = 1;
            } else {
                ZiskaneEXP = Math.round(message.content.length / 15);
            }

            //První zpráva
            if (result.length < 1){
                db.query("INSTER INTO Levels (DisUserID, EXP, Level, CountOfMessages) VALUES ('" + message.author.id + "', '" + ZiskaneEXP + "', '1')", (err2) => {
                    if (err2) {
                        message.channel.send({ embeds: [new embeds().ErrEmbed("při zapisování uživatele do databáze", "Kontaktujte tvůrce bota <@781556627899547690>", message.author)] });
                        console.log("[ERROR] Nepovedlo se zapsat data z databáze. Zkontroluj jeslti zda MySQL uživatel má správná oprávnění, chyba:" + err2);
                        return;
                    }
                    const FirstMessageEmbed = new Discord.MessageEmbed()
                        .setTitle("🎉 První Zpráva! 🎉")
                        .setColor("#bd7739")
                        .setDescription("Hej <@" + message.author.id + ">, \nGratuluji ti, napsal jsi tvojí první zprávu na FallingFox Discordu!")
                        .setTimestamp()
                        .setFooter("FallingFox v3 | Levely");
                    message.channel.send({ embeds: [FirstMessageEmbed] });
                })
            //Když je uživatel víc jak jednou v databázi
            } else if(result.length > 1){
                message.channel.send({ embeds: [new embeds().ErrEmbed("v databázi je uživatel zapsán dvakrát", "Kontaktujte tvůrce bota <@781556627899547690>", message.author)] });
            //Když je uživatel jednou v databázi
            } else {
                const LevelBefore = result[0].Level;
                const EXPBefore = result[0].EXP;

                const EXPAfter = ZiskaneEXP + EXPBefore;

                const EXPNeededForNextLevel = this.CalculateXPForNextLevel (LevelBefore);

                //Level UP check
                let LevelAfter;
                if (EXPAfter >= EXPNeededForNextLevel) {
                    LevelAfter = LevelBefore + 1;
                }

                const SQLCommand = (LevelAfter !== undefined) ? "UPDATE Levels SET Level = '" + LevelAfter + "', EXP = '" + EXPAfter + "', CountOfMessages = '" + (result[0].CountOfMessages++) + "' WHERE ID = '" + result[0].ID + "'" : "UPDATE Levels SET EXP = '" + EXPAfter + "', CountOfMessages = '" + (result[0].CountOfMessages + 1) + "' WHERE ID = '" + result[0].ID + "'";
                db.query(SQLCommand, (err2) => {
                    if (err2) {
                        message.channel.send({ embeds: [new embeds().ErrEmbed("při zapisování EXPů a levelů do databáze", "Kontaktujte tvůrce bota <@781556627899547690>", message.author)] });
                        console.log("[ERROR] Nepovedlo se zapsat data z databáze. Zkontroluj jeslti zda MySQL uživatel má správná oprávnění, chyba:" + err2);
                        return;
                    }
                    if (LevelAfter !== undefined) {
                        const LevelUPEmbed = new Discord.MessageEmbed()
                            .setTitle("🎉 Dosažení dalšího levelu! 🎉")
                            .setColor("#bd7739")
                            .setThumbnail(message.author.displayAvatarURL())
                            .setDescription("Hej <@" + message.author.id + ">, \nGratuluji ti, právě jsi byl povýšen na level **" + LevelAfter + "**! \nChceš vidět jak na tom jsou ostatní? Mrkni se na **" + configFile["leaderboardWeb"] + "**")
                            .setTimestamp()
                            .setFooter("FallingFox v3 | Levely");
                        message.channel.send({ embeds: [LevelUPEmbed] });
                    }
                    //Checknutí rolí a přidání role, když je potřeba
                    //TODO: Vyřešit líp, zbytečný checkovat při každé zprávě
                    if (LevelAfter >= 30) {
                        configFile["rolesForLevels"].forEach((role) =>{
                            if (LevelAfter >= role.levelNeeded & !message.member.roles.cache.has(role.roleID)) {
                                message.member.roles.add(role.roleID);
                            }
                        })
                    }
                })
                
            }
        })
    }
}

module.exports = levely;
