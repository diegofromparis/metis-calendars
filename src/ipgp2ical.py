import sys
from uuid import uuid4
from xml.etree import ElementTree as ET
from datetime import datetime, time
from icalendar import Calendar, Event

DEFAULT_YEAR = 2021
START_WEEK = 34
WEEKS_IN_YEAR = 52

def parse(filename):
    return ET.parse(filename)


def iter_events(tree):
    return tree.iterfind("events")


def parse_week_number(event, start_week=START_WEEK):
    """Deduce week number from start week and offset

    The offset is the index of 'Y' in a string of the type:
    'NNNNNNNNNNNNNNNNYNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNN'
                     ^

    Return the result modulo 52 and notify the caller if the year must
    be bumped by one.

    Example: week 60 is week 8 of next year 
    """
    year_offset = 0
    spec = event.find('rawweeks').text
    wnum = spec.find('Y') + start_week
    if wnum > WEEKS_IN_YEAR:
        wnum -= WEEKS_IN_YEAR
        year_offset = 1
    return wnum, year_offset
    

def parse_day_number(event):
    return int(event.find('day').text)


def parse_start_time(event):
    return time.fromisoformat(event.find('starttime').text)


def parse_end_time(event):
    return time.fromisoformat(event.find('endtime').text)


def parse_group(event):
    return event.find("resources")\
                .find("group")\
                .find("item").text


def parse_summary(event):
    return event.find("prettytimes").text


def date_from_week_number(year, week, day):
    return datetime.strptime(f"{year}-{week}-{day + 1}", "%Y-%W-%w")


def parse_date(event, year=DEFAULT_YEAR):
    wnum, year_offset = parse_week_number(event)
    year += year_offset
    day = parse_day_number(event)
    dt = date_from_week_number(year, wnum, day)
    return dt


def event_to_ical(event, uid=None):
    """Convert XML 'event' element to `icalendar.Event()` instance"""
    ical_evt = Event()

    if uid is None:
        uid = str(uuid4())
    ical_evt['uid'] = uid

    evt_date = parse_date(event)
    ical_evt.add(
        'dtstart',
        datetime.combine(evt_date, parse_start_time(event))
    )
    ical_evt.add(
        'dtend',
        datetime.combine(evt_date, parse_end_time(event))
    )

    ical_evt.add('summary', parse_summary(event))

    return ical_evt


def ipgp_to_ical(tree):
    calendar = Calendar()
    for uid, event in enumerate(tree.iterfind("event")):
        calendar.add_component(event_to_ical(event, uid))
    return calendar


if __name__ == "__main__":
    filename = sys.argv[1]
    tree = parse(filename)
    calendar = ipgp_to_ical(tree)
    sys.stdout.buffer.write(calendar.to_ical())
