/*
    FallingFox Discord Bot

    Code by: Jonanek#2328
*/
const axios = require("axios");
const Discord = require("discord.js");
const client = new Discord.Client();
const mysql = require("mysql");
require('dotenv').config();

//Napojení na databázy
const db = mysql.createConnection({
    database: process.env.DB_DATABASE,
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    supportBigNumbers: true
})

db.connect((err) => {
    if(err) {
        console.log("[Error]" + err);
    }
    setInterval(() => {
        db.ping();    
    }, 10 * 60 * 1000);
});

const nadavky = ["kokot", "dement", "pi"]

//Role za Levely
const RoleZaLevely = [
    {roleID: 707578282253746246, levelNeeded: 30, roleName: "Věrný fanoušek"},
    {roleID: 707578567692648469, levelNeeded: 60, roleName: "Dlouhodobý fanoušek"},
    {roleID: 707578176884441150, levelNeeded: 100, roleName: "Lištička"},
    {roleID: 731195588657545276, levelNeeded: 150, roleName: "Liška"},
    {roleID: 764857315874308146, levelNeeded: 200, roleName: "Mafianská  Liška"},
    {roleID: 764857735832666174, levelNeeded: 250, roleName: "Retro Liška"},
    {roleID: 764857894373949461, levelNeeded: 300, roleName: "CupHead Liška"},
    {roleID: 764858829351157801, levelNeeded: 400, roleName: "Liška z Bradavic"}
]

//HELP command
const ListCommands = [
    {command: "help", popis: "Zobrazí list všech dostupných příkazů"},
    {command: "level [@Uživatel]", popis: "Zobrazí váš aktuální level nebo level zadaného uživatele"},
    {command: "anketa [Otázka]", popis: "Vytvoří hlasování"},
    {command: "leaderboard", popis: "Zobrazí top 5 lidí s nejvyšším levelem a pošle odkaz na webový leaderboard"},
    {command: "random-food", popis: "Zobrazí náhodné jídlo z Redditu"},
    {command: "random-reddit [Název Redditu]", popis: "Zobrazí náhodný post ze zadaného redditu"},
    {command: "linky", popis: "Zobrazí důležité odkazy"},
    {command: "bot-github", popis: "Zobrazí github bota"},
    {command: "avatar [@Uživatel]", popis: "Zobrazí a zhodnotí váš/někoho avatar"},
    {command: "slap [@Uživatel]", popis: "Pošle uživateli facku"},
    {command: "8ball [Otázka]", popis: "Odpoví ti na jakýkoliv dotaz"},
    {command: "clear [Počet zpráv]", popis: "Smaže určitý počet zpráv [ADMIN ONLY]"}
]

//Levely
const ZakladniLevely = [10, 50, 100, 150, 200, 300, 400, 500, 600, 1000];

/*
    Funkce
*/

function UpdateCountOfUsers() {
    const channel = client.channels.cache.get(process.env.CHANNEL_ID_USERS_COUNT);
    const PocetUzivatelu = client.guilds.cache.get(channel.guild.id).members.cache.filter(member => !member.user.bot).size;
    if(channel.name !== `Uživatelů na serveru: ${PocetUzivatelu}`){
        channel.setName(`Uživatelů na serveru: ${PocetUzivatelu}`)
        .catch(() => console.log("[UpdateChannelu] Vypadá to tak, že nemám oprávnění na úpravu kanálu s počtem uživatelů :("));
        console.log("[UpdateChannel] Počet uživatelů byl aktualizován!");
    }else{
        console.log("[UpdateChannel] Počet uživatelů se nezměnil, channel nebyl aktualizován.");
    }
}

function EmbedError(Chyba, HowOpravitIt, AutorPrikazu) {
    const Embed = new Discord.MessageEmbed()
    .setTitle(":x: Ouuuuu, stala se chybka! :x:")
    .setColor("#ff0000")
    .setDescription(`${Chyba} \n 👉 ${HowOpravitIt}`)
    .setTimestamp()
    .setFooter("FallingFox Bot | Příkaz zadal/a: " + AutorPrikazu.tag, AutorPrikazu.avatarURL());
    return Embed;
}

function VypocetXPNaDalsiLevel(Level) {
    if(Level < ZakladniLevely.length){
        return ZakladniLevely[Level];
    }else{
        return (Level+1) * 250 - (ZakladniLevely.length * 250) + 1000;
    }
}

//Akce po napojení na bota
client.on("ready", () => {
    console.log("[BotStart] Logined to client " + client.user.tag);
    client.user.setActivity("FallingFox on Youtube", {type: "WATCHING"});
    setInterval(() => {
        if(client.users.cache.get("435810466648948736").presence.status == "online"){
            client.user.setActivity("JIRKA ON DISCORD", {type: "WATCHING"});
        }else if(client.users.cache.get("435810466648948736").presence.status == "idle"){
            client.user.setActivity("JIRKA, ALE ODEŠEL OD POČÍTAČE :((((", {type: "WATCHING"});
        }else if(client.users.cache.get("736648405253750821").presence.status == "online"){
            client.user.setActivity("MAREK ON DISCORD", {type: "WATCHING"});
        }else if(client.users.cache.get("736648405253750821").presence.status == "idle"){
            client.user.setActivity("MAREK, ALE ODEŠEL OD POČÍTAČE :((((", {type: "WATCHING"});
        }else{
            const Statusy = [
                {typ: "WATCHING", status: "FallingFox on Youtube"},
                {typ: "WATCHING", status: "FallingFox on Instagram"},
                {typ: "PLAYING", status: "Minecraft on minecraft.fallingfox.cz"},
                {typ: "PLAYING", status: "Half-Life 3"},
                {typ: "LISTENING", status: "you on FallingFox Discord"},
                {typ: "LISTENING", status: "FallingFox Hymna"},
                {typ: "PLAYING", status: "with Kamení | fox?help - Zobrazí všechny příkazy"},
                {typ: "PLAYING", status: "with Water | fox?random-food - Zobrazí náhodnou fotku jídla"},
                {typ: "PLAYING", status: "MMA with you | fox?level - Zobrazí tvůj aktuální level"},
                {typ: "PLAYING", status: "Fortnajt | fox?leaderboard - Zobrazí nejaktivnější uživatele serveru"},
                {typ: "PLAYING", status: "Majnkraft | fallingfox.eu - Webový leaderboard serveru"},
                {typ: "WATCHING", status: "NASA | fox?avatar - Ohodnotí a zobrazí tvůj avatar"},
                {typ: "LISTENING", status: "podcast Vyhonit Ďábla | fox?slap [@Uživatel] - Pošle uživateli facku"}
            ]
            const random = Statusy[ Math.floor(Math.random() * Statusy.length)];
            client.user.setActivity(random.status, {type: random.typ});
        }
    }, 30 * 1000);

    setInterval(() => {
        const Statusy = [
            "online",
            "idle",
            "dnd"
        ]
        client.user.setStatus(Statusy[ Math.floor(Math.random() * Statusy.length)]);
    }, 60 * 30 * 1000);
        
    UpdateCountOfUsers();
})

//Log errorů
client.on("error", (err) => {
    console.log("[Error] " + err)
})

client.on("guildMemberAdd", (member) => {
    UpdateCountOfUsers();
    const HelloEmbed = new Discord.MessageEmbed()
    .setTitle("Vítej!")
    .setColor("#bd7739")
    .setDescription("Hej <@" + member.user.id + "> ! Vítej na **FallingFox** serveru.")
    .addField("Discord invite", "https://invite.gg/fallingfox", true)
    .addField("Twitter", "https://twitter.com/FallingFoxYT", true)
    .addField("Instagram", "https://www.instagram.com/_fallingfox_/", true)
    .addField("Facebook", "https://www.facebook.com/FallingFoxYT/", true)
    .addField("Youtube", "https://www.youtube.com/channel/UCfb8dV6IZdj-t0l9eNae3_Q", true)
    .setTimestamp()
    .setFooter("FallingFox Bot | Hello!");
    member.user.send(HelloEmbed);
})

client.on("guildMemberRemove", () => {
    UpdateCountOfUsers();
})

//Levels
client.on("message", (message) => {
    if(message.content.startsWith(process.env.BOT_PREFIX) || message.author.bot || message.channel.type == "dm") return;

    db.query("SELECT * FROM `Levely` WHERE `UserID` LIKE '" + message.author.id + "'", (err, result, fields) => {

        if(result.length > 1){ //Pokud je uživatel zapsán v databázy vícekrát je vypsaná chybová zpráva...
            console.log("[Levely] Vypadá to, tak že uživatel je v databázy zapsán již 2 krát!");
            message.channel.send(EmbedError("Vypadá to, tak že jsi v databázy zapsán dvakrát 😕 Proč? Nevím", "Kontaktuj prosím tvůrce bota -> <@430776633302188062>", message.author));
        }else if(result.length < 1){
            //Pokud uživatel není zapsaný vytvoří se do tabulky nový záznam
            db.query("INSERT INTO `Levely`(`UserID`, `XP`, `Level`, `PocetZprav`) VALUES ('" + message.author.id + "', '1', '0', '1')", (err, result) => {
                //Když je chyba :()
                if(err){
                    console.log("[Levely] Při zapisování uživatele " + message.author.tag + " došlo k chybě! - " + err);
                    message.channel.send(EmbedError("Vypadá to, tak že při zapisování do databáze se stala nevysvětltelná chyba 😕 Proč? Nevím", "Kontaktuj prosím tvůrce bota -> <@430776633302188062>", message.author));
                }else{
                    //Když je vše okey pošle se gratulace k první zprávě!
                    const PrvniZpravaEmbed = new Discord.MessageEmbed()
                    .setTitle("🎉 První Zpráva! 🎉")
                    .setColor("#bd7739")
                    .setDescription("Hej <@" + message.author.id + "> ! Gratulujeme ti. Napsal jsi tvojí první zprávu!")
                    .setTimestamp()
                    .setFooter("FallingFox Bot | Level System");
                    message.channel.send(PrvniZpravaEmbed);
                }
            })
        }else{
            let level = result[0].Level;
            let ZiskaneXP;
            //Kolik XP se uživateli připíše
            if(message.content.length < 15){
                ZiskaneXP = 1;
            }else if(message.content.length > 600){
                ZiskaneXP = Math.round(message.content.length/20);
            }else{
                ZiskaneXP = Math.round(message.content.length/15);
            }
            //Výpočet kolik aktuálně XP bude mít
            const AktualniXP = ZiskaneXP + result[0].XP;

            //Výpočet XP potřebných na další level
            let XPPotrebneProDalsiLevel = VypocetXPNaDalsiLevel(result[0].Level);
            //LevelUP?
            if(AktualniXP >= XPPotrebneProDalsiLevel){
                level = level++;
                db.query("UPDATE `Levely` SET `Level` = '" + (result[0].Level + 1) + "', `XP` = '" + AktualniXP + "', `PocetZprav` = '" + (result[0].PocetZprav + 1) + "' WHERE `ID` = '" + result[0].ID + "'", (err, resultUpdatu) => {
                    if(err){
                        console.log("[Levely] Při zapisování nového levelu uživatele " + message.author.tag + " došlo k chybě! - " + err);
                        message.channel.send(EmbedError("Vypadá to, tak že při zapisování do databáze nového levelu se stala nevysvětltelná chyba 😕 Proč? Nevím", "Kontaktuj prosím tvůrce bota -> <@430776633302188062>", message.author));
                    }else{
                        const LevelUPEmbed = new Discord.MessageEmbed()
                        .setTitle("🎉 Dosažení novéh levelu! 🎉")
                        .setColor("#bd7739")
                        .setDescription("Hej <@" + message.author.id + "> ! Právě jsi byl povýšen na level **" + result[0].Level + "**. Gratulujeme!")
                        .setTimestamp()
                        .setFooter("FallingFox Bot | Level System");
                        message.channel.send(LevelUPEmbed);
                    }
                })
            }else{
                //Přičtění EXpů a zprávy
                db.query("UPDATE `Levely` SET `XP` = '" + AktualniXP + "', `PocetZprav` = '" + (result[0].PocetZprav + 1) + "' WHERE `ID` = '" + result[0].ID + "'");
            }
            for(i = 0; i < RoleZaLevely.length; i++){
                if(level >= RoleZaLevely[i].levelNeeded & !message.member.roles.cache.find(r => r.id == RoleZaLevely[i].roleID)){
                    message.member.roles.add(message.member.guild.roles.cache.find(role => role.id == RoleZaLevely[i].roleID));
                }
            }
        }
    })
}) 


//Příkazy
client.on("message", async (message) => {
    if(message.channel.type == "dm"){
        console.log("Uživatel " + message.author.tag + " napsal botovi do dm tuto zprávu: " + message.content)
        return;
    }
    if(message.content.includes("nud")){
        const NudaEmbedLoading = new Discord.MessageEmbed()
            .setTitle("Ale ale ale slyšel jsem, že tu se někdo nudí")
            .setColor("#bd7739")
            .setDescription("Čekejte... Probíhá získávání obrázku, co tě určitě zabaví.")
            .setTimestamp()
            .setFooter("FallingFox Bot | Příkaz zadal/a: " + message.author.tag, message.author.avatarURL());
            message.channel.send(NudaEmbedLoading)
            .then((msg) => {
                axios.get("http://fake.pinktube.eu:9090/reddit/random/funny/?only=image")
                .then((api) => {
                    const data = api.data;
                    const NudaEmbed = new Discord.MessageEmbed()
                    .setTitle("Ale ale ale slyšel jsem, že tu se někdo nudí")
                    .setColor("#bd7739")
                    .setURL(data.reddit_link)
                    .setDescription(data.title + "\n\nAutor/ka: " + data.author + " počet upvotů: " + data.upvotes)
                    .setImage(data.url)
                    .setTimestamp()
                    .setFooter("FallingFox Bot | Příkaz zadal/a: " + message.author.tag, message.author.avatarURL());
                    msg.edit(NudaEmbed);
                })
            })
    }
    if(message.content.toLowerCase().startsWith("fax?")) message.channel.send(EmbedError("Vypadá to, tak že jsi použil nesprávný prefix 😕", "Příkazy reagují pouze s prefix " + process.env.BOT_PREFIX, message.author));
    if(!message.content.toLowerCase().startsWith(process.env.BOT_PREFIX) || message.author.bot) return;
    if(message.channel.name !== "commands"){
        const Upozorneni = new Discord.MessageEmbed()
        .setTitle("Příkazy mimo místnost #commands")
        .setColor("#ff0000")
        .setDescription("Hej <@" + message.author.id + "> ! Prosím používej na příkazy místnost <#731489571556032542> ,která je na příkazy určená!")
        .setTimestamp()
        .setFooter("FallingFox Bot | Automatická zpráva")
        message.author.send(Upozorneni);
    }
    const args = message.content.slice(process.env.BOT_PREFIX.length).trim().split(/ +/);
    const prikaz = args.shift().toLocaleLowerCase();
    switch (prikaz) {
        //HELP
        case "help":
            const HelpEmbed = new Discord.MessageEmbed()
            .setTitle("Help - Dostupné příkazy")
            .setColor("#bd7739")
            .setTimestamp()
            .setFooter("FallingFox Bot | Příkaz zadal/a: " + message.author.tag, message.author.avatarURL());
            for (let i = 0; i < ListCommands.length; i++) {
                HelpEmbed.addField(process.env.BOT_PREFIX + ListCommands[i].command, ListCommands[i].popis, true);  
            }
            message.channel.send(HelpEmbed);
            break;
        //Level
        case "level":
            const uzivatel = message.mentions.users.first() || message.author;
            db.query("SELECT * FROM `Levely` WHERE `UserID` LIKE '" +uzivatel.id + "'", (err, result, fields) => {
                if(err){
                    message.channel.send(EmbedError("Vypadá to, tak že se nepodařilo získat data z databáze 😕", "Kontaktuj prosím tvůrce bota -> <@430776633302188062>", message.author))
                }else if(uzivatel.bot){
                    message.channel.send(EmbedError("Vypadá to, tak že chceš zobrazit level bota, ale botům se nepočítají levely 😕", "Zkus zobrati level někoho jiného než bota", message.author))
                }else if(result.length < 1){
                    message.channel.send(EmbedError("Vypadá to, tak že <@" + uzivatel.id + "> ještě nenapsal/a žádnou zprávu!", "Přinuť uživatele aď napíše zprávu a dej příkaz znovu", message.author))
                }else{
                    const LevelEmbed = new Discord.MessageEmbed()
                    .setTitle("Aktuální Level - " + uzivatel.username)
                    .setColor("#bd7739")
                    .setThumbnail(uzivatel.avatarURL())
                    .setDescription("Uživatel/ka <@" + uzivatel.id + "> má aktuálně level **" + result[0].Level + " **(**" + result[0].XP + "**) a celkově napsal/a **" +result[0].PocetZprav + "** zpráv! \nDo dalšího levelu zbývá uživatelovi/ce získat **" + (VypocetXPNaDalsiLevel(result[0].Level) - result[0].XP) + " XP** (" + result[0].XP + "/" +VypocetXPNaDalsiLevel(result[0].Level) + ")")
                    .setTimestamp()
                    .setFooter("FallingFox Bot | Příkaz zadal/a: " + message.author.tag, message.author.avatarURL());
                    message.channel.send(LevelEmbed);
                }
            })
            break;
        case "náhodné-jídlo":
        case "random-jídlo":
        case "random-food":
            const FoodLoadingEmbed = new Discord.MessageEmbed()
            .setTitle("Náhodné jídlo!")
            .setColor("#bd7739")
            .setDescription("Čekejte... Probíhá získávání jídla.")
            .setTimestamp()
            .setFooter("FallingFox Bot | Příkaz zadal/a: " + message.author.tag, message.author.avatarURL());
            message.channel.send(FoodLoadingEmbed)
            .then((msg) => {
                axios.get("http://fake.pinktube.eu:9090/reddit/random/foodporn/?only=image")
                .then((api) => {
                    const data = api.data;
                    const FoodEmbed = new Discord.MessageEmbed()
                    .setTitle("Náhodné jídlo!")
                    .setColor("#bd7739")
                    .setURL(data.reddit_link)
                    .setDescription(data.title + "\n\nAutor/ka: " + data.author + " počet upvotů: " + data.upvotes)
                    .setImage(data.url)
                    .setTimestamp()
                    .setFooter("FallingFox Bot | Příkaz zadal/a: " + message.author.tag, message.author.avatarURL());
                    msg.edit(FoodEmbed);
                })
            })
            break;
        
        case "clear":
            if(!message.member.hasPermission("MANAGE_MESSAGES")){
                message.channel.send(EmbedError("Vypadá to, tak že nemáš dostatečná oprávnění na tento příkaz 😕", "Staň se adminem a třeba to budeš moci provést", message.author));
                return;
            }else if(!args[0] || isNaN(args[0])){
                message.channel.send(EmbedError("Vypadá to, tak že jsi nezadal dostatek argumentů nebo argument není čísl 😕", process.env.BOT_PREFIX + "clear [Počet Zpráv]", message.author));
                return;
            }
            message.channel.bulkDelete(Number(args[0]) + 1);
            const ClearEmbed = new Discord.MessageEmbed()
            .setTitle("Mazání zpráv proběhlo úspěšně!")
            .setColor("#bd7739")
            .setDescription("Bylo smazáno " + args[0] + " zpráv! ||Tato zpráva zmizne za 30 sekund||")
            .setTimestamp()
            .setFooter("FallingFox Bot | Příkaz zadal/a: " + message.author.tag, message.author.avatarURL());
            message.channel.send(ClearEmbed)
            .then(msg => {
                msg.delete({reason: "Mazání zpráv adminem " + message.author.tag, timeout: 10000})
            })
            break;

        case "levely-top":
        case "scoreboard":
        case "leaderboard":
            db.query("SELECT * FROM `Levely` ORDER BY `XP` DESC LIMIT 5", (err, result, fields) => {
                if(err){
                    message.channel.send(EmbedError("Vypadá to, tak že se nepodařilo získat data z databáze 😕", "Kontaktuj prosím tvůrce bota -> <@430776633302188062>", message.author))
                    return;
                }
                const LeaderboardEmbed = new Discord.MessageEmbed()
                .setTitle("FallingBoard")
                .setColor("#bd7739")
                .setTimestamp()
                .setFooter("FallingFox Bot | Příkaz zadal/a: " + message.author.tag, message.author.avatarURL());
                let DataDoEmbedu = "";
                for(i = 0; i < result.length; i++){
                    DataDoEmbedu += `${i + 1}. <@${result[i].UserID}>\n`;
                }
                DataDoEmbedu += "\n**Chceš vidět celý leaderboard? Můžeš ho vidět zde:** https://fallingfox.eu/";
                LeaderboardEmbed.setDescription(DataDoEmbedu);
                message.channel.send(LeaderboardEmbed);
            })
            break;
        
        case "random-reddit":
            if(!args[0]){
                message.channel.send(EmbedError("Vypadá to, tak že jsi nezadal dostatečný počet argumentů 😕", process.env.BOT_PREFIX + "random-reddit [Název Redditu]", message.author))
            }else{
                const RedditLoadingEmbed = new Discord.MessageEmbed()
                .setTitle("Náhodný post!")
                .setColor("#bd7739")
                .setDescription("Čekejte... Probíhá získávání fotky.")
                .setTimestamp()
                .setFooter("FallingFox Bot | Příkaz zadal/a: " + message.author.tag, message.author.avatarURL());
                message.channel.send(RedditLoadingEmbed)
                .then((msg) => {
                    axios.get("http://fake.pinktube.eu:9090/reddit/random/" + args[0] + "/?only=image")
                    .then((api) => {
                        const data = api.data;
                        const RandomEmbed = new Discord.MessageEmbed()
                        .setTitle("Náhodný post!")
                        .setColor("#bd7739")
                        .setURL(data.reddit_link)
                        .setDescription(data.title + "\n\nAutor/ka: " + data.author + " počet upvotů: " + data.upvotes)
                        .setImage(data.url)
                        .setTimestamp()
                        .setFooter("FallingFox Bot | Příkaz zadal/a: " + message.author.tag, message.author.avatarURL());
                        msg.edit(RandomEmbed);
                    })
                })
            }
            break;
        
        case "linky":
            const linkyEmbed = new Discord.MessageEmbed()
            .setTitle("Důležité odkazy")
            .setColor("#bd7739")
            .addField("Discord invite", "https://invite.gg/fallingfox", true)
            .addField("Twitter", "https://twitter.com/FallingFoxYT", true)
            .addField("Instagram", "https://www.instagram.com/_fallingfox_/", true)
            .addField("Facebook", "https://www.facebook.com/FallingFoxYT/", true)
            .addField("Youtube", "https://www.youtube.com/channel/UCfb8dV6IZdj-t0l9eNae3_Q", true)
            .setTimestamp()
            .setFooter("FallingFox Bot | Příkaz zadal/a: " + message.author.tag, message.author.avatarURL());
            message.channel.send(linkyEmbed);
            break;
        case "anketa":
            const anketa = args.join(" ");
            if(!anketa){
                message.channel.send(EmbedError("Vypadá to, tak že jsi nezadal dostatečný počet argumentů 😕", process.env.BOT_PREFIX + "anketa [Otázka]", message.author));
            }else{
                message.delete({timeout: 1, reason: "Automatické mazání"});
                const anketaEmbed = new Discord.MessageEmbed()
                .setTitle("Anketa")
                .setColor("#bd7739")
                .setDescription(anketa + "\n\n(👍 - Ano, 🤷 - Nevím, 👎 - Ne)")
                .setTimestamp()
                .setFooter("FallingFox Bot | Příkaz zadal/a: " + message.author.tag, message.author.avatarURL());
                message.channel.send(anketaEmbed)
                .then(function (msg) {
                    msg.react("👍")
                    msg.react("🤷")
                    msg.react("👎")
                });
            }
            break;
        case "bot-code":
        case "bot-github":
            const githubEmbed = new Discord.MessageEmbed()
            .setTitle("Můj(FallingFoxBot) github")
            .setColor("#bd7739")
            .setDescription("Odkaz na github: https://github.com/JonanekDev/fallingfox-bot-v2")
            .setTimestamp()
            .setFooter("FallingFox Bot | Příkaz zadal/a: " + message.author.tag, message.author.avatarURL());
            message.channel.send(githubEmbed);
            break;

        case "avatar":
            const user = message.mentions.users.first() || message.author;
            const hodnoceni = ["Tak hnusnej avatar jsem ještě neviděl", "KAMOOO FUJ NOČNÍ MŮRY BUDU MÍT Z TOHO", "Vypadáš celkem dobře, ale Jirka vypadá stále líp", "I rozježděnej pes vypadá lépe než ty", "No ty vole. Blít se mi chce", "Vypadá vcelku dobře", "Najs fotka <3 Nezajdeme někdy někam?", "Vypadáš jak po zásahu elektřinou", "OOO KURVÁ", "Nevysral se ti náhodou na obličej pes? Vypadá to tak", "Ale tak v celku v pohodě avatar", "Asi jsem oslepl z toho, jak moc jsi hnusnej", "Asi jsem oslepl z toho, jak moc jsi překrásnej", "I můj tvůrce vypadá líp než ty"];
            const avatarEmbed = new Discord.MessageEmbed()
            .setTitle("Hodnocení avatara uživatele - " + user.tag)
            .setColor("#bd7739")
            .setDescription(hodnoceni[Math.floor(Math.random() * hodnoceni.length)])
            .setImage(user.avatarURL())
            .setTimestamp()
            .setFooter("FallingFox Bot | Příkaz zadal/a: " + message.author.tag, message.author.avatarURL());
            message.channel.send(avatarEmbed);
            break;
        case "facka":
        case "slap":
            if(!message.mentions.users.first()){
                message.channel.send(EmbedError("Vypadá to, tak že jsi nezadal dostatečný počet argumentů 😕", process.env.BOT_PREFIX + "anketa [@Uživatel]", message.author));
            }else{
                const user = message.mentions.users.first();
                const slapGify = ["https://media2.giphy.com/media/26uf3m46sDFVPedig/source.gif", "https://media2.giphy.com/media/l2SpSQLpViJk9vhmg/200_d.gif", "https://media0.giphy.com/media/l41YtWUr1CGntlR1C/source.gif", "https://media2.giphy.com/media/xT9IgzTnZHL9zp6IPS/source.gif", "https://media2.giphy.com/media/1zjd1s1GCubSkmp94F/giphy.gif", "https://media2.giphy.com/media/i25ciUjc3ZfOw/giphy.gif", "https://reactions.gifs.ninja/r/df4b1d9.gif", "https://24.media.tumblr.com/848bce754d3bb524c1e71a781fdb71c4/tumblr_miqv4no2lr1rjlk07o1_400.gif", "https://24.media.tumblr.com/0ab9301964e1024acb8cf9016fc4cf23/tumblr_n00o29MxQZ1qkxtdao1_400.gif", "https://www.uproxx.com/tv/wp-content/uploads/2012/06/tumblr_lydfx4Zqjd1r4bg1q.gif", "https://media3.giphy.com/media/xUOwGnf0f118Hrtgk0/source.gif", "https://media.tenor.com/images/3ccfad9cb027d3515e409b4e0f4f3873/tenor.gif"];
                const SlapEmbed = new Discord.MessageEmbed()
                .setTitle("Facka pro " + user.username)
                .setColor("#bd7739")
                .setDescription("Hej <@" + user.id + "> letí pro tebe facka!")
                .setImage(slapGify[Math.floor(Math.random() * slapGify.length)])
                .setTimestamp()
                .setFooter("FallingFox Bot | Příkaz zadal/a: " + message.author.tag, message.author.avatarURL());
                message.channel.send(SlapEmbed);
            }
            break;

        case "8ball":
            if(!args[0]){
                message.channel.send(EmbedError("Vypadá to, tak že jsi nezadal dostatečný počet argumentů 😕", process.env.BOT_PREFIX + "8ball [Tvoje otázka]", message.author))
            }else{
                let odpovedi;
                if(message.content.toLocaleLowerCase().includes("nebo")){
                    odpovedi = ["Spíše bych řekl že první možnost", "Spíše bych řekl že druhá možnost", "Nevím, fakt nevím"];
                }else if(message.content.toLocaleLowerCase().includes("jir")){
                    odpovedi = ["Zeptej se raději <@435810466648948736> ten to bude vědět", "Kámo to je těžká otázka, fakt nevím srry", "Hm jako řekl bych, že ne ale je možné že i jo hmm"];
                }else if(message.content.toLocaleLowerCase().includes("gay") || message.content.toLocaleLowerCase().includes("gej")){
                    odpovedi = ["Nejsem gay test, srry", "Připadám ti sakra jako gay test?"];    
                }else{
                    odpovedi = ["Ano", "Nevím", "Ne", "Možná", "Spíš ne", "Spíš ano", "Jak to mám vědět? Raději se zeptej třeba <@435810466648948736>", "Khamo to je moc fylozofická otázka. Nevím sry.", "Khamo. Na takové tupé dotazy nemám čas", "Dobrát ozáka! Ale já na ni neznám odpověď."];
                }
                const BallEmbed = new Discord.MessageEmbed()
                .setTitle("8Ball")
                .setColor("#bd7739")
                .setDescription("Zadaná otázka: \n\n**" + args.join(" ") + "**\n\nMoje odpověď:\n **" + odpovedi[Math.floor(Math.random() * odpovedi.length)] + "**")
                .setThumbnail("https://media3.giphy.com/media/3orifhNhn840GpMMPm/giphy.gif")
                .setTimestamp()
                .setFooter("FallingFox Bot | Příkaz zadal/a: " + message.author.tag, message.author.avatarURL());
                message.channel.send(BallEmbed);
            }
            break;
    
        //Akce, když příkaz neexistuje
        default:
            message.channel.send(EmbedError("Vypadá to, tak že jste zadali neexistující příkaz 🤔", "Pomcoí příkazu " + process.env.BOT_PREFIX + "help zobrazíte všechny příkazy", message.author));
            break;
    }
})


client.login(process.env.BOT_TOKEN);



/*
    WEB
*/
const express = require("express");
const app = express();


app.get("/", (req, res) => {
    if(!req.query.strana){
        res.redirect("/?strana=0");
        return;
    }
    res.write('<head> <meta charset="UTF-8"> <meta name="viewport" content="width=device-width, initial-scale=1.0"> <title>FallingFox - Discord Leaderboard</title> <meta name="description" content="Oficální Leaderboard Discord serveru Falling Fox! Padá liška něco si přej <3"> <meta name="theme-color" content="#139107"> <meta property="og:site_name" content="PinkTube.eu"> <meta property="og:title" content="FallingFox - Discord Leaderboard"> <meta property="og:description" content="Oficální Leaderboard Discord serveru Falling Fox! Padá liška něco si přej <3"> <meta property="og:url" content="https://fallingfox.eu/"> <meta property="og:image" content="http://fallingfox.eu/public-files/DefaultAvatar.jpg"> <link href="http://fallingfox.eu/public-files/DefaultAvatar.jpg" rel="icon" type="image/jpg"></link> <link rel="stylesheet" href="http://fallingfox.eu/public-files/style.css"> </head>');
    res.write("<body>");
    db.query("SELECT COUNT(*) as count FROM `Levely`", (err, rows1, fields) => {
        if(rows1[0].count < (req.query.strana * 10) || isNaN(req.query.strana) || req.query.strana < 0){
            res.write(' <div id="Karta"> <img src="http://fallingfox.eu/public-files/DefaultAvatar.jpg" class="avatar"> <div class="Jmeno">Chybka!!!!!</div> <div class="Info">Tato strána není dostupná! :( ' + req.query.strana + ' </div> ');
            res.write("</body>");
            res.end();
        }else{
            let ZacatecniPozice;
            if(req.query.strana == 0){
                ZacatecniPozice = 0;
            }else{
                ZacatecniPozice = (Number(req.query.strana) + 9);
            }
            db.query("SELECT * FROM `Levely` ORDER BY `XP` DESC LIMIT " + ZacatecniPozice + ", " + (ZacatecniPozice + 10), async (err, rows, fields) => {
                for(i = 0; i < rows.length; i++){
                    const Uzivatel = rows[i];
                    console.log(Uzivatel);
                    //je tu await, protože jinak  když to pak jelo dál tak se někdy stalo, že první request byl později než druhý a bylo to pak přeházené..
                    await axios.get("https://discord.com/api/users/" + Uzivatel.UserID, {
                        headers: {
                            Authorization: "Bot " + process.env.BOT_TOKEN
                        }
                    }).then((api) => {
                        let Avatar;
                        if(api.data.avatar == null){
                            Avatar = "http://fallingfox.eu/public-files/DefaultAvatar.jpg";
                        }else{
                            Avatar = "https://cdn.discordapp.com/avatars/" + api.data.id + "/" + api.data.avatar + ".png";
                        }
                        const NextLevel = VypocetXPNaDalsiLevel(Uzivatel.Level);
                        const ZbyvaXP = NextLevel - Uzivatel.XP;
                        res.write('\n <div id="Karta"> <div class="Pozice">' + (ZacatecniPozice + i + 1) + '.</div> <img src="' + Avatar + '" class="avatar"> <div class="Jmeno">' + api.data.username + '</div> <div class="Info">Počet zpráv: <strong>' + Uzivatel.PocetZprav +'</strong>, aktuální level: <strong>' + Uzivatel.Level + '</strong> a aktuální počet EXP: <strong>' + Uzivatel.XP + '</strong> a uživateli zbývá získat ' + ZbyvaXP + 'EXP do dalšího levelu (' + Uzivatel.XP + '/' + NextLevel + ')</div> </div> ');
                        if(i == (rows.length -1)){
                            if(rows1[0].count > ((ZacatecniPozice + 1) * 10) || isNaN(ZacatecniPozice)){
                                const DalsiStrana = ZacatecniPozice + 1 || 1;
                                res.write(`<a href="http://fallingfox.eu/?strana=${DalsiStrana}" class="PageButton">&#8250;</a>`);
                            }
                            if(ZacatecniPozice !== 0){
                                const DalsiStrana = ZacatecniPozice - 1;
                                res.write(`<a href="http://fallingfox.eu/?strana=${DalsiStrana}" class="PageButton">&#8249;</a>`);
                            }
                            res.write("</body>")
                            res.end();
                        }
                    })
                }
            })
        }
    })
})


app.use('/public-files/', express.static('public'));


app.listen(8443, () => console.log("[FallingStart] Leaderboard na portu 8443 naběhl!")) ;
