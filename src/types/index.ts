import { Hours } from "@yext/search-headless-react";
import { DirectoryParent } from "./DirectoryParent";
import { Coordinate } from "../components/google-map/SearchProvider";
import { AddressType } from "@yext/pages/components";

export type MapTypes = "google" | "mapbox";
export type AutocompleteTypes = "google" | "mapbox" | "yext";
export interface SiteData {
  id: string;
  slug: string;
  name: string;
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
}

export interface StateDocument {
  name: string;
  slug: string;
  meta: EntityMeta;
  _site: SiteData;
}

export interface CityDocument {
  name: string;
  slug: string;
  meta: EntityMeta;
  _site: SiteData;
}

export interface LocationDocument {
  meta: EntityMeta;
  _site: SiteData;
  id: string;
  name: string;
  slug: string;
  address: AddressType;
  hours: Hours;
  yextDisplayCoordinate: Coordinate;
  googlePlaceId: string;
  dm_directoryParents: DirectoryParent[];
}
