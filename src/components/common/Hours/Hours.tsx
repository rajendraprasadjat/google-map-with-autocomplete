import React, { useEffect, useState } from "react";
import {
  HoursManipulator,
  arrayShift,
  intervalsListsAreEqual,
  HoursIntervalManipulator,
} from "./hoursManipulator";
import { Hours as ComponentHours, DayHour } from "@yext/search-core";
import moment from "moment";

const defaultDayOfWeekNames = [
  "sunday",
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
];

interface HoursCollapseDay {
  isToday: boolean;
  dayOfWeek: DayHour | string;
  intervals: HoursIntervalManipulator[];
  sortIdx: number;
}

interface CollapseDay extends HoursCollapseDay {
  startDay: DayHour | string;
  endDay: DayHour | string;
}

const defaultDayOfWeekSortIdx = [0, 1, 2, 3, 4, 5, 6];
function getSortIdx(props: HoursProps, todayDate: Date) {
  let startIdx = 0;
  if (props.startOfWeek === "today") {
    startIdx = todayDate.getDay();
    return arrayShift(defaultDayOfWeekSortIdx, startIdx);
  } else if (props.startOfWeek) {
    startIdx = defaultDayOfWeekNames.indexOf(props.startOfWeek);
    return arrayShift(defaultDayOfWeekSortIdx, startIdx);
  } else {
    return defaultDayOfWeekSortIdx;
  }
}
function collapseDays(hoursDays: HoursCollapseDay[]) {
  const collapsedDays: CollapseDay[] = [];
  hoursDays.forEach((hoursDay) => {
    const latestGroup = collapsedDays[collapsedDays.length - 1];
    if (!latestGroup) {
      collapsedDays.push({
        startDay: hoursDay.dayOfWeek,
        endDay: hoursDay.dayOfWeek,
        ...hoursDay,
      });
    } else {
      if (intervalsListsAreEqual(latestGroup.intervals, hoursDay.intervals)) {
        latestGroup.endDay = hoursDay.dayOfWeek;
        latestGroup.isToday = latestGroup.isToday || hoursDay.isToday;
      } else {
        collapsedDays.push({
          startDay: hoursDay.dayOfWeek,
          endDay: hoursDay.dayOfWeek,
          ...hoursDay,
        });
      }
    }
  });
  return collapsedDays.map((day) => ({
    ...day,
    dayOfWeek:
      day.startDay === day.endDay
        ? `${day.startDay}`
        : `${day.startDay} - ${day.endDay}`,
  }));
}
function defaultIntervalStringsBuilder(dayData: HoursCollapseDay) {
  const intervalStrings = [];
  if (dayData.intervals.length === 0) {
    intervalStrings.push("Closed");
  } else {
    dayData.intervals.forEach((interval) => {
      const startTime = interval.getStartTime("en-US");
      const endTime = interval.getEndTime("en-US");
      intervalStrings.push(
        <>
          <span>{startTime}</span>-<span>{endTime}</span>
        </>
      );
    });
  }
  return intervalStrings;
}
/* function dayOfWeekNamesToArray(nameMap: ComponentHours) {
  return [
    nameMap.sunday || defaultDayOfWeekNames[0],
    nameMap.monday || defaultDayOfWeekNames[1],
    nameMap.tuesday || defaultDayOfWeekNames[2],
    nameMap.wednesday || defaultDayOfWeekNames[3],
    nameMap.thursday || defaultDayOfWeekNames[4],
    nameMap.friday || defaultDayOfWeekNames[5],
    nameMap.saturday || defaultDayOfWeekNames[6],
  ];
} */

interface HoursProps {
  hours: ComponentHours;
  dayOfWeekNames?: string[];
  collapseDays?: HoursCollapseDay[];
  showHeader?: boolean;
  className?: string;
  intervalStringsBuilderFn?: () => string[];
  startOfWeek?: string;
  message?: string;
}

const Hours = (props: HoursProps) => {
  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);
  const h = new HoursManipulator(props.hours);
  console.log("props", props);
  if (h.hours.reopenDate) {
    const date = moment(h.hours.reopenDate);
    return (
      <div className="reopen-date">
        {props.message && <span>{props.message}</span>}
        <div> {`Reopen date: ${date.format("DD MMM, YYYY")}`}</div>
      </div>
    );
  }
  const now = new Date();
  const dayOfWeekNames = defaultDayOfWeekNames;
  const dayOfWeekSortIdx = getSortIdx(props, new Date());
  const allIntervals = h.getIntervalsForNDays(7, now);
  let hoursDays = [];
  for (let i = 0; i < 7; i++) {
    hoursDays.push({
      dayOfWeek: dayOfWeekNames[i],
      sortIdx: dayOfWeekSortIdx[i],
      intervals: allIntervals.filter(
        (interval) => interval.start.getDay() === i
      ),
      isToday: now.getDay() === i,
    });
  }
  const sortFn = (day1: { sortIdx: number }, day2: { sortIdx: number }) => {
    if (day1.sortIdx === day2.sortIdx) {
      return 0;
    }
    return day1.sortIdx > day2.sortIdx ? 1 : -1;
  };
  hoursDays.sort(sortFn);
  if (props.collapseDays) {
    hoursDays = collapseDays(hoursDays);
  }

  console.log("hoursDays", hoursDays);
  return (
    <React.Fragment>
      {isClient && (
        <table className={`hours-table ${props.className}`}>
          {props.showHeader && (
            <thead className="sr-only">
              <tr>
                <th>Day of the Week</th>
                <th>Hours</th>
              </tr>
            </thead>
          )}
          {hoursDays.map((dayData) => {
            const intervalStringsBuilder =
              props.intervalStringsBuilderFn || defaultIntervalStringsBuilder;
            const intervalStrings = intervalStringsBuilder(dayData);

            return (
              <tr
                key={dayData.sortIdx}
                className={`hours-table-row ${
                  dayData.isToday ? "is-today" : ""
                }`}
              >
                <td className="hours-table-day">{dayData.dayOfWeek}</td>
                <td className="hours-table-intervals">
                  {intervalStrings.map((intervalString, idx) => (
                    <span className="hours-table-interval" key={idx}>
                      {intervalString}
                    </span>
                  ))}
                </td>
              </tr>
            );
          })}
        </table>
      )}
    </React.Fragment>
  );
};
export { Hours };
