import * as React from "react";
import { SearchContext } from "../google-map/SearchProvider";
import LocationCard from "./LocationCard";

const LocationList = ({ meta }) => {
  const { locations } = React.useContext(SearchContext);
  return (
    <div className="listing">
      {locations.map((location: any) => (
        <LocationCard key={location.id} location={location} meta={meta} />
      ))}
    </div>
  );
};

export default LocationList;
