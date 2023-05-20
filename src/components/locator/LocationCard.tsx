import * as React from "react";

type LocationCardProps = {
  location: any;
};

const LocationCard = ({ location }: LocationCardProps) => {
  return <div>{location.rawData.name}</div>;
};

export default LocationCard;
