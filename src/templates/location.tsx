import * as React from "react";
import {
  Template,
  GetPath,
  TemplateConfig,
  TemplateProps,
  TemplateRenderProps,
  GetHeadConfig,
  HeadConfig,
  TransformProps,
} from "@yext/pages";
import { fetch } from "@yext/pages/util";
import favicon from "../assets/images/favicon.ico";
import { EntityMeta, LocationDocument, TemplateMeta } from "../types";
import PageLayout from "../components/layout/PageLayout";
import Breadcrumbs, { BreadcrumbItem } from "../components/common/Breadcrumbs";
import {
  AnalyticsProvider,
  AnalyticsScopeProvider,
} from "@yext/pages/components";
import Information from "../components/location/Information";
import NearByLocation from "../components/location/NearByLocation";
import "../index.css";
import { getBreadcrumb } from "../config/GlobalFunctions";

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
      "hours",
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

export const getPath: GetPath<TemplateProps> = ({ document }) => {
  if (
    document.dm_directoryParents &&
    document.dm_directoryParents != "undefined"
  ) {
    const parent: string[] = [];
    document.dm_directoryParents?.map(
      (i: { meta: EntityMeta; slug: string; name: string }) => {
        parent.push(i.slug);
      }
    );
    return `${parent.join("/")}/${document.slug.toString()}.html`;
  } else {
    return `${document.slug.toString()}.html`;
  }
};

export const getHeadConfig: GetHeadConfig<TemplateRenderProps> = ({
  document,
}): HeadConfig => {
  const metaTitle = `Dotsquares | ${document.name}`;
  return {
    title: metaTitle,
    charset: "UTF-8",
    viewport:
      "width=device-width, initial-scale=1.0, maximum-scale=1, minimum-scale=1, user-scalable=0",
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
  externalApiData: any;
  breadcrumbs: BreadcrumbItem[];
};
export const transformProps: TransformProps<TransformData> = async (data) => {
  const document = data.document as LocationDocument;
  const latitude = document.yextDisplayCoordinate?.latitude;
  const longitude = document.yextDisplayCoordinate?.longitude;
  const directoryParents = document.dm_directoryParents || [];
  const url = `${YEXT_PUBLIC_VERTICAL_SEARCH_END_POINT}?experienceKey=${YEXT_PUBLIC_ANSWER_SEARCH_EXPERIENCE_KEY}&api_key=${YEXT_PUBLIC_ANSWER_SEARCH_API_KEY}&v=20220511&version=${YEXT_PUBLIC_ANSWER_SEARCH_EXPERIENCE_VERSION}&locale=${data.document.meta.locale}&location=${latitude},${longitude}&verticalKey=${YEXT_PUBLIC_ANSWER_SEARCH_VERTICAL_KEY}&limit=5&retrieveFacets=true&skipSpellCheck=false&session_id=12727528-aa0b-4558-9d58-12a815eb3761&sessionTrackingEnabled=true&source=STANDARD&allowEmptySearch=true`;
  const externalApiData = (await fetch(url).then((res) => res.json())) as any;
  let response = [];
  if (externalApiData && externalApiData.response) {
    response = externalApiData.response.results;
  }
  const breadcrumbs = getBreadcrumb(directoryParents, document, data.__meta);
  return { ...data, externalApiData: response, breadcrumbs };
};

interface LocationTemplateProps extends TransformData {
  __meta: TemplateMeta;
  document: LocationDocument;
}

const Location: Template<LocationTemplateProps> = ({
  document,
  __meta,
  externalApiData,
  breadcrumbs,
}) => {
  const { meta, _site, slug } = document;
  return (
    <div id="main">
      <AnalyticsProvider
        templateData={{ document, __meta }}
        enableDebugging={YEXT_PUBLIC_ANALYTICS_ENABLE_DEBUGGING}
        enableTrackingCookie={YEXT_PUBLIC_ANALYTICS_ENABLE_TRACKING_COOKIE}
      >
        <AnalyticsScopeProvider name={document.name}>
          <PageLayout
            _site={_site}
            meta={__meta}
            template="country"
            locale={meta.locale}
            devLink={slug}
          >
            <Breadcrumbs baseUrl="/" breadcrumbs={breadcrumbs} />
            <Information document={document} _site={_site} />

            <NearByLocation locations={externalApiData} meta={__meta} />
          </PageLayout>
        </AnalyticsScopeProvider>
      </AnalyticsProvider>
    </div>
  );
};
export default Location;
