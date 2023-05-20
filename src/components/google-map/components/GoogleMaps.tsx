import * as React from "react";

import {
  GoogleMap as ReactGoogleMap,
  Marker,
  MarkerClusterer,
} from "@react-google-maps/api";
import { SearchContext } from "../SearchProvider";
import {
  getClusterIcon,
  getMarkerPin,
  getPosition,
  getUserIcon,
} from "../../../config/GlobalFunctions";

const GoogleMap = () => {
  const {
    locations,
    zoomLavel,
    centerCoordinates,
    updateViewportLocations,
    userCurrentLocation,
  } = React.useContext(SearchContext);
  const [map, setMap] = React.useState<google.maps.Map | null>(null);
  const [center, setCenter] = React.useState({
    lat: centerCoordinates.latitude,
    lng: centerCoordinates.longitude,
  });

  console.log('center', center)

  const showMarkersInViewport = (googleMap: google.maps.Map) => {
    if (googleMap) {
      updateViewportLocations(googleMap);
    }
  };

  const onMapLoad = (map: google.maps.Map) => {
    setMap(map);
  };

  return (
    <ReactGoogleMap
      center={center}
      zoom={zoomLavel}
      onLoad={(map: google.maps.Map) => onMapLoad(map)}
      /* options={{
        styles: mapStyle,
      }} */
      onDragEnd={() => {
        map && showMarkersInViewport(map);
      }}
      onZoomChanged={() => {
        map && showMarkersInViewport(map);
      }}
      onIdle={() => {
        map && showMarkersInViewport(map);
      }}
      mapContainerClassName="map-box-wrapper w-full h-[calc(100vh_-_28.30rem)] md:h-[calc(100vh_-_12.313rem)] lg:h-[calc(100vh_-_13.125rem)] top-0 order-1 lg:order-none z-[1]"
    >
      <MarkerClusterer
        styles={[{ url: getClusterIcon(), height: 35, width: 35 }]}
        zoomOnClick
      >
        {(clusterer: any) =>
          locations.map((location: { id: React.Key | null | undefined }) => {
            const position = getPosition(location);
            return (
              <Marker
                clusterer={clusterer}
                key={location.id}
                position={position}
                icon={getMarkerPin(location).url}
                onClick={() => {
                  map?.setCenter(position);
                }}
              />
            );
          })
        }
      </MarkerClusterer>
      {userCurrentLocation &&
      userCurrentLocation.latitude &&
      userCurrentLocation.longitude ? (
        <Marker
          icon={getUserIcon()}
          position={{
            lat: userCurrentLocation.latitude,
            lng: userCurrentLocation.longitude,
          }}
        />
      ) : (
        <Marker icon={getUserIcon()} position={center} />
      )}
    </ReactGoogleMap>
  );
};

export default GoogleMap;
