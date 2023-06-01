import * as React from "react";
import { SearchContext } from "../SearchProvider";
import GoogleAutoSuggestions from "./GoogleAutoSuggestions";
import YextAutoSuggestions from "./YextAutoSuggestions";

interface AutoSuggestionProps {
  locale: string;
}
const AutoSuggestions = ({ locale }: AutoSuggestionProps) => {
  const { autocompleteType } = React.useContext(SearchContext);

  return autocompleteType === "google" ? (
    <GoogleAutoSuggestions />
  ) : (
    <YextAutoSuggestions locale={locale} />
  );
};

export default AutoSuggestions;
