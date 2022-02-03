const yamlReader = require("./yamlReader");
const calendarHandler = require("./calendarHandler");

const sources = yamlReader.retrieveSources("Liste", "liste.yaml");
calendarHandler.handleData(sources);