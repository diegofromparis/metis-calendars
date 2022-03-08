from xml.etree import ElementTree as ET
from datetime import datetime, time
import sys
from icalendar import Calendar, Event

YEAR = 2021

def parse(filename):
    return ET.parse(filename)

def iter_events(tree):
    return tree.iterfind("events")

def parse_week_number(event):
    spec = event.find('rawweeks').text
    return spec.find('Y') + 33

def parse_day_number(event):
    return int(event.find('day').text)

def parse_start_time(event):
    return time.fromisoformat(event.find('starttime').text)

def parse_end_time(event):
    return time.fromisoformat(event.find('endtime').text)

def parse_description(event):
    return event.find("resources")\
                .find("group")\
                .find("item").text

def parse_summary(event):
    return event.find("prettytimes").text
    

def date_from_week_number(year, week, day):
    return datetime.strptime(f"{year}-{week}-{day + 1}", "%Y-%W-%w")

def parse_dt(event):
    year = YEAR
    week = parse_week_number(event)
    if week > 52:
        year += 1
        week -= 52
    day = parse_day_number(event)
    dt = date_from_week_number(year, week, day)
    return dt

def event_to_ical(event, uid):
    ical_evt = Event()
    ical_evt['uid'] = uid
    ical_evt['dtstart'] = datetime.combine(parse_dt(event), parse_start_time(event))
    ical_evt['dtend'] = datetime.combine(parse_dt(event), parse_end_time(event))
    ical_evt['summary'] = parse_description(event)
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
    print(calendar.to_ical().replace(b'\r\n', b'\n').strip().decode())

