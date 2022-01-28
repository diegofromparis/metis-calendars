const yaml = require("js-yaml");
const fs = require("fs");
const path = require("path");

function createFolderIfNeeded(folderName) {
    if(!fs.existsSync(folderName) || !fs.lstatSync(folderName).isDirectory()) {
        fs.mkdirSync(folderName);
    }
}

function createFile(fileName) {
    fs.closeSync(fs.openSync(fileName, "w"));
}

function handleDataElement(data, prefix) {
    if(Array.isArray(data)) {
        const name = path.join(prefix, data[0]);
        if(Array.isArray(data[1])) {
            createFile(name + ".ical");
            return [{file: name + ".ical", sources: data[1]}];
        }
        else {
            createFolderIfNeeded(name);
            let array = [];
            Object.entries(data[1]).forEach(entry => array = array.concat(handleDataElement(entry, name)));
            return array;
        }
    }
    else {
        return null;
    }
}

function retrieveSources(listFolder, listFile) {
    try {
        const doc = yaml.load(fs.readFileSync(listFile));
        const array = handleDataElement([listFolder, doc], "");
        return array;
    }
    catch(e) {
        console.log(e);
        return null;
    }
}

module.exports.retrieveSources = retrieveSources;
