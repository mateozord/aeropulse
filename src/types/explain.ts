export type ExplainPayload = {
  iata: string;
  city: string;
  score: number;
  status: string;
  drivers: string[];
  weather: {
    rainChance: number;
    windSpeed: number;
    visibility: string;
    temperature: number;
    source: "live" | "mock";
  };
  traffic: {
    observedAircraft: number | null;
    availability: "available" | "stale" | "unavailable";
    source: "live" | "mock";
  };
};
