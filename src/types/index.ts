import { Hours } from "@yext/search-headless-react";
import { DirectoryParent } from "./DirectoryParent";
import { Coordinate } from "../components/google-map/SearchProvider";
import { AddressType } from "@yext/pages/components";
import { DirectoryChild } from "./DirectoryChild";
import { E164Number } from "libphonenumber-js/types";

export type MapTypes = "google" | "mapbox";
export type AutocompleteTypes = "google" | "mapbox" | "yext";
export interface SiteData {
  id: string;
  slug: string;
  name: string;
  meta: EntityMeta;
}

export interface TemplateMeta {
  mode: "development" | "production";
}

export interface EntityType {
  id: string;
}
export interface EntityMeta {
  id: string;
  entityType: EntityType;
  locale: string;
}

export interface CountryDocument {
  name: string;
  slug: string;
  meta: EntityMeta;
  _site: SiteData;
  dm_directoryChildren: DirectoryChild[];
  dm_directoryParents: DirectoryParent[];
}

export interface StateDocument {
  name: string;
  slug: string;
  meta: EntityMeta;
  _site: SiteData;
  dm_directoryChildren: DirectoryChild[];
  dm_directoryParents: DirectoryParent[];
}

export interface CityDocument {
  name: string;
  slug: string;
  meta: EntityMeta;
  _site: SiteData;
  dm_directoryChildren: LocationDocument[];
  dm_directoryParents: DirectoryParent[];
}

export interface LocationDocument {
  meta: EntityMeta;
  _site: SiteData;
  id: string;
  name: string;
  slug: string;
  address: AddressType;
  hours: Hours;
  timezone: string;
  additionalHoursText: string;
  yextDisplayCoordinate: Coordinate;
  googlePlaceId: string;
  mainPhone: E164Number;
  dm_directoryParents: DirectoryParent[];
}
