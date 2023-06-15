import * as React from "react";
import { Template, GetPath, TemplateConfig, TemplateProps, TemplateRenderProps, GetHeadConfig, HeadConfig, TransformProps } from "@yext/pages";
import favicon from "../assets/images/favicon.ico";
import { LocationDocument, TemplateMeta } from "../types";
import PageLayout from "../components/layout/PageLayout";
import Breadcrumbs, { BreadcrumbItem } from "../components/common/Breadcrumbs";
import { AnalyticsProvider, AnalyticsScopeProvider } from "@yext/pages/components";
import Information from "../components/location/Information";
import NearByLocation from "../components/location/NearByLocation";
import "../index.css";
import { getBreadcrumb, getBreadcrumbSchema, getLink } from "../config/GlobalFunctions";
import { NearByLocationResult } from "../types/Locator";
import { DirectoryParent } from "../types/DirectoryParent";

export const config: TemplateConfig = {
  stream: {
    $id: "location",
    filter: {
      entityTypes: ["location"],
    },
    fields: [
      "id",
      "uid",
      "meta",
      "name",
      "slug",
      "address",
      "timezone",
      "hours",
      "additionalHoursText",
      "googlePlaceId",
      "yextDisplayCoordinate",
      "dm_directoryParents.name",
      "dm_directoryParents.slug",
      "dm_directoryParents.meta.entityType",
      "dm_directoryParents.dm_directoryParents.name",
      "dm_directoryParents.dm_directoryParents.slug",
      "dm_directoryParents.dm_directoryParents.meta.entityType",
      "dm_directoryParents.dm_directoryParents.dm_directoryParents.name",
      "dm_directoryParents.dm_directoryParents.dm_directoryParents.slug",
      "dm_directoryParents.dm_directoryParents.dm_directoryParents.meta.entityType",
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
          name: "robots",
          content: "noindex,nofollow",
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
  externalApiData: NearByLocationResult[];
  breadcrumbs: BreadcrumbItem[];
};
export const transformProps: TransformProps<TransformData> = async (data) => {
  const document = data.document as LocationDocument;
  const directoryParents = document.dm_directoryParents || [];
  const breadcrumbs = getBreadcrumb<DirectoryParent, LocationDocument>(directoryParents, document, data.__meta, true, 0, true);
  return { ...data, breadcrumbs };
};

interface LocationTemplateProps extends TransformData {
  __meta: TemplateMeta;
  document: LocationDocument;
}

const Location: Template<LocationTemplateProps> = ({ document, __meta, breadcrumbs }: LocationTemplateProps) => {
  const { meta, _site, slug } = document;
  const [nearByLocations, setNearByLocations] = React.useState([]);
  console.log("getBreadcrumbSchema", getBreadcrumbSchema(breadcrumbs));
  return (
    <div id="main">
      <AnalyticsProvider
        templateData={{ document, __meta }}
        enableDebugging={YEXT_PUBLIC_ANALYTICS_ENABLE_DEBUGGING}
        enableTrackingCookie={YEXT_PUBLIC_ANALYTICS_ENABLE_TRACKING_COOKIE}
      >
        <AnalyticsScopeProvider name={document.name}>
          <PageLayout _site={_site} meta={__meta} template="country" locale={meta.locale} devLink={slug}>
            <Breadcrumbs baseUrl="" breadcrumbs={breadcrumbs} />
            <Information document={document} _site={_site} nearByLocations={nearByLocations} />

            <NearByLocation
              apiKey={YEXT_PUBLIC_ANSWER_SEARCH_API_KEY}
              coordinate={document.yextDisplayCoordinate}
              id={document.id}
              meta={__meta}
              setNearByLocations={setNearByLocations}
            />
          </PageLayout>
        </AnalyticsScopeProvider>
      </AnalyticsProvider>
    </div>
  );
};
export default Location;
