import React, { useContext } from "react";
import { SearchContext } from "../google-map/SearchProvider";

function ViewMore() {
  const { pagination, getSearchData, centerCoordinates, inputValue } =
    useContext(SearchContext);
  return !pagination.isLastPage ? (
    <div className="view-more-block">
      <button
        className="button view-more"
        onClick={() =>
          getSearchData(centerCoordinates, inputValue, pagination.offset, [])
        }
      >
        View More
      </button>
    </div>
  ) : null;
}

export default ViewMore;
