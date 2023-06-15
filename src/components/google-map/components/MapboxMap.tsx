import { useRef, useEffect, useContext } from "react";
import Map, { LayerProps, MapRef, Marker, Popup } from "react-map-gl";
import { LngLatBounds } from "mapbox-gl";
import * as React from "react";
import { SearchContext } from "../SearchProvider";
import { LocationResult } from "../../../types/Locator";
import { getMarkerPin, getPosition } from "../../../config/GlobalFunctions";
import { Address } from "@yext/pages/components";
import { SiteData, TemplateMeta } from "../../../types";
import "mapbox-gl/dist/mapbox-gl.css";
import { InfowindowProps } from "../../locator/Infowindow";

interface MapboxMapProps {
  mapboxAccessToken: string;
  InfowindowComponent: React.FC<InfowindowProps>;
  _site: SiteData;
  meta: TemplateMeta;
}

export function MapboxMap({ mapboxAccessToken, InfowindowComponent, _site, meta }: MapboxMapProps) {
  const map = useRef<MapRef | null>(null);
  const { locations, infoWindowContent, setZoomLavel, setMapCenter, setInfoWindowContent, centerCoordinates, zoomLavel, mapCenter } =
    useContext(SearchContext);

  const fitBoundMap = () => {
    if (locations?.length > 0 && map.current) {
      const mapbox = map.current;
      const bounds = new LngLatBounds();
      locations.forEach((result: LocationResult) => {
        const markerLocation = getPosition(result);
        if (markerLocation) {
          const { lat, lng } = markerLocation;
          if (lat && lng) {
            bounds.extend([lng, lat]);
          }
        }
      });
      if (!bounds.isEmpty()) {
        mapbox.fitBounds(bounds, {
          padding: { top: 50, bottom: 50, left: 50, right: 50 },
          maxZoom: 14,
        });
      }
    }
  };

  useEffect(() => {
    fitBoundMap();
  }, [locations]);

  return (
    <Map
      ref={map}
      initialViewState={{
        longitude: -101.299591,
        latitude: 47.116386,
        zoom: 6,
      }}
      mapStyle="mapbox://styles/mapbox/streets-v9"
      mapboxAccessToken={mapboxAccessToken}
    >
      {infoWindowContent && (
        <Popup
          latitude={getPosition(infoWindowContent).lat}
          longitude={getPosition(infoWindowContent).lng}
          closeOnMove={false}
          anchor={"bottom"}
          closeOnClick={false}
          onClose={() => {
            setInfoWindowContent(null);
            if (zoomLavel === 4) {
              fitBoundMap();
            } else {
              map.current?.setZoom(zoomLavel);
            }
            if (mapCenter) {
              map.current?.setCenter(mapCenter);
            } else {
              fitBoundMap();
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
        </Popup>
      )}
      {locations.map((location: LocationResult, index: number) => {
        const markerLocation = getPosition(location);
        const { lat, lng } = markerLocation;
        const isActive = infoWindowContent && infoWindowContent.id === location.rawData.id;
        const markerStyle = isActive ? { zIndex: 999999 } : {};
        return (
          <Marker key={`${location.rawData.id}-${index}`} longitude={lng} latitude={lat} anchor="bottom" style={markerStyle}>
            <button
              className={`${isActive ? "is-selected" : ""}`}
              id={`marker-${location.rawData.id}-${index}`}
              onClick={() => {
                const currentZoom = map.current?.getZoom() || 4;
                const latitude = map.current?.getCenter().lat;
                const longitude = map.current?.getCenter().lng;
                let currentCenter = {
                  lat: centerCoordinates.latitude,
                  lng: centerCoordinates.longitude,
                };
                if (latitude && longitude) {
                  currentCenter = {
                    lat: latitude,
                    lng: longitude,
                  };
                }

                setZoomLavel(currentZoom);
                setMapCenter(currentCenter);
                map.current?.setCenter({ lat, lng });
                map.current?.setZoom(14);
                setInfoWindowContent(location);
              }}
              // onMouseOver={() => handleMouseOver(location.rawData.id)}
              // onMouseOut={handleMouseOut}
            >
              <img
                alt=""
                id={"marker-img-" + index}
                className=""
                style={{ width: 20 }}
                src={isActive ? getMarkerPin(location).url : getMarkerPin(location).url}
              />
            </button>
          </Marker>
        );
      })}
    </Map>
  );
}

export const clusterLayer: LayerProps = {
  id: "clusters",
  type: "circle",
  source: "earthquakes",
  filter: ["has", "point_count"],
  paint: {
    "circle-color": ["step", ["get", "point_count"], "#51bbd6", 100, "#f1f075", 750, "#f28cb1"],
    "circle-radius": ["step", ["get", "point_count"], 20, 100, 30, 750, 40],
  },
};

export const clusterCountLayer: LayerProps = {
  id: "cluster-count",
  type: "symbol",
  source: "earthquakes",
  filter: ["has", "point_count"],
  layout: {
    "text-field": "{point_count_abbreviated}",
    "text-font": ["DIN Offc Pro Medium", "Arial Unicode MS Bold"],
    "text-size": 12,
  },
};

export const unclusteredPointLayer: LayerProps = {
  id: "unclustered-point",
  type: "circle",
  source: "earthquakes",
  filter: ["!", ["has", "point_count"]],
  paint: {
    "circle-color": "#11b4da",
    "circle-radius": 4,
    "circle-stroke-width": 1,
    "circle-stroke-color": "#fff",
  },
};
