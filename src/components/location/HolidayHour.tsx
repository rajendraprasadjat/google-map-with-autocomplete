import { HolidayHours, Interval } from "@yext/search-core";
import * as React from "react";
import { SiteData } from "../../types";
import moment from "moment";
/**
 * Create HolidayHour for holiday feild
 * @param props
 * @returns html for holiday hours feild
 */
interface HolidayHourProps {
  site: SiteData;
  hours: HolidayHours[];
  specificDay?: { holidayDate?: Date; holidayName?: string }[];
}

const HolidayHour = ({ hours, specificDay }: HolidayHourProps) => {
  const currentDate = moment(moment().format("MM-DD-YYYY"));

  const array: HolidayHours[] = [];
  hours?.map((i) => {
    const d2 = moment(i.date);
    if (d2.diff(currentDate) >= 0) {
      array.push(i);
    }
  });
  let ddate: string;

  return (
    <>
      {array.map((res: HolidayHours, i: number) => {
        const weeks = [
          "sunday",
          "monday",
          "tuesday",
          "wednesday",
          "thursday",
          "friday",
          "saturday",
        ];
        const d = moment(res.date);
        return (
          <React.Fragment key={i}>
            <tr className="pop-up-holyhrs">
              <td>{d.format("DD/MM/YYYY")}</td>
              <td>{weeks[d.day()]}</td>
              <td>
                {specificDay &&
                  specificDay?.map((day, i) => {
                    if (
                      day?.holidayDate &&
                      day?.holidayDate.toString() === res.date
                    ) {
                      ddate = res.date;
                      return (
                        <span className="specificday" key={i}>
                          {day?.holidayName ? day.holidayName : "Holiday"}
                        </span>
                      );
                    }
                  })}
                {ddate == res?.date ? <></> : <div>{"Holiday"}</div>}
              </td>
              {!res.isClosed && (
                <td className="">
                  {res.openIntervals?.map(
                    (openinterval: Interval, index: number) => {
                      return (
                        <>
                          <div key={index}>
                            <span className="op-time">
                              {openinterval?.start}
                            </span>
                            <span className="spac-bx"> - </span>
                            <span className="cl-time">{openinterval?.end}</span>
                          </div>
                        </>
                      );
                    }
                  )}
                </td>
              )}
              {res.isClosed && <td>Closed</td>}
            </tr>
          </React.Fragment>
        );
      })}
    </>
  );
};
export default HolidayHour;
