import * as React from "react";
import {
  useSearchActions,
  DisplayableFacetOption,
} from "@yext/search-headless-react";
import useOutsideClick from "../hooks/useOutSideClick";
import { SearchContext } from "../google-map/SearchProvider";
import Facet from "./Facet";

interface FacetsProps {
  searchOnChange?: boolean;
  searchable?: boolean;
  collapsible?: boolean;
  defaultExpanded?: boolean;
  setActiveFacet?: (index: number | null) => void;
  activeFacet?: number | null;
}

export default function Facets(props: FacetsProps): JSX.Element {
  const {
    searchOnChange,
    searchable,
    collapsible,
    defaultExpanded,
    setActiveFacet = () => {
      ("");
    },
    activeFacet = null,
  } = props;

  const ref = React.useRef<HTMLDivElement | null>(null);
  const onOutsideClick = () => {
    setActiveFacet(null);
  };
  useOutsideClick(false, ref, onOutsideClick);
  const { facets, getSearchData, centerCoordinates, inputValue } =
    React.useContext(SearchContext);

  const searchAction = useSearchActions();
  const executeSearch = () => {
    getSearchData(centerCoordinates, inputValue, 0, []);
  };
  const handleFacetOptionChange = (
    fieldId: string,
    option: DisplayableFacetOption
  ) => {
    searchAction.setFacetOption(fieldId, option, !option.selected);
    if (searchOnChange) {
      executeSearch();
    }
  };

  const facetComponentOptions =
    facets &&
    facets
      .filter((facet) => facet.options?.length > 0)
      ?.map((facet, index) => {
        return (
          <div className="single-filter-wrapper" key={index}>
            <div
              className={`filter-select-box ${
                activeFacet === index ? "active" : ""
              }`}
            >
              <button
                className="button"
                onClick={() =>
                  setActiveFacet(index === activeFacet ? null : index)
                }
              >
                {facet?.displayName}
              </button>
            </div>
            {activeFacet === index && (
              <div className="filter-dropdown" key={facet.fieldId}>
                <Facet facet={facet} onToggle={handleFacetOptionChange} />
              </div>
            )}
          </div>
        );
      });

  return (
    <div className="filter-wrapper" ref={ref}>
      {facetComponentOptions}
    </div>
  );
}
