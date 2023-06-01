import { Hours } from "@yext/search-core";
import { SiteData } from "../../types";
import { HoursManipulator } from "./Hours/hoursManipulator";
import React from "react";
interface OpenCloseProps {
  hours: Hours;
  timezone: string;
  site: SiteData;
}

export default function OpenCloseStatus(props: OpenCloseProps) {
  const h = new HoursManipulator(props.hours);
  const currentInterval = h.getCurrentInterval();
  const isOpenNow = currentInterval?.isOpened();
  let openedAt = "";
  if (h.hours.reopenDate) {
    openedAt = "Temprary Closed";
  } else if (!isOpenNow) {
    const nInterval = h.getIntervalsForNDays(7, new Date());
    if (nInterval.length > 0) {
      for (let index = 0; index < nInterval.length; index++) {
        const interval = nInterval[index];
        if (interval.isOpened()) {
          openedAt = `Closed - Opens at ${interval.getStartTime()} ${interval.getWeekDay()}`;
          break;
        }
      }
    } else {
      openedAt = "Closed";
    }
  } else if (
    currentInterval &&
    currentInterval.interval.end === "23:59" &&
    currentInterval.interval.start === "00:00"
  ) {
    openedAt = `Open 24 Hours`;
  } else {
    openedAt = `Open - Close at ${currentInterval?.getEndTime()}`;
  }

  return openedAt ? <div className="open-close">{openedAt}</div> : null;
}
