# FallingFox Discord Bot v3

Custom Discord bot pro FallingFox Discord ([Invite na Discord server](https://invite.gg/fallingfox))

Btw důvod přespsání celého bota je aktualizace Discord.js na 13

### Stav aktuálního kódu:
* Funkční základ
* Funkční level system 
* Welcome message
* Přidání role po připojení
* Update channelu s počtem uživatelů
* Funkční více optimalizovaný webový leaderboard
* Funkční příkazy:
    * level
    * levely-role
    * linky
    * avatar
    * slap
    * anketa 
    * leaderboard
    * 8ball
    * random-food
    * počasí
    * user-info
    * clear
    * random-reddit
    * sourcecode

### TODO: 
* Přidat na webovej leaderboard šipky :OMEGALUL:
* Fix chyby při generaci příkazů to se někdy udělá
* Možná jednoduchá administrace pro adminy ze serveru, kde by šli přidávat role za levely a nějaké další vecičky
* Publikovat na plného bota
* AntiSpam
* Notifikace na nová videa na Youtube channelu


### Jak spustit bota
* Stáhneme kód bota 
* Zkontrolujte zda máte minimálně **Node.js 16** po případě nainstalujte (Discord.js v13 vyžaduje minimálně verzi 16)
* Ve složce, kde máme kód bota dáme `npm i`, což nám nainstaluje všechny použité balíčky
* Vytvoříme `.env` soubor, který bude obsahovat následující hodnoty:

```
MYSQL_HOST=IP MySQL server
MYSQL_USER=MySQL uživatel
MYSQL_PASSWORD=Heslo uživatele
MYSQL_DATABASE=Název MySQL databáze
DISCORD_BOT_TOKEN=Token vašeho bota
WEB_PORT=Port, kde chcete mít web
```
* Vytvoříme v MySQL databází tabulku Levels pomocí následující SQL příkazu
```
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
* Prvně spustíme bota příkaze `npm run start-regcommands`, což registruje všechny příkazy, co má bot (Na konci registrace příkazů bot spadne to je dobře, někdy to musím fixnout...)
* Poté můžeme bota již spouštět pouze s příkazem `npm start`

#### Chtěl bys vlastního custom bota pro svůj Discord server? Neváhej a napiš mi na Discord Jonanek#6969 nebo email jonas@pinktube.eu
