import * as React from "react";
import { SearchContext } from "./SearchProvider";
import GoogleMap from "./components/GoogleMaps";
import { MapboxMap } from "./components/MapboxMap";
import Infowindow from "../locator/Infowindow";
import { SiteData, TemplateMeta } from "../../types";

export type Libraries = ("drawing" | "geometry" | "localContext" | "marker" | "places" | "visualization")[];

type MapWrapperProps = {
  _site: SiteData;
  meta: TemplateMeta;
};

const MapWrapper = ({ _site, meta }: MapWrapperProps) => {
  const { mapType, mapboxAccessToken } = React.useContext(SearchContext);
  return mapType === "google" ? (
    <GoogleMap meta={meta} InfowindowComponent={Infowindow} _site={_site} />
  ) : (
    <MapboxMap meta={meta} mapboxAccessToken={mapboxAccessToken} InfowindowComponent={Infowindow} _site={_site} />
  );
};

export default MapWrapper;
