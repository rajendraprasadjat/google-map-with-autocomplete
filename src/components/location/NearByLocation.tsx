import { Address, Link } from "@yext/pages/components";
import * as React from "react";
import { TemplateMeta } from "../../types";
import { NearByLocationResult } from "../../types/Locator";
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";
// Import Swiper styles
import "swiper/css";
import { getDirectionUrl, getLink, getRecursiveData } from "../../config/GlobalFunctions";
import { Coordinate } from "../google-map/SearchProvider";
import { fetch } from "@yext/pages/util";

type NearbyAPIConfig = {
  endpoint: "https://liveapi-sandbox.yext.com/v2/accounts/me/entities/geosearch" | "https://liveapi.yext.com/v2/accounts/me/entities/geosearch";
  params: {
    api_key: string;
    entityTypes?: string;
    limit?: string;
    radius?: string;
    savedFilterIds?: string;
    v: string;
  };
};

const getConfig = (api_key: string): NearbyAPIConfig => {
  return {
    endpoint: YEXT_PUBLIC_GEO_SEARCH_END_POINT,
    params: {
      api_key,
      entityTypes: "location",
      limit: "3",
      radius: "2500",
      v: "20220927",
    },
  };
};

type NearbyProps = {
  coordinate: Coordinate;
  id: string;
  meta: TemplateMeta;
  apiKey: string;
  setNearByLocations: (value: []) => void;
};

const NearByLocation = ({ meta, coordinate, id, apiKey, setNearByLocations }: NearbyProps) => {
  const [locations, setLocations] = React.useState<NearByLocationResult[]>([]);
  React.useEffect(() => {
    if (!coordinate || !apiKey) {
      return;
    }

    const config = getConfig(apiKey);
    const searchParams = new URLSearchParams({
      ...config.params,
      location: `${coordinate.latitude},${coordinate.longitude}`,
      filter: JSON.stringify({ "meta.id": { "!$eq": `${id}` } }),
      fields: "dm_directoryParents,name,slug,address",
    });

    fetch(`${config.endpoint}?${searchParams.toString()}`)
      .then((resp) => resp.json())
      .then((data) => {
        console.log("data.response", data.response);
        setLocations(data.response.entities || []);
        setNearByLocations(data.response.entities || []);
      })
      .catch((error) => console.error(error));
  }, [coordinate, id, apiKey]);
  return (
    <div className="nearby-locations">
      <div className="container">
        <h3 className="nearby-locations-title">Nearby Locations</h3>
        <Swiper
          spaceBetween={50}
          slidesPerView={3}
          breakpoints={{
            "@0.00": {
              slidesPerView: 1,
              spaceBetween: 10,
            },
            "@1.00": {
              slidesPerView: 2,
              spaceBetween: 20,
            },
            "@1.50": {
              slidesPerView: 3,
              spaceBetween: 40,
            },
          }}
        >
          {locations.map((location) => {
            const url = getLink<NearByLocationResult>(location, meta, true, 0, true);
            return (
              <SwiperSlide key={location.id}>
                <div className="location-card">
                  <div className="icon-row">
                    <div className="icon addressIcon"></div>
                    <a className="location-name" href={`${url}`}>
                      {location.name}
                    </a>
                    <Address address={location.address} />
                  </div>

                  <div className="button-bx-detail">
                    <a className="button link" href={`${url}`}>
                      View Details
                    </a>
                    <Link
                      data-ya-track="getdirections"
                      eventName={`getdirections`}
                      target="_blank"
                      className="direction button before-icon"
                      href={getDirectionUrl(location.address, location.googlePlaceId)}
                      rel="noopener noreferrer"
                    >
                      Get Direction
                    </Link>
                  </div>
                </div>
              </SwiperSlide>
            );
          })}
        </Swiper>
        <div className="nearby-locations-actions">
          <Link href="/" className="button link">
            View More
          </Link>
        </div>
      </div>
    </div>
  );
};
export default NearByLocation;
