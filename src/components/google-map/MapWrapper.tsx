import { Wrapper } from "@googlemaps/react-wrapper";
import * as React from "react";
import { SearchContext } from "./SearchProvider";
import GoogleMap from "./components/GoogleMaps";
import { MapboxMap } from "./components/MapboxMap";
import Infowindow from "../locator/Infowindow";
import { SiteData } from "../../types";

export type Libraries = (
  | "drawing"
  | "geometry"
  | "localContext"
  | "marker"
  | "places"
  | "visualization"
)[];

type MapWrapperProps = {
  _site: SiteData;
};

const MapWrapper = ({ _site }: MapWrapperProps) => {
  const { mapType, mapboxAccessToken } = React.useContext(SearchContext);
  return mapType === "google" ? (
    <GoogleMap InfowindowComponent={Infowindow} _site={_site} />
  ) : (
    <MapboxMap
      mapboxAccessToken={mapboxAccessToken}
      InfowindowComponent={Infowindow}
      _site={_site}
    />
  );
};

export default MapWrapper;
