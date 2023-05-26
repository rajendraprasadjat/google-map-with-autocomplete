import * as React from "react";
import { useEffect, useState } from "react";
import { SearchContext } from "../SearchProvider";
import { SearchIcon } from "../../../assets/svgs/SvgIcons";

const AutoSuggestions = () => {
  const { getCoordinates, setInputValue, inputValue } =
    React.useContext(SearchContext);
  const googleLib = typeof google !== "undefined" ? google : null;
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [autocomplete, setAutocomplete] =
    useState<google.maps.places.Autocomplete | null>(null);
  useEffect(() => {
    if (
      googleLib &&
      typeof google.maps === "object" &&
      inputRef.current &&
      !autocomplete
    ) {
      const options: google.maps.places.AutocompleteOptions = {
        fields: ["address_component", "geometry", "formatted_address"],
      };
      const autoComplete = new google.maps.places.Autocomplete(
        inputRef.current,
        options
      );
      if (autoComplete) {
        const pacSelectFirst = (input: HTMLInputElement) => {
          const _addEventListener = input.addEventListener;

          const getEvent = () => {
            const keydown = document.createEvent("HTMLEvents");
            keydown.initEvent("keydown", true, false);
            Object.defineProperty(keydown, "keyCode", {
              get: function () {
                return 40;
              },
            });
            Object.defineProperty(keydown, "which", {
              get: function () {
                return 40;
              },
            });
            input.dispatchEvent(keydown);
          };
          function addEventListenerWrapper(
            type: string,
            listener: EventListenerOrEventListenerObject
          ) {
            if (type == "keydown") {
              const orig_listener = listener;

              listener = function (event: KeyboardEvent | Event) {
                const suggestion_selected =
                  document.getElementsByClassName("pac-item-selected").length >
                  0;

                if (
                  ((event as KeyboardEvent).which == 13 ||
                    (event as KeyboardEvent).which == 9) &&
                  !suggestion_selected
                ) {
                  getEvent();
                  (orig_listener as EventListener).apply(input, [event]);
                }

                (orig_listener as EventListener).apply(input, [event]);
              };
            }

            _addEventListener.apply(input, [type, listener]);
          }

          if (input.addEventListener) {
            input.addEventListener = addEventListenerWrapper;
          }
        };

        setAutocomplete(autoComplete);
        pacSelectFirst(inputRef.current);

        google.maps.event.addListener(
          autoComplete,
          "place_changed",
          function () {
            const place = autoComplete.getPlace();
            console.log(
              "inputValue",
              inputRef.current?.value,
              place.formatted_address
            );
            if (inputRef.current?.value && place.formatted_address) {
              setInputValue(place.formatted_address);
              if (place.geometry?.location) {
                getCoordinates(
                  place.formatted_address,
                  place.geometry?.location.toJSON()
                );
              } else {
                getCoordinates(place.formatted_address);
              }
            }
          }
        );
      }
    }
    return () => {
      if (autocomplete) {
        autocomplete.unbindAll();
        setAutocomplete(null);
      }
    };
  }, [googleLib]);
  console.log("inputValue", inputValue);
  return (
    <div className="search-form">
      <input
        type="text"
        ref={inputRef}
        placeholder={"Search.."}
        className="search-input"
        value={inputValue}
        onChange={(e) => {
          setInputValue(e.target.value);
        }}
      />

      {/* Search icon Button  */}
      <button
        className="search-button"
        aria-label="Search bar icon"
        id="search-location-button"
        onClick={() => {
          const inputElement = inputRef.current;
          if (inputElement) {
            const keydown = document.createEvent("HTMLEvents");
            keydown.initEvent("keydown", true, false);
            Object.defineProperty(keydown, "keyCode", {
              get: function () {
                return 13;
              },
            });
            Object.defineProperty(keydown, "which", {
              get: function () {
                return 13;
              },
            });
            inputElement.dispatchEvent(keydown);
          }
        }}
      >
        <SearchIcon />
      </button>
    </div>
  );
};

export default AutoSuggestions;
