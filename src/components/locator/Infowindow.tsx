import * as React from "react";
import { Address, Link } from "@yext/pages/components";
import { LocationResult } from "../../types/Locator";

type InfowindowProps = {
  location: LocationResult;
};

const Infowindow = ({ location }: InfowindowProps) => {
  const url = location.rawData.slug;
  return (
    <div className="infowindow-content">
      <Link className="location-name" href={`/${url}`}>
        {location.rawData.name}
      </Link>
      <Address
        className="location-address"
        address={location.rawData.address}
      />
      <Link className="button link" href={`/${url}`}>
        View Details
      </Link>
    </div>
  );
};

export default Infowindow;
