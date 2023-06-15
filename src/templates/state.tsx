import * as React from "react";
import { Template, GetPath, TemplateConfig, TemplateProps, TemplateRenderProps, GetHeadConfig, HeadConfig, TransformProps } from "@yext/pages";
import favicon from "../assets/images/favicon.ico";
import { EntityMeta, StateDocument, TemplateMeta } from "../types";
import PageLayout from "../components/layout/PageLayout";
import "../index.css";
import { Link } from "@yext/pages/components";
import { DirectoryChild } from "../types/DirectoryChild";
import { DirectoryParent } from "../types/DirectoryParent";
import { getBreadcrumb, getLink } from "../config/GlobalFunctions";
import Breadcrumbs, { BreadcrumbItem } from "../components/common/Breadcrumbs";

export const config: TemplateConfig = {
  stream: {
    $id: "region",
    filter: {
      entityTypes: ["ce_region"],
    },
    fields: [
      "id",
      "uid",
      "meta",
      "name",
      "slug",

      "dm_directoryParents.name",
      "dm_directoryParents.slug",
      "dm_directoryParents.meta.entityType",

      /* DM children */
      "dm_directoryChildren.name",
      "dm_directoryChildren.slug",
      "dm_directoryChildren.meta.entityType",
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
  const document = data.document as StateDocument;
  const directoryParents = document.dm_directoryParents || [];
  const breadcrumbs = getBreadcrumb<DirectoryParent, StateDocument>(directoryParents, document, data.__meta, true, 0, true);
  return { ...data, breadcrumbs };
};

interface StateTemplateProps extends TransformData {
  __meta: TemplateMeta;
  document: StateDocument;
}

const State: Template<StateTemplateProps> = ({ document, __meta, breadcrumbs }: StateTemplateProps) => {
  const { meta, _site, slug, dm_directoryChildren } = document;

  return (
    <div id="main">
      <PageLayout _site={_site} meta={__meta} template="country" locale={meta.locale} devLink={slug}>
        <Breadcrumbs baseUrl="" breadcrumbs={breadcrumbs} />
        <h1>State</h1>

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
export default State;
