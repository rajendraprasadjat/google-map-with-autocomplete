import * as React from "react";
import { SearchContext } from "../google-map/SearchProvider";
import LocationCard, { LocationCardLoader } from "./LocationCard";
import { TemplateMeta } from "../../types";
import { LocationResult } from "../../types/Locator";
type LocationListProps = {
  meta?: TemplateMeta;
};
const LocationList = ({ meta }: LocationListProps) => {
  const {
    locations,
    isLoading,
    viewportLocations,
    isUpdateListAccordingMarkers,
    showViewportLocations,
  } = React.useContext(SearchContext);
  const [pageLoading, setPageLoading] = React.useState(true);
  React.useEffect(() => {
    if (!isLoading) {
      setPageLoading(false);
    }
  }, [isLoading]);
  return (
    <div className="listing">
      {showViewportLocations && isUpdateListAccordingMarkers
        ? viewportLocations.map((location: LocationResult) => (
            <LocationCard key={location.id} location={location} meta={meta} />
          ))
        : locations.map((location: LocationResult) => (
            <LocationCard key={location.id} location={location} meta={meta} />
          ))}

      {pageLoading && (
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
