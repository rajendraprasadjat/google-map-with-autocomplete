import * as React from "react";
import { Address, Link } from "@yext/pages/components";
import { LocationResult } from "../../types/Locator";
import { SiteData, TemplateMeta } from "../../types";
import { getDirectionUrl, getLink } from "../../config/GlobalFunctions";
import { RawData } from "../../types/Locator";

export type InfowindowProps = {
  location: LocationResult;
  _site: SiteData;
  meta: TemplateMeta;
};

const Infowindow = ({ location, meta }: InfowindowProps) => {
  const url = getLink<RawData>(location.rawData, meta, true, 0, true);
  return (
    <div className="infowindow-content">
      <div className="icon-row">
        <div className="icon addressIcon"></div>
        <a className="location-name" href={`/${url}`}>
          {location.rawData.name}
        </a>
        <Address address={location.rawData.address} />
      </div>
      <div className="button-bx-detail">
        <Link
          data-ya-track="getdirections"
          eventName={`getdirections`}
          target="_blank"
          className="direction button before-icon"
          href={getDirectionUrl(location.rawData.address, location.rawData.googlePlaceId)}
          rel="noopener noreferrer"
        >
          Get Direction
        </Link>
        <a className="button link" href={`/${url}`}>
          View Details
        </a>
      </div>
    </div>
  );
};

export default Infowindow;
