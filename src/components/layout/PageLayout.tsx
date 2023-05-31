import * as React from "react";
import Header from "./Header";
import Footer from "./Footer";
import { SiteData, TemplateMeta } from "../../types";

export interface PageLayoutProps {
  children?: React.ReactNode;
  _site?: SiteData;
  meta: TemplateMeta;
  template?: string;
  devLink?: string;
  locale?: string;
}

const PageLayout = ({
  children,
  _site,
  meta,
  template,
  devLink,
  locale,
}: PageLayoutProps) => {
  return (
    <div className="page-wrapper">
      <Header
        _site={_site}
        meta={meta}
        template={template}
        locale={locale}
        devLink={devLink}
      />
      {children}
      <Footer
        _site={_site}
        meta={meta}
        template={template}
        locale={locale}
        devLink={devLink}
      />
    </div>
  );
};

export default PageLayout;
