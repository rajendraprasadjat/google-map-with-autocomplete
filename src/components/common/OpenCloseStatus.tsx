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
  if (!isOpenNow) {
    const nInterval = h.getIntervalsForNDays(7, new Date());
    for (let index = 0; index < nInterval.length; index++) {
      const interval = nInterval[index];
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
