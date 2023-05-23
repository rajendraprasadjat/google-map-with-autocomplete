import * as React from "react";
import { SearchContext } from "../google-map/SearchProvider";
import LocationCard from "./LocationCard";

const LocationList = () => {
  const { locations } = React.useContext(SearchContext);
  return (
    <div style={{ maxHeight: "100%", overflow: "auto" }}>
      {locations.map((location: any) => (
        <LocationCard key={location.id} location={location} />
      ))}
    </div>
  );
};

export default LocationList;
