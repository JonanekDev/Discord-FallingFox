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

function JeAdminCheck(ID) {
    const config = require("./config.json");
    const client = require("./bot");
    let jeAdmin = false;
    for (let i = 0; i < config.adminPermRolesIDs.length; i++){
        const role = config.adminPermRolesIDs[i];
        if (client.guilds.cache.get(config.guildID).members.cache.get(ID).roles.cache.has(role)) {
            jeAdmin = true;
            break;
        }
    }
    return jeAdmin;
}

router.get("/*", (req, res, next) => {
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
        res.redirect("/administrace/main")
    }).catch(() => {
        res.render("administrace", {PageTitle: "Chyba!", AdminErr: 'Omlouváme se, ale zadaný kód není platný! Zkuste akci provést <a href="../login">znovu.</a>'});
    })
})

router.get("/main", (req, res) => {
    //TODO: DODĚLAT TO
    const DiscordOauth2 = require("discord-oauth2");
    const oauth = new DiscordOauth2();
    oauth.getUser(req.session.access_token)
    .then((data) => {
        console.log(JeAdminCheck(data.id));
        res.render("administrace", {PageTitle: "Hlavní stránka administrace", user: { logined: 1, data: data, administracepravo: JeAdminCheck(data.id)}});
    })
})


router.get("/*", (req, res) => {
    res.redirect("/administrace/main");
})

module.exports = router;