const axios = require("axios");
const ical2json = require("ical2json");
const fs = require("fs");

async function fetchSource(url) {
    const res = await axios.get(url);
    return res.data;
}

async function handleSource(url) {
    const data = await fetchSource(url);
    const events = ical2json.convert(data).VCALENDAR[0].VEVENT;
    return events;
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
        for(let i = 0; i < element.sources.length; i++) {
            const data = await handleSource(element.sources[i]);
            if(!fetchedSources.includes(element.sources[i])) {
                fetchedSources.push(element.sources[i]);
                allEvents = allEvents.concat(data);
            }
            events = events.concat(data);
        }
        writeCalendar(element.file, events);
    }
    writeCalendar("all.ical", allEvents);
}

module.exports.handleData = handleData;