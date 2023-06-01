import * as React from "react";
import { Address, Link } from "@yext/pages/components";
import { LocationDocument, SiteData } from "../../types";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import { Hours } from "../common/Hours/Hours";
import HolidayHour from "./HolidayHour";
import OpenCloseStatus from "../common/OpenCloseStatus";
import { getDirectionUrl } from "../../config/GlobalFunctions";

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
              <Link
                className="button link"
                href={getDirectionUrl(document.address, document.googlePlaceId)}
              >
                Get Direction
              </Link>
            </div>
          </div>

          {document.hours && (
            <div className="box timing">
              <div className="inner-box">
                <OpenCloseStatus
                  hours={document.hours}
                  site={_site}
                  timezone={YEXT_PUBLIC_TIME_ZONE}
                />

                {document.hours.holidayHours && (
                  <div className="holiday-hours">
                    <HolidayHour
                      hours={document.hours.holidayHours}
                      site={_site}
                    />
                  </div>
                )}
                <div className="daylist">
                  <Hours
                    hours={document.hours}
                    showHeader={true}
                    startOfWeek="today"
                    message={document.additionalHoursText}
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
