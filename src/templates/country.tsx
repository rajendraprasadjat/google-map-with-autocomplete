import * as React from "react";
import { Template, GetPath, TemplateConfig, TemplateProps, TemplateRenderProps, GetHeadConfig, HeadConfig, TransformProps } from "@yext/pages";
import favicon from "../assets/images/favicon.ico";
import { TemplateMeta } from "../types";
import { CountryDocument } from "../types/index";
import PageLayout from "../components/layout/PageLayout";
import "../index.css";
import { Link } from "@yext/pages/components";
import { DirectoryChild } from "../types/DirectoryChild";
import { getBreadcrumb, getLink } from "../config/GlobalFunctions";
import Breadcrumbs, { BreadcrumbItem } from "../components/common/Breadcrumbs";
import { DirectoryParent } from "../types/DirectoryParent";

/**
 * Required when Knowledge Graph data is used for a template.
 */
export const config: TemplateConfig = {
  stream: {
    $id: "country",
    // Specifies the exact data that each generated document will contain. This data is passed in
    // directly as props to the default exported function.
    fields: [
      "id",
      "uid",
      "meta",
      "name",
      "slug",

      "dm_directoryParents.name",
      "dm_directoryParents.slug",

      /* DM children */
      "dm_directoryChildren.name",
      "dm_directoryChildren.slug",
    ],
    // Defines the scope of entities that qualify for this stream.
    filter: {
      entityTypes: ["ce_country"],
    },
    // The entity language profiles that documents will be generated for.
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
  const document = data.document as CountryDocument;
  const directoryParents = document.dm_directoryParents || [];
  const breadcrumbs = getBreadcrumb<DirectoryParent, CountryDocument>(directoryParents, document, data.__meta, true, 0, true);
  return { ...data, breadcrumbs };
};

interface CountryTemplateProps extends TransformData {
  __meta: TemplateMeta;
  document: CountryDocument;
}

const country: Template<CountryTemplateProps> = ({ document, __meta, breadcrumbs }: CountryTemplateProps) => {
  const { _site, meta, slug, dm_directoryChildren } = document;

  return (
    <div id="main">
      <PageLayout _site={_site} meta={__meta} template="country" locale={meta.locale} devLink={slug}>
        <Breadcrumbs baseUrl="" breadcrumbs={breadcrumbs} />
        <h1>Country</h1>

        <div className="directory-children">
          {dm_directoryChildren &&
            dm_directoryChildren.map((region: DirectoryChild) => {
              const url = region.slug;

              return (
                <div className="directory-children-card" key={region.slug}>
                  <a className="directory-children-name" href={`/${url}`}>
                    {region.name}
                  </a>
                </div>
              );
            })}
        </div>
      </PageLayout>
    </div>
  );
};

export default country;
