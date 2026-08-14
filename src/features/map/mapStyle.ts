import type { StyleSpecification } from "maplibre-gl";

/**
 * Minimal dark basemap style. OpenFreeMap only ships light styles
 * (positron/liberty/bright), so we author our own paint rules against
 * their public vector source + glyphs — this is the customization path
 * documented at https://openfreemap.org/quick_start/.
 */
export const DARK_MAP_STYLE: StyleSpecification = {
  version: 8,
  glyphs: "https://tiles.openfreemap.org/fonts/{fontstack}/{range}.pbf",
  sources: {
    openmaptiles: {
      type: "vector",
      url: "https://tiles.openfreemap.org/planet",
    },
  },
  layers: [
    {
      id: "background",
      type: "background",
      paint: { "background-color": "#08090b" },
    },
    {
      id: "water",
      type: "fill",
      source: "openmaptiles",
      "source-layer": "water",
      paint: { "fill-color": "#0d1420" },
    },
    {
      id: "landcover",
      type: "fill",
      source: "openmaptiles",
      "source-layer": "landcover",
      paint: { "fill-color": "#0d0f13", "fill-opacity": 0.6 },
    },
    {
      id: "park",
      type: "fill",
      source: "openmaptiles",
      "source-layer": "park",
      paint: { "fill-color": "#0e1210", "fill-opacity": 0.5 },
    },
    {
      id: "boundary-state",
      type: "line",
      source: "openmaptiles",
      "source-layer": "boundary",
      filter: ["==", ["get", "admin_level"], 4],
      paint: { "line-color": "#1b1e25", "line-width": 0.6 },
    },
    {
      id: "boundary-country",
      type: "line",
      source: "openmaptiles",
      "source-layer": "boundary",
      filter: ["<=", ["get", "admin_level"], 2],
      paint: { "line-color": "#33363f", "line-width": 1 },
    },
    {
      id: "place-country",
      type: "symbol",
      source: "openmaptiles",
      "source-layer": "place",
      filter: ["==", ["get", "class"], "country"],
      layout: {
        "text-field": ["get", "name:en"],
        "text-font": ["Noto Sans Regular"],
        "text-size": 11,
        "text-transform": "uppercase",
        "text-letter-spacing": 0.15,
      },
      paint: { "text-color": "#4b4f59" },
    },
    {
      id: "place-city",
      type: "symbol",
      source: "openmaptiles",
      "source-layer": "place",
      filter: ["==", ["get", "class"], "city"],
      layout: {
        "text-field": ["get", "name:en"],
        "text-font": ["Noto Sans Regular"],
        "text-size": 10,
      },
      paint: { "text-color": "#5a5f6b" },
      minzoom: 4,
    },
  ],
};
