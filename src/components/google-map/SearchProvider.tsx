import * as React from "react";
import { createContext } from "react";
import {
  DisplayableFacet,
  Matcher,
  Result,
  SelectableFilter,
  useSearchActions,
} from "@yext/search-headless-react";
import GoogleMapWrapper, { Libraries } from "./GoogleMapWrapper";
import PropTypes from "prop-types";
import { getPosition } from "../../config/GlobalFunctions";

export type PaginationType = {
  totalRecord: number;
  showingCount: number;
  offset: number;
  totalPage: number;
  currentPage: number;
  isLastPage: boolean;
  limit: number;
};

export type Coordinate = {
  latitude: number;
  longitude: number;
};

interface ContextType {
  getCoordinates: (
    address: string,
    coordinate?: { lat: number; lng: number }
  ) => void;
  centerCoordinates: Coordinate;
  pagination: PaginationType;
  getSearchData: (
    location: Coordinate | null,
    address: string | null,
    apiOffset: number,
    staticFilter: SelectableFilter[]
  ) => void;
  locations: any;
  facets: any;
  isLoading: boolean;
  showViewportCount: number;
  showViewportLocations: boolean;
  viewportLocations: any;
  updateViewportLocations: (map: google.maps.Map) => void;
  zoomLavel: number;
  setZoomLavel: (value: number) => void;
}

export const SearchContext = createContext<ContextType>({
  getCoordinates: function (): void {
    throw new Error("Function not implemented.");
  },
  centerCoordinates: {
    latitude: 0,
    longitude: 0,
  },
  pagination: {
    totalRecord: 0,
    showingCount: 0,
    offset: 0,
    totalPage: 0,
    currentPage: 0,
    isLastPage: false,
    limit: 0,
  },
  getSearchData: function (): void {
    throw new Error("Function not implemented.");
  },
  locations: undefined,
  facets: undefined,
  isLoading: false,
  showViewportCount: 0,
  showViewportLocations: false,
  viewportLocations: undefined,
  updateViewportLocations: function (): void {
    throw new Error("Function not implemented.");
  },
  zoomLavel: 0,
  setZoomLavel: function (value: number): void {
    throw new Error("Function not implemented.");
  },
});

interface SearchProviderProps {
  children: React.ReactNode;
  defaultCoordinates: Coordinate;
  googleApiKey: string;
  limit: number;
  language: string;
  libraries: Libraries;
}

const SearchProvider = ({
  children,
  defaultCoordinates,
  googleApiKey,
  limit,
  language,
  libraries,
}: SearchProviderProps) => {
  const searchActions = useSearchActions();
  const [zoomLavel, setZoomLavel] = React.useState(4);
  const [centerCoordinates, setCenterCoordinates] = React.useState(defaultCoordinates);
  const [locations, setLocations] = React.useState<
    Result<Record<string, unknown>>[]
  >([]);
  const [facets, setFacets] = React.useState<DisplayableFacet[]>([]);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [offset, setOffset] = React.useState<number>(0);
  const [pagination, setPagination] = React.useState<PaginationType>({
    totalRecord: 0,
    showingCount: 0,
    offset: 0,
    totalPage: 0,
    currentPage: 1,
    isLastPage: true,
    limit,
  });
  const [showViewportCount, setShowViewportCount] = React.useState<number>(0);
  const [showViewportLocations, setShowViewportLocations] =
    React.useState<boolean>(false);
  const [viewportLocations, setViewportLocations] = React.useState<
    Result<Record<string, unknown>>[]
  >([]);
  console.log("locations", locations.length);
  const setPagingData = (
    totalRecord: number,
    resultsLength: number,
    apiOffset = 0
  ) => {
    console.log("totalRecord", totalRecord, resultsLength, offset, apiOffset);
    if (totalRecord > 0) {
      const showingCount = resultsLength + apiOffset;
      const totalPage = Math.ceil(totalRecord / limit);
      const currentPage = Math.ceil(showingCount / limit);
      const isLastPage = currentPage === totalPage;
      const newOffset = limit * currentPage;
      setOffset(newOffset);
      const returnData = {
        totalRecord,
        showingCount,
        offset: newOffset,
        totalPage,
        currentPage,
        isLastPage,
        limit,
      };
      setPagination(returnData);
    }
  };

  const getSearchData = (
    location: Coordinate | null,
    address: string | null,
    apiOffset = 0,
    staticFilter: SelectableFilter[]
  ) => {
    setIsLoading(true);
    if (location !== null) {
      searchActions.setUserLocation(location);
    }
    searchActions.setOffset(apiOffset);
    searchActions.setVerticalLimit(limit);
    if (address !== null) {
      searchActions.setQuery(address);
    }
    if (staticFilter) {
      searchActions.setStaticFilters(staticFilter);
    }
    if (apiOffset === 0) {
      setLocations([]);
      setOffset(0);
      setPagination({
        totalRecord: 0,
        showingCount: 0,
        offset: 0,
        totalPage: 0,
        currentPage: 1,
        isLastPage: true,
        limit,
      });
    }

    console.log("called----------");

    searchActions.executeVerticalQuery().then((response) => {
      setFacets(response?.facets || []);
      if (
        response?.verticalResults.results &&
        response?.verticalResults.results.length > 0
      ) {
        console.log("response", response);
        const result = response?.verticalResults.results;
        const allData = apiOffset ? [...locations, ...result] : result;
        const uniqueArray = allData.filter((obj, index, self) => {
          return index === self.findIndex((o) => o.id === obj.id);
        });
        setPagingData(
          response?.verticalResults.resultsCount || 0,
          result.length,
          apiOffset
        );
        setLocations(uniqueArray);
        setIsLoading(false);
        if (
          !apiOffset &&
          uniqueArray.length < response?.verticalResults.resultsCount
        ) {
          //   getSearchData(location, address, apiOffset, staticFilter);
        }
      } else if (response?.allResultsForVertical?.verticalResults) {
        const result = response?.allResultsForVertical?.verticalResults.results;
        setLocations(result.filter((_e: any, index: number) => index === 0));
        setIsLoading(false);
      }
    });
  };

  const getCoordinates = (address: string, coordinate: {lat: number, lng: number} | undefined) => {
    console.log('address', address)
    if(coordinate){
      setCenterCoordinates({ latitude: coordinate.lat, longitude: coordinate.lng })
      getSearchData({ latitude: coordinate.lat, longitude: coordinate.lng }, address, 0, []);
    }else{
      fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${googleApiKey}`
      )
        .then((response) => response.json())
        .then((data) => {
          if (data.status === "OK") {
            console.log("data", data);
            data.results.map(
              (res: { geometry: { location: { lat: number; lng: number } } }) => {
                const latitude = res.geometry.location.lat;
                const longitude = res.geometry.location.lng;
                /* const filterItem = [];
                const locationFilter: SelectableFilter = {
                  selected: true,
                  fieldId: "builtin.location",
                  value: {
                    lat: latitude,
                    lng: longitude,
                    radius: 5000,
                  },
                  matcher: Matcher.Near,
                };
                filterItem.push(locationFilter); */
                setCenterCoordinates({ latitude, longitude })
                getSearchData({ latitude, longitude }, address, 0, []);
              }
            );
          } else {
            setCenterCoordinates(defaultCoordinates)
            getSearchData(defaultCoordinates, address, 0, []);
          }
        });
    }
  };

  const updateViewportLocations = (map: google.maps.Map) => {
    if (map) {
      const bounds = map ? map.getBounds() : null;
      if (bounds) {
        const result = locations.filter(
          (e: Result<Record<string, unknown>>) => {
            const d = getPosition(e);
            return bounds.contains(new google.maps.LatLng(d.lat, d.lng));
          }
        );
        if (result.length !== locations.length) {
          setShowViewportLocations(true);
          setShowViewportCount(result.length);
          setViewportLocations(result);
        } else {
          setShowViewportLocations(false);
          setShowViewportCount(0);
          setViewportLocations([]);
        }
      }
    }
  };

  const data = {
    getCoordinates,
    centerCoordinates,
    pagination,
    getSearchData,
    locations,
    facets,
    isLoading,
    showViewportCount,
    showViewportLocations,
    viewportLocations,
    updateViewportLocations,
    zoomLavel,
    setZoomLavel,
  };

  console.log("pagination", pagination);
  return (
    <SearchContext.Provider value={data}>
      <GoogleMapWrapper
        apiKey={googleApiKey}
        language={language}
        libraries={libraries}
      >
        {children}
      </GoogleMapWrapper>
    </SearchContext.Provider>
  );
};

SearchProvider.propTypes = {
  children: PropTypes.node.isRequired,
  googleApiKey: PropTypes.string.isRequired,
  language: PropTypes.string,
  libraries: PropTypes.array,
  defaultCoordinates: PropTypes.object.isRequired,
  limit: PropTypes.number,
};

SearchProvider.defaultProps = {
  language: "en",
  libraries: ["places", "geometry"],
  limit: 50,
};

export default SearchProvider;