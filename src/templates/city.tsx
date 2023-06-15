import * as React from "react";
import { Template, GetPath, TemplateConfig, TemplateProps, TemplateRenderProps, GetHeadConfig, HeadConfig, TransformProps } from "@yext/pages";
import favicon from "../assets/images/favicon.ico";
import { CityDocument, EntityMeta, LocationDocument, TemplateMeta } from "../types";
import PageLayout from "../components/layout/PageLayout";
import "../index.css";
import { Address, Link } from "@yext/pages/components";
import Breadcrumbs, { BreadcrumbItem } from "../components/common/Breadcrumbs";
import { DirectoryParent } from "../types/DirectoryParent";
import { getBreadcrumb, getDirectionUrl, getLink } from "../config/GlobalFunctions";

export const config: TemplateConfig = {
  stream: {
    $id: "city",
    filter: {
      entityTypes: ["ce_city"],
    },
    fields: [
      "id",
      "uid",
      "meta",
      "name",
      "slug",

      "dm_directoryParents.name",
      "dm_directoryParents.slug",
      "dm_directoryParents.dm_directoryParents.name",
      "dm_directoryParents.dm_directoryParents.slug",

      /* DM children */
      "dm_directoryChildren.name",
      "dm_directoryChildren.slug",
      "dm_directoryChildren.hours",
      "dm_directoryChildren.address",
      "dm_directoryChildren.id",
      "dm_directoryChildren.yextDisplayCoordinate",
      "dm_directoryChildren.dm_directoryParents.name",
      "dm_directoryChildren.dm_directoryParents.slug",
      "dm_directoryChildren.dm_directoryParents.dm_directoryParents.name",
      "dm_directoryChildren.dm_directoryParents.dm_directoryParents.slug",
    ],
    localization: {
      locales: ["en_GB"],
      primary: false,
    },
  },
};

export const getPath: GetPath<TemplateProps> = ({ document, __meta }) => {
  if (__meta.mode === "development") {
    return document.slug;
  } else {
    return getLink(document, __meta, true, 0, true);
  }
};

export const getHeadConfig: GetHeadConfig<TemplateRenderProps> = ({ document }): HeadConfig => {
  const metaTitle = `Dotsquares | ${document.name}`;
  return {
    title: metaTitle,
    charset: "UTF-8",
    viewport: "width=device-width, initial-scale=1.0, maximum-scale=1, minimum-scale=1, user-scalable=0",
    tags: [
      {
        type: "link",
        attributes: {
          rel: "icon",
          type: "image/png",
          href: favicon,
        },
      },

      {
        type: "meta",
        attributes: {
          name: "author",
          content: "Dotsquares",
        },
      },
      {
        type: "meta",
        attributes: {
          name: "robots",
          content: `${"noindex, nofollow"}`,
        },
      },
    ],
  };
};

type TransformData = TemplateRenderProps & {
  breadcrumbs: BreadcrumbItem[];
};

export const transformProps: TransformProps<TransformData> = async (data) => {
  const document = data.document as CityDocument;
  const directoryParents = document.dm_directoryParents || [];
  const breadcrumbs = getBreadcrumb<DirectoryParent, CityDocument>(directoryParents, document, data.__meta, true, 0, true);
  return { ...data, breadcrumbs };
};

interface CityTemplateProps extends TransformData {
  __meta: TemplateMeta;
  document: CityDocument;
}

const City: Template<CityTemplateProps> = ({ document, __meta, breadcrumbs }: CityTemplateProps) => {
  const { meta, _site, slug, dm_directoryChildren } = document;
  return (
    <div id="main">
      <PageLayout _site={_site} meta={__meta} template="country" locale={meta.locale} devLink={slug}>
        <Breadcrumbs baseUrl="" breadcrumbs={breadcrumbs} />
        <h1>City</h1>
        <h3>Locations</h3>
        <div className="city-locations">
          <div className="container">
            {dm_directoryChildren &&
              dm_directoryChildren.map((location: LocationDocument) => {
                const url = getLink<LocationDocument>(location, __meta, true, 0, true);

                return (
                  <div className="city-location" key={location.id}>
                    <div className="location-card">
                      <div className="icon-row">
                        <div className="icon addressIcon"></div>
                        <a className="location-name" href={`/${url}`}>
                          {location.name}
                        </a>
                        <Address address={location.address} />
                      </div>
                      <div className="button-bx-detail">
                        <Link className="button link" href={getDirectionUrl(location.address, location.googlePlaceId)}>
                          Get Direction
                        </Link>
                        <a className="button link" href={`/${url}`}>
                          View Details
                        </a>
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </PageLayout>
    </div>
  );
};
export default City;
