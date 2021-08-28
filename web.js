const express = require("express")

const app = express();

//<3 EJS
app.set("view engine", "ejs");

app.use("/public", express.static("public"))

app.use("/administrace", require("./administrace"));

//Leaderboard
app.get("/", async (req, res) => {
    const levely = require("./levely");
    new levely().GetLeaderBoard(-69, 0)
    .then(async (leaderboard) => {
        if (leaderboard.length < 1) {
            res.render("leaderboard", {err: 1});
        } else {
            const client = await require("./bot");
            const users = [];
            leaderboard.forEach(async (user, index) => {
                const neededEXP = new levely().CalculateXPForNextLevel(user.Level);
                const disUser = client.users.cache.get(user.DisUserID);
                if (disUser == undefined) {
                    new levely().SetUserLeavl(user.DisUserID, 1);
                } else {
                    users.push({username: disUser.username, avatar: disUser.displayAvatarURL(), level: user.Level, exp: user.EXP, messages: user.CountOfMessages, neededexp: neededEXP, remains: (neededEXP - user.EXP), index: (req.query.page * 10 + index + 1)});
                }
            });
            if (users.length < 1) {
                res.render("leaderboard", {err: 1});
            } else {
                res.render("leaderboard", {users: users});
            }
        }
    })
})


const port = process.env.WEB_PORT || 8080;
app.listen(port, () => console.log("[Start] Web běží na portu " + port));