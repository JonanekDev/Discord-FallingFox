const express = require("express");
const axios = require("axios");
const app = express();
const mysql = require("mysql");
require('dotenv').config();
const LEVELY = [10, 50, 100, 150, 200, 300, 400, 500, 600, 1000];

const db = mysql.createConnection({
    database: process.env.DB_DATABASE,
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    supportBigNumbers: true
})

app.get("/", (req, res) => {
    if(!req.query.page){
        res.redirect("?page=0");
        return;
    }
    res.write('<head>  <meta charset="UTF-8"> <meta name="viewport" content="width=device-width, initial-scale=1.0"> <title>FallingFox - Discord Leaderboard</title> <meta name="description" content="Oficální Leaderboard Discord serveru Falling Fox! Padá liška něco si přej <3"> <meta name="theme-color" content="#139107"> <meta property="og:site_name" content="PinkTube.eu"> <meta property="og:title" content="FallingFox - Discord Leaderboard"> <meta property="og:description" content="Oficální Leaderboard Discord serveru Falling Fox! Padá liška něco si přej <3"> <meta property="og:url" content="https://pinktube.eu/fallingfox/"> <meta property="og:image" content="https://pinktube.eu/fallingfox/liska.jpg"> <link href="https://pinktube.eu/fallingfox/liska.jpg" rel="icon" type="image/jpg"></link> <style>body{color: white;margin: 0;background-color: #5c5c5c;padding-top: 5vh;padding-bottom: 5vh;user-select: none;} #Karta{margin: 0 auto; margin-top: 2vh; background-color: #454545; border-radius: 15px; width: 60%; height: 10vh; padding: 10px; overflow-wrap: break-word;} .Jmeno{text-align: left; font-weight: bold; font-size: 3vh; margin-left: 1vh; float: left;} .Info{ margin-top: 4vh; word-warp: break-word; white-space: pre-line; width: 50%; overflow: auto; } .Pozice{line-height: 100%; font-size: 100%; float:left; } .avatar{ height: 100%; border-radius: 50%; float: left; margin-right: 20px; } .PageButton{  background-color: #f1f1f1; position: absolute; border-radius: 50%; color: black; margin: 1% auto; text-align: center; left: 50%;} a {  text-decoration: none;  display: inline-block;  padding: 8px 16px;} a:hover {  background-color: #ddd;  color: black;} @media screen and (max-width: 1000px) { #Karta{  width: 90%; }}</style>  </head>');

    res.write("<body>");
    db.query("SELECT COUNT(*) as count FROM `Levely`", (err, rows1, fields) => {
        if(rows1[0].count < (req.query.page * 10) || isNaN(req.query.page)){
            res.write(' <div id="Karta"> <img src="./image/avatar.jpg" class="avatar"> <div class="Jmeno">Chybka!!!!!</div> <div class="Info">Tato strána není dostupná! :( </div> ');
            res.write("</body>");
            res.end();
        }else{
            let ZacatecniPozice = (req.query.page * 10) || 0;
            db.query("SELECT * FROM `Levely` ORDER BY `XP` DESC LIMIT " + ZacatecniPozice + ", " + (ZacatecniPozice + 10), async (err, rows, fields) => {
                for(i = 0; i < rows.length; i++){
                    await axios.get("https://discordapp.com/api/users/" + rows[i].UserID, {
                        headers: {
                        Authorization: 'Bot NjA3Njg0ODgyNzEzNTQyNjkz.XUdMpg.xuqH_wj0N9AVJMkk8MhQ89B7AYk'
                        }
                    })
                    .then((api) => {
                        let Avatar;
                        if(api.data.avatar == null){
                            Avatar = './image/avatar.jpg'
                        }else{
                            Avatar = 'https://cdn.discordapp.com/avatars/' + api.data.id + '/' + api.data.avatar + '.png'
                        }
                        let NextLevel;
                        if(rows[i].Level < LEVELY.length){
                            NextLevel = LEVELY[rows[i].Level];
                        }else{
                            NextLevel = ((rows[i].Level+1) * 250 - (LEVELY.length * 250) + 1000);
                        }
                        const ZbyvaXP = NextLevel - rows[i].XP; 
                        res.write(' <div id="Karta"> <div class="Pozice">' + (ZacatecniPozice + i + 1) + '.</div> <img src="' + Avatar + '" class="avatar"> <div class="Jmeno">' + api.data.username + '</div> <div class="Info">Počet zpráv: <strong>' + rows[i].PocetZprav +'</strong>, aktuální level: <strong>' + rows[i].Level + '</strong> a aktuální počet EXP: <strong>' + rows[i].XP + '</strong> a uživateli zbývá získat ' + ZbyvaXP + 'EXP do dalšího levelu (' + rows[i].XP + '/' + NextLevel + ')</div> </div>');
                        if(i == (rows.length - 1)){
                            if(rows1[0].count > ((Number(req.query.page) + 1) * 10) || isNaN(req.query.page)){
                                const DalsiStrana = Number(req.query.page) + 1 || 1;
                                res.write(`<a href="?page=${DalsiStrana}" class="PageButton">&#8250;</a>`);
                            }
                            if(req.query.page !== 0 & req.query.page){
                                const DalsiStrana = Number(req.query.page) - 1;
                                res.write(`<a href="?page=${DalsiStrana}" class="PageButton">&#8249;</a>`);
                            }
                            res.write("</body>")
                            res.end();
                        }
                    })
                }
            })
        }
    })
    /*db.query("SELECT * FROM `Levely` ORDER BY `XP` DESC LIMIT 30", async (err, rows, fields) => {
        for(i =0; i < rows.length; i++){
            const data = {};
            await axios.get("https://discordapp.com/api/users/" + rows[i].UserID, {
                headers: {
                  Authorization: 'Bot NjA3Njg0ODgyNzEzNTQyNjkz.XUdMpg.xuqH_wj0N9AVJMkk8MhQ89B7AYk'
                }
            })
            .then((api) => {
                let Avatar;
                if(api.data.avatar == null){
                    Avatar = './image/avatar.jpg'
                }else{
                    Avatar = 'https://cdn.discordapp.com/avatars/' + api.data.id + '/' + api.data.avatar + '.png'
                }
                let NextLevel;
                if(rows[i].Level <= LEVELY.length){
                    NextLevel = LEVELY[rows[i].Level];
                }else{
                    NextLevel = ((rows[i].Level+1) * 250 - (LEVELY.length * 250) + 1000);
                }
                const ZbyvaXP = NextLevel - rows[i].XP; 
                res.write(' <div id="Karta"> <div class="Pozice">' + (i + 1) + '.</div> <img src="' + Avatar + '" class="avatar"> <div class="Jmeno">' + api.data.username + '</div> <div class="Info">Počet zpráv: <strong>' + rows[i].PocetZprav +'</strong>, aktuální level: <strong>' + rows[i].Level + '</strong> a aktuální počet EXP: <strong>' + rows[i].XP + '</strong></div> a uživateli zbývá získat ' + ZbyvaXP + 'EXP do dalšího levelu </div> ');
                if(i == (rows.length - 1)){
                    res.write("</body>")
                    res.send();
                }
            })
        }
    })*/


    //res.write('<iframe width="1" height="1" wmode="transparent" src="https://www.youtube.com/embed/Bey8XBlcFPk?autoplay=1&loop=1&" frameborder="0" allowfullscreen> </iframe>')
})

app.get("/image/:ID", (req, res) => {
    if(res.sendFile(__dirname + "/image/" + req.params.ID)){
        res.send("Obrázek " + req.params.ID + " Neexistuje :(");
    }
})

app.listen(8443, () => {
    console.log("[FallingStart] Leaderboard na portu 8443 naběhl!")
}) 
