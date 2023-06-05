import defaultMarker from "../assets/images/default-marker.png";
import hoverMarker from "../assets/images/hover-marker.png";
import userMarker from "../assets/images/user-marker.png";
import cluster from "../assets/images/cluster.png";
import { LocationResult } from "../types/Locator";
import { TemplateMeta } from "../types";
import { BreadcrumbItem } from "../components/common/Breadcrumbs";
import { AddressType } from "@yext/pages/components";
import { Coordinate } from "../components/google-map/SearchProvider";
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

export const getDirectionUrl = (
  address: AddressType,
  googlePlaceId = "",
  userLocation: null | Coordinate = null
) => {
  let address_string = "";
  if (address.line1) {
    address_string += address.line1 + ",";
  }
  if (address.line2) {
    address_string += address.line2 + ",";
  }
  if (address.city) {
    address_string += address.city + ",";
  }
  if (address.region) {
    address_string += address.region + ",";
  }
  if (address.postalCode) {
    address_string += address.postalCode + ",";
  }
  address_string += address.countryCode;
  address_string = address_string.replace("undefined,", "");

  let directionUrl =
    `https://www.google.com/maps/dir/?api=1&destination=` +
    encodeURIComponent(address_string);

  if (googlePlaceId) {
    directionUrl += `&destination_place_id=${googlePlaceId}`;
  }

  if (userLocation && userLocation.latitude && userLocation.longitude) {
    directionUrl += `&origin=${userLocation.latitude},${userLocation.longitude}`;
  }
  return directionUrl;
};

export const getClusterIcon = () => {
  return cluster;
};

export const getUserIcon = () => {
  return userMarker;
};

export const getMarkerPin = (
  result: LocationResult,
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

export const getOgTags = (
  title: string,
  description: string,
  url: string,
  image: string
) => {
  return [
    {
      type: "meta",
      attributes: {
        property: "og:title",
        content: title,
      },
    },
    {
      type: "meta",
      attributes: {
        property: "og:description",
        content: description,
      },
    },
    {
      type: "meta",
      attributes: {
        property: "og:url",
        content: url,
      },
    },

    {
      type: "meta",
      attributes: {
        property: "og:image",
        content: image,
      },
    },
  ];
};
