export type AeroPulseStatus = "NORMAL" | "ATTENTION" | "ELEVATED" | "HIGH";

export type Airport = {
  icao: string;
  iata: string;
  name: string;
  city: string;
  lat: number;
  lon: number;
};
