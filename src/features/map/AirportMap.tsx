import { useEffect, useRef, useState } from "react";
import { Map, Marker, type MapRef } from "react-map-gl/maplibre";
import "maplibre-gl/dist/maplibre-gl.css";
import "./maplibreWorkerSetup";
import { AIRPORTS } from "../../data/airports";
import type { AeroPulseStatus } from "../../types/airport";
import { DARK_MAP_STYLE } from "./mapStyle";
import { AirportMarker } from "./AirportMarker";

type Props = {
  statusByIata: Record<string, AeroPulseStatus>;
  selectedIata: string | null;
  onSelect: (iata: string) => void;
  /** When set, only airports in this set render a marker (status filters). Omit/null shows all. */
  visibleIata?: Set<string> | null;
};

export function AirportMap({ statusByIata, selectedIata, onSelect, visibleIata }: Props) {
  const [tilesUnavailable, setTilesUnavailable] = useState(false);
  const [tilesLoaded, setTilesLoaded] = useState(false);
  const mapRef = useRef<MapRef>(null);

  useEffect(() => {
    if (!selectedIata) return;
    const airport = AIRPORTS.find((a) => a.iata === selectedIata);
    if (!airport) return;
    mapRef.current?.flyTo({ center: [airport.lon, airport.lat], zoom: 6, duration: 800 });
  }, [selectedIata]);

  const visibleAirports = visibleIata ? AIRPORTS.filter((a) => visibleIata.has(a.iata)) : AIRPORTS;

  return (
    <div className="relative h-full w-full">
      <Map
        ref={mapRef}
        initialViewState={{ longitude: -51, latitude: -14, zoom: 3.4 }}
        minZoom={2.5}
        maxZoom={8}
        mapStyle={DARK_MAP_STYLE}
        attributionControl={{ compact: true }}
        style={{ width: "100%", height: "100%" }}
        onError={() => setTilesUnavailable(true)}
        onLoad={() => setTilesLoaded(true)}
      >
        {visibleAirports.map((airport) => (
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

      {!tilesLoaded && !tilesUnavailable && (
        <div className="absolute inset-0 flex items-center justify-center bg-base">
          <p className="animate-breathe text-xs uppercase tracking-wider text-muted">Carregando mapa…</p>
        </div>
      )}

      {tilesUnavailable && (
        <div className="pointer-events-none absolute left-3 top-3 rounded border border-border bg-surface-raised px-3 py-1.5 text-xs text-attention">
          Fonte de dados do mapa temporariamente indisponível
        </div>
      )}
    </div>
  );
}
