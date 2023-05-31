import { Hours } from "@yext/search-core";
import { SiteData } from "../../types";
import { HoursManipulator } from "./Hours/hoursManipulator";
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
  console.log("isOpenNow", isOpenNow);
  if (!isOpenNow) {
    const nInterval = h.getIntervalsForNDays(7, new Date());
    console.log("nInterval", nInterval);
    for (let index = 0; index < nInterval.length; index++) {
      const interval = nInterval[index];
      console.log("interval.isOpened", interval.isOpened(), interval);
      if (interval.isOpened()) {
        openedAt = `Closed - Opens at ${interval.getStartTime()} ${interval.getWeekDay()}`;
        break;
      }
    }
  } else {
    openedAt = `Open - Close at ${currentInterval?.getEndTime()}`;
  }

  return openedAt;
}
