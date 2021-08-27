const express = require("express")

const app = express();

//<3 EJS
app.set("view engine", "ejs");

app.use("/public", express.static("public"))

//Leaderboard
app.get("/", async (req, res) => {
    if (!req.query.page || req.query.page < 0 || isNaN(req.query.page)) {
        res.redirect("?page=0");
        return;
    }
    const levely = require("./levely");
    new levely().GetLeaderBoard(10, req.query.page * 10)
    .then(async (leaderboard) => {
        if (leaderboard.length < 1) {
            res.render("leaderboard", {err: 1});
        } else {
            const client = await require("./bot");
            const users = [];
            leaderboard.forEach(async (user, index) => {
                const neededEXP = new levely().CalculateXPForNextLevel(user.Level);
                //TODO: DODĚLAT TO AŽ SE VYSPÍM LOOOL teď kurva drát nevím
                const disUser = client.users.cache.get(user.ID);
                console.log(disUser);
                users.push({username: disUser.username, avatar: disUser.displayAvatarURL(), level: user.Level, exp: user.EXP, messages: user.CountOfMessages, neededexp: neededEXP, remains: (neededEXP - user.EXP), index: (req.query.page * 10 + index)});
            });
            res.render("leaderboard", {users: users});
        }
    })
})


const port = process.env.WEB_PORT || 8080;
app.listen(port, () => console.log("[Start] Web běží na portu " + port));