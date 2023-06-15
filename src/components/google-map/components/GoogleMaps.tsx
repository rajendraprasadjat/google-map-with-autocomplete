import * as React from "react";

import { GoogleMap as ReactGoogleMap, Marker, MarkerClusterer, InfoWindow } from "@react-google-maps/api";
import { SearchContext } from "../SearchProvider";
import { getClusterIcon, getMarkerPin, getPosition, getUserIcon } from "../../../config/GlobalFunctions";
import { Address } from "@yext/pages/components";
import { SiteData, TemplateMeta } from "../../../types";
import { LocationResult } from "../../../types/Locator";
import { InfowindowProps } from "../../locator/Infowindow";
interface GoogleMapProps {
  InfowindowComponent: React.FC<InfowindowProps>;
  _site: SiteData;
  meta: TemplateMeta;
}

const GoogleMap = ({ InfowindowComponent, _site, meta }: GoogleMapProps) => {
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
    isUpdateListAccordingMarkers,
    updateViewportLocations,
    setHoveredLocation,
    hoveredLocation,
  } = React.useContext(SearchContext);
  const [map, setMap] = React.useState<google.maps.Map | null>(null);
  const [center] = React.useState({
    lat: centerCoordinates.latitude,
    lng: centerCoordinates.longitude,
  });

  const showMarkersInViewport = (googleMap: google.maps.Map) => {
    if (googleMap && isUpdateListAccordingMarkers) {
      updateViewportLocations(googleMap);
    }
  };

  const onMapLoad = (map: google.maps.Map) => {
    setMap(map);
  };

  const fitBoundMap = (force = false) => {
    if (!infoWindowContent || force) {
      if (locations.length > 0) {
        const bounds = new google.maps.LatLngBounds();
        if (userLocation && userLocation.latitude && userLocation.longitude) {
          bounds.extend({
            lat: userLocation.latitude,
            lng: userLocation.longitude,
          });
        } else {
          bounds.extend(center);
        }
        locations.map((e: LocationResult) => {
          const position = getPosition(e);
          bounds.extend(position);
        });
        map?.fitBounds(bounds);
      } else {
        if (userLocation && userLocation.latitude && userLocation.longitude) {
          map?.setCenter({
            lat: userLocation.latitude,
            lng: userLocation.longitude,
          });
        } else {
          map?.setCenter({
            lat: centerCoordinates.latitude,
            lng: centerCoordinates.longitude,
          });
        }
        map?.setCenter({
          lat: centerCoordinates.latitude,
          lng: centerCoordinates.longitude,
        });
        map?.setZoom(4);
      }
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
      <MarkerClusterer styles={[{ url: getClusterIcon(), height: 35, width: 35 }]} zoomOnClick averageCenter>
        {(clusterer) => {
          return (
            <>
              {locations.map((location) => {
                const position = getPosition(location);
                let icon = getMarkerPin(location).url;

                if (hoveredLocation === location.id) {
                  icon = getMarkerPin(location, false, true).url;
                } else if (infoWindowContent && infoWindowContent.id === location.id) {
                  icon = getMarkerPin(location, true).url;
                }
                return (
                  <Marker
                    clusterer={clusterer}
                    key={location.id}
                    position={position}
                    icon={icon}
                    onClick={() => {
                      if (!infoWindowContent) {
                        const currentZoom = map?.getZoom() || 4;
                        const currentCenter = map?.getCenter()?.toJSON() || {
                          lat: centerCoordinates.latitude,
                          lng: centerCoordinates.longitude,
                        };
                        setZoomLavel(currentZoom);
                        setMapCenter(currentCenter);
                      }
                      map?.setCenter(position);
                      setInfoWindowContent(location);
                    }}
                    onMouseOver={() => setHoveredLocation(location.id)}
                    onMouseOut={() => {
                      if (hoveredLocation === location.id) {
                        setHoveredLocation(null);
                      }
                    }}
                  >
                    {infoWindowContent && infoWindowContent.id === location.id && (
                      <InfoWindow
                        position={getPosition(infoWindowContent)}
                        onCloseClick={() => {
                          setInfoWindowContent(null);
                          if (zoomLavel === 4) {
                            fitBoundMap(true);
                          } else {
                            map?.setZoom(zoomLavel);
                          }
                          if (mapCenter) {
                            map?.setCenter(mapCenter);
                          } else {
                            fitBoundMap(true);
                          }
                        }}
                      >
                        {InfowindowComponent ? (
                          <InfowindowComponent meta={meta} location={infoWindowContent} _site={_site} />
                        ) : (
                          <div className="infowindow-content">
                            <a className="location-name" href={`/${infoWindowContent.rawData.slug}`}>
                              {infoWindowContent.rawData.name}
                            </a>
                            <Address className="location-address" address={infoWindowContent.rawData.address} />
                            <a className="button link" href={`/${infoWindowContent.rawData.slug}`}>
                              View Details
                            </a>
                          </div>
                        )}
                      </InfoWindow>
                    )}
                  </Marker>
                );
              })}
            </>
          );
        }}
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
