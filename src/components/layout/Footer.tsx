import * as React from "react";
import {
  Facebook,
  GitHub,
  Instagram,
  Twitter,
  YouTube,
} from "../../assets/svgs/SocialIcons";
import { SiteData, TemplateMeta } from "../../types";
import logo from "../../assets/images/logo.jpg";

interface FooterProps {
  _site?: SiteData;
  meta: TemplateMeta;
  template?: string;
  devLink?: string;
  locale?: string;
  description?: string;
}

const currentTime = new Date();
const year = currentTime.getFullYear();

const navigation = {
  company: [
    { name: "About", href: "#" },
    { name: "Blog", href: "#" },
    { name: "Jobs", href: "#" },
    { name: "Press", href: "#" },
    { name: "Partners", href: "#" },
  ],
  legal: [
    { name: "Claim", href: "#" },
    { name: "Privacy", href: "#" },
    { name: "Terms", href: "#" },
  ],
  social: [
    {
      name: "Facebook",
      href: "#",
      icon: (
        props: JSX.IntrinsicAttributes & React.SVGProps<SVGSVGElement>
      ) => <Facebook {...props} />,
    },
    {
      name: "Instagram",
      href: "#",
      icon: (
        props: JSX.IntrinsicAttributes & React.SVGProps<SVGSVGElement>
      ) => <Instagram {...props} />,
    },
    {
      name: "Twitter",
      href: "#",
      icon: (
        props: JSX.IntrinsicAttributes & React.SVGProps<SVGSVGElement>
      ) => <Twitter {...props} />,
    },
    {
      name: "GitHub",
      href: "#",
      icon: (
        props: JSX.IntrinsicAttributes & React.SVGProps<SVGSVGElement>
      ) => <GitHub {...props} />,
    },
    {
      name: "YouTube",
      href: "#",
      icon: (
        props: JSX.IntrinsicAttributes & React.SVGProps<SVGSVGElement>
      ) => <YouTube {...props} />,
    },
  ],
};

const Footer = (props: FooterProps) => {
  const { meta } = props;
  return (
    <>
      <footer className="site-footer" aria-labelledby="footer-heading">
        <h2 id="footer-heading" className={`sr-only ${meta.mode}`}>
          Footer
        </h2>
        <div className="container">
          <div className="row">
            <div className="footer-block">
              <div className="f-logo">
                <a href="/">
                  <img src={logo} alt="logo" />
                </a>
              </div>
              <div className="social-links">
                {navigation.social.map((item) => (
                  <a key={item.name} href={item.href} className="">
                    <span className="sr-only">{item.name}</span>
                    <item.icon className="h-6 w-6" aria-hidden="true" />
                  </a>
                ))}
              </div>
            </div>
            <div className="footer-block">
              <h3 className="footer-heading">Company</h3>
              <ul role="list" className="footer-links">
                {navigation.company.map((item) => (
                  <li key={item.name}>
                    <a
                      href={item.href}
                      className="text-sm leading-6 text-gray-600 hover:text-gray-900"
                    >
                      {item.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div className="footer-block">
              <h3 className="footer-heading">Legal</h3>
              <ul role="list" className="footer-links">
                {navigation.legal.map((item) => (
                  <li key={item.name}>
                    <a
                      href={item.href}
                      className="text-sm leading-6 text-gray-600 hover:text-gray-900"
                    >
                      {item.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <div className="container">
            <p>&copy; {year} Your Company, Inc. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
