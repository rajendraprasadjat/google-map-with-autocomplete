import * as React from "react";
import {
  useSearchActions,
  DisplayableFacetOption,
  StaticFilter,
} from "@yext/search-headless-react";
import { SearchContext } from "../google-map/SearchProvider";
import Facet from "./Facet";
import useOutsideClick from "../hooks/useOutsideClick";

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
  const { facets, setFacetOption } = React.useContext(SearchContext);
  const [staticFilters, setStaticFilters] = React.useState<StaticFiltersType[]>(
    []
  );
  const searchAction = useSearchActions();

  const handleFacetOptionChange = (
    fieldId: string,
    option: DisplayableFacetOption
  ) => {
    searchAction.resetFacets();
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
