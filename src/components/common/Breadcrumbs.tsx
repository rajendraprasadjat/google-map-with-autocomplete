import * as React from "react";
import { ReactNode } from "react";
import { Link } from "@yext/pages/components";

export interface BreadcrumbItemProps {
  name: string;
  url: string;
}

export interface BreadcrumbItem {
  name: string;
  slug: string;
}
export interface BreadcrumbsProps {
  breadcrumbs?: BreadcrumbItem[];
  separator?: ReactNode;
  baseUrl: string;
}

const BreadcrumbItem = (props: BreadcrumbItemProps) => {
  const { name, url } = props;
  console.log("url", url);
  if (url) {
    return (
      <a href={url}>
        <span className="font-bold hover:underline hover:cursor-pointer">{name}</span>
      </a>
    );
  }

  return <span className="Breadcrumbs-label">{name}</span>;
};

const Breadcrumbs = (props: BreadcrumbsProps) => {
  const { breadcrumbs, separator = ">", baseUrl } = props;

  return (
    <div className="breadcrumb-wrapper">
      {breadcrumbs?.length && (
        <div className="breadcrumbs">
          <ol className="flex space-x-4">
            {breadcrumbs.map(({ name, slug }, index) => {
              const isLast = index === breadcrumbs.length - 1;
              const isFirst = index === 0;

              return (
                <li className="breadcrumb-item flex" key={index}>
                  {isFirst ? (
                    <BreadcrumbItem name={"Home"} url={isLast ? "" : baseUrl + slug} {...props} />
                  ) : (
                    <BreadcrumbItem name={name} url={isLast ? "" : baseUrl + slug} {...props} />
                  )}
                  {!isLast && <span className="breadcrumb-separator">{separator}</span>}
                </li>
              );
            })}
          </ol>
        </div>
      )}
    </div>
  );
};

export default Breadcrumbs;
