import * as React from "react";
import { Address } from "@yext/pages/components";
import { LocationDocument } from "../../types";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import { Hours } from "../common/Hours/Hours";

type InformationProps = {
  document: LocationDocument;
};

const Information = (props: InformationProps) => {
  const location = props.document;
  console.log("location", location);
  const getPosition = (location: LocationDocument) => {
    const lat = location.yextDisplayCoordinate.latitude;
    const lng = location.yextDisplayCoordinate.longitude;
    return { lat, lng };
  };
  console.log("location.hours", location.hours);
  const coordinates = getPosition(location);
  return (
    <div className="location-detail-sec">
      <div className="container-lg">
        <div className="boxes">
          <div className="box store-info">
            <div className="inner-box">
              <h4 className="box-title">{location?.name}</h4>
              <div className="address-innerbx">
                <div className="address-left">
                  <Address address={location.address} />
                </div>
              </div>
            </div>
          </div>

          {location.hours && (
            <div className="box timing">
              <div className="inner-box">
                <h4 className="box-title">{location?.name}</h4>
                <div className="daylist">
                  <Hours
                    hours={location.hours}
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
