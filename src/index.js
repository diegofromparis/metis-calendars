const yamlReader = require("./yamlReader");
const calendarHandler = require("./calendarHandler");
const fs = require("fs");

fs.writeFileSync("lastUpdate.txt", (new Date()).toLocaleString("fr-FR", {timeZone: "Europe/Paris"}));
const sources = yamlReader.retrieveSources("Liste", "liste.yaml");
calendarHandler.handleData(sources);