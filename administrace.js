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
    console.log(req.session);
    if(req.url == "/login" || req.url.startsWith("/login/DisOAuth2Redirect") || req.url.startsWith("/logout")){
        next();
    }else if(req.session.Logined !== 1) {
        res.redirect("/administrace/login");
    } else {
        const DiscordOauth2 = require("discord-oauth2");
        const oauth = new DiscordOauth2();
        oauth.getUser(req.session.access_token)
        .then((data) => {
            next();
        })
        .catch(() => {
            req.session = null;
            res.render("administrace", {PageTitle: "Chyba!", AdminErr: 'Omlouváme se, ale vaše přihlášení vypršelo, můžete se přihlásit <a href="../login">znovu.</a>'});
        })
    }
})

router.get("/logout", (req, res) => {
    req.session = null;
    res.redirect("/");
})

router.get("/login", (req, res) => {
    //MRDÁ MI V HLAVĚ MRDÁ MI V HLAVĚ
    if (req.session.Logined == 1) {
        res.redirect("/administrace/main");
    }
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
        req.session.Logined = 1;
        req.session.access_token = data.access_token;
        res.send("Tvoje máma je kokot")
    }).catch(() => {
        res.render("administrace", {PageTitle: "Chyba!", AdminErr: 'Omlouváme se, ale zadaný kód není platný! Zkuste akci provést <a href="../login">znovu.</a>'});
    })
})

router.get("/main", (req, res) => {
    //TODO: DODĚLAT TO
    if (req.session.Logined !== 1) {
        res.redirect("/administrace/login");
        return;
    }
    const DiscordOauth2 = require("discord-oauth2");
    const oauth = new DiscordOauth2();
    oauth.getUser(req.session.access_token)
    .then((data) => {
        res.send("Tohle ještě někdy musím dodělat ok? Btw ahoj " + data.username);  
    })
})


router.get("/*", (req, res) => {
    res.redirect("/administrace/main");
})

module.exports = router;