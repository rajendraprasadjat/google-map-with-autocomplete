import { Address, Link } from "@yext/pages/components";
import * as React from "react";
import { TemplateMeta } from "../../types";
import { NearByLocationResult } from "../../types/Locator";
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";
// Import Swiper styles
import "swiper/css";
import { getRecursiveData } from "../../config/GlobalFunctions";

type NearByprops = {
  locations: NearByLocationResult[];
  meta: TemplateMeta;
};

const NearByLocation = ({ locations, meta }: NearByprops) => {
  return (
    <div className="nearby-locations">
      <div className="container">
        <h3 className="nearby-locations-title">Nearby Locations</h3>
        <Swiper spaceBetween={50} slidesPerView={3}>
          {locations.map((location) => {
            const { data } = location;
            const url = getRecursiveData(data, meta);
            return (
              <SwiperSlide key={data.id}>
                <div className="location-card">
                  <div className="icon-row">
                    <div className="icon addressIcon"></div>
                    <Link className="location-name" href={`${url}`}>
                      {data.name}
                    </Link>
                    <Address address={data.address} />
                  </div>

                  <div className="button-bx-detail">
                    <Link className="button link" href={`${url}`}>
                      View Details
                    </Link>
                    {/* <Link
                  data-ya-track="getdirections"
                  eventName={`getdirections`}
                  target="_blank"
                  className="direction button before-icon"
                  href={getDirectionUrl(location)}
                  rel="noopener noreferrer"
                >
                  Get Direction
                </Link> */}
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
