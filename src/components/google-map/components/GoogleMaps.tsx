import * as React from "react";

import {
  GoogleMap as ReactGoogleMap,
  Marker,
  MarkerClusterer,
  InfoWindow,
} from "@react-google-maps/api";
import { SearchContext } from "../SearchProvider";
import {
  getClusterIcon,
  getMarkerPin,
  getPosition,
  getUserIcon,
} from "../../../config/GlobalFunctions";
import { Address, Link } from "@yext/pages/components";

const GoogleMap = ({ Infowindow }) => {
  const {
    locations,
    zoomLavel,
    setZoomLavel,
    centerCoordinates,
    userLocation,
    infoWindowContent,
    setInfoWindowContent,
    mapCenter,
    setMapCenter,
  } = React.useContext(SearchContext);
  const [map, setMap] = React.useState<google.maps.Map | null>(null);
  const [center] = React.useState({
    lat: centerCoordinates.latitude,
    lng: centerCoordinates.longitude,
  });

  console.log("center", center);

  const showMarkersInViewport = (googleMap: google.maps.Map) => {
    if (googleMap) {
      //updateViewportLocations(googleMap);
    }
  };

  const onMapLoad = (map: google.maps.Map) => {
    setMap(map);
  };

  const fitBoundMap = () => {
    if (locations.length > 0) {
      const bounds = new google.maps.LatLngBounds();

      locations.map((e: any) => {
        const position = getPosition(e);
        bounds.extend(position);
      });
      map?.fitBounds(bounds);
    } else {
      map?.setCenter({
        lat: centerCoordinates.latitude,
        lng: centerCoordinates.longitude,
      });
      map?.setZoom(4);
    }
  };

  React.useEffect(() => {
    fitBoundMap();
  }, [locations]);

  React.useEffect(() => {
    if (infoWindowContent) {
      map?.setCenter(getPosition(infoWindowContent));
      map?.setZoom(16);
    }
  }, [infoWindowContent]);

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
      mapContainerClassName="map-box-wrapper"
    >
      {infoWindowContent && (
        <InfoWindow
          position={getPosition(infoWindowContent)}
          onCloseClick={() => {
            setInfoWindowContent(null);
            if (zoomLavel === 4) {
              fitBoundMap();
            } else {
              map?.setZoom(zoomLavel);
            }
            if (mapCenter) {
              map?.setCenter(mapCenter);
            } else {
              fitBoundMap();
            }
          }}
        >
          {Infowindow ? (
            <Infowindow location={infoWindowContent} />
          ) : (
            <div className="infowindow-content">
              <Link
                className="location-name"
                href={`/${infoWindowContent.rawData.slug}`}
              >
                {infoWindowContent.rawData.name}
              </Link>
              <Address
                className="location-address"
                address={infoWindowContent.rawData.address}
              />
              <Link
                className="button link"
                href={`/${infoWindowContent.rawData.slug}`}
              >
                View Details
              </Link>
            </div>
          )}
        </InfoWindow>
      )}
      <MarkerClusterer
        styles={[{ url: getClusterIcon(), height: 35, width: 35 }]}
        // zoomOnClick
        maxZoom={16}
        ignoreHidden={true}
      >
        {(clusterer) =>
          locations.map((location) => {
            const position = getPosition(location);
            return (
              <Marker
                clusterer={clusterer}
                key={location.id}
                position={position}
                icon={getMarkerPin(location).url}
                onClick={() => {
                  const currentZoom = map?.getZoom() || 4;
                  const currentCenter = map?.getCenter()?.toJSON() || {
                    lat: centerCoordinates.latitude,
                    lng: centerCoordinates.longitude,
                  };
                  setZoomLavel(currentZoom);
                  setMapCenter(currentCenter);
                  map?.setCenter(position);
                  setInfoWindowContent(location);
                }}
              />
            );
          })
        }
      </MarkerClusterer>
      {userLocation && userLocation.latitude && userLocation.longitude ? (
        <Marker
          icon={getUserIcon()}
          position={{
            lat: userLocation.latitude,
            lng: userLocation.longitude,
          }}
        />
      ) : (
        <Marker icon={getUserIcon()} position={center} />
      )}
    </ReactGoogleMap>
  );
};

export default GoogleMap;
