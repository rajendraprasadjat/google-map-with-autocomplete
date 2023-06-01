import * as React from "react";
import { SearchContext } from "../SearchProvider";
import GoogleAutoSuggestions from "./GoogleAutoSuggestions";
import YextAutoSuggestions from "./YextAutoSuggestions";

const AutoSuggestions = ({ locale }) => {
  const { autocompleteType } = React.useContext(SearchContext);

  return autocompleteType === "google" ? (
    <GoogleAutoSuggestions />
  ) : (
    <YextAutoSuggestions locale={locale} />
  );
};

export default AutoSuggestions;
