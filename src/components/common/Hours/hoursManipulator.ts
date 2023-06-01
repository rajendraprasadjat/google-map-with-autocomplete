import { Hours, Interval } from "@yext/search-core";

const dayKeys = [
  "sunday",
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
];

type DayStringType =
  | "sunday"
  | "monday"
  | "tuesday"
  | "wednesday"
  | "thursday"
  | "friday"
  | "saturday";
class HoursIntervalManipulator {
  date;
  end;
  start;
  hours;
  interval;
  constructor(date: Date, interval: Interval, hours: Hours) {
    this.date = date;
    this.end = new Date(date);
    this.start = new Date(date);
    this.hours = hours;
    this.interval = interval;
    [(interval.start, interval.end)].forEach((time) => {
      if (time && time.split(":").length != 2) {
        throw new Error(
          `expected interval start and end data to be in the format "HH:MM"`
        );
      }
    });
    if (interval.start && interval.end) {
      const [startHour, startMinute] = interval.start.split(":");
      const [endHour, endMinute] = interval.end.split(":");
      this.end.setHours(Number(endHour), Number(endMinute));
      this.start.setHours(Number(startHour), Number(startMinute));
      if (this.end < this.start) {
        this.end.setDate(this.end.getDate() + 1);
      }
    }
  }
  isOpened() {
    const now = new Date();
    if (this.start.toLocaleDateString() === now.toLocaleDateString()) {
      if (
        this.start.getTime() <= now.getTime() &&
        this.end.getTime() >= now.getTime()
      ) {
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
  contains(date: Date) {
    return this.start <= date && date < this.end;
  }
  getWeekDay() {
    const now = new Date();
    const today = now.getDay();
    const day = this.date.getDay();
    if (day - today === 1) {
      return "Tomorrow";
    } else if (day - today === 0) {
      return "";
    }
    return dayKeys[day];
  }
  getStartTime(locale = "") {
    return this.start.toLocaleString(locale || "en-US", {
      hour: "numeric",
      minute: "numeric",
    });
  }
  getEndTime(locale = "") {
    return this.end.toLocaleString(locale || "en-US", {
      hour: "numeric",
      minute: "numeric",
    });
  }
  timeIsEqualTo(other: {
    getStartTime: () => string;
    getEndTime: () => string;
  }) {
    const startEqual = this.getStartTime() === other.getStartTime();
    const endEqual = this.getEndTime() === other.getEndTime();
    return startEqual && endEqual;
  }
}
class HoursManipulator {
  holidayHoursByDate;
  hours: Hours;
  constructor(hours: Hours) {
    this.holidayHoursByDate = Object.fromEntries(
      (hours.holidayHours || []).map((hours2) => [hours2.date, hours2])
    );
    this.hours = hours;
  }
  getInterval(date: Date) {
    if (this.isTemporarilyClosedAt(date)) {
      return null;
    }
    const priorDate = new Date(date);
    priorDate.setDate(priorDate.getDate() - 1);
    for (const hoursDate of [priorDate, date]) {
      const hours = this.getHours(hoursDate);
      if (hours && !hours.isClosed) {
        for (const interval of hours.openIntervals || []) {
          const hoursInterval = new HoursIntervalManipulator(
            hoursDate,
            interval,
            this.hours
          );
          if (hoursInterval.contains(date)) {
            return hoursInterval;
          }
        }
      }
    }
    return null;
  }
  getCurrentInterval() {
    return this.getInterval(new Date());
  }
  getIntervalAfter(date: Date) {
    const intervalsList = this.getIntervalsForNDays(7, date);
    const sortFn = (
      interval1: HoursIntervalManipulator,
      interval2: HoursIntervalManipulator
    ) => {
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
    return this.getIntervalAfter(new Date());
  }
  getIntervalsForNDays(n: number, startDate: string | number | Date) {
    const intervalsList = [];
    for (let i = 0; i < n; i++) {
      const theDate = new Date(startDate);
      theDate.setDate(theDate.getDate() + i);
      const hours = this.getHours(theDate);
      if (hours && !hours.isClosed && hours.openIntervals) {
        intervalsList.push(
          ...hours.openIntervals.map(
            (interval: Interval) =>
              new HoursIntervalManipulator(theDate, interval, this.hours)
          )
        );
      }
    }
    return intervalsList;
  }
  getHolidayHours(date: Date) {
    if (this.isTemporarilyClosedAt(date)) {
      return null;
    }

    return this.holidayHoursByDate[this.transformDateToYext(date)] || null;
  }
  getNormalHours(date: Date) {
    if (this.isTemporarilyClosedAt(date)) {
      return null;
    }
    return this.hours[dayKeys[date.getDay()] as DayStringType];
  }
  getHours(date: Date) {
    return this.getHolidayHours(date) || this.getNormalHours(date);
  }
  isHoliday(date: Date) {
    return !!this.getHolidayHours(date);
  }
  isTemporarilyClosedAt(targetDate: Date) {
    if (!this.hours.reopenDate) {
      return false;
    }
    if (this.transformDateToYext(targetDate) < this.hours.reopenDate) {
      return true;
    }
    return false;
  }
  isOpenAt(date: Date) {
    if (this.isTemporarilyClosedAt(date)) {
      return false;
    }
    return !!this.getInterval(date);
  }
  isOpenNow() {
    return this.isOpenAt(new Date());
  }
  transformDateToYext(date: Date) {
    const [year, month, day] = date.toISOString().split("T")[0].split("-");
    const zeroBasedMonth = Number(month);
    const monthZeroBased =
      zeroBasedMonth < 10 ? "0" + zeroBasedMonth : zeroBasedMonth.toString();
    return `${year}-${monthZeroBased}-${day}`;
  }
}
function arrayShift(arr: number[], n: number) {
  const myArr = [...arr];
  n = n % myArr.length;
  return myArr.concat(myArr.splice(0, myArr.length - n));
}
function intervalsListsAreEqual(
  il1: HoursIntervalManipulator[],
  il2: HoursIntervalManipulator[]
) {
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
export {
  HoursIntervalManipulator,
  HoursManipulator,
  arrayShift,
  intervalsListsAreEqual,
};
