import {
  DisplayableFacet,
  DisplayableFacetOption,
} from "@yext/search-headless-react";
import { useState } from "react";
import * as React from "react";

export type onFacetChangeFn = (
  fieldId: string,
  option: DisplayableFacetOption
) => void;

export interface FacetConfig {
  searchable?: boolean;
  placeholderText?: string;
  label?: string;
  collapsible?: boolean;
  defaultExpanded?: boolean;
}

interface FacetProps extends FacetConfig {
  facet: DisplayableFacet;
  onToggle: onFacetChangeFn;
}

export default function Facet(props: FacetProps): JSX.Element {
  const { facet, onToggle } = props;
  const facetOptions = facet.options;

  return (
    <div className="facet-block">
      <div className={"facet-options"}>
        {facetOptions?.map((option) => {
          const a =
            option.displayName?.length > 2
              ? `${option.displayName}`
              : `${option?.displayName}`;

          return (
            <Checkbox
              key={option.displayName}
              option={{ id: option.displayName, label: `${a}` }}
              selected={option.selected}
              onClick={() => onToggle(facet.fieldId, option)}
            />
          );
        })}
      </div>
    </div>
  );
}

interface CheckboxProps {
  option: { id: string; label: string };
  selected: boolean;
  onClick: (value: boolean) => void;
}
const Checkbox = ({ option, selected, onClick }: CheckboxProps) => {
  const [isChecked, setIsChecked] = useState(selected);
  return (
    <div className={"input-box"}>
      <input
        type="checkbox"
        id={option.id}
        checked={selected}
        className={"facet-checkbox"}
        onChange={(evt) => {
          setIsChecked(!isChecked);
          onClick(evt.target.checked);
        }}
      />
      <label className={"input-label"} htmlFor={option.id}>
        {option.label}
      </label>
    </div>
  );
};
