import * as React from "react";
import { Link } from "@yext/pages/components";
import { SiteData, TemplateMeta } from "../../types";
import logo from "../../assets/images/logo.jpg";

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
  // const { meta, template, devLink, locale } = props;
  console.log("props", props);
  return (
    <header className="site-header">
      <div className="container">
        <div className="row">
          <div className="logo">
            <a href="#">
              <img src={logo} alt="logo" />
            </a>
          </div>
          <div className="header-menu">
            <ul>
              {navigation.map((link) => (
                <li key={link.href}>
                  <Link as="a" href={link.href} className="">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
