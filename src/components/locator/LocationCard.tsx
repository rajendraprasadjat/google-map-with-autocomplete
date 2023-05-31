import * as React from "react";
import { SearchContext } from "../google-map/SearchProvider";
import { Address, Link } from "@yext/pages/components";
import { LocationResult } from "../../types/Locator";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

type LocationCardProps = {
  location: LocationResult;
};

const LocationCard = ({ location }: LocationCardProps) => {
  const {
    setInfoWindowContent,
    infoWindowContent,
    setHoveredLocation,
    hoveredLocation,
  } = React.useContext(SearchContext);
  const cardRef = React.useRef<HTMLDivElement>(null);
  console.log("location.rawData", location.rawData);
  const url = location.rawData.slug;

  React.useEffect(() => {
    if (infoWindowContent && cardRef.current) {
      cardRef.current.scrollIntoView({ block: "center", behavior: "smooth" });
    }
  }, [infoWindowContent]);
  return (
    <div
      ref={cardRef}
      className={`location-card ${
        hoveredLocation === location.id ||
        (infoWindowContent && infoWindowContent.id === location.id)
          ? "active"
          : ""
      }`}
      onClick={() => {
        setInfoWindowContent(location);
      }}
      onMouseOver={() => setHoveredLocation(location.id)}
      onMouseOut={() => {
        if (hoveredLocation === location.id) {
          setHoveredLocation(null);
        }
      }}
    >
      <Link className="location-name" href={`/${url}`}>
        {location.rawData.name}
      </Link>
      <Address
        className="location-address"
        address={location.rawData.address}
      />

      <Link className="button link" href={`/${url}`}>
        View Details
      </Link>
    </div>
  );
};

export const LocationCardLoader = () => {
  return (
    <div className="location-card">
      <Skeleton height={25} enableAnimation />
      <Skeleton count={3} width={"50%"} enableAnimation />

      <Skeleton
        enableAnimation
        width={140}
        height={40}
        style={{ paddingTop: 20, borderRadius: 0 }}
      />
    </div>
  );
};

export default LocationCard;
