import * as React from "react";
import {
  useSearchActions,
  DisplayableFacetOption,
  StaticFilter,
  SelectableStaticFilter,
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

interface StaticFiltersType {
  fieldId: string;
  values: StaticFilter[];
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
  const {
    facets,
    getSearchData,
    centerCoordinates,
    inputValue,
    setFacetOption,
    resetFacets,
  } = React.useContext(SearchContext);
  const [staticFilters, setStaticFilters] = React.useState<StaticFiltersType[]>(
    []
  );
  const searchAction = useSearchActions();

  const handleFacetOptionChange = (
    fieldId: string,
    option: DisplayableFacetOption
  ) => {
    console.log("fieldId", fieldId, option);
    searchAction.resetFacets();
    const staticFilter: SelectableStaticFilter[] = [];
    let allFilters = staticFilters;
    const currentFilter = allFilters.find((e) => e.fieldId === fieldId);

    if (currentFilter) {
      allFilters = allFilters.filter((e) => e.fieldId !== fieldId);
      const selected = currentFilter.values.find(
        (e) => e.value === option.value
      );

      if (selected) {
        const filtered = currentFilter.values.filter(
          (f) => f.value !== option.value
        );

        allFilters.push({
          fieldId,
          values: filtered,
        });
      } else {
        allFilters.push({
          fieldId,
          values: [...currentFilter.values, option],
        });
      }
    } else {
      allFilters.push({
        fieldId,
        values: [option],
      });
    }

    allFilters.forEach((element) => {
      if (element.fieldId) {
        element.values.forEach((e) => {
          const itemFilter = {
            selected: true,
            fieldId: element.fieldId,
            value: e.value,
            matcher: e.matcher,
          };
          console.log("itemFilter", itemFilter);
        });
      }
    });
    console.log("allFilters", allFilters, staticFilter);

    setStaticFilters(allFilters);
    setFacetOption(fieldId, option, searchOnChange ? searchOnChange : false);

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
