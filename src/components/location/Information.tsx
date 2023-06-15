import * as React from "react";
import { Address, Link, getDirections } from "@yext/pages/components";
import { LocationDocument, SiteData } from "../../types";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import { Hours } from "../common/Hours/Hours";
import HolidayHour from "./HolidayHour";
import OpenCloseStatus from "../common/OpenCloseStatus";
import { getDirectionUrl, getMarkerPin } from "../../config/GlobalFunctions";
import { LocationResult } from "../../types/Locator";

type InformationProps = {
  document: LocationDocument;
  _site: SiteData;
  nearByLocations: any;
};

const Information = ({
  document,
  _site,
  nearByLocations,
}: InformationProps) => {
  const getPosition = (location: LocationDocument) => {
    const lat = location.yextDisplayCoordinate.latitude;
    const lng = location.yextDisplayCoordinate.longitude;
    return { lat, lng };
  };
  const coordinates = getPosition(document);
  console.log("document", document);
  return (
    <div className="location-information">
      <div className="container">
        <div className="address-main-sec">
          <div className="icon-row">
            <div className="icon addressIcon"></div>
            <h4 className="location-name">{document?.name}</h4>
            <Address address={document.address} />
          </div>
          {document.hours && (
            <div className="icon-row">
              <div className="icon clockIcon"></div>
              <OpenCloseStatus
                hours={document.hours}
                site={_site}
                timezone={document.timezone}
              />
            </div>
          )}
          <div className="button-bx-detail">
            <Link
              className="button link"
              href={getDirectionUrl(document.address, document.googlePlaceId)}
            >
              Get Direction
            </Link>
          </div>
        </div>
        <div className="hours-sec">
          {document.hours && (
            <div className="box timing">
              <div className="inner-box">
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
                    locale={_site.meta.locale}
                    timeZone={document.timezone}
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="map-sec">
          <LoadScript googleMapsApiKey={YEXT_PUBLIC_GOOGLE_API_KEY}>
            <GoogleMap center={coordinates} zoom={12}>
              <Marker position={coordinates} clickable={false} />
              {nearByLocations.map((location: any) => {
                return (
                  <Marker
                    key={location.id}
                    position={getPosition(location)}
                    clickable={false}
                    icon={getMarkerPin(location)}
                  />
                );
              })}
            </GoogleMap>
          </LoadScript>
        </div>
      </div>
    </div>
  );
};
export default Information;
