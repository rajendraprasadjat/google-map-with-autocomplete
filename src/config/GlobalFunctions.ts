import defaultMarker from "../assets/images/default-marker.png";
import userMarker from "../assets/images/user-marker.png";
import cluster from "../assets/images/cluster.png";

export function slugify(slugString: string) {
  slugString.toLowerCase().toString();
  slugString = slugString.replace(/[&/\\#^+()$~%.'":*?<>{}!@]/, "");
  slugString = slugString.replaceAll("  ", "-");
  slugString = slugString.replaceAll(" ", "-");
  slugString = slugString.replaceAll("---", "-");
  slugString = slugString.replaceAll("--", "-");
  slugString = slugString.replaceAll("'", "");
  return slugString.toLowerCase();
}

export const getPosition = (result: any) => {
  const lat = (result.rawData as any).yextDisplayCoordinate.latitude;
  const lng = (result.rawData as any).yextDisplayCoordinate.longitude;
  return { lat, lng };
};

export const getDirectionUrl = (location: any) => {
  let userLocation: any = false;
  let address_string = "";
  if (location.address.line1) address_string += location.address.line1 + ",";
  if (location.address.line2) address_string += location.address.line2 + ",";
  if (location.address.city) address_string += location.address.city + ",";
  if (location.address.region) address_string += location.address.region + ",";
  if (location.address.postalCode)
    address_string += location.address.postalCode + ",";
  address_string += regionNames.of(location.address.countryCode);
  address_string = address_string.replace("undefined,", "");

  const googlePlaceId = location.googlePlaceId ? location.googlePlaceId : false;

  let origin: any = null;
  if (location.address.city) {
    origin = location.address.city;
  } else if (location.address.region) {
    origin = location.address.region;
  } else {
    origin = location.address.country;
  }
  let directionUrl =
    `https://www.google.com/maps/dir/?api=1&destination=` +
    encodeURIComponent(address_string);
  if (googlePlaceId) directionUrl += `&destination_place_id=${googlePlaceId}`;

  if (userLocation) {
    const currentLatitude = userLocation.coords.latitude;
    const currentLongitude = userLocation.coords.longitude;
    directionUrl += `&origin=${currentLatitude},${currentLongitude}`;
    window.open(directionUrl, "_blank");
  } else if (navigator.geolocation) {
    const error = () => {
      directionUrl += `&origin=` + encodeURIComponent(origin);
      window.open(directionUrl, "_blank");
    };
    navigator.geolocation.getCurrentPosition(
      function (position) {
        userLocation = position;
        const currentLatitude = position.coords.latitude;
        const currentLongitude = position.coords.longitude;
        directionUrl += `&origin=${currentLatitude},${currentLongitude}`;
        window.open(directionUrl, "_blank");
      },
      error,
      {
        timeout: 10000,
      }
    );
  } else {
    directionUrl += `&origin=` + encodeURIComponent(origin);
    window.open(directionUrl, "_blank");
  }
};

export const getClusterIcon = () => {
  return cluster;
};

export const getUserIcon = () => {
  return userMarker;
};

export const getMarkerPin = (result: any) => {
  const m_icon = {
    url: defaultMarker,
    id: result.id,
  };
  return m_icon;
};
