const axios = require("axios");
const ical2json = require("ical2json");
const fs = require("fs");

async function fetchSource(url) {
    const res = await axios.get(url);
    return res.data;
}

function processICal(ical) {
    const events = ical2json.convert(ical).VCALENDAR[0].VEVENT;
    return events.map(function(e){
      e.DESCRIPTION = (e.DESCRIPTION || "").replace(/\\n\(Exporté le:.*$/, '')
      e["LAST-MODIFIED"] = ""
      return e;
    });
}

function writeCalendar(path, events) {
    const calendar = {
        VCALENDAR: [
            {
                METHOD: 'REQUEST',
                PRODID: '-//ADE/version 6.0',
                VERSION: '2.0',
                CALSCALE: 'GREGORIAN',
                NAME: path.substring(0, path.length - 5),
                VEVENT: events
            }
        ]
    };
    const data = ical2json.revert(calendar);
    fs.writeFileSync(path, data);
}

async function handleData(data) {
    let allEvents = [];
    const fetchedSources = [];
    for(let i = 0; i < data.length; i++) {
        const element = data[i];
        let events = [];
        if (element.sources.length == 1 && element.sources[0] === element.file) {
            const ical = fs.readFileSync(element.file).toString();
            const data = processICal(ical);
            if(!fetchedSources.includes(element.file)) {
                fetchedSources.push(element.file);
                allEvents = allEvents.concat(data);
            }
        } else {
            for(let i = 0; i < element.sources.length; i++) {
                const ical = await fetchSource(element.sources[i]);
                const data = processICal(ical);
                events = events.concat(data);
                if(!fetchedSources.includes(element.sources[i])) {
                    fetchedSources.push(element.sources[i]);
                    allEvents = allEvents.concat(data);
                }
            }
            writeCalendar(element.file, events);
        }
    }
    writeCalendar("all.ical", allEvents);
}

module.exports.handleData = handleData;
