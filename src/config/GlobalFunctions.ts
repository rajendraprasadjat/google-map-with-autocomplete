import defaultMarker from "../assets/images/default-marker.png";
import hoverMarker from "../assets/images/hover-marker.png";
import userMarker from "../assets/images/user-marker.png";
import cluster from "../assets/images/cluster.png";
import { LocationResult } from "../types/Locator";
import { TemplateMeta } from "../types";
import { BreadcrumbItem } from "../components/common/Breadcrumbs";
type LinkParams = {
  link: string;
  mode?: string;
  template?: string;
  locale?: string;
  devLink?: string;
};
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

export const getLink = ({
  link,
  mode,
  template,
  locale,
  devLink,
}: LinkParams) => {
  let url = link;

  if (mode === "development" && template) {
    url = `/${template}`;
    devLink && (url += `/${devLink}`);
    locale && (url += `?locale=${locale}`);
  }
  return url;
};

export const getRecursiveData = <DataType>(
  element: DataType,
  meta: TemplateMeta,
  skip = 0
) => {
  let slug = "";
  if (meta.mode === "development") {
    slug = element.slug;
  } else {
    if (element.dm_directoryParents) {
      element.dm_directoryParents.forEach((e: DataType, index: number) => {
        if (index >= skip) {
          slug += `/${e.slug}`;
        }
      });
    }
    slug += `/${element.slug}`;
  }
  return slug;
};

export const getBreadcrumb = <DataType, Document>(
  data: DataType[],
  document: Document,
  meta: TemplateMeta,
  isRecursive = true,
  skip = 0,
  basePrefix = "",
  baseName = ""
) => {
  const breadcrumbs: BreadcrumbItem[] = [];

  if (isRecursive) {
    data.forEach((element: DataType, index: number) => {
      if (index >= skip && index !== 0) {
        const slug = getRecursiveData<DataType>(element, meta, skip);
        breadcrumbs.push({
          slug: slug,
          name: element.name,
        });
      } else if (index === 0) {
        breadcrumbs.push({
          slug: basePrefix,
          name: baseName ? baseName : element.name,
        });
      }
    });

    breadcrumbs.push({
      slug: getRecursiveData(document, meta),
      name: document.name,
    });
  } else {
    let slug = "";
    data.forEach((element: DataType, index: number) => {
      if (element.slug && index >= skip) {
        slug += `/${element.slug}`;
        breadcrumbs.push({
          slug: slug,
          name: element.name,
        });
      } else if (index === 0) {
        breadcrumbs.push({
          slug: basePrefix,
          name: baseName ? baseName : element.name,
        });
      }
    });

    breadcrumbs.push({
      slug: slug + `/${document.slug}`,
      name: document.name,
    });
  }

  return breadcrumbs;
};

export const getPosition = (result: LocationResult) => {
  const lat = result.rawData.yextDisplayCoordinate.latitude;
  const lng = result.rawData.yextDisplayCoordinate.longitude;
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

export const getMarkerPin = (
  result: any,
  isActive = false,
  isHover = false
) => {
  let marker = defaultMarker;
  if (isHover) {
    marker = hoverMarker;
  } else if (isActive) {
    marker = hoverMarker;
  }
  const m_icon = {
    url: marker,
    id: result.id,
  };
  return m_icon;
};
