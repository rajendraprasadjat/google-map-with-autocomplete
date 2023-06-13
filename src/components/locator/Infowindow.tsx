import * as React from "react";
import { Address, Link } from "@yext/pages/components";
import { LocationResult } from "../../types/Locator";
import { SiteData, TemplateMeta } from "../../types";
import { getLink } from "../../config/GlobalFunctions";
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
        <Link className="location-name" href={`/${url}`}>
          {location.rawData.name}
        </Link>
        <Address address={location.rawData.address} />
      </div>
      <div className="button-bx-detail">
        <Link className="button link" href={`/${url}`}>
          View Details
        </Link>
      </div>
    </div>
  );
};

export default Infowindow;
