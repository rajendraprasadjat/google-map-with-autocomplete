import * as React from "react";
import { SearchContext } from "../google-map/SearchProvider";
import { Address, Link } from "@yext/pages/components";
import { LocationResult } from "../../types/Locator";

type LocationCardProps = {
  location: LocationResult;
};

const LocationCard = ({ location }: LocationCardProps) => {
  const { setInfoWindowContent } = React.useContext(SearchContext);
  const cartRef = React.useRef(null);
  console.log("location.rawData", location.rawData);
  const url = location.rawData.slug;
  return (
    <div
      ref={cartRef}
      className="location-card"
      onClick={() => {
        setInfoWindowContent(location);
      }}
    >
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

export default LocationCard;
