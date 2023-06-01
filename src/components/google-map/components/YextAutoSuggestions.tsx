import * as React from "react";
import { SearchContext } from "../SearchProvider";
import { provideHeadless } from "@yext/search-headless";
import { SearchBar } from "@yext/search-ui-react";
import {
  NearByLocationResult,
  VerticalKeyToResults,
} from "../../../types/Locator";

interface YextAutoSuggestionProps {
  locale: string;
}

const YextAutoSuggestions = ({ locale }: YextAutoSuggestionProps) => {
  const { getCoordinates, setInputValue } = React.useContext(SearchContext);

  const handleSearch = (searchEventData: {
    verticalKey?: string;
    query?: string;
  }): void => {
    const { query } = searchEventData;
    if (query) {
      setInputValue(query);
      getCoordinates(query);
    } else {
      setInputValue("");
      getCoordinates("");
    }
  };

  const entityPreviewSearcher = provideHeadless({
    ...{
      apiKey: YEXT_PUBLIC_ANSWER_SEARCH_API_KEY,
      experienceKey: YEXT_PUBLIC_ANSWER_SEARCH_EXPERIENCE_KEY,
      locale: locale,
    },
    headlessId: "entity-preview-searcher",
  });

  const renderEntityPreviews = (
    verticalKeyToResults: Record<string, VerticalKeyToResults>
  ): JSX.Element | null => {
    const locationResults = verticalKeyToResults["location"]?.results || [];

    return (
      <div className="max-h-max overflow-y-scroll sm:max-h-96 sm:shadow-2xl">
        {renderLocationDropdown(locationResults)}
      </div>
    );
  };

  const renderLocationDropdown = (results: NearByLocationResult[]) => {
    if (!results || results.length === 0) return null;

    return results.map((result: NearByLocationResult) => {
      const title = result.highlightedFields?.name ?? result.name;
      return (
        title &&
        result.name && <p className="text-black line-clamp-2">{result.name}</p>
      );
    });
  };

  return (
    <SearchBar
      onSearch={handleSearch}
      hideRecentSearches={false}
      recentSearchesLimit={5}
      customCssClasses={{
        searchBarContainer: "search-form",
        inputElement: "search-input",
        searchButton: "search-location-button",
        clearButton: "search-clear-button",
      }}
      visualAutocompleteConfig={{
        entityPreviewsDebouncingTime: 300,
        renderEntityPreviews,
        entityPreviewSearcher,
        includedVerticals: ["location"],
      }}
      placeholder="e.g, San Francisco, CA"
    />
  );
};

export default YextAutoSuggestions;
