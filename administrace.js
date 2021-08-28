const express = require("express");
const cookieSession = require("cookie-session");

const router = express.Router();

router.use("/public", express.static("public"));

router.use(cookieSession({
    name: "SessionCookieNECUMLOL",
    keys: [
        "KitKatFallingFoxChunky",
        "MamRadVelkyCernyLisky",
        "ProcMiKurvaNekdoCumiDoKodu",
        "MamRadTHINKINGEmojy"
    ],
    maxAge: 24 * 60 * 60 * 1000 
}))

router.get("/*", (req, res, next) => {
    //TODO:Checknutí funkčosti tokenu
    if(req.url == "/login" || req.url.startsWith("/login/DisOAuth2Redirect")){
        next();
    }else if(req.session.Logined !== 1 & req.url !== "/login"){
        res.redirect("/administrace/login");
    }
})

router.get("/login", (req, res) => {
    const config = require("./config.json");
    res.redirect("https://discord.com/api/oauth2/authorize?client_id=" + config.clientID + "&redirect_uri=" + encodeURI(config.redirecturi) + "&response_type=code&scope=identify");
})

router.get("/login/DisOAuth2Redirect", (req, res) => {
    if (!req.query.code) {
        res.redirect("/administrace/login")
        return;
    }
    const config = require("./config.json");
    const DiscordOauth2 = require("discord-oauth2");
    const oauth = new DiscordOauth2();

    oauth.tokenRequest({
        clientId: config.clientID,
        clientSecret: process.env.CLIENTSECRET,
        code: req.query.code,
        scope: "identify",
        grantType: "authorization_code",
        redirectUri: config.redirecturi
    }).then((data) => {
        
    }).catch(() => {
        res.render("administrace", {PageTitle: "Chyba!", AdminErr: 'Omlouváme se, ale zadaný kód není platný! Zkuste akci provést <a href="../login">znovu.</a>'});
    })
})

module.exports = router;