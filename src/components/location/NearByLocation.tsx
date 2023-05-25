import { Address, Link } from "@yext/pages/components";
import * as React from "react";
import { getDirectionUrl } from "../../config/GlobalFunctions";
import { getRecursiveData } from "../../templates/location";
import { TemplateMeta } from "../../types";
import { NearByLocationResult } from "../../types/Locator";

type NearByprops = {
  locations: NearByLocationResult[];
  meta: TemplateMeta;
};

const NearByLocation = ({ locations, meta }: NearByprops) => {
  console.log("locations", locations);
  return (
    <div className="nearby-locations">
      {locations.map((location) => {
        const { data } = location;
        const url = getRecursiveData(data, meta);
        return (
          <div className="location near-location" key={data.id}>
            <div className="miles-with-title">
              <h3 className="">
                <Link href={`${url}`}>{data.name}</Link>
              </h3>
            </div>

            <Address address={data.address} />
            <div className="buttons">
              <Link className="button before-icon" href={`${url}`}>
                View Details
              </Link>
              {/* <Link
                data-ya-track="getdirections"
                eventName={`getdirections`}
                target="_blank"
                className="direction button before-icon"
                href={getDirectionUrl(location)}
                rel="noopener noreferrer"
              >
                Get Direction
              </Link> */}
            </div>
          </div>
        );
      })}
    </div>
  );
};
export default NearByLocation;
