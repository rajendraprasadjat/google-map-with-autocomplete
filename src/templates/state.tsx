import * as React from "react";
import {
  Template,
  GetPath,
  TemplateConfig,
  TemplateProps,
  TemplateRenderProps,
  GetHeadConfig,
  HeadConfig,
} from "@yext/pages";
import favicon from "../assets/images/favicon.ico";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import { EntityMeta, StateDocument, TemplateMeta } from "../types";
import PageLayout from "../components/layout/PageLayout";

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

interface StateTemplateProps extends TemplateRenderProps {
  __meta: TemplateMeta;
  document: StateDocument;
}

const State: Template<StateTemplateProps> = ({
  document,
  __meta,
}: StateTemplateProps) => {
  const { meta, _site, slug } = document;

  return (
    <div id="main">
      <PageLayout
        _site={_site}
        meta={__meta}
        template="country"
        locale={meta.locale}
        devLink={slug}
      >
        <div>State</div>
      </PageLayout>
    </div>
  );
};
export default State;
