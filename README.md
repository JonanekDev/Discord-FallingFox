# FallingFox Discord Bot v3

Custom Discord bot pro FallingFox Discord ([Invite na Discord server](https://invite.gg/fallingfox))

Btw důvod přespsání celého bota je aktualizace Discord.js na 13

### Stav aktuálního kódu:
* Funkční základ
* Funkční level system 

### TODO: 
* Příkaz:
    * level
    * levely-role
    * anketa 
    * leaderboard
    * random-food
    * random-reddit
    * linky
    * avatar
    * slap
    * 8ball
    * clear
    * počasí
    * user-info
    * Další zatím nevím :(
* Update channelu s počtem uživatelů
* Web leaderboard (Víc optimalizovaný než předchozí doufám)
* Welcome message
* Možná jednoduchá administrace pro adminy ze serveru, kde by šli přidávat role za levely a nějaké další vecičky
* Publikovat na plného bota


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
```
* Vytvoříme v MySQL databází tabulku Levels pomocí následující SQL příkazu
```
CREATE TABLE `Levels` (
  `ID` int(11) NOT NULL,
  `DisUserID` bigint(20) NOT NULL,
  `EXP` int(11) NOT NULL,
  `Level` int(11) NOT NULL,
  `CountOfMessages` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
ALTER TABLE `Levels`
  ADD PRIMARY KEY (`ID`);
```
* Nyní můžeme spustit bota příkazem `npm start`

##### Chtěl bys vlastního custom bota pro svůj Discord server? Neváhej a napiš mi na Discord Jonanek#6969 nebo email jonas@pinktube.eu
