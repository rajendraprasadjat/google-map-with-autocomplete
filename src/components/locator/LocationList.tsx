import * as React from "react";
import { SearchContext } from "../google-map/SearchProvider";
import LocationCard, { LocationCardLoader } from "./LocationCard";

const LocationList = ({ meta }) => {
  const {
    locations,
    isLoading,
    viewportLocations,
    isUpdateListAccordingMarkers,
    showViewportLocations,
  } = React.useContext(SearchContext);

  return (
    <div className="listing">
      {showViewportLocations && isUpdateListAccordingMarkers
        ? viewportLocations.map((location: any) => (
            <LocationCard key={location.id} location={location} meta={meta} />
          ))
        : locations.map((location: any) => (
            <LocationCard key={location.id} location={location} meta={meta} />
          ))}

      {isLoading && (
        <>
          <LocationCardLoader />
          <LocationCardLoader />
          <LocationCardLoader />
          <LocationCardLoader />
          <LocationCardLoader />
        </>
      )}
    </div>
  );
};

export default LocationList;
