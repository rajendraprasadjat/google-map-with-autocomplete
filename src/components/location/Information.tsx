import * as React from "react";
import { Address } from "@yext/pages/components";
import { LocationDocument, SiteData } from "../../types";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import { Hours } from "../common/Hours/Hours";
import HolidayHour from "./HolidayHour";
import OpenCloseStatus from "../common/OpenCloseStatus";

type InformationProps = {
  document: LocationDocument;
  _site: SiteData;
};

const Information = ({ document, _site }: InformationProps) => {
  const getPosition = (location: LocationDocument) => {
    const lat = location.yextDisplayCoordinate.latitude;
    const lng = location.yextDisplayCoordinate.longitude;
    return { lat, lng };
  };
  console.log("location.hours", document.hours);
  const coordinates = getPosition(document);
  return (
    <div className="location-detail-sec">
      <div className="container-lg">
        <div className="boxes">
          <div className="box store-info">
            <div className="inner-box">
              <h4 className="box-title">{document?.name}</h4>
              <div className="address-innerbx">
                <div className="address-left">
                  <Address address={document.address} />
                </div>
              </div>
            </div>
          </div>

          {document.hours && (
            <div className="box timing">
              <div className="inner-box">
                <div className="open-close">
                  <OpenCloseStatus
                    hours={document.hours}
                    site={_site}
                    timezone={YEXT_PUBLIC_TIME_ZONE}
                  />
                </div>
                <div className="holiday-hours">
                  <HolidayHour
                    hours={document.hours.holidayHours}
                    site={_site}
                  />
                </div>
                <div className="daylist">
                  <Hours
                    hours={document.hours}
                    showHeader={true}
                    startOfWeek="today"
                  />
                </div>
              </div>
            </div>
          )}

          <div className="box map-info without-hours">
            <div className="inner-box">
              <LoadScript googleMapsApiKey={YEXT_PUBLIC_GOOGLE_API_KEY}>
                <GoogleMap center={coordinates} zoom={12}>
                  <Marker position={coordinates} clickable={false} />
                </GoogleMap>
              </LoadScript>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Information;
