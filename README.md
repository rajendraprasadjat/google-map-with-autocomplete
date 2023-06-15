# Yext Master Reporsitory of Google Place Autocomplete and Google Map

This repository provides a basic example of how to start developing a React site on the Yext Pages system using google map and google place autocomplete.

## Getting Started

### Prerequisites

1. Have the Yext CLI installed: https://hitchhikers.yext.com/guides/cli-getting-started-resources/01-install-cli/
1. Have Deno installed, version 1.21.0 or later: https://deno.land/manual/getting_started/installation
1. Have node installed, version 17 or later: https://nodejs.org/en/download/

### Clone this repo and install dependencies

```shell
git clone https://github.com/rajendraprasadjat/google-map-with-autocomplete.git
cd google-map-with-autocomplete
npm install
npm run prepare
```

### Recommended Development Flow

# Before starting development create .env file with following variables:

```
YEXT_PUBLIC_UNIVERSE="staging or production"
YEXT_PUBLIC_PAGE_LIMIT=
YEXT_PUBLIC_TIME_ZONE=
YEXT_PUBLIC_GOOGLE_API_KEY=
YEXT_PUBLIC_DEFAULT_LATITUDE=
YEXT_PUBLIC_DEFAULT_LONGITUDE=
YEXT_PUBLIC_WEBSITE_URL=
YEXT_PUBLIC_ANALYTICS_ENABLE_DEBUGGING=
YEXT_PUBLIC_ANALYTICS_ENABLE_TRACKING_COOKIE=
YEXT_PUBLIC_DEFAULT_LOCALE=
YEXT_PUBLIC_ANSWER_SEARCH_API_KEY=
YEXT_PUBLIC_ANSWER_SEARCH_EXPERIENCE_KEY=
YEXT_PUBLIC_ANSWER_SEARCH_VERTICAL_KEY=
YEXT_PUBLIC_ANSWER_SEARCH_EXPERIENCE_VERSION="STAGING or PRODUCTION"
```

### Uses

## SearchProvider

```jsx
<SearchProvider
  // default coordinates are required
  defaultCoordinates={{
    latitude: parseFloat(YEXT_PUBLIC_DEFAULT_LATITUDE),
    longitude: parseFloat(YEXT_PUBLIC_DEFAULT_LONGITUDE),
  }}
  // if you use mapbox then mapbox token is required
  mapboxAccessToken={YEXT_PUBLIC_MAP_BOX_API_KEY}
  // if you use google map or google autocomplete then google map api key is required
  googleApiKey={YEXT_PUBLIC_GOOGLE_API_KEY}
  // limit for results
  limit={parseInt(YEXT_PUBLIC_PAGE_LIMIT)}
  // map type google | mapbox
  mapType="google"
  // autocomplete type google | mapbox | text
  autocompleteType="google"
>
  ...Your code
</SearchProvider>
```

## props

| name                   |  type                  | description                                                                                                                                                  |
|------------------------|------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **defaultCoordinates** | object                 | This object is used for default center coordinates of google map or mapbox. **The data is passed as `object` which is pair of `Latitude` and `Longitude`.**  |
| **mapboxAccessToken**  | string                 | This is for `mapbox` access token. if you use `mapbox` as map this is require key.                                                                           |
| **googleApiKey**       | string                 | This is for `google map` or `google autocomplete` api key. if you use `google map` as map or `google autocomplete` as autocomplete then this is require key. |
| **limit**              | number                 | This is for limit                                                                                                                                            |
| **mapType**            | google or mapbox       | used for which maptype you want `google` or `mapbox`.                                                                                                        |
| **autocompleteType**   | google / mapbox / yext | used for which autocomplete type you want `google` or `mapbox` or `yext`.                                                                                    |


## PageLayout

```jsx
<PageLayout
  // _site is Required for Global Data That is Used to Show Content or Data
  _site={_site}
  // used to Acchieve Seo points using OG Tags
  meta={__meta}
  // template is used to show type of Page
  template="country"
  //locale is used to show the Language
  locale={meta.locale}
>
  ...Your code
</PageLayout>
```

## props

| name         | type         | description                                                                                                                                           |
|--------------|--------------|-------------------------------------------------------------------------------------------------------------------------------------------------------|
| **_site**    | SiteData     | _site Contains All Global Data that are Globally Defined in Knowledge Graph The data is passed to access `Header` and `Footer` and other `Global Data`|
| **meta**     | TemplateMeta | This is to acchieve `seo` Points.                                                                                                                     |
| **template** | string       | This is for showing Type Of Template                                                                                                                  |
| **locale**   | string       | used for which type of Language is going to be Used                                                                                                   |                                                                    

## MapWrapper

```jsx
<MapWrapper
  // _site is Required for Global Data That is Used to Show Content or Data
  _site={_site}
/>
```

## props

| name      | type     |         description                                                                                                                                         |
|-----------|----------|-------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **_site** | SiteData | _site Contains All Global Data that are Globally Defined in Knowledge Graph **The data is passed to access `Header` and `Footer`and other `Global Data` .** |


## ListLayout

```jsx
<ListLayout
  // show Message when no Data Found in Api
  showNoRecordMessage={true}
  // used to Acchieve Seo points using OG Tags
  meta={__meta}
  //locale is used to show the Language
  locale={YEXT_PUBLIC_DEFAULT_LOCALE}
/>
```

## props

| name                    | type         | description                                               |
| ------------------------|--------------|-----------------------------------------------------------|
| **showNoRecordMessage** | boolean      | used to Show Record Message When No Data is Found in `Api`|
| **meta**                | TemplateMeta | This is to acchieve `seo` Points.                         |
| **locale**              | string       | used for which type of Language is going to be Used       |

## GoogleMap

```jsx
<GoogleMap
  // InfoWindow Component to Show Info Window Content/Box on Map  on Clicking the Markers
  InfowindowComponent={Infowindow}
  // _site is Required for Global Data That is Used to Show Content or Data
  _site={_site}
/>
```

## props

| name                    | type                      |      description                                                                                                             |
|-------------------------|---------------------------|------------------------------------------------------------------------------------------------------------------------------|
|**InfowindowComponent**  | React.FC<InfowindowProps> | all Info Window Content `name` ,`Phone Number` ,`address`etc to Show Information about tity                                  |
| **_site**               | SiteData                  | _site Contains All Global Data that are Globally Defined in Knowledge Graph The data is passed to access `Header`and `Footer`|


## MapboxMap

```jsx
<MapboxMap
  // MapBox Access Token to use Mapbox
  mapboxAccessToken={mapboxAccessToken}
  // InfoWindow Component to Show Info Window Content/Box on Map  on Clicking the Markers
  InfowindowComponent={Infowindow}
  // _site is Required for Global Data That is Used to Show Content or Data
  _site={_site}
/>
```

## props

| name                  | type                      | description                                                                                                                                                |
| ----------------------|---------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **mapboxAccessToken** | string                    | MapBox Access Token type of key use to allow Access in Mapbox with its features.                                                                           |
|**InfowindowComponent**| React.FC<InfowindowProps> | number |boolean | array | all Info Window Content `name` ,`Phone Number` ,`address`etc to Show Information about entity                                    |
| **_site**             | SiteData                  | _site Contains All Global Data that are Globally Defined in Knowledge Graph The data is passed to access `Header` and `Footer` and other `Global Data` .** |


## AutoSuggestions

```jsx
<AutoSuggestions
  //locale is used to show the Language
  locale={locale}
/>
```

## props

| name       | type   | description                                         |
| -----------|--------|-----------------------------------------------------|
| **locale** | string | used for which type of Language is going to be Used |

## YextAutoSuggestions

```jsx
<YextAutoSuggestions
  //locale is used to show the Language
  locale={locale}
/>
```

## props

| name       | type   | description                                         |
| -----------|--------|-----------------------------------------------------|
| **locale** | string | used for which type of Language is going to be Used |

## Facets

```jsx
<Facets
  // pass Active facet Number/Null using State
  activeFacet={activeFacet}
  //set value or Number of Active Facet using setState
  setActiveFacet={setActiveFacet}
  //use to pass boolean value onChange
  searchOnChange={true}
/>
```

## props

| name               | type            |       description                                |
| -------------------|-----------------|--------------------------------------------------|
| **activeFacet**    | number / null   | used to Pass Number of Active Facets using State |
| **setActiveFacet** | number / null   | used to set Active Facet Numbers                 |
| **searchOnChange** | boolean         |used to show or Pass `true`,`false`Value on change|

## Facet

```jsx
<Facet
  //show Filter Data using Facet Functionality
  facet={facet}
  //change or show Option on toggle using handleFacetOptionChange
  onToggle={handleFacetOptionChange}
/>
```

## props

| name         | type            | description                                                    |
| -------------|-----------------|----------------------------------------------------------------|
| **facet**    | string          | used to Pass facet used to filter data and show Display `Name` |
| **onToggle** | onFacetChangeFn | used to show or Pass `options`and `fieldId`                    |

## Checkbox

```jsx
<Checkbox
  // Key prop to pass DisplayName
  key={option.displayName}
  // To show the options with Label and id
  option={{ id: option.displayName, label: `${a}` }}
  //Pass filed id and options as an boolean value
  selected={option.selected}
  // Perform OnClick Operation with the Paramters FiledId and Options
  onClick={() => onToggle(facet.fieldId, option)}
/>
```
## props

| name         | type    | description                                                    |
| -------------|---------|----------------------------------------------------------------|
| **key**      | string  | used to Pass facet used to filter data and show Display `Name` |
| **option**   | string  | used to show selectd option label                              |
| **selected** | boolean | selected are work on data option choose`                       |
| **onClick**  | boolean | used to show or Pass `options`and `fieldId`                    |

## NoRecordFound

```jsx
<NoRecordFound
  //To Show the Message When No Result Founds
  message={message}
/>
```
## props

| name        | type   | description                                             |
| ------------|--------|---------------------------------------------------------|
| **message** | string | used to Pass the `Message` When No Result/Record Founds |

## LocationList

```jsx
<LocationList
  // used to Acchieve Seo points using OG Tags
  meta={meta}
/>
```

## props

| name     |   type       | description                       |
| ---------|--------------|-----------------------------------|
| **meta** | TemplateMeta | This is to acchieve `seo` Points. |

## LocationCard

```jsx
<LocationCard
  //Key Prop to Pass Location ID
  key={location.id}
  //To Pass Locations/Entities and its Data as a prop
  location={location}
  // used to Acchieve Seo points using OG Tags
  meta={meta}
/>
```

## props

| name         | type             | description                       |
| -------------|------------------|-----------------------------------|
| **key**      | number           | used to Pass Entitiy/Location `Id`| 
| **location** | LocationResult   | Used to Pass All Entities Data    |
| **meta**     | TemplateMeta     | This is to acchieve `seo` Points. | 

## Breadcrumbs

```jsx
<Breadcrumbs
  //Base Url Prop
  baseUrl="/"
  //BreadCrumbs includes all Data that is needed to perform its Functionality
  breadcrumbs={breadcrumbs}
/>
```

## props

| name            | type           | description                                         |
| ----------------|----------------|-----------------------------------------------------|
| **baseUrl**     | string         | Used to Pass BaseUrl                                |
| **breadcrumbs** | BreadcrumbItem | BreadCrumbs Inherited Data to show Directory Paths. |

## Information

```jsx
<Information
  //All related Data to the Entities Pass as a Prop in Document
  document={document}
  // _site is Required for Global Data That is Used to Show Content or Data
  _site={_site}
/>
```

## props

| name         | type               | description                                                                  |
| -------------|--------------------|------------------------------------------------------------------------------|
| **document** | LocationDocument   | used to Access all Data Realted Entities                                     |
| **_site**    | SiteData           | _site Contains All Global Data that are Globally Defined in Knowledge Graph  |

## NearByLocation

```jsx
<NearByLocation
  //Api used to Show Nearby Entites and its Data Content
  apiKey={YEXT_PUBLIC_ANSWER_SEARCH_API_KEY}
  // default coordinates are required
  coordinate={document.yextDisplayCoordinate}
  //default Id Passed as an Prop
  id={document.id}
  // used to Acchieve Seo points using OG Tags
  meta={__meta}
/>
```

## props

| name           | type         | description                                                                                                                 |
|----------------|--------------|-----------------------------------------------------------------------------------------------------------------------------|
| **apiKey**     | string       | Api Key Contains the Data of all entites helps to show NearBy  Location                                                     |
| **coordinate** | object       | This object is used for coordinates of google map or mapbox. **The data is passed as `object` which is pair of `Lat` & `long| 
| **id**         | number       | id used to show Entities Id to Determine Unique Identity.                                                                   |
| **meta**       | TemplateMeta | This is to acchieve `seo` Points.                                                                                           |                                                    |

## Header

```jsx
<Header
  // _site is Required for Global Data That is Used to Show Content or Data
  _site={_site}
  // used to Acchieve Seo points using OG Tags
  meta={meta}
  // template is used to show type of Page
  template={template}
  // locale is used to show the perticular Language
  locale={locale}
  // devlink props are used header links
  devLink={devLink}
/>
```

## props

| name            | type         | description                                                                                                                   |
|-----------------|--------------|-------------------------------------------------------------------------------------------------------------------------------|
| **_site**       | SiteData     | _site Contains All Global Data that are Globally Defined in Knowledge Graph The data is passed to access `Header` and `Footer`|
| **meta**        | TemplateMeta | This is to acchieve `seo` Points.                                                                                             |
| **template**    | string       | This is for showing Type Of Template                                                                                          |
| **locale**      | string       | used for which type of Language is going to be Used                                                                           |
| **devLink**     | string       | used for all Header content links                                                                                             |

## Footer

```jsx
<Footer
  // _site is Required for Global Data That is Used to Show Content or Data
  _site={_site}
  // used to Acchieve Seo points using OG Tags
  meta={meta}
  // template is used to show type of Page
  template={template}
  // locale is used to show the perticular Language
  locale={locale}
  // devlink props are used all Footer links
  devLink={devLink}
/>
```

## props

| name            | type         | description                                                                                                                   |
|-----------------|--------------|-------------------------------------------------------------------------------------------------------------------------------|
| **_site**       | SiteData     | _site Contains All Global Data that are Globally Defined in Knowledge Graph The data is passed to access `Header` and `Footer`|
| **meta**        | TemplateMeta | This is to acchieve `seo` Points.                                                                                             |
| **template**    | string       | This is for showing Type Of Template                                                                                          |
| **locale**      | string       | used for which type of Language is going to be Used                                                                           |
| **devLink**     | string       | used for all Footer content links                                                                                             |

## Address
 and other `Global Data` .\*\* |
```jsx
<Address
  //Includes City ,State, Postal Code,CountryCode
  address={document.address}
/>
```

## props

| name        | type          |  description                                               |
| ------------|---------------|------------------------------------------------------------|
| **address** | AddressType   | Used to Show `PostalCode`,`City`,`State`,`CountryCode` etc |

## OpenCloseStatus

```jsx
<OpenCloseStatus
  //Prop to send Hours According to Entities
  hours={document.hours}
  // _site is Required for Global Data That is Used to Show Content or Data
  site={_site}
  //TimeZone According To Countries
  timezone={YEXT_PUBLIC_TIME_ZONE}
/>
```

## props

| name         | type       | description                                                                 |
| -------------|------------|-----------------------------------------------------------------------------|
| **hours**    | Hours      | Used to Show Hours According to Entites                                     |
| **_site**    | SiteData   | _site Contains All Global Data that are Globally Defined in Knowledge Graph |
| **timezone** | string     | Used to Set TimeZone `CountryWise`                                          |

## HolidayHour

```jsx
<HolidayHour
  //Prop to send holidayHours According to Entities
  hours={document.hours.holidayHours}
  // _site is Required for Global Data That is Used to Show Content or Data
  site={_site}
/>
```

## props

| name       | type         |  description                                                               |
| -----------|--------------|----------------------------------------------------------------------------|
| **hours**  | HolidayHours | Used to Show holidayHours According to Entites                             |
| **_site**  | SiteData     | _site Contains All Global Data that are Globally Defined in Knowledge Graph|  

## Hours

```jsx
<Hours
  //Prop to send Hours According to Entities
  hours={document.hours}
  //showHeader manage condition show the hours heading
  showHeader={true}
  //startOfWeek is used to indicate the start of the week.
  startOfWeek="today"
  //send props show additionalHoursText
  message={document.additionalHoursText}
/>
```

## props

| name            | type           |  description                                            |
| ----------------|----------------|---------------------------------------------------------|
| **hours**       | ComponentHours | Used to Show Prop to send `Hours` According to Entities |
| **showHeader**  | boolean        | showHeader manage condition show the hours heading      |
| **startOfWeek** | string         | startOfWeek is used to indicate the start of the week.  |
| **message**     | string         | use to show mesage in additional hours text             |

While _developing locally_, run the following command:

```
npm run dev
```

This command will start a Vite-powered dev server that will enable hot-reloading. Additionally, the command will generate a `localData` directory that contains a subset of your Knowledge Graph data. This command is automatically in "dynamic" mode, which means it will pull data updates automatically from your Knowledge graph, so real-time data changes in your Yext account will be reflected in your local dev site.

NOTE: Whenever you make changes to your stream definitions, you must re-run `npm run dev` for the system to update the `features.json` and the required entities to power your site.

_Before committing_ your code, we recommend running the following command:

```
npm run build:serve
```

This command will generate a production build of your site, so you can ensure there are no build errors or unexpected behavior. This build step replicates the production build environment used in the Yext system, and serves your data at `localhost:8000`.

In practice, development builds (via `npm run dev`) and production builds compile and bundle assets differently. For local development, ES Modules are loaded directly by the browser, allowing fast iteration during local development and also allows for hot module replacement (HMR). Other things like CSS are also loaded directly by the browser, including linking to sourcemaps. During a production build all of the different files are compiled (via ESBuild for jsx/tsx) and minified, creating assets as small as possible so that the final html files load quickly when served to a user. Tree-shaking also occurs during the build step, in which any unused dependencies are removed from your final build.

### Other Useful commands

`yext init` - Authenticates the Yext CLI with your Yext account

`yext pages generate-test-data` - pull an example set of `localData` from your account. This command is packaged within `npm run dev'.

`npm run build` - Runs a production build against your `localData`: part one of `npm run build:serve`

`npm run serve` - Runs a local server against your production-built files: part two of `npm run build:serve`

`npm run fmt` - Automatically formats all code

`npm run lint` - Run ESLint to check for errors and warnings

## Repository Layout

```
root
└───localData
└───sites-config
│   │   ci.json
└───src
│   └───assets
│   │
│   └───components
│   │
│   └───templates
│       │   404.tsx
│       │   robots.ts
│       │   locator.tsx
│   │
│   └───types
```

### localData

Contains example stream documents that are used while local developing. By default this repo contains example files that work with the provided example templates. You can generate real stream documents specific to your Yext account via `yext pages generate-test-data`.

NOTE: You normally wouldn't want to check in the localData folder as it's only used for local dev. It is gitignored by default.

### sites-config

Contains a single `ci.json` file. This file defines how the Yext CI system will build your project. It is not used during local dev. However, it is used when running a local production build (i.e. `yext pages build`).

NOTE: A `features.json` file will automatically be generated during CI build for you based on the template configs defined in your templates. If this file doesn't exist then `yext pages build` will implicitly generate a new one when it calls `npm run build:local` (defined in `sites-config/ci.json`). In the recommended devleopment flow with `npm run dev`, the `features.json` will be automatically generated.

NOTE: After changing your stream definitions, you should rerun `yext pages generate` and `yext pages generate-text-data` to ensure your local build pulls in the required data from the Knowledge Graph

### src

#### components

This is where all of your custom components _may_ live. This folder is not required and you can set up your own custom folder structure for your own components in any way you'd like, as long as it lives in the `src` directory.

#### templates

Required. This is where your actual templates live. There are effectively two types of components:

1. stream-based templates: those that have an exported `config`
1. static templates: those that don't have an exported `config`.

#### types

Here you can define any custom TypeScript types you need.

#### index.scss

Not required. In this example this sets up Tailwind CSS.

### vite.config.js

Vite is now a first class member of the starter! This file defines any custom Vite configuration you want, giving you full control over your setup. Specifically, it will allows users to pass additional configuration options to the vite-plugin-yext-sites-ssg plugin when they become more widely available.

### Everything else

The rest of the files are basic config setup common to many other React projects. In this example we've enabled:

1. Tailwind CSS (which leverages PostCSS) - used for easy styling
2. ESLint - catches errors in your code
3. Prettier - formats your code (you can add .prettierrc to override any default settings)
4. TypeScript - adds typing to Javascript for a better developer experience
5. Husky - pre-commit testing for a better code quality.
