import { Hours, Interval } from "@yext/search-core";
import moment, { Moment } from "moment-timezone";

const dayKeys = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];

type DayStringType = "sunday" | "monday" | "tuesday" | "wednesday" | "thursday" | "friday" | "saturday";
class HoursIntervalManipulator {
  date;
  end;
  start;
  hours;
  interval;
  timeZone;
  constructor(date: Moment, interval: Interval, hours: Hours, timeZone: string) {
    this.date = moment.tz(date, timeZone);
    this.end = moment.tz(date, timeZone);
    this.start = moment.tz(date, timeZone);
    this.hours = hours;
    this.interval = interval;
    this.timeZone = timeZone;
    [(interval.start, interval.end)].forEach((time) => {
      if (time && time.split(":").length != 2) {
        throw new Error(`expected interval start and end data to be in the format "HH:MM"`);
      }
    });
    if (interval.start && interval.end) {
      const [startHour, startMinute] = interval.start.split(":");
      const [endHour, endMinute] = interval.end.split(":");
      this.end.set("hour", Number(endHour));
      this.end.set("minute", Number(endMinute));
      this.start.set("hour", Number(startHour));
      this.start.set("minute", Number(startMinute));

      if (this.end < this.start) {
        this.end.set("date", this.end.get("date") + 1);
      }
    }
  }
  isOpened(locale = "en_GB") {
    const now = moment.tz(moment(), this.timeZone);
    console.log("this.getStartTime", this.getStartTime(locale), now.toLocaleString());
    if (this.getStartTime(locale) === now.toLocaleString()) {
      if (this.start.get("millisecond") <= now.get("millisecond") && this.end.get("millisecond") >= now.get("millisecond")) {
        return true;
      } else {
        return false;
      }
    } else if (this.interval) {
      return true;
    } else {
      return false;
    }
  }
  contains(date: Moment) {
    return this.start <= date && date < this.end;
  }
  getWeekDay() {
    const now = moment.tz(moment(), this.timeZone);
    const today = now.get("day");
    const day = this.date.get("day");
    console.log("today", now, this.date);
    if (day - today === 1) {
      return "Tomorrow";
    } else if (day - today === 0) {
      return "";
    }
    return dayKeys[day];
  }
  getStartTime(locale = "") {
    return this.start.locale(locale).format("hh:mm A");
  }
  getEndTime(locale = "") {
    return this.end.locale(locale).format("hh:mm A");
  }
  timeIsEqualTo(other: { getStartTime: () => string; getEndTime: () => string }) {
    const startEqual = this.getStartTime() === other.getStartTime();
    const endEqual = this.getEndTime() === other.getEndTime();
    return startEqual && endEqual;
  }
}
class HoursManipulator {
  holidayHoursByDate;
  hours: Hours;
  timeZone: string;
  constructor(hours: Hours, timeZone: string) {
    this.holidayHoursByDate = Object.fromEntries(((hours && hours.holidayHours) || []).map((hours2) => [hours2.date, hours2]));
    this.hours = hours;
    this.timeZone = timeZone;
  }
  getInterval(date: Moment) {
    if (this.isTemporarilyClosedAt(date)) {
      return null;
    }
    const priorDate = moment.tz(date, this.timeZone);
    priorDate.set("date", priorDate.get("date") - 1);
    for (const hoursDate of [priorDate, date]) {
      const hours = this.getHours(hoursDate);
      if (hours && !hours.isClosed) {
        for (const interval of hours.openIntervals || []) {
          const hoursInterval = new HoursIntervalManipulator(hoursDate, interval, this.hours, this.timeZone);
          if (hoursInterval.contains(date)) {
            return hoursInterval;
          }
        }
      }
    }
    return null;
  }
  getCurrentInterval() {
    return this.getInterval(moment.tz(moment(), this.timeZone));
  }
  getIntervalAfter(date: Moment) {
    const intervalsList = this.getIntervalsForNDays(7, date);
    const sortFn = (interval1: HoursIntervalManipulator, interval2: HoursIntervalManipulator) => {
      if (interval1.start === interval2.start) return 0;
      return interval1.start > interval2.start ? 1 : -1;
    };
    const sortedIntervals = intervalsList.sort(sortFn);
    for (const [idx, hoursInterval] of sortedIntervals.entries()) {
      if (hoursInterval.contains(date)) {
        if (sortedIntervals.length > idx + 1) {
          return sortedIntervals[idx + 1];
        }
      }
    }
    for (const hoursInterval of sortedIntervals) {
      if (hoursInterval.start > date) {
        return hoursInterval;
      }
    }
    return null;
  }
  getNextInterval() {
    return this.getIntervalAfter(moment());
  }
  getIntervalsForNDays(n: number, startDate: string | number | Moment) {
    const intervalsList = [];
    for (let i = 0; i < n; i++) {
      const theDate = moment.tz(startDate, this.timeZone);
      theDate.set("date", theDate.get("date") + i);
      const hours = this.getHours(theDate);
      if (hours && !hours.isClosed && hours.openIntervals) {
        intervalsList.push(
          ...hours.openIntervals.map((interval: Interval) => new HoursIntervalManipulator(theDate, interval, this.hours, this.timeZone))
        );
      }
    }
    return intervalsList;
  }
  getHolidayHours(date: Moment) {
    if (this.isTemporarilyClosedAt(date)) {
      return null;
    }

    return this.holidayHoursByDate[this.transformDateToYext(date)] || null;
  }
  getNormalHours(date: Moment) {
    if (this.isTemporarilyClosedAt(date)) {
      return null;
    }
    return this.hours[dayKeys[date.get("day")] as DayStringType];
  }
  getHours(date: Moment) {
    return this.getHolidayHours(date) || this.getNormalHours(date);
  }
  isHoliday(date: Moment) {
    return !!this.getHolidayHours(date);
  }
  isTemporarilyClosedAt(targetDate: Moment) {
    if (!this.hours?.reopenDate) {
      return false;
    }
    if (this.transformDateToYext(targetDate) < this.hours.reopenDate) {
      return true;
    }
    return false;
  }
  isOpenAt(date: Moment) {
    if (this.isTemporarilyClosedAt(date)) {
      return false;
    }
    return !!this.getInterval(date);
  }
  isOpenNow() {
    return this.isOpenAt(moment.tz(moment(), this.timeZone));
  }
  transformDateToYext(date: Moment) {
    return date.format("YYYY-MM-DD");
  }
}
function arrayShift(arr: number[], n: number) {
  const myArr = [...arr];
  n = n % myArr.length;
  return myArr.concat(myArr.splice(0, myArr.length - n));
}
function intervalsListsAreEqual(il1: HoursIntervalManipulator[], il2: HoursIntervalManipulator[]) {
  if (il1.length != il2.length) {
    return false;
  }
  for (const [idx, interval] of il1.entries()) {
    if (!interval.timeIsEqualTo(il2[idx])) {
      return false;
    }
  }
  return true;
}
export { HoursIntervalManipulator, HoursManipulator, arrayShift, intervalsListsAreEqual };
