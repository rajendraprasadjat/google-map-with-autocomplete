/**
 * This is an example of how to create a static template that uses getStaticProps to retrieve data.
 */
import * as React from "react";
import "../index.css";
import { Template, GetPath, GetHeadConfig, HeadConfig, TransformProps, TemplateConfig, TemplateProps, TemplateRenderProps } from "@yext/pages";
import PageLayout from "../components/layout/PageLayout";
import favicon from "../assets/images/favicon.ico";
import { SearchHeadlessProvider, provideHeadless } from "@yext/search-headless-react";
import SearchProvider from "../components/google-map/SearchProvider";
import { TemplateMeta } from "../types";
import { LocatorDocument } from "../types/Locator";
import ListLayout from "../components/locator/ListLayout";
import MapWrapper from "../components/google-map/MapWrapper";

/**
 * Not required depending on your use case.
 */
export const config: TemplateConfig = {
  // The name of the feature. If not set the name of this file will be used (without extension).
  // Use this when you need to override the feature name.
  stream: {
    $id: "locator",
    filter: {
      entityIds: ["stores-directory"],
    },
    fields: ["id", "uid", "meta", "name", "slug"],
    localization: {
      locales: ["en_GB"],
      primary: false,
    },
  },
};

/**
 * Used to either alter or augment the props passed into the template at render time.
 * This function will be run during generation and pass in directly as props to the default
 * exported function.
 *
 * This can be used when data needs to be retrieved from an external (non-Knowledge Graph)
 * source. This example calls a public API and returns the data.
 *
 * If the page is truly static this function is not necessary.
 */
export const transformProps: TransformProps<TemplateProps> = async (data) => {
  return { ...data };
};

/**
 * Defines the path that the generated file will live at for production.
 *
 * NOTE: This currently has no impact on the local dev path. Local dev urls currently
 * take on the form: featureName/entityId
 */
export const getPath: GetPath<TemplateProps> = ({ document, __meta }) => {
  return __meta.mode === "development" ? document.slug : "index.html";
};

/**
 * This allows the user to define a function which will take in their template
 * data and produce a HeadConfig object. When the site is generated, the HeadConfig
 * will be used to generate the inner contents of the HTML document's <head> tag.
 * This can include the title, meta tags, script tags, etc.
 */
export const getHeadConfig: GetHeadConfig<TemplateRenderProps> = (): HeadConfig => {
  return {
    title: "Locator Page Example",
    charset: "UTF-8",
    viewport: "width=device-width, initial-scale=1",
    tags: [
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
          name: "description",
          content: "Static page example meta description.",
        },
      },
      {
        type: "link",
        attributes: {
          rel: "icon",
          type: "image/x-icon",
          href: favicon,
        },
      },
    ],
  };
};

interface LocatorTemplateProps extends TemplateRenderProps {
  __meta: TemplateMeta;
  document: LocatorDocument;
}
/**
 * This is the main template. It can have any name as long as it's the default export.
 * The props passed in here are the direct result from `transformProps`.
 */
const Locator: Template<LocatorTemplateProps> = ({ document, __meta }: LocatorTemplateProps) => {
  const { _site, meta } = document;

  const searcher = provideHeadless({
    experienceKey: YEXT_PUBLIC_ANSWER_SEARCH_EXPERIENCE_KEY,
    apiKey: YEXT_PUBLIC_ANSWER_SEARCH_API_KEY,
    verticalKey: YEXT_PUBLIC_ANSWER_SEARCH_VERTICAL_KEY,
    locale: YEXT_PUBLIC_DEFAULT_LOCALE,
    environment: YEXT_PUBLIC_UNIVERSE,
    experienceVersion: YEXT_PUBLIC_ANSWER_SEARCH_EXPERIENCE_VERSION,
    endpoints: {
      verticalSearch: YEXT_PUBLIC_VERTICAL_SEARCH_END_POINT,
    },
  });

  const [isMapView, setIsMapView] = React.useState(false);
  return (
    <SearchHeadlessProvider searcher={searcher}>
      <SearchProvider
        defaultCoordinates={{
          latitude: parseFloat(YEXT_PUBLIC_DEFAULT_LATITUDE),
          longitude: parseFloat(YEXT_PUBLIC_DEFAULT_LONGITUDE),
        }}
        mapboxAccessToken={YEXT_PUBLIC_MAP_BOX_API_KEY}
        googleApiKey={YEXT_PUBLIC_GOOGLE_API_KEY}
        limit={parseInt(YEXT_PUBLIC_PAGE_LIMIT)}
        autoLoadAllResult={true}
        isUseAlternateResult={{ limit: 1, show: true }}
        mapType="mapbox"
        autocompleteType="google"
        isFilterEnable={false}
        isUpdateListAccordingMarkers={true}
      >
        <PageLayout _site={_site} meta={__meta} template="country" locale={meta.locale}>
          <main className="main-content">
            <section className="listing-map" id="main">
              <div className="mobile-view-map lg:hidden">
                <button type="button" className="map-link" onClick={() => setIsMapView(!isMapView)}>
                  {isMapView ? "Hide Map" : "Show Map"}
                </button>
              </div>
              <div className={`map-block ${isMapView ? "show" : ""}`}>
                <MapWrapper _site={_site} meta={__meta} />
              </div>
              <ListLayout showNoRecordMessage={true} meta={__meta} locale={YEXT_PUBLIC_DEFAULT_LOCALE} />
            </section>
          </main>
        </PageLayout>
      </SearchProvider>
    </SearchHeadlessProvider>
  );
};

export default Locator;
