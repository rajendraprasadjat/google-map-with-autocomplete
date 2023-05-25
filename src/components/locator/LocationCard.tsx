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
    <div
      onClick={() => {
        setInfoWindowContent(location);
      }}
      style={{
        margin: "10px 0px",
        border: "1px solid",
      }}
    >
      {location.rawData.name}
      <Address address={location.rawData.address} />
    </div>
  );
};

export default LocationCard;
