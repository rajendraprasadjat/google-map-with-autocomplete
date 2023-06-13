import * as React from "react";
import { createContext } from "react";
import { DisplayableFacet, Facet, FacetOption, Matcher, SelectableStaticFilter, SortBy, useSearchActions } from "@yext/search-headless-react";
import { Libraries } from "./MapWrapper";
import { string, array, node, object, number, bool } from "prop-types";
import { getPosition } from "../../config/GlobalFunctions";
import { LocationResult } from "../../types/Locator";
import { Wrapper } from "@googlemaps/react-wrapper";
import { AutocompleteTypes, MapTypes } from "../../types";

export type PaginationType = {
  totalRecord: number;
  showingCount: number;
  offset: number;
  totalPage: number;
  currentPage: number;
  isLastPage: boolean;
  limit: number;
  startFrom: number;
};

export type Coordinate = {
  latitude: number;
  longitude: number;
};

interface ContextType {
  getCoordinates: (address: string, coordinate?: { lat: number; lng: number } | null, isUserLocation?: boolean) => void;
  centerCoordinates: Coordinate;
  pagination: PaginationType;
  getSearchData: (location: Coordinate | null, address: string | null, apiOffset: number, staticFilter: SelectableStaticFilter[]) => void;
  locations: LocationResult[];
  facets: Facet[] | undefined;
  isLoading: boolean;
  showViewportCount: number;
  showViewportLocations: boolean;
  viewportLocations: LocationResult[];
  updateViewportLocations: (map: google.maps.Map) => void;
  zoomLavel: number;
  setZoomLavel: (value: number) => void;
  userLocation: Coordinate;
  setUserLocation: (value: Coordinate) => void;
  infoWindowContent: LocationResult | null;
  setInfoWindowContent: (value: LocationResult | null) => void;
  mapCenter: google.maps.LatLngLiteral | null;
  setMapCenter: (value: google.maps.LatLngLiteral | null) => void;
  inputValue: string;
  setInputValue: (value: string) => void;
  isUserLocationAllowed: boolean;
  setIsUserLocationAllowed: (value: boolean) => void;
  setFacetOption: (fieldId: string, option: FacetOption, searchOnChange: boolean) => void;
  resetFacets: () => void;
  setSortBy: (sortBy: SortBy[]) => void;
  mapType: MapTypes;
  autocompleteType: AutocompleteTypes;
  isFilterEnable: boolean;
  isUpdateListAccordingMarkers: boolean;
  mapboxAccessToken: string;
  hoveredLocation: string | null;
  setHoveredLocation: (value: string | null) => void;
  noRecordFound: boolean;
  isUseAlternateResult?: IsUseAlternateResult;
  showResultCount: boolean;
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
  locations: [],
  facets: [],
  isLoading: false,
  showViewportCount: 0,
  showViewportLocations: false,
  viewportLocations: [],
  updateViewportLocations: function (): void {
    throw new Error("Function not implemented.");
  },
  zoomLavel: 0,
  setZoomLavel: function (): void {
    throw new Error("Function not implemented.");
  },
  userLocation: { latitude: 0, longitude: 0 },
  setUserLocation: function (): void {
    throw new Error("Function not implemented.");
  },
  infoWindowContent: null,
  setInfoWindowContent: function (): void {
    throw new Error("Function not implemented.");
  },
  mapCenter: null,
  setMapCenter: function (): void {
    throw new Error("Function not implemented.");
  },
  inputValue: "",
  setInputValue: function (): void {
    throw new Error("Function not implemented.");
  },
  isUserLocationAllowed: false,
  setIsUserLocationAllowed: function (): void {
    throw new Error("Function not implemented.");
  },
  setFacetOption: function (): void {
    throw new Error("Function not implemented.");
  },
  resetFacets: function (): void {
    throw new Error("Function not implemented.");
  },
  setSortBy: function (): void {
    throw new Error("Function not implemented.");
  },
  mapType: "google",
  autocompleteType: "google",
  isFilterEnable: false,
  isUpdateListAccordingMarkers: false,
  mapboxAccessToken: "",
  hoveredLocation: null,
  setHoveredLocation: function (): void {
    throw new Error("Function not implemented.");
  },
  noRecordFound: false,
  isUseAlternateResult: { show: false },
  showResultCount: true,
});

interface IsUseAlternateResult {
  limit?: number;
  show: boolean;
}

interface MapConfig {
  defaultZoom?: number;
  maxZoom?: number;
  minZoom?: number;
  zoomLevelInfowindow?: number;
}

interface NoResultFound {
  show: boolean;
  message: string;
  showWithAlternateResult?: boolean;
}

interface GoogleAutocompleteConfig {
  countries?: string[];
}

interface SearchProviderProps {
  children: React.ReactNode;
  defaultCoordinates: Coordinate;
  googleApiKey: string;
  limit: number;
  language: string;
  libraries: Libraries;
  isUseAlternateResult?: IsUseAlternateResult;
  autoLoadAllResult?: boolean;
  radius?: number;
  mapType?: MapTypes;
  autocompleteType?: AutocompleteTypes;
  mapboxAccessToken?: string;
  isFilterEnable?: boolean;
  isUpdateListAccordingMarkers?: boolean;
  mapConfig?: MapConfig;
  googleAutocompleteConfig?: GoogleAutocompleteConfig;
  noResultFound?: NoResultFound;
  showResultOnIntialLoad?: boolean;
  showResultCount?: boolean;
}
/**
 * This provider used for search action by yext search action
 * We used google map and map box for showing result into map
 * @param param0
 * @returns
 */
const SearchProvider = ({
  children,
  defaultCoordinates,
  googleApiKey,
  limit,
  language,
  libraries,
  isUseAlternateResult,
  autoLoadAllResult = false,
  radius = 0,
  mapType = "google",
  autocompleteType = "google",
  mapboxAccessToken = "",
  isFilterEnable = false,
  isUpdateListAccordingMarkers = false,
  noResultFound,
  showResultCount = true,
}: SearchProviderProps) => {
  const searchAction = useSearchActions();
  const [inputValue, setInputValue] = React.useState("");
  const [zoomLavel, setZoomLavel] = React.useState(4);
  const [mapCenter, setMapCenter] = React.useState<google.maps.LatLngLiteral | null>(null);
  const [centerCoordinates, setCenterCoordinates] = React.useState(defaultCoordinates);
  const [userLocation, setUserLocation] = React.useState(defaultCoordinates);
  const [isUserLocationAllowed, setIsUserLocationAllowed] = React.useState(false);
  const [locations, setLocations] = React.useState<LocationResult[]>([]);
  const [facets, setFacets] = React.useState<DisplayableFacet[]>([]);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [noRecordFound, setNoRecordFound] = React.useState<boolean>(false);
  const [offset, setOffset] = React.useState<number>(0);
  const [pagination, setPagination] = React.useState<PaginationType>({
    totalRecord: 0,
    showingCount: 0,
    offset: offset,
    totalPage: 0,
    currentPage: 1,
    isLastPage: true,
    limit,
    startFrom: 1,
  });
  const [showViewportCount, setShowViewportCount] = React.useState<number>(0);
  const [showViewportLocations, setShowViewportLocations] = React.useState<boolean>(false);
  const [viewportLocations, setViewportLocations] = React.useState<LocationResult[]>([]);

  const [infoWindowContent, setInfoWindowContent] = React.useState<LocationResult | null>(null);

  const [hoveredLocation, setHoveredLocation] = React.useState<string | null>(null);

  const setPagingData = (totalRecord: number, resultsLength: number, apiOffset = 0) => {
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
        startFrom: 1,
      };
      setPagination(returnData);
      return returnData;
    } else {
      return {
        totalRecord: 0,
        showingCount: 0,
        offset: offset,
        totalPage: 0,
        currentPage: 1,
        isLastPage: true,
        limit,
        startFrom: 1,
      };
    }
  };

  const setFacetOption = (fieldId: string, option: FacetOption, searchOnChange = false) => {
    searchAction.setFacetOption(fieldId, option, !option.selected);
    if (searchOnChange) {
      getSearchData(centerCoordinates, inputValue, 0, []);
    }
  };

  const resetFacets = () => {
    searchAction.resetFacets();
  };

  const setSortBy = (sortBy: SortBy[]) => {
    searchAction.setSortBys(sortBy);
  };

  const getSearchData = (
    location: Coordinate | null,
    address: string | null,
    apiOffset = 0,
    staticFilter: SelectableStaticFilter[],
    lastLocations: LocationResult[] = []
  ) => {
    setNoRecordFound(false);
    setIsLoading(true);
    if (location !== null) {
      searchAction.setUserLocation(location);
    }
    searchAction.setOffset(apiOffset);

    searchAction.setVerticalLimit(limit);
    if (address !== null) {
      searchAction.setQuery(address);
    }

    if (radius && location) {
      const locationFilter: SelectableStaticFilter = {
        selected: true,
        filter: {
          kind: "fieldValue",
          fieldId: "builtin.location",
          value: {
            lat: location.latitude,
            lng: location.longitude,
            radius: radius,
          },
          matcher: Matcher.Near,
        },
      };
      staticFilter.push(locationFilter);
    }

    if (staticFilter) {
      searchAction.setStaticFilters(staticFilter);
    }

    if (apiOffset === 0) {
      setInfoWindowContent(null);
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
        startFrom: 1,
      });
    }

    searchAction.executeVerticalQuery().then((response) => {
      setFacets(response?.facets || []);
      let currentPagination = pagination;
      const oldLocations = lastLocations.length ? lastLocations : locations;
      let results: LocationResult[] = [];
      let resultCount = 0;
      if (response?.verticalResults.results && response?.verticalResults.results.length > 0) {
        results = response?.verticalResults.results as unknown as LocationResult[];
        resultCount = response?.verticalResults.resultsCount || 0;
      } else if (response?.allResultsForVertical?.verticalResults && isUseAlternateResult && isUseAlternateResult.show) {
        setNoRecordFound(true);
        results = response?.allResultsForVertical?.verticalResults.results as unknown as LocationResult[];
        if (isUseAlternateResult.limit && isUseAlternateResult.limit > 0 && isUseAlternateResult.limit < limit) {
          const alternateLimit = isUseAlternateResult.limit;
          results = results.filter((_e, index: number) => index < alternateLimit);
          resultCount = alternateLimit;
        } else {
          results = response?.allResultsForVertical?.verticalResults.results as unknown as LocationResult[];

          resultCount = response?.allResultsForVertical?.verticalResults.resultsCount || 0;
        }
      }

      const allData = apiOffset ? [...oldLocations, ...results] : results;
      console.log("apiOffset", apiOffset, oldLocations.length, results.length);
      const uniqueArray = allData.filter((obj, index, self) => {
        return index === self.findIndex((o) => o.id === obj.id);
      });
      currentPagination = setPagingData(resultCount, results.length, apiOffset);
      setLocations(uniqueArray);

      if (autoLoadAllResult && !currentPagination.isLastPage) {
        getSearchData(location, address, apiOffset + limit, staticFilter, uniqueArray);
      } else {
        setIsLoading(false);
      }
    });
  };

  const getCoordinates = (address: string, coordinate: { lat: number; lng: number } | undefined | null, isUserLocation = false) => {
    if (coordinate) {
      setCenterCoordinates({
        latitude: coordinate.lat,
        longitude: coordinate.lng,
      });
      getSearchData({ latitude: coordinate.lat, longitude: coordinate.lng }, address, 0, []);
    } else {
      fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${googleApiKey}`)
        .then((response) => response.json())
        .then((data) => {
          if (data.status === "OK") {
            const response = data.results.length > 0 ? data.results[0] : null;
            if (response) {
              const latitude = response.geometry.location.lat;
              const longitude = response.geometry.location.lng;
              setCenterCoordinates({ latitude, longitude });
              if (isUserLocation) {
                getSearchData({ latitude, longitude }, response.formatted_address, 0, []);
                setInputValue(response.formatted_address);
              } else {
                getSearchData({ latitude, longitude }, address, 0, []);
              }
            } else {
              setCenterCoordinates(defaultCoordinates);
              getSearchData(defaultCoordinates, isUserLocation ? "" : address, 0, []);
            }
          } else {
            setCenterCoordinates(defaultCoordinates);
            getSearchData(defaultCoordinates, address, 0, []);
          }
        });
    }
  };

  const updateViewportLocations = (map: google.maps.Map) => {
    if (map && isUpdateListAccordingMarkers) {
      const bounds = map ? map.getBounds() : null;
      if (bounds) {
        const result = locations.filter((e) => {
          const d = getPosition(e);
          return bounds.contains(new google.maps.LatLng(d.lat, d.lng));
        });
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

  React.useEffect(() => {
    getSearchData(centerCoordinates, "", 0, []);
  }, []);

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
    userLocation,
    setUserLocation,
    infoWindowContent,
    setInfoWindowContent,
    mapCenter,
    setMapCenter,
    inputValue,
    setInputValue,
    isUserLocationAllowed,
    setIsUserLocationAllowed,
    setFacetOption,
    resetFacets,
    setSortBy,
    mapType,
    mapboxAccessToken,
    autocompleteType,
    isFilterEnable,
    isUpdateListAccordingMarkers,
    hoveredLocation,
    setHoveredLocation,
    noRecordFound,
    isUseAlternateResult,
    noResultFound,
    showResultCount,
  };

  return (
    <SearchContext.Provider value={data}>
      {mapType === "google" || autocompleteType === "google" ? (
        <Wrapper apiKey={googleApiKey} language={language} libraries={libraries}>
          {children}
        </Wrapper>
      ) : (
        children
      )}
    </SearchContext.Provider>
  );
};

SearchProvider.propTypes = {
  children: node.isRequired,
  googleApiKey: string.isRequired,
  language: string,
  libraries: array,
  defaultCoordinates: object.isRequired,
  limit: number,

  isUseAlternateResult: object,
  autoLoadAllResult: bool,
  radius: number,
  mapType: string,
  autocompleteType: string,
  mapboxAccessToken: string,
  isFilterEnable: bool,
  isUpdateListAccordingMarkers: bool,
};

SearchProvider.defaultProps = {
  language: "en",
  libraries: ["places", "geometry"],
  limit: 50,
  autoLoadAllResult: false,
  mapType: "google",
  autocompleteType: "google",
  isFilterEnable: false,
  isUpdateListAccordingMarkers: false,
};

export default SearchProvider;
