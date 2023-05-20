import { Wrapper } from "@googlemaps/react-wrapper";
import * as React from "react";

export type Libraries = (
  | "drawing"
  | "geometry"
  | "localContext"
  | "marker"
  | "places"
  | "visualization"
)[];

type GoogleMapWrapper = {
  apiKey: string;
  language?: string;
  libraries?: Libraries;
  children: React.ReactNode;
};

const GoogleMapWrapper = ({ children, ...props }: GoogleMapWrapper) => {
  return (
    <Wrapper
      {...props}
    >
      {children}
    </Wrapper>
  );
};

export default GoogleMapWrapper;
