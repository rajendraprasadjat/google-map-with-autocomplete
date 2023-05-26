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
  console.log("locations", locations);
  return (
    <div className="nearby-locations">
      <h3 className="nearby-locations-title">Nearby Locations</h3>
      <Swiper
        spaceBetween={50}
        slidesPerView={5}
        onSlideChange={() => console.log("slide change")}
        onSwiper={(swiper) => console.log(swiper)}
      >
        {locations.map((location) => {
          const { data } = location;
          const url = getRecursiveData(data, meta);
          return (
            <SwiperSlide key={data.id}>
              <div className="location near-location">
                <div className="miles-with-title">
                  <h3 className="">
                    <Link href={`${url}`}>{data.name}</Link>
                  </h3>
                </div>

                <Address address={data.address} />
                <div className="buttons">
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
  );
};
export default NearByLocation;
