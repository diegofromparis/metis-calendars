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
                VEVENT: events
            }
        ]
    };
    const data = ical2json.revert(calendar);
    fs.writeFileSync(path, data);
}

function handleData(data) {
    data.forEach(async element => {
        let events = [];
        for(let i = 0; i < element.sources.length; i++) {
            const data = await handleSource(element.sources[i]);
            events = events.concat(data);
        }
        writeCalendar(element.file, events);
    });
}

module.exports.handleData = handleData;