import type { Visibility, WeatherSignal } from "../types/signal";
import { fetchWithTimeout } from "../utils/fetchWithTimeout";

const BASE_URL = "https://api.open-meteo.com/v1/forecast";

type OpenMeteoResponse = {
  current: {
    time: string;
    temperature_2m: number;
    wind_speed_10m: number;
  };
  hourly: {
    time: string[];
    precipitation_probability: number[];
    visibility: number[];
  };
};

function visibilityCategory(meters: number): Visibility {
  if (meters >= 10000) return "Good";
  if (meters >= 3000) return "Moderate";
  return "Poor";
}

function nearestHourIndex(hourlyTimes: string[], currentTime: string): number {
  const currentHour = currentTime.slice(0, 13); // "2026-08-14T14"
  const index = hourlyTimes.findIndex((t) => t.slice(0, 13) === currentHour);
  return index === -1 ? 0 : index;
}

/**
 * Fetches current weather for one coordinate from Open-Meteo.
 * Free, no API key, non-commercial use — https://open-meteo.com/en/terms
 */
export async function fetchLiveWeather(lat: number, lon: number): Promise<WeatherSignal> {
  const url = `${BASE_URL}?latitude=${lat}&longitude=${lon}&current=temperature_2m,wind_speed_10m&hourly=precipitation_probability,visibility&forecast_days=1&timezone=auto`;

  const response = await fetchWithTimeout(url);
  if (!response.ok) {
    throw new Error(`Open-Meteo request failed with status ${response.status}`);
  }

  const data = (await response.json()) as OpenMeteoResponse;
  const idx = nearestHourIndex(data.hourly.time, data.current.time);

  return {
    rainChance: Math.round(data.hourly.precipitation_probability[idx] ?? 0),
    windSpeed: Math.round(data.current.wind_speed_10m),
    visibility: visibilityCategory(data.hourly.visibility[idx] ?? 10000),
    temperature: Math.round(data.current.temperature_2m),
    source: "live",
    fetchedAt: new Date().toISOString(),
  };
}
