import { useState } from "react";
import { Map, Marker } from "react-map-gl/maplibre";
import "maplibre-gl/dist/maplibre-gl.css";
import { AIRPORTS } from "../../data/airports";
import type { AeroPulseStatus } from "../../types/airport";
import { DARK_MAP_STYLE } from "./mapStyle";
import { AirportMarker } from "./AirportMarker";

type Props = {
  statusByIata: Record<string, AeroPulseStatus>;
  selectedIata: string | null;
  onSelect: (iata: string) => void;
};

export function AirportMap({ statusByIata, selectedIata, onSelect }: Props) {
  const [tilesUnavailable, setTilesUnavailable] = useState(false);

  return (
    <div className="relative h-full w-full">
      <Map
        initialViewState={{ longitude: -51, latitude: -14, zoom: 3.4 }}
        minZoom={2.5}
        maxZoom={8}
        mapStyle={DARK_MAP_STYLE}
        attributionControl={{ compact: true }}
        style={{ width: "100%", height: "100%" }}
        onError={() => setTilesUnavailable(true)}
      >
        {AIRPORTS.map((airport) => (
          <Marker key={airport.iata} longitude={airport.lon} latitude={airport.lat} anchor="center">
            <AirportMarker
              iata={airport.iata}
              status={statusByIata[airport.iata]}
              active={selectedIata === airport.iata}
              onClick={() => onSelect(airport.iata)}
            />
          </Marker>
        ))}
      </Map>

      {tilesUnavailable && (
        <div className="pointer-events-none absolute left-3 top-3 rounded border border-border bg-surface-raised px-3 py-1.5 text-xs text-attention">
          Map data source temporarily unavailable
        </div>
      )}
    </div>
  );
}
