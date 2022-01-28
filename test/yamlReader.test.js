const assert = require("assert");
const yamlReader = require("../src/yamlReader");
const path = require("path");

describe("YamlReader", () => {
    describe("Retour", () => {
        it("Retour correct", () => {
            assert.deepEqual(yamlReader.retrieveSources(path.join("test", "Listes"), path.join("test", "test.yaml")), [
                {file: path.join("test", "Listes", "dossier1", "calendrier1.ical"), sources: ["http://localhost:8000/test1.ical", "http://localhost:8000/test2.ical"]},
                {file: path.join("test", "Listes", "dossier1", "calendrier2.ical"), sources: ["http://localhost:8000/test1.ical"]},
                {file: path.join("test", "Listes", "calendrier3.ical"), sources: ["http://localhost:8000/test2.ical"]}
            ]);
        });
    });
});