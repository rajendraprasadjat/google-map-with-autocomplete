import * as React from "react";
import { SearchContext } from "../google-map/SearchProvider";
import LocationCard from "./LocationCard";

const LocationList = () => {
  const { locations } = React.useContext(SearchContext);
  return (
    <div>
      {locations.map((location: any) => (
        <LocationCard key={location.id} location={location} />
      ))}
    </div>
  );
};

export default LocationList;
