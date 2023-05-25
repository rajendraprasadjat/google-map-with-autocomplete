import * as React from "react";
import { Link } from "@yext/pages/components";
import { SiteData, TemplateMeta } from "../../types";
import { getLink } from "../../config/GlobalFunctions";

const navigation = [
  { name: "Home", href: "/" },
  { name: "About", href: "#" },
];

interface HeaderProps {
  _site: SiteData;
  meta: TemplateMeta;
  template?: string;
  devLink?: string;
  locale?: string;
}

const Header = (props: HeaderProps) => {
  const { meta, template, devLink, locale } = props;
  return (
    <div className="space-y-1 pt-2 pb-3">
      {navigation.map((link) => (
        <Link
          key={link.href}
          as="a"
          href={getLink({
            link: link.href,
            mode: meta.mode,
            template,
            devLink,
            locale,
          })}
          className="block border-l-4 border-transparent py-2 pl-3 pr-4 text-base font-medium text-gray-500 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-700 sm:pl-5 sm:pr-6"
        >
          {link.name}
        </Link>
      ))}
    </div>
  );
};

export default Header;
