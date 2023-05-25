import * as React from "react";
import { SearchContext } from "../google-map/SearchProvider";
import { Address } from "@yext/pages/components";
import { LocationResult } from "../../types/Locator";

type LocationCardProps = {
  location: LocationResult;
};

const LocationCard = ({ location }: LocationCardProps) => {
  const { setInfoWindowContent } = React.useContext(SearchContext);
  return (
    <div className="location-card"
      onClick={() => {
        setInfoWindowContent(location);
      }}
    >
      <div className="location-name">{location.rawData.name}</div>
      <Address className="location-address" address={location.rawData.address} />
    </div>
  );
};

export default LocationCard;
