# FallingFox Discord Bot v3

Custom Discord bot pro FallingFox Discord ([Invite na Discord server](https://invite.gg/fallingfox))

Btw důvod přespsání celého bota je aktualizace Discord.js na 13

### Stav aktuálního kódu:

- Funkční základ
- Funkční level system
- Welcome message
- Přidání role po připojení
- Update channelu s počtem uživatelů
- Funkční více optimalizovaný webový leaderboard
- Notifikace na nová videa na Youtube channelu
- Funkční příkazy:
  - level
  - levely-role
  - linky
  - avatar
  - slap
  - anketa
  - leaderboard
  - 8ball
  - random-food
  - počasí
  - user-info
  - clear
  - random-reddit
  - sourcecode

### TODO:

- Přidat do administrace přidání rolí přes názvy
- API pro zpracovávání úprav v administraci
- Možnost dát níž nebo výš roly v nastavení rolí za levely

### Jak spustit bota

- Stáhneme kód bota
- Zkontrolujte zda máte minimálně **Node.js 16** po případě nainstalujte (Discord.js v13 vyžaduje minimálně verzi 16)
- Ve složce, kde máme kód bota dáme `npm i`, což nám nainstaluje všechny použité balíčky
- Vytvoříme `.env` soubor, který bude obsahovat následující hodnoty:

```
MYSQL_HOST=IP MySQL server
MYSQL_USER=MySQL uživatel
MYSQL_PASSWORD=Heslo uživatele
MYSQL_DATABASE=Název MySQL databáze
DISCORD_BOT_TOKEN=Token vašeho bota
WEB_PORT=Port, kde chcete mít web
CLIENTSECRET=
```

- Vytvoříme v MySQL databází tabulku Levels pomocí následující SQL příkazu

```sql
CREATE TABLE `Levels` (
  `ID` int(11) NOT NULL,
  `DisUserID` bigint(20) NOT NULL,
  `EXP` int(11) NOT NULL,
  `Level` int(11) NOT NULL,
  `CountOfMessages` int(11) NOT NULL,
  `Leave` BOOLEAN NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
ALTER TABLE `Levels`
  ADD PRIMARY KEY (`ID`);
```

- Upravíme soubor config.json

```
{
    "leaderboardWeb": "URL KDE POBĚŽÍ WEB",
    "guildID": "GUILD ID KDE POBĚŽÍ BOT",
    "rolesForLevels": [
        {"roleID": "ID ROLE ZA LEVEL", "levelNeeded": "LEVEL ZA KTERÝ TO MÁ BÝT", "roleName": "NÁZEV ROLE, KTERÝ SE ZOBRAZÍ VE ZPRÁVÁCH"}
        ...Může jich tu být nekonečně...
    ],
    "linky": [
        {"nadpis": "Název link", "link": "ODKAZ"}
    ],
    "everyoneRoleID": "ID ROLE EVERYONE",
    "adminPermRolesIDs": [
        "ID ADMIN ROLE"
        ...Může jich tu být nekonečně.. (Při změně je potřeba použít npm run start-regcommands, aby se aplikovali práva na příkazy)
    ],
    "avatarRecenze": [
        "Vaše recenze avatarů..."
        ...Může jich tu být nekonečně...
    ],
    "slapGify": [
        "ODKAZ NA .GIF MUSÍ BÝT PŘÍMO .gif SOUBOR"
        ...Může jich tu být nekonečně...
    ],
    "meneniStatusuIntervalSekundy": 120,
    "permanentniStatusy": [
        {"type": "WATCHING/LISTENING/PLAYING", "CONTENT": "STATUS"}
        ...Může jich tu být nekonečně...
    ],
    "anketaChannelID":  "ID MÍSTNOSTI KAM SE MAJÍ POSÍLAT ANKETY",
    "welcomeChannelID": "ID MÍSTNOSTI KAM SE MAJÍ POSÍLAT UVÍTACÍ ZPRÁVY",
    "roleAfterJoin": "ID ROLE CO SE MÁ UDĚLIT PO PŘIPOJENÍ",
    "countOfUsersChannel": "ID CHANNELU NA POČET UŽIVATELŮ",
    "8ballAnswers": [
        "ODPOVĚDI DO 8BALL"
        ...Může jich tu být nekonečně...
    ],
    "clientID": "CLIENT ID BOTA",
    "redirecturi": "REDIRECT URI PO UDĚLENÍ PRÁV V OAUTH2"
}
```

- Prvně spustíme bota příkaze `npm run start-regcommands`, což registruje všechny příkazy, co má bot. Na konci se vám do konzole vypíše zpráva, že registrace proběhla úspěšně, může to chvíli trvat musíte počkat. Příkazy také nebudou hned na serveru vidět, ale většinou do pár minut budou vidět
- Poté můžeme bota již spouštět pouze s příkazem `npm start`

#### Chtěl bys vlastního custom bota pro svůj Discord server? Neváhej a napiš mi na Discord Jonanek#0742 nebo email jonas@pinktube.eu
